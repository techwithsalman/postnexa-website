/**
 * PostNexa - Platform Preview Video Modal Controller
 * =====================================================
 * Handles: play/pause, volume, progress scrubbing,
 *          fullscreen, close button, Escape key,
 *          click-outside, and auto-pause on close.
 *
 * VIDEO SOURCE CONFIGURATION:
 * To replace the demo video, update the <source> tag in index.html.
 * Primary target filename: assets/videos/postnexa-platform-demo.mp4
 */

(function () {
  'use strict';

  // ─── Element References ─────────────────────────────────────────────────────
  const overlay        = document.getElementById('demoModal');
  const video          = document.getElementById('postnexaDemoVideo');
  const closeBtn       = document.getElementById('videoModalClose');
  const playPauseBtn   = document.getElementById('scPlayPauseBtn');
  const playIcon       = document.getElementById('scPlayIcon');
  const pauseIcon      = document.getElementById('scPauseIcon');
  const timeDisplay    = document.getElementById('scVideoTime');
  const progressWrap   = document.getElementById('scVideoProgressWrap');
  const progressBar    = document.getElementById('scVideoProgressBar');
  const muteBtn        = document.getElementById('scMuteBtn');
  const volumeIcon     = document.getElementById('scVolumeIcon');
  const muteIcon       = document.getElementById('scMuteIcon');
  const volumeSlider   = document.getElementById('scVolumeSlider');
  const fullscreenBtn  = document.getElementById('scFullscreenBtn');
  const fsExpandIcon   = document.getElementById('scFsExpandIcon');
  const fsCollapseIcon = document.getElementById('scFsCollapseIcon');
  const fallbackPanel  = document.getElementById('scVideoFallback');
  const fallbackContact = document.getElementById('scVideoFallbackContact');
  const modalContainer = overlay ? overlay.querySelector('.sc-video-modal-container') : null;

  // Guard: if modal elements aren't present, exit silently
  if (!overlay || !video || !closeBtn) return;

  // ─── Utility: Format seconds → "M:SS" ──────────────────────────────────────
  function formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  // ─── Open / Close Modal ──────────────────────────────────────────────────────
  function openVideoModal() {
    overlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    // Do NOT autoplay with sound — wait for user interaction
  }

  function closeVideoModal() {
    overlay.classList.remove('is-active');
    document.body.style.overflow = '';
    // Pause video and reset play/pause icon state
    if (video && !video.paused) {
      video.pause();
    }
    updatePlayPauseUI();
    // Exit fullscreen if active
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    }
  }

  // The main play trigger (the yellow badge button on homepage)
  const mainTrigger = document.querySelector('.sc-showcase-play-badge');
  if (mainTrigger) {
    // Remove any existing listener bound by main.js for this element
    // Re-assign with our video-aware version
    mainTrigger.addEventListener('click', openVideoModal);
  }

  // Close button
  closeBtn.addEventListener('click', closeVideoModal);

  // Click outside the modal container
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeVideoModal();
  });

  // Escape key (in addition to main.js handler)
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-active')) {
      closeVideoModal();
    }
  });

  // Fallback contact link — close modal before navigating
  if (fallbackContact) {
    fallbackContact.addEventListener('click', function () {
      closeVideoModal();
    });
  }

  // ─── Play / Pause ────────────────────────────────────────────────────────────
  function updatePlayPauseUI() {
    if (!video.paused && !video.ended) {
      playIcon.style.display  = 'none';
      pauseIcon.style.display = '';
      if (playPauseBtn) playPauseBtn.setAttribute('aria-label', 'Pause video');
    } else {
      playIcon.style.display  = '';
      pauseIcon.style.display = 'none';
      if (playPauseBtn) playPauseBtn.setAttribute('aria-label', 'Play video');
    }
  }

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', function () {
      if (video.paused || video.ended) {
        video.play().catch(function () {
          // Autoplay blocked — show fallback
          showFallback();
        });
      } else {
        video.pause();
      }
    });
  }

  // Click on video area toggles play/pause
  video.addEventListener('click', function () {
    if (video.paused || video.ended) {
      video.play().catch(showFallback);
    } else {
      video.pause();
    }
  });

  video.addEventListener('play',   updatePlayPauseUI);
  video.addEventListener('pause',  updatePlayPauseUI);
  video.addEventListener('ended',  updatePlayPauseUI);

  // ─── Time & Progress ─────────────────────────────────────────────────────────
  video.addEventListener('timeupdate', function () {
    if (!video.duration) return;
    const pct = (video.currentTime / video.duration) * 100;
    if (progressBar)   progressBar.style.width = pct + '%';
    if (timeDisplay)   timeDisplay.textContent = formatTime(video.currentTime) + ' / ' + formatTime(video.duration);
  });

  video.addEventListener('loadedmetadata', function () {
    if (timeDisplay) timeDisplay.textContent = '0:00 / ' + formatTime(video.duration);
  });

  // Progress bar click scrubbing
  if (progressWrap) {
    progressWrap.addEventListener('click', function (e) {
      if (!video.duration) return;
      const rect = progressWrap.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const ratio  = Math.max(0, Math.min(1, clickX / rect.width));
      video.currentTime = ratio * video.duration;
    });
  }

  // ─── Volume ──────────────────────────────────────────────────────────────────
  function updateMuteUI() {
    if (video.muted || video.volume === 0) {
      volumeIcon.style.display = 'none';
      muteIcon.style.display   = '';
      if (muteBtn) muteBtn.setAttribute('aria-label', 'Unmute video');
    } else {
      volumeIcon.style.display = '';
      muteIcon.style.display   = 'none';
      if (muteBtn) muteBtn.setAttribute('aria-label', 'Mute video');
    }
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', function () {
      video.muted = !video.muted;
      if (volumeSlider) volumeSlider.value = video.muted ? 0 : video.volume;
      updateMuteUI();
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', function () {
      video.volume = parseFloat(volumeSlider.value);
      video.muted  = (video.volume === 0);
      updateMuteUI();
    });
  }

  // ─── Fullscreen ──────────────────────────────────────────────────────────────
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', function () {
      const container = modalContainer || overlay;
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        (container.requestFullscreen || container.webkitRequestFullscreen).call(container);
      } else {
        (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      }
    });
  }

  function handleFullscreenChange() {
    const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
    if (fsExpandIcon)   fsExpandIcon.style.display   = isFs ? 'none' : '';
    if (fsCollapseIcon) fsCollapseIcon.style.display  = isFs ? ''    : 'none';
    if (fullscreenBtn)  fullscreenBtn.setAttribute('aria-label', isFs ? 'Exit fullscreen' : 'Enter fullscreen');
  }

  document.addEventListener('fullscreenchange',       handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

  // ─── Error / Fallback handling ───────────────────────────────────────────────
  function showFallback() {
    if (video)         video.style.display        = 'none';
    const controls = document.getElementById('scVideoControls');
    if (controls)      controls.style.display     = 'none';
    if (fallbackPanel) fallbackPanel.style.display = '';
  }

  video.addEventListener('error', showFallback);

  // Check if video loaded successfully after a short delay (handles missing local file)
  video.addEventListener('loadeddata', function () {
    // Video loaded fine — ensure fallback is hidden
    if (fallbackPanel) fallbackPanel.style.display = 'none';
    video.style.display = '';
  });

  // ─── Override main.js modal open (avoid double-registration) ─────────────────
  // main.js binds openModal() to .sc-showcase-play-badge.
  // We remove that binding here by re-adding ours which will fire last.
  // The main.js openModal() will also fire but it just adds .is-active — harmless.

})();
