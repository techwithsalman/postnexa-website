/**
 * PostNexa Social Media Video Downloader — Security, Validation & Rate Limiting
 * ==============================================================================
 * Implements strict URL validation, platform detection, domain allowlisting,
 * SSRF protection, safe redirect following, CORS policies, and rate limiting.
 */

const MAX_URL_LENGTH = 2048;
const MAX_REDIRECTS = 4;
const DEFAULT_TIMEOUT_MS = 8000;
const MAX_DOWNLOAD_BYTES = 100 * 1024 * 1024; // 100 MiB streaming ceiling

// Allowed Domains by Platform
const PLATFORM_DOMAINS = {
  tiktok: [
    'tiktok.com',
    'www.tiktok.com',
    'm.tiktok.com',
    'vm.tiktok.com',
    'vt.tiktok.com'
  ],
  instagram: [
    'instagram.com',
    'www.instagram.com'
  ],
  facebook: [
    'facebook.com',
    'www.facebook.com',
    'm.facebook.com',
    'web.facebook.com',
    'fb.watch'
  ],
  youtube: [
    'youtube.com',
    'www.youtube.com',
    'm.youtube.com',
    'youtu.be',
    'music.youtube.com'
  ],
  postnexa_authorized: [
    'postnexa.world',
    'www.postnexa.world',
    'postnexa-website.pages.dev'
  ]
};

// Allowed Media CDN host suffixes for verified direct video streams
const ALLOWED_MEDIA_CDN_SUFFIXES = [
  'postnexa.world',
  'postnexa-website.pages.dev',
  'tiktokcdn.com',
  'tiktokcdn-us.com',
  'tiktokv.com',
  'fbcdn.net',
  'cdninstagram.com'
];

// Sliding-window rate limit buckets (per Worker isolate)
const rateLimitStore = new Map();

/**
 * Checks if a hostname is an IP literal, loopback, link-local, or private network address (SSRF protection)
 */
export function isBlockedHost(hostname) {
  if (!hostname || typeof hostname !== 'string') return true;
  const host = hostname.toLowerCase().trim();

  if (
    host === 'localhost' ||
    host === '0.0.0.0' ||
    host === '::1' ||
    host === '[::1]' ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    host.endsWith('.localhost') ||
    host.endsWith('.arpa')
  ) {
    return true;
  }

  // Block raw IPv6 literals
  if (host.includes(':')) {
    return true;
  }

  // Block raw IPv4 literals and private ranges
  const ipv4Match = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    return true;
  }

  return false;
}

/**
 * Detects which supported platform a URL belongs to and validates its path pattern.
 */
