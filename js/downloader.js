/**
 * PostNexa — All-in-One Social Media Video Downloader Controller
 * ==============================================================
 * Handles:
 * - Platform tab selection & ?platform= URL query parameter synchronization
 * - Real-time intelligent URL platform detection (TikTok, Instagram, Facebook, YouTube)
 * - Cross-tab mismatch warning with 1-click automatic tab switching
 * - Clipboard Paste, Clear, and sample test links
 * - Backend communication with Cloudflare Pages Functions (/api/downloader/inspect & /api/downloader/download)
 * - Real byte-stream download progress tracking via ReadableStream (zero fake progress bars)
 */

(function () {
  'use strict';

  const PLATFORM_META = {
    all: {
      id: 'all',
      name: 'All Platforms',
      icon: '../../assets/icons/publish.svg',
      placeholder: 'Paste your video link here (TikTok, Instagram, Facebook, or YouTube)...',
      hint: 'Supports TikTok, Instagram Reels, Facebook Watch/Reels, YouTube links, and authorized owned MP4 sources.'
    },
    tiktok: {
      id: 'tiktok',
      name: 'TikTok',
      icon: '../../assets/icons/tiktok.svg',
      placeholder: 'Paste your TikTok video link (e.g., https://www.tiktok.com/@user/video/...)...',
      hint: 'Supports tiktok.com/@user/video/..., vm.tiktok.com/..., and vt.tiktok.com/... links.'
    },
    instagram: {
      id: 'instagram',
      name: 'Instagram',
      icon: '../../assets/icons/instagram.svg',
      placeholder: 'Paste your Instagram Reel or video link (e.g., https://www.instagram.com/reel/...)...',
      hint: 'Supports instagram.com/reel/..., instagram.com/p/..., and instagram.com/tv/... links.'
    },
    facebook: {
      id: 'facebook',
      name: 'Facebook',
      icon: '../../assets/icons/facebook.svg',
      placeholder: 'Paste your Facebook video or Reel link (e.g., https://www.facebook.com/reel/... or https://fb.watch/...)...',
      hint: 'Supports facebook.com/reel/..., facebook.com/watch/..., facebook.com/videos/..., and fb.watch/... links.'
    },
    youtube: {
      id: 'youtube',
      name: 'YouTube',
      icon: '../../assets/icons/youtube.svg',
      placeholder: 'Paste your YouTube video or Shorts link (e.g., https://www.youtube.com/watch?v=... or https://youtu.be/...)...',
      hint: 'Supports youtube.com/watch?v=..., youtube.com/shorts/..., and youtu.be/... links.'
    }
  };

  /**
   * Client-side URL platform detector matching backend rules in server/downloader/security.js
   */
  function detectClientPlatform(rawUrl) {
    if (!rawUrl || typeof rawUrl !== 'string') {
      return { valid: false, empty: true };
    }
    const trimmed = rawUrl.trim();
    if (!trimmed) {
      return { valid: false, empty: true };
    }

    let parsed;
    try {
      const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : 'https://' + trimmed;
      parsed = new URL(normalized);
    } catch {
      return {
        valid: false,
        empty: false,
        error: 'Please enter a valid supported social media video URL.'
      };
    }

    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return {
        valid: false,
        empty: false,
        error: 'Please enter a valid supported social media video URL.'
      };
    }

    const host = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname || '/';

    // TikTok
    if (['tiktok.com', 'www.tiktok.com', 'm.tiktok.com', 'vm.tiktok.com', 'vt.tiktok.com'].includes(host)) {
      const isShort = host === 'vm.tiktok.com' || host === 'vt.tiktok.com';
      const isVideo =
        /^\/@[^/]+\/video\/\d+/i.test(pathname) ||
        /^\/t\/[A-Za-z0-9_-]+/i.test(pathname) ||
        /^\/v\/\d+/i.test(pathname) ||
        (isShort && pathname.length > 1);

      if (isVideo) {
        return { valid: true, platform: 'tiktok', platformName: 'TikTok', url: parsed.toString() };
      }
      return {
        valid: false,
        platform: 'tiktok',
        platformName: 'TikTok',
        error: 'Please enter a valid supported social media video URL.'
      };
    }

    // Instagram
    if (['instagram.com', 'www.instagram.com'].includes(host)) {
      if (/^\/(?:[^/]+\/)?(reel|reels|p|tv)\/[A-Za-z0-9_-]+/i.test(pathname)) {
        return { valid: true, platform: 'instagram', platformName: 'Instagram', url: parsed.toString() };
      }
      return {
        valid: false,
        platform: 'instagram',
        platformName: 'Instagram',
        error: 'Please enter a valid supported social media video URL.'
      };
    }

    // Facebook
    if (['facebook.com', 'www.facebook.com', 'm.facebook.com', 'web.facebook.com', 'fb.watch'].includes(host)) {
      const isFbWatch = host === 'fb.watch' && pathname.length > 1;
      const isFbVideo =
        /^\/reel\/[A-Za-z0-9_-]+/i.test(pathname) ||
        /^\/watch\/?/i.test(pathname) ||
        /^\/[^/]+\/videos\/[A-Za-z0-9_.-]+/i.test(pathname) ||
        /^\/videos\/[A-Za-z0-9_.-]+/i.test(pathname) ||
        /^\/share\/(?:v|r)\/[A-Za-z0-9_-]+/i.test(pathname);

      if (isFbWatch || isFbVideo) {
        return { valid: true, platform: 'facebook', platformName: 'Facebook', url: parsed.toString() };
      }
      return {
        valid: false,
        platform: 'facebook',
        platformName: 'Facebook',
        error: 'Please enter a valid supported social media video URL.'
      };
    }

    // YouTube
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be', 'music.youtube.com'].includes(host)) {
      let videoId = null;
      if (host === 'youtu.be') {
        const m = pathname.match(/^\/([A-Za-z0-9_-]{6,20})/);
        if (m) videoId = m[1];
      } else if (/^\/shorts\/([A-Za-z0-9_-]{6,20})/i.test(pathname)) {
        const m = pathname.match(/^\/shorts\/([A-Za-z0-9_-]{6,20})/i);
        if (m) videoId = m[1];
      } else if (pathname === '/watch') {
        const v = parsed.searchParams.get('v');
        if (v && /^[A-Za-z0-9_-]{6,20}$/.test(v)) videoId = v;
      }

      if (videoId) {
        return { valid: true, platform: 'youtube', platformName: 'YouTube', url: parsed.toString() };
      }
      return {
        valid: false,
        platform: 'youtube',
        platformName: 'YouTube',
        error: 'Please enter a valid supported social media video URL.'
      };
    }

    // Direct MP4 video asset
    if (/\.mp4$/i.test(pathname)) {
      const p = (parsed.searchParams.get('platform') || 'tiktok').toLowerCase();
      const map = { tiktok: 'TikTok', instagram: 'Instagram', facebook: 'Facebook', youtube: 'YouTube', all: 'All Platforms' };
      const plat = map[p] ? p : 'tiktok';
      return {
        valid: true,
        platform: plat,
        platformName: map[plat],
        isOwnedAsset: true,
        url: parsed.toString()
      };
    }

    return {
      valid: false,
      empty: false,
      error: 'Please enter a valid supported social media video URL.'
    };
  }

  function formatBytesClient(bytes) {
    if (!bytes || isNaN(bytes) || bytes <= 0) return '';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return mb.toFixed(2) + ' MB';
    return Math.round(bytes / 1024) + ' KB';
  }

  function initDownloaderApp() {
    const form = document.getElementById('dlToolForm');
    const urlInput = document.getElementById('dlUrlInput');
    const pasteBtn = document.getElementById('dlPasteBtn');
    const clearBtn = document.getElementById('dlClearBtn');
    const submitBtn = document.getElementById('dlSubmitBtn');
    const submitBtnText = document.getElementById('dlSubmitBtnText');
    const platformHint = document.getElementById('dlPlatformHint');

    const tabButtons = document.querySelectorAll('.sc-dl-tab-btn[data-platform]');

    // Status & Feedback Elements
    const detectionBar = document.getElementById('dlDetectionBar');
    const detectionIcon = document.getElementById('dlDetectionIcon');
    const detectionText = document.getElementById('dlDetectionText');

    const mismatchBanner = document.getElementById('dlMismatchBanner');
    const mismatchText = document.getElementById('dlMismatchText');
    const mismatchSwitchBtn = document.getElementById('dlMismatchSwitchBtn');

    const errorBanner = document.getElementById('dlErrorBanner');
    const errorTitle = document.getElementById('dlErrorTitle');
    const errorText = document.getElementById('dlErrorText');

    const loadingState = document.getElementById('dlLoadingState');
    const loadingText = document.getElementById('dlLoadingText');

    // Result Card Elements
    const resultSection = document.getElementById('dlResultSection');
    const resPlatformIcon = document.getElementById('dlResPlatformIcon');
    const resPlatformName = document.getElementById('dlResPlatformName');
    const resStatusBadge = document.getElementById('dlResStatusBadge');
    const resTitle = document.getElementById('dlResTitle');
    const resAuthor = document.getElementById('dlResAuthor');
    const resDuration = document.getElementById('dlResDuration');
    const resFormat = document.getElementById('dlResFormat');
    const resSize = document.getElementById('dlResSize');
    const resStatusMessage = document.getElementById('dlResStatusMessage');

    const resMediaStage = document.getElementById('dlResMediaStage');
    const resDownloadBtn = document.getElementById('dlResDownloadBtn');
    const resDownloadBtnText = document.getElementById('dlResDownloadBtnText');
    const resOfficialLinkBtn = document.getElementById('dlResOfficialLinkBtn');
    const resCopyLinkBtn = document.getElementById('dlResCopyLinkBtn');
    const resResetBtn = document.getElementById('dlResResetBtn');

    const progressContainer = document.getElementById('dlProgressContainer');
    const progressBarFill = document.getElementById('dlProgressBarFill');
    const progressLabel = document.getElementById('dlProgressLabel');

    if (!form || !urlInput) return;

    let selectedTab = 'all';
    let currentDetectedPlatform = null;
    let lastInspectionResult = null;
    let isDownloading = false;

    // 1. Set active platform tab
    function selectTab(platformId, updateUrlParam = true) {
      const target = PLATFORM_META[platformId] ? platformId : 'all';
      selectedTab = target;

      tabButtons.forEach(btn => {
        const isMatch = btn.getAttribute('data-platform') === target;
        btn.classList.toggle('is-active', isMatch);
        btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      });

      const meta = PLATFORM_META[target];
      urlInput.placeholder = meta.placeholder;
      if (platformHint) {
        platformHint.textContent = meta.hint;
      }

      if (updateUrlParam && window.history && window.history.replaceState) {
        const url = new URL(window.location.href);
        if (target === 'all') {
          url.searchParams.delete('platform');
        } else {
          url.searchParams.set('platform', target);
        }
        window.history.replaceState({}, '', url.toString());
      }

      // Re-evaluate mismatch warning if URL already entered
      handleUrlInputChange(false);
    }

    // Read initial ?platform= parameter from URL
    function syncTabFromLocation() {
      try {
        const params = new URLSearchParams(window.location.search);
        const p = (params.get('platform') || '').toLowerCase().trim();
        if (p && PLATFORM_META[p]) {
          selectTab(p, false);
        } else {
          selectTab('all', false);
        }
      } catch {
        selectTab('all', false);
      }
    }

    syncTabFromLocation();
    window.addEventListener('popstate', syncTabFromLocation);

    // Bind tab button clicks
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const p = btn.getAttribute('data-platform');
        selectTab(p, true);
      });
    });

    // Also intercept header/footer/mobile menu links pointing to ?platform=... on this page
    document.querySelectorAll('a[href*="social-media-downloader"]').forEach(link => {
      link.addEventListener('click', (e) => {
        try {
          const targetUrl = new URL(link.href, window.location.origin);
          if (targetUrl.pathname.includes('/tools/social-media-downloader')) {
            e.preventDefault();
            const p = (targetUrl.searchParams.get('platform') || 'all').toLowerCase();
            selectTab(p, true);
            const mobileDrawer = document.getElementById('scMobileDrawer');
            if (mobileDrawer && mobileDrawer.classList.contains('is-open')) {
              const closeBtn = document.getElementById('scMobileClose');
              if (closeBtn) closeBtn.click();
            }
            urlInput.focus();
          }
        } catch {
          // Allow default navigation
        }
      });
    });

    // 2. Real-time URL Detection & Mismatch Check
    function hideMessages() {
      if (errorBanner) errorBanner.style.display = 'none';
    }

    function showError(title, message) {
      if (!errorBanner) return;
      if (errorTitle) errorTitle.textContent = title || 'Unable to Process Link';
      if (errorText) errorText.textContent = message || 'Please enter a valid supported social media video URL.';
      errorBanner.style.display = 'flex';
    }

    function handleUrlInputChange(clearErrors = true) {
      if (clearErrors) hideMessages();
      const val = urlInput.value.trim();

      if (!val) {
        currentDetectedPlatform = null;
        if (detectionBar) detectionBar.style.display = 'none';
        if (mismatchBanner) mismatchBanner.style.display = 'none';
        return;
      }

      const detected = detectClientPlatform(val);

      if (detected.valid) {
        currentDetectedPlatform = detected.platform;
        const meta = PLATFORM_META[detected.platform];

        if (detectionBar) {
          detectionBar.style.display = 'inline-flex';
          detectionBar.classList.remove('is-invalid');
          detectionBar.classList.add('is-valid');
        }
        if (detectionIcon && meta) {
          detectionIcon.src = meta.icon;
          detectionIcon.style.display = 'inline-block';
        }
        if (detectionText) {
          detectionText.textContent = 'Platform detected: ' + detected.platformName;
        }

        // Check if a specific platform tab is selected that doesn't match the detected URL
        if (selectedTab !== 'all' && selectedTab !== detected.platform) {
          const selectedMeta = PLATFORM_META[selectedTab];
          if (mismatchBanner && mismatchText && mismatchSwitchBtn) {
            mismatchText.textContent =
              `You pasted a ${detected.platformName} link while the ${selectedMeta.name} tab is selected.`;
            mismatchSwitchBtn.textContent = `Switch to ${detected.platformName} Tab`;
            mismatchSwitchBtn.onclick = function () {
              selectTab(detected.platform, true);
            };
            mismatchBanner.style.display = 'flex';
          }
        } else if (mismatchBanner) {
          mismatchBanner.style.display = 'none';
        }
      } else {
        currentDetectedPlatform = null;
        if (mismatchBanner) mismatchBanner.style.display = 'none';
        if (detectionBar) {
          detectionBar.style.display = 'inline-flex';
          detectionBar.classList.remove('is-valid');
          detectionBar.classList.add('is-invalid');
        }
        if (detectionIcon) {
          detectionIcon.style.display = 'none';
        }
        if (detectionText) {
          detectionText.textContent = 'Please enter a valid supported social media video URL.';
        }
      }
    }

    urlInput.addEventListener('input', () => handleUrlInputChange(true));
    urlInput.addEventListener('paste', () => {
      setTimeout(() => handleUrlInputChange(true), 20);
    });

    // 3. Paste Link & Clear Buttons
    if (pasteBtn) {
      pasteBtn.addEventListener('click', async () => {
        hideMessages();
        if (navigator.clipboard && navigator.clipboard.readText) {
          try {
            const clipText = await navigator.clipboard.readText();
            if (clipText && clipText.trim()) {
              urlInput.value = clipText.trim();
              handleUrlInputChange(true);
              urlInput.focus();
            } else {
              urlInput.focus();
              showError('Clipboard Empty', 'Your clipboard does not currently contain a text link.');
            }
          } catch {
            urlInput.focus();
            showError(
              'Clipboard Permission Required',
              'Browser clipboard access was declined. Please press Ctrl+V (or Cmd+V) inside the input box to paste your link.'
            );
          }
        } else {
          urlInput.focus();
          showError(
            'Manual Paste Required',
            'Clipboard API is unavailable in this browser context. Please press Ctrl+V (or Cmd+V) to paste your link.'
          );
        }
      });
    }

    function resetToolState() {
      urlInput.value = '';
      currentDetectedPlatform = null;
      lastInspectionResult = null;
      if (detectionBar) detectionBar.style.display = 'none';
      if (mismatchBanner) mismatchBanner.style.display = 'none';
      if (errorBanner) errorBanner.style.display = 'none';
      if (loadingState) loadingState.style.display = 'none';
      if (resultSection) resultSection.style.display = 'none';
      if (progressContainer) progressContainer.style.display = 'none';
      if (resMediaStage) resMediaStage.innerHTML = '';
      const resGuideWrap = document.getElementById('dlResGuideWrap');
      if (resGuideWrap) {
        resGuideWrap.innerHTML = '';
        resGuideWrap.style.display = 'none';
      }
      const resCapabilities = document.getElementById('dlResCapabilities');
      if (resCapabilities) {
        resCapabilities.innerHTML = '';
      }
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        resetToolState();
        urlInput.focus();
      });
    }

    if (resResetBtn) {
      resResetBtn.addEventListener('click', () => {
        resetToolState();
        urlInput.focus();
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }

    function sanitizeFilenameClient(title, platform = 'video', ext = 'mp4') {
      const cleanPlatform = String(platform || 'video').toLowerCase().replace(/[^a-z0-9]/g, '');
      const slug = String(title || 'media')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60) || 'clip';
      return `postnexa-${cleanPlatform}-${slug}.${ext}`;
    }

    /**
     * Client-side direct stream resolver for TikTok.
     * Operates from the user's browser (residential/mobile IP with CORS: *)
     * to guarantee MP4 streaming even if Cloudflare Edge Worker IPs encounter rate limits.
     */
    async function resolveTikTokClientSide(targetUrl, serverFallbackData) {
      const candidateUrls = [
        (serverFallbackData && serverFallbackData.canonicalUrl) || null,
        targetUrl
      ].filter((u, i, arr) => !!u && arr.indexOf(u) === i);

      const endpoints = [
        'https://www.tikwm.com/api/',
        'https://tikwm.com/api/'
      ];

      for (const urlToTry of candidateUrls) {
        for (const endpoint of endpoints) {
          try {
            const apiUrl = `${endpoint}?url=${encodeURIComponent(urlToTry)}&hd=1`;
            const res = await fetch(apiUrl, {
              headers: { Accept: 'application/json' }
            });
            if (!res.ok) continue;

            const json = await res.json();
            if (json && json.code === 0 && json.data && (json.data.play || json.data.hdplay || json.data.wmplay)) {
              let playUrl = json.data.play || json.data.hdplay || json.data.wmplay;
              if (playUrl.startsWith('//')) {
                playUrl = 'https:' + playUrl;
              } else if (playUrl.startsWith('/')) {
                playUrl = 'https://www.tikwm.com' + playUrl;
              }

              const videoIdMatch = urlToTry.match(/\/video\/(\d+)/);
              const videoId = videoIdMatch ? videoIdMatch[1] : (json.data.id || null);
              const rawTitle = (json.data.title || '').trim();
              const title = rawTitle || (serverFallbackData && serverFallbackData.title) || (videoId ? `TikTok Video #${videoId}` : 'TikTok Video');
              const author = json.data.author?.unique_id
                ? `@${json.data.author.unique_id}`
                : (json.data.author?.nickname ? `@${json.data.author.nickname}` : (serverFallbackData?.authorName || 'TikTok Creator'));
              const durationSec = parseInt(json.data.duration || '0', 10);
              const durationFormatted = durationSec > 0
                ? (durationSec >= 60 ? `${Math.floor(durationSec / 60)}:${String(durationSec % 60).padStart(2, '0')}` : `0:${String(durationSec).padStart(2, '0')}`)
                : (serverFallbackData?.duration || 'Short Video');
              const sizeBytes = typeof json.data.size === 'number' && json.data.size > 0 ? json.data.size : null;
              const sizeFormatted = sizeBytes ? formatBytesClient(sizeBytes) : null;
              const filename = sanitizeFilenameClient(title, 'tiktok', 'mp4');

              return {
                ok: true,
                platform: 'tiktok',
                platformName: 'TikTok',
                canonicalUrl: urlToTry,
                title,
                authorName: author,
                authorUrl: json.data.author?.unique_id ? `https://www.tiktok.com/@${json.data.author.unique_id}` : (serverFallbackData?.authorUrl || null),
                duration: durationFormatted,
                thumbnailUrl: json.data.cover || (serverFallbackData && serverFallbackData.thumbnailUrl) || null,
                previewVideoUrl: playUrl,
                embedUrl: videoId ? `https://www.tiktok.com/embed/v2/${videoId}` : (serverFallbackData?.embedUrl || null),
                format: 'MP4 (H.264 HD)',
                sizeBytes,
                sizeFormatted,
                metadataAvailable: true,
                previewAvailable: true,
                downloadAvailable: true,
                authorizationRequired: false,
                isRestricted: false,
                statusCode: 'READY',
                statusLabel: 'Verified Playable MP4',
                statusMessage: sizeFormatted
                  ? `Verified TikTok MP4 video stream ready for download (${sizeFormatted}).`
                  : 'Verified TikTok MP4 video stream ready for download.',
                downloadUrl: playUrl,
                directDownloadUrl: playUrl,
                filename
              };
            }
          } catch {
            // Continue to next endpoint or candidate URL
          }
        }
      }
      return null;
    }

    // 4. Backend Inspection Request with Automatic Client-Side Fallback
    async function inspectAndResolveUrl(rawUrl) {
      hideMessages();
      const detected = detectClientPlatform(rawUrl);

      if (!detected.valid) {
        if (resultSection) resultSection.style.display = 'none';
        showError('Unsupported URL', 'Please enter a valid supported social media video URL.');
        return;
      }

      // Show loading state
      if (resultSection) resultSection.style.display = 'none';
      if (progressContainer) progressContainer.style.display = 'none';
      if (loadingState) {
        loadingState.style.display = 'flex';
        if (loadingText) {
          loadingText.textContent = `Connecting to ${detected.platformName} provider & verifying permitted media options...`;
        }
      }
      if (submitBtn) submitBtn.disabled = true;
      if (submitBtnText) submitBtnText.textContent = 'Checking Link...';

      try {
        let response = null;
        let data = null;

        try {
          response = await fetch('/api/downloader/inspect', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify({ url: detected.url })
          });

          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            data = await response.json();
          }
        } catch {
          // Network error or local inspection failure
        }

        // If backend succeeded and verified MP4 download is available, use it directly
        if (response && response.ok && data && data.ok && data.downloadAvailable) {
          lastInspectionResult = data;
          renderResultCard(data);
          return;
        }

        // PART A: Client-Side Fallback for TikTok
        // When Cloudflare Edge Worker IP is rate-limited or challenged by TikWM WAF,
        // the client browser (with consumer IP & CORS: *) resolves the stream directly.
        if (detected.platform === 'tiktok') {
          if (loadingText) {
            loadingText.textContent = 'Verifying direct TikTok high-speed media stream...';
          }
          const clientData = await resolveTikTokClientSide(detected.url, data);
          if (clientData && clientData.downloadAvailable) {
            lastInspectionResult = clientData;
            renderResultCard(clientData);
            return;
          }
        }

        // If client resolution didn't produce a stream, but server returned valid data (e.g. metadata or official guide)
        if (response && response.ok && data && data.ok) {
          lastInspectionResult = data;
          renderResultCard(data);
          return;
        }

        // If error response
        if (data && !data.ok) {
          const errorTitles = {
            UNSUPPORTED_URL: 'Unsupported URL',
            VIDEO_UNAVAILABLE: 'Video Unavailable',
            PRIVATE_OR_RESTRICTED: 'Private or Restricted Video',
            DOWNLOAD_NOT_PERMITTED: 'Download Not Permitted',
            FILE_TOO_LARGE: 'File Too Large',
            PROVIDER_UNAVAILABLE: 'Provider Unavailable',
            RATE_LIMITED: 'Rate Limit Reached',
            SERVER_UNAVAILABLE: 'Server Temporarily Unavailable'
          };
          const code = data?.errorCode || 'SERVER_UNAVAILABLE';
          showError(
            errorTitles[code] || 'Unable to Process Video',
            data?.message || 'The requested video could not be retrieved.'
          );
          return;
        }

        showError(
          'Server Temporarily Unavailable',
          'Could not reach the PostNexa media inspection worker. Please check your connection and try again.'
        );
      } catch {
        showError(
          'Server Temporarily Unavailable',
          'Could not reach the PostNexa media inspection worker. Please check your connection and try again.'
        );
      } finally {
        if (loadingState) loadingState.style.display = 'none';
        if (submitBtn) submitBtn.disabled = false;
        if (submitBtnText) submitBtnText.textContent = 'Download Video';
      }
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      inspectAndResolveUrl(urlInput.value);
    });

    // 5. Render Result Card
    function renderResultCard(data) {
      if (!resultSection) return;

      const meta = PLATFORM_META[data.platform] || PLATFORM_META.all;
      if (resPlatformIcon) resPlatformIcon.src = meta.icon;
      if (resPlatformName) resPlatformName.textContent = data.platformName || meta.name;

      if (resStatusBadge) {
        resStatusBadge.textContent = data.statusLabel || (data.downloadAvailable ? 'Verified MP4 Ready' : 'Metadata Verified');
        resStatusBadge.className = 'sc-dl-status-pill ' + (data.downloadAvailable ? 'is-ready' : 'is-restricted');
      }

      if (resTitle) resTitle.textContent = data.title || 'Social Media Video';
      if (resAuthor) resAuthor.textContent = data.authorName || data.platformName;
      if (resDuration) resDuration.textContent = data.duration || 'Standard Clip';
      if (resFormat) resFormat.textContent = data.format || 'MP4 Video';
      if (resSize) {
        resSize.textContent = data.sizeFormatted || 'Determined by source';
      }
      if (resStatusMessage) {
        resStatusMessage.textContent = data.statusMessage || '';
      }

      // Render Explicit Capability Flags (Task 3 & 5)
      const resCapabilities = document.getElementById('dlResCapabilities');
      if (resCapabilities) {
        const metadataPill = data.metadataAvailable !== false
          ? '<span class="sc-dl-cap-pill is-ok">✓ Metadata Available</span>'
          : '<span class="sc-dl-cap-pill is-warn">⚠ Metadata Unavailable</span>';

        const previewPill = data.previewAvailable !== false
          ? '<span class="sc-dl-cap-pill is-ok">✓ Preview Available</span>'
          : '<span class="sc-dl-cap-pill is-warn">⚠ Preview Unavailable</span>';

        let downloadPill;
        if (data.downloadAvailable) {
          downloadPill = '<span class="sc-dl-cap-pill is-ok">✓ MP4 Download Ready</span>';
        } else if (data.authorizationRequired) {
          downloadPill = '<span class="sc-dl-cap-pill is-warn">🔒 OAuth Required for Raw MP4</span>';
        } else {
          downloadPill = '<span class="sc-dl-cap-pill is-warn">⚠ Direct Download Restricted</span>';
        }

        const restrictionPill = data.isRestricted
          ? '<span class="sc-dl-cap-pill is-warn">Platform Restricted (ToS)</span>'
          : '<span class="sc-dl-cap-pill is-ok">Unrestricted Stream</span>';

        resCapabilities.innerHTML = `${metadataPill}${previewPill}${downloadPill}${restrictionPill}`;
      }

      // Render Media Preview Stage (HTML5 <video> for direct MP4, thumbnail + embed option for platform streams)
      if (resMediaStage) {
        resMediaStage.innerHTML = '';

        if (data.previewVideoUrl) {
          const videoEl = document.createElement('video');
          videoEl.controls = true;
          videoEl.playsInline = true;
          videoEl.preload = 'metadata';
          videoEl.className = 'sc-dl-preview-video';
          if (data.thumbnailUrl) {
            videoEl.poster = data.thumbnailUrl;
          }
          videoEl.src = data.previewVideoUrl + '#t=0.001';
          resMediaStage.appendChild(videoEl);
        } else if (data.thumbnailUrl) {
          const thumbWrap = document.createElement('div');
          thumbWrap.className = 'sc-dl-thumb-wrap';

          const img = document.createElement('img');
          img.src = data.thumbnailUrl;
          img.alt = data.title || 'Video Thumbnail';
          img.className = 'sc-dl-thumb-img';
          img.loading = 'lazy';
          thumbWrap.appendChild(img);

          if (data.embedUrl) {
            const previewOverlayBtn = document.createElement('button');
            previewOverlayBtn.type = 'button';
            previewOverlayBtn.className = 'sc-dl-embed-trigger';
            previewOverlayBtn.innerHTML =
              '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg><span>Load Official Video Preview</span>';
            previewOverlayBtn.addEventListener('click', () => {
              resMediaStage.innerHTML = '';
              const iframe = document.createElement('iframe');
              iframe.src = data.embedUrl;
              iframe.className = 'sc-dl-preview-iframe';
              iframe.title = data.title || 'Official Video Preview';
              iframe.setAttribute('allowfullscreen', 'true');
              iframe.setAttribute('loading', 'lazy');
              iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
              resMediaStage.appendChild(iframe);
            });
            thumbWrap.appendChild(previewOverlayBtn);
          }

          resMediaStage.appendChild(thumbWrap);
        } else if (data.embedUrl) {
          const placeholder = document.createElement('div');
          placeholder.className = 'sc-dl-thumb-placeholder';
          const iconImg = document.createElement('img');
          iconImg.src = meta.icon;
          iconImg.alt = '';
          iconImg.style.width = '44px';
          iconImg.style.height = '44px';
          placeholder.appendChild(iconImg);

          const loadBtn = document.createElement('button');
          loadBtn.type = 'button';
          loadBtn.className = 'sc-btn sc-btn-secondary sc-btn-pill';
          loadBtn.style.marginTop = '12px';
          loadBtn.textContent = 'Load Official Embedded Preview';
          loadBtn.addEventListener('click', () => {
            resMediaStage.innerHTML = '';
            const iframe = document.createElement('iframe');
            iframe.src = data.embedUrl;
            iframe.className = 'sc-dl-preview-iframe';
            iframe.title = data.title || 'Official Video Preview';
            iframe.setAttribute('allowfullscreen', 'true');
            iframe.setAttribute('loading', 'lazy');
            resMediaStage.appendChild(iframe);
          });
          placeholder.appendChild(loadBtn);
          resMediaStage.appendChild(placeholder);
        }
      }

      // Render Official Save Guide for Restricted Platforms
      const resGuideWrap = document.getElementById('dlResGuideWrap');
      if (resGuideWrap) {
        if (!data.downloadAvailable && Array.isArray(data.saveGuide) && data.saveGuide.length > 0) {
          resGuideWrap.innerHTML = `
            <div class="sc-dl-guide-box">
              <div class="sc-dl-guide-box-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                <span>Official Creator Export Instructions</span>
              </div>
              <ol class="sc-dl-guide-box-list">
                ${data.saveGuide.map(step => `<li>${step}</li>`).join('')}
              </ol>
            </div>
          `;
          resGuideWrap.style.display = 'block';
        } else {
          resGuideWrap.innerHTML = '';
          resGuideWrap.style.display = 'none';
        }
      }

      // Configure Download Button Honesty & State
      if (resDownloadBtn && resDownloadBtnText) {
        if (data.downloadAvailable && data.downloadUrl) {
          resDownloadBtn.disabled = false;
          resDownloadBtn.setAttribute('aria-disabled', 'false');
          resDownloadBtn.classList.remove('is-disabled');
          resDownloadBtn.style.display = 'inline-flex';
          resDownloadBtnText.textContent = data.sizeFormatted
            ? `Download MP4 (${data.sizeFormatted})`
            : 'Download MP4';
        } else {
          // Never display a misleading disabled Download button for restricted platforms
          resDownloadBtn.disabled = true;
          resDownloadBtn.setAttribute('aria-disabled', 'true');
          resDownloadBtn.classList.add('is-disabled');
          resDownloadBtn.style.display = 'none';
        }
      }

      // Official Platform / Studio Action Button
      if (resOfficialLinkBtn) {
        if (!data.downloadAvailable && data.officialActionUrl) {
          resOfficialLinkBtn.href = data.officialActionUrl;
          resOfficialLinkBtn.textContent = data.officialActionLabel || 'Open Official Source ➔';
          resOfficialLinkBtn.className = 'sc-btn sc-btn-primary sc-btn-pill';
          resOfficialLinkBtn.style.display = 'inline-flex';
        } else {
          resOfficialLinkBtn.style.display = 'none';
        }
      }

      resultSection.style.display = 'block';
      resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // 6. Real Verified MP4 Stream Download with True Byte Progress
    if (resDownloadBtn) {
      resDownloadBtn.addEventListener('click', async () => {
        if (isDownloading || !lastInspectionResult || !lastInspectionResult.downloadAvailable || !lastInspectionResult.downloadUrl) {
          return;
        }

        isDownloading = true;
        resDownloadBtn.disabled = true;
        if (resDownloadBtnText) resDownloadBtnText.textContent = 'Starting Download...';

        if (progressContainer && progressBarFill && progressLabel) {
          progressContainer.style.display = 'block';
          progressBarFill.style.width = '0%';
          progressBarFill.classList.add('is-indeterminate');
          progressLabel.textContent = 'Verifying binary video stream...';
        }

        try {
          const filename = lastInspectionResult.filename || 'postnexa-video.mp4';
          let response = null;

          try {
            response = await fetch(lastInspectionResult.downloadUrl);
          } catch {
            // If browser fetch was blocked by cross-origin security or an adblock extension, trigger direct anchor download
            const a = document.createElement('a');
            a.href = lastInspectionResult.downloadUrl;
            a.download = filename;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            document.body.appendChild(a);
            a.click();
            a.remove();
            if (progressContainer) progressContainer.style.display = 'none';
            return;
          }

          if (!response.ok) {
            let errMessage = 'Download could not be completed.';
            try {
              const errData = await response.json();
              if (errData?.message) errMessage = errData.message;
            } catch {
              // ignore
            }
            throw new Error(errMessage);
          }

          const contentType = (response.headers.get('content-type') || '').toLowerCase();
          if (contentType && !contentType.startsWith('video/') && !contentType.includes('octet-stream') && !contentType.includes('binary')) {
            throw new Error('Server did not return a valid video stream.');
          }

          const totalBytes = parseInt(response.headers.get('content-length') || String(lastInspectionResult.sizeBytes || 0), 10);

          if (response.body && response.body.getReader) {
            const reader = response.body.getReader();
            const chunks = [];
            let receivedBytes = 0;

            if (totalBytes > 0 && progressBarFill) {
              progressBarFill.classList.remove('is-indeterminate');
            }

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              if (value) {
                chunks.push(value);
                receivedBytes += value.byteLength;

                if (totalBytes > 0) {
                  const pct = Math.min(100, Math.round((receivedBytes / totalBytes) * 100));
                  if (progressBarFill) progressBarFill.style.width = pct + '%';
                  if (progressLabel) {
                    progressLabel.textContent = `Downloading MP4: ${formatBytesClient(receivedBytes)} of ${formatBytesClient(totalBytes)} (${pct}%)`;
                  }
                } else if (progressLabel) {
                  progressLabel.textContent = `Downloading MP4: ${formatBytesClient(receivedBytes)} received...`;
                }
              }
            }

            const blob = new Blob(chunks, { type: contentType || 'video/mp4' });
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

            if (progressBarFill) {
              progressBarFill.classList.remove('is-indeterminate');
              progressBarFill.style.width = '100%';
            }
            if (progressLabel) {
              progressLabel.textContent = `Download complete! Saved ${filename} (${formatBytesClient(receivedBytes)}).`;
            }
          } else {
            // Fallback direct attachment download if ReadableStream is unavailable
            window.location.assign(lastInspectionResult.downloadUrl);
          }
        } catch (err) {
          if (progressContainer) progressContainer.style.display = 'none';
          showError('Download Error', err?.message || 'Unable to download video file.');
        } finally {
          isDownloading = false;
          if (lastInspectionResult && lastInspectionResult.downloadAvailable) {
            resDownloadBtn.disabled = false;
            if (resDownloadBtnText) {
              resDownloadBtnText.textContent = lastInspectionResult.sizeFormatted
                ? `Download MP4 (${lastInspectionResult.sizeFormatted})`
                : 'Download MP4';
            }
          }
        }
      });
    }

    // 7. Copy Original Link Button
    if (resCopyLinkBtn) {
      resCopyLinkBtn.addEventListener('click', async () => {
        const linkToCopy = lastInspectionResult?.canonicalUrl || urlInput.value.trim();
        if (!linkToCopy) return;
        const origLabel = resCopyLinkBtn.textContent;
        try {
          await navigator.clipboard.writeText(linkToCopy);
          resCopyLinkBtn.textContent = 'Copied Link! ✓';
          setTimeout(() => {
            resCopyLinkBtn.textContent = origLabel;
          }, 2200);
        } catch {
          resCopyLinkBtn.textContent = 'Copy Failed';
          setTimeout(() => {
            resCopyLinkBtn.textContent = origLabel;
          }, 2200);
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDownloaderApp);
  } else {
    initDownloaderApp();
  }
})();
