/**
 * Cloudflare Pages Function — GET /api/downloader/providers
 * =========================================================
 * Returns the capability matrix and operational status of all active
 * and planned social media downloader providers.
 */

import { PROVIDERS, FUTURE_PROVIDERS } from '../../../server/downloader/providers.js';
import { getCorsHeaders } from '../../../server/downloader/security.js';

export async function onRequestOptions(context) {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(context.request)
  });
}

export async function onRequestGet(context) {
  const { request, env } = context;

  const activeProviders = Object.values(PROVIDERS).map(p => ({
    id: p.id,
    name: p.name,
    enabled: p.enabled,
    capabilities: p.capabilities,
    oauthConfigured: p.capabilities.requiredEnvVars.some(k => Boolean(env && env[k]))
  }));

  const futureProviders = Object.values(FUTURE_PROVIDERS);

  return new Response(
    JSON.stringify({
      ok: true,
      service: 'PostNexa Social Media Video Downloader API',
      version: '1.0.0',
      activeProviders,
      futureProviders
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=60',
        ...getCorsHeaders(request)
      }
    }
  );
}