export function detectPlatformFromUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { valid: false, error: 'Please enter a valid supported social media video URL.' };
  }

  const trimmed = rawUrl.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_URL_LENGTH) {
    return { valid: false, error: 'Please enter a valid supported social media video URL.' };
  }

  let parsed;
  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    parsed = new URL(withProtocol);
  } catch {
    return { valid: false, error: 'Please enter a valid supported social media video URL.' };
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return { valid: false, error: 'Only HTTP/HTTPS social media video links are supported.' };
  }

  if (parsed.username || parsed.password) {
    return { valid: false, error: 'URLs containing embedded credentials are not allowed.' };
  }

  if (parsed.port && parsed.port !== '80' && parsed.port !== '443') {
    return { valid: false, error: 'Non-standard network ports are not permitted.' };
  }

  const host = parsed.hostname.toLowerCase();
  if (isBlockedHost(host)) {
    return { valid: false, error: 'Please enter a valid supported social media video URL.' };
  }

  const pathname = parsed.pathname || '/';

  // 1. TikTok Detection
  if (PLATFORM_DOMAINS.tiktok.includes(host)) {
    const isShortHost = host === 'vm.tiktok.com' || host === 'vt.tiktok.com';
    const isVideoPath =
      /^\/@[^/]+\/video\/\d+/i.test(pathname) ||
      /^\/t\/[A-Za-z0-9_-]+/i.test(pathname) ||
      /^\/v\/\d+/i.test(pathname) ||
      (isShortHost && pathname.length > 1);

    if (isVideoPath) {
      return {
        valid: true,
        platform: 'tiktok',
        platformName: 'TikTok',
        normalizedUrl: parsed.toString(),
        hostname: host,
        isShortLink: isShortHost || /^\/t\//i.test(pathname)
      };
    }
    return {
      valid: false,
      platform: 'tiktok',
      platformName: 'TikTok',
      error: 'Please enter a direct TikTok video link (e.g., tiktok.com/@user/video/... or vm.tiktok.com/...).'
    };
  }

  // 2. Instagram Detection
  if (PLATFORM_DOMAINS.instagram.includes(host)) {
    const igMatch = pathname.match(/^\/(?:[^/]+\/)?(reel|reels|p|tv)\/([A-Za-z0-9_-]+)/i);
    if (igMatch) {
      return {
        valid: true,
        platform: 'instagram',
        platformName: 'Instagram',
        mediaType: igMatch[1].toLowerCase() === 'p' ? 'post' : 'reel',
        shortcode: igMatch[2],
        normalizedUrl: `https://www.instagram.com/${igMatch[1].toLowerCase() === 'reels' ? 'reel' : igMatch[1].toLowerCase()}/${igMatch[2]}/`,
        hostname: host,
        isShortLink: false
      };
    }
    return {
      valid: false,
      platform: 'instagram',
      platformName: 'Instagram',
      error: 'Please enter a direct Instagram Reel, Post, or IGTV URL (e.g., instagram.com/reel/...).'
    };
  }

  // 3. Facebook Detection
  if (PLATFORM_DOMAINS.facebook.includes(host)) {
    const isFbWatch = host === 'fb.watch' && pathname.length > 1;
    const isFbVideoPath =
      /^\/reel\/[A-Za-z0-9_-]+/i.test(pathname) ||
      /^\/watch\/?/i.test(pathname) ||
      /^\/[^/]+\/videos\/[A-Za-z0-9_.-]+/i.test(pathname) ||
      /^\/videos\/[A-Za-z0-9_.-]+/i.test(pathname) ||
      /^\/share\/(?:v|r)\/[A-Za-z0-9_-]+/i.test(pathname);

    if (isFbWatch || isFbVideoPath) {
      return {
        valid: true,
        platform: 'facebook',
        platformName: 'Facebook',
        normalizedUrl: parsed.toString(),
        hostname: host,
        isShortLink: isFbWatch || /^\/share\//i.test(pathname)
      };
    }
    return {
      valid: false,
      platform: 'facebook',
      platformName: 'Facebook',
      error: 'Please enter a valid Facebook video, Watch, or Reel link (e.g., facebook.com/reel/... or fb.watch/...).'
    };
  }

  // 4. YouTube Detection
  if (PLATFORM_DOMAINS.youtube.includes(host)) {
    let videoId = null;
    if (host === 'youtu.be') {
      const m = pathname.match(/^\/([A-Za-z0-9_-]{6,20})/);
      if (m) videoId = m[1];
    } else if (/^\/shorts\/([A-Za-z0-9_-]{6,20})/i.test(pathname)) {
      const m = pathname.match(/^\/shorts\/([A-Za-z0-9_-]{6,20})/i);
      if (m) videoId = m[1];
    } else if (pathname === '/watch') {
      const v = parsed.searchParams.get('v');
      if (v && /^[A-Za-z0-9_-]{6,20}$/.test(v)) {
        videoId = v;
      }
    }

    if (videoId) {
      return {
        valid: true,
        platform: 'youtube',
        platformName: 'YouTube',
        videoId,
        normalizedUrl: `https://www.youtube.com/watch?v=${videoId}`,
        originalUrl: parsed.toString(),
        hostname: host,
        isShortLink: host === 'youtu.be'
      };
    }
    return {
      valid: false,
      platform: 'youtube',
      platformName: 'YouTube',
      error: 'Please enter a valid YouTube video or Shorts URL (e.g., youtube.com/watch?v=... or youtu.be/...).'
    };
  }

  // 5. Authorized First-Party PostNexa Video Assets (for verified owned media downloads)
  if (PLATFORM_DOMAINS.postnexa_authorized.includes(host) && /\.mp4$/i.test(pathname)) {
    const taggedPlatform = (parsed.searchParams.get('platform') || 'tiktok').toLowerCase();
    const validPlatforms = { tiktok: 'TikTok', instagram: 'Instagram', facebook: 'Facebook', youtube: 'YouTube' };
    const resolvedPlatform = validPlatforms[taggedPlatform] ? taggedPlatform : 'tiktok';
    return {
      valid: true,
      platform: resolvedPlatform,
      platformName: validPlatforms[resolvedPlatform],
      isAuthorizedDirectAsset: true,
      normalizedUrl: parsed.toString(),
      hostname: host,
      isShortLink: false
    };
  }

  return {
    valid: false,
    error: 'Please enter a valid supported social media video URL (TikTok, Instagram, Facebook, or YouTube).'
  };
}

