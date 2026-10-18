/**
 * Cloudflare Pages Function — GET /api/downloader/download
 * ========================================================
 * Verifies and streams permitted, playable video files with safe filenames,
 * strict SSRF/domain allowlist checks, rate limiting, and size enforcement.
 */

import {
  isAllowedMediaStreamUrl,
  checkRateLimit,
  fetchWithTimeout,
  sanitizeFilename,
  getCorsHeaders,
  MAX_DOWNLOAD_BYTES,
  redactUrlForLog
} from '../../../server/downloader/security.js';
import { verifyPlayableVideoStream } from '../../../server/downloader/providers.js';

function errorJson(message, errorCode, status, request, extraHeaders = {}) {
  return new Response(JSON.stringify({ ok: false, errorCode, message }), {
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
  const { request } = context;

  const rateLimit = checkRateLimit(request, 'download', 10, 60000);
  if (!rateLimit.allowed) {
    return errorJson(
      `Download rate limit reached. Please wait ${rateLimit.retryAfterSec} seconds.`,
      'RATE_LIMITED',
      429,
      request,
      { 'Retry-After': String(rateLimit.retryAfterSec) }
    );
  }

  const reqUrl = new URL(request.url);
  const mediaUrl = reqUrl.searchParams.get('url') || '';
  const platform = reqUrl.searchParams.get('platform') || 'video';
  const title = reqUrl.searchParams.get('title') || 'postnexa-video';

  if (!mediaUrl || !isAllowedMediaStreamUrl(mediaUrl)) {
    return errorJson(
      'Download not permitted: media source is not an authorized, allowlisted video stream.',
      'DOWNLOAD_NOT_PERMITTED',
      403,
      request
    );
  }

  // Verify the media stream is a real playable video file before streaming
  const verification = await verifyPlayableVideoStream(mediaUrl);
  if (!verification.verified) {
    const status = verification.errorCode === 'FILE_TOO_LARGE' ? 413 : 422;
    return errorJson(
      verification.reason || 'Unable to verify playable video file.',
      verification.errorCode || 'VIDEO_UNAVAILABLE',
      status,
      request
    );
  }

  try {
    console.log(`[Downloader Stream] platform=${platform} url=${redactUrlForLog(mediaUrl)}`);
    const isTiktokCdn = /(?:tiktokcdn|tiktok|byteoversea|ibytedtos|tikwm|bytedance|tikmate|nowmvideo)/i.test(mediaUrl);
    const upstreamRes = await fetchWithTimeout(mediaUrl, {
      method: 'GET',
      headers: isTiktokCdn
        ? {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
            'Referer': 'https://www.tiktok.com/'
          }
        : {}
    }, 25000);

    if (!upstreamRes.ok || !upstreamRes.body) {
      return errorJson(
        'Video file is currently unavailable from the upstream media server.',
        'VIDEO_UNAVAILABLE',
        502,
        request
      );
    }

    const contentLength = upstreamRes.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_DOWNLOAD_BYTES) {
      return errorJson(
        'File too large to stream through Worker.',
        'FILE_TOO_LARGE',
        413,
        request
      );
    }

    const safeName = sanitizeFilename(title, platform, 'mp4');
    const headers = new Headers({
      'Content-Type': verification.contentType || 'video/mp4',
      'Content-Disposition': `attachment; filename="${safeName}"`,
      'Cache-Control': 'private, max-age=300',
      'X-Content-Type-Options': 'nosniff',
      ...getCorsHeaders(request)
    });

    if (contentLength) {
      headers.set('Content-Length', contentLength);
    } else if (verification.sizeBytes) {
      headers.set('Content-Length', String(verification.sizeBytes));
    }

    return new Response(upstreamRes.body, {
      status: 200,
      headers
    });
  } catch (err) {
    console.error(`[Downloader Stream Error] err=${err?.message || 'unknown'}`);
    return errorJson(
      'Server temporarily unavailable while streaming video download.',
      'SERVER_UNAVAILABLE',
      503,
      request
    );
  }
}
