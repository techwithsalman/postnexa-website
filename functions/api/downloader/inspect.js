/**
 * Cloudflare Pages Function — POST /api/downloader/inspect
 * ========================================================
 * Validates a pasted social media video URL, identifies its platform,
 * resolves short links safely, and queries the modular platform provider.
 */

import {
  detectPlatformFromUrl,
  checkRateLimit,
  getCorsHeaders,
  redactUrlForLog
} from '../../../server/downloader/security.js';
import { getProvider } from '../../../server/downloader/providers.js';

function jsonResponse(body, status, request, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...getCorsHeaders(request),
      ...extraHeaders
    }
  });
}

export async function onRequestOptions(context) {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(context.request)
  });
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const reqUrl = new URL(request.url);
  const targetUrl = reqUrl.searchParams.get('url');
  if (!targetUrl) {
    return jsonResponse(
      { ok: false, errorCode: 'UNSUPPORTED_URL', message: 'Please enter a valid supported social media video URL.' },
      400,
      request
    );
  }
  return handleInspect(targetUrl, request, env);
}

export async function onRequestPost(context) {
  const { request, env } = context;

  // Enforce request size limit (max 8 KB body)
  const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
  if (contentLength > 8192) {
    return jsonResponse(
      { ok: false, errorCode: 'PAYLOAD_TOO_LARGE', message: 'Request payload exceeds maximum allowed size.' },
      413,
      request
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(
      { ok: false, errorCode: 'INVALID_REQUEST', message: 'Invalid JSON request body.' },
      400,
      request
    );
  }

  const targetUrl = body?.url;
  return handleInspect(targetUrl, request, env);
}

async function handleInspect(rawUrl, request, env) {
  const rateLimit = checkRateLimit(request, 'inspect', 30, 60000);
  if (!rateLimit.allowed) {
    return jsonResponse(
      {
        ok: false,
        errorCode: 'RATE_LIMITED',
        message: `Too many requests. Please wait ${rateLimit.retryAfterSec} seconds before trying again.`
      },
      429,
      request,
      { 'Retry-After': String(rateLimit.retryAfterSec) }
    );
  }

  const detection = detectPlatformFromUrl(rawUrl);
  if (!detection.valid) {
    return jsonResponse(
      {
        ok: false,
        errorCode: 'UNSUPPORTED_URL',
        platform: detection.platform || null,
        platformName: detection.platformName || null,
        message: detection.error || 'Please enter a valid supported social media video URL.'
      },
      400,
      request
    );
  }

  const provider = getProvider(detection.platform);
  if (!provider || !provider.enabled) {
    return jsonResponse(
      {
        ok: false,
        errorCode: 'PROVIDER_UNAVAILABLE',
        platform: detection.platform,
        platformName: detection.platformName,
        message: 'Provider unavailable for the detected platform.'
      },
      503,
      request
    );
  }

  try {
    console.log(`[Downloader Inspect] platform=${detection.platform} url=${redactUrlForLog(detection.normalizedUrl)}`);
    const result = await provider.inspect(detection, env || {});
    if (!result.ok) {
      const statusMap = {
        UNSUPPORTED_URL: 400,
        VIDEO_UNAVAILABLE: 404,
        PRIVATE_OR_RESTRICTED: 403,
        DOWNLOAD_NOT_PERMITTED: 403,
        FILE_TOO_LARGE: 413,
        PROVIDER_UNAVAILABLE: 502
      };
      return jsonResponse(result, statusMap[result.errorCode] || 422, request);
    }

    return jsonResponse(result, 200, request);
  } catch (err) {
    console.error(`[Downloader Inspect Error] platform=${detection.platform} err=${err?.message || 'unknown'}`);
    return jsonResponse(
      {
        ok: false,
        errorCode: 'SERVER_UNAVAILABLE',
        message: 'Server temporarily unavailable while inspecting media. Please try again.'
      },
      503,
      request
    );
  }
}