/**
 * Checks whether a media CDN host is allowlisted for binary streaming
 */
export function isAllowedMediaStreamUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'https:') return false;
    if (parsed.username || parsed.password || parsed.port) return false;
    const host = parsed.hostname.toLowerCase();
    if (isBlockedHost(host)) return false;
    return ALLOWED_MEDIA_CDN_SUFFIXES.some(
      suffix => host === suffix || host.endsWith(`.${suffix}`)
    );
  } catch {
    return false;
  }
}

/**
 * Fetch wrapper with strict AbortController timeout
 */
export async function fetchWithTimeout(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'User-Agent': 'PostNexaMediaInspector/1.0 (+https://postnexa.world/tools/social-media-downloader/)',
        'Accept-Language': 'en-US,en;q=0.9',
        ...(options.headers || {})
      }
    });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Safely resolves short links up to MAX_REDIRECTS hops while enforcing domain allowlists and SSRF protection
 */
export async function safeResolveRedirect(initialUrl, allowedDomains) {
  let currentUrl = initialUrl;
  for (let hop = 0; hop < MAX_REDIRECTS; hop++) {
    const response = await fetchWithTimeout(currentUrl, {
      method: 'GET',
      redirect: 'manual'
    }, 6000);

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location) break;

      const nextUrl = new URL(location, currentUrl);
      if (nextUrl.protocol !== 'https:' && nextUrl.protocol !== 'http:') {
        throw new Error('Blocked unsafe redirect protocol');
      }
      const nextHost = nextUrl.hostname.toLowerCase();
      if (isBlockedHost(nextHost)) {
        throw new Error('Blocked unsafe redirect target');
      }
      const isAllowed = allowedDomains.some(
        d => nextHost === d || nextHost.endsWith(`.${d}`)
      );
      if (!isAllowed) {
        throw new Error('Redirect target outside allowed platform domains');
      }
      currentUrl = nextUrl.toString();
      continue;
    }

    return { resolvedUrl: currentUrl, response };
  }
  return { resolvedUrl: currentUrl, response: null };
}

/**
 * Sliding-window IP rate limiter
 */
export function checkRateLimit(request, bucket = 'inspect', maxRequests = 30, windowMs = 60000) {
  const ip =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'anonymous';

  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const entry = rateLimitStore.get(key) || { timestamps: [] };

  entry.timestamps = entry.timestamps.filter(ts => now - ts < windowMs);

  if (entry.timestamps.length >= maxRequests) {
    rateLimitStore.set(key, entry);
    const oldest = entry.timestamps[0];
    const retryAfterSec = Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000));
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  entry.timestamps.push(now);
  rateLimitStore.set(key, entry);

  // Periodic cleanup to prevent unbounded Map growth
  if (rateLimitStore.size > 2000) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.timestamps.every(ts => now - ts >= windowMs)) {
        rateLimitStore.delete(k);
      }
    }
  }

  return {
    allowed: true,
    remaining: Math.max(0, maxRequests - entry.timestamps.length),
    retryAfterSec: 0
  };
}

/**
 * Generates safe ASCII download filename
 */
export function sanitizeFilename(title, platform = 'video', ext = 'mp4') {
  const cleanPlatform = String(platform || 'video').toLowerCase().replace(/[^a-z0-9]/g, '');
  const slug = String(title || 'media')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'clip';

  return `postnexa-${cleanPlatform}-${slug}.${ext}`;
}

/**
 * Redacts sensitive query parameters before logging
 */
export function redactUrlForLog(rawUrl) {
  try {
    const u = new URL(rawUrl);
    for (const key of [...u.searchParams.keys()]) {
      if (/token|key|sig|secret|auth|pass|session/i.test(key)) {
        u.searchParams.set(key, '[REDACTED]');
      }
    }
    return u.toString();
  } catch {
    return '[INVALID_URL]';
  }
}

/**
 * Builds CORS headers for API responses
 */
export function getCorsHeaders(request) {
  const origin = request.headers.get('origin') || '';
  const isAllowedOrigin =
    origin === 'https://postnexa.world' ||
    origin === 'https://www.postnexa.world' ||
    /^https:\/\/([a-z0-9-]+\.)?postnexa-website\.pages\.dev$/i.test(origin) ||
    /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);

  return {
    'Access-Control-Allow-Origin': isAllowedOrigin ? origin : 'https://postnexa.world',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

export { PLATFORM_DOMAINS, MAX_DOWNLOAD_BYTES };
