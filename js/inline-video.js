/**
 * PostNexa - Homepage Inline Video Player Controller
 * =====================================================
 * Replaces old modal popup with an inline interactive video player
 * embedded directly within the homepage hero showcase container.
 *
 * Controls:
 * - Play / Pause (video click, center play button, Platform Preview badge, play button)
 * - Progress Timeline Scrubbing
 * - Volume Slider & Mute Toggle
 * - Fullscreen Toggle (Standard & WebKit)
 * - Keyboard shortcuts (Space/Enter: toggle, Left/Right: seek 5s)
 */

(function () {
  'use strict';

  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', initInlinePlayer);
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initInlinePlayer();
  }

  let initialized = false;

  function initInlinePlayer() {
    if (initialized) return;

    const container     = document.getElementById('inlinePlayerContainer');
    const video         = document.getElementById('postnexaInlineVideo');
    if (!container || !video) return;

    initialized = true;

    const centerPlayBtn = document.getElementById('inlineCenterPlayBtn');
    const platformBadge = document.getElementById('inlinePlatformBadge');
    const badgePlaySvg  = document.getElementById('badgePlaySvg');
    const badgePauseSvg = document.getElementById('badgePauseSvg');
    const badgePlayText = document.getElementById('badgePlayText');

    const playPauseBtn  = document.getElementById('inlinePlayPauseBtn');
    const playIcon      = document.getElementById('inlinePlayIcon');
    const pauseIcon     = document.getElementById('inlinePauseIcon');
    const timeDisplay   = document.getElementById('inlineTimeDisplay');
    const progressWrap  = document.getElementById('inlineProgressWrap');
    const progressBar   = document.getElementById('inlineProgressBar');
    const muteBtn       = document.getElementById('inlineMuteBtn');
    const volumeIcon    = document.getElementById('inlineVolumeIcon');
    const muteIcon      = document.getElementById('inlineMuteIcon');
    const volumeSlider  = document.getElementById('inlineVolumeSlider');
    const fullscreenBtn = document.getElementById('inlineFullscreenBtn');
    const fsExpandIcon  = document.getElementById('inlineFsExpandIcon');
    const fsCollapseIcon= document.getElementById('inlineFsCollapseIcon');

    // Utility: Format seconds to "M:SS"
    function formatTime(seconds) {
      if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) return '0:00';
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return m + ':' + (s < 10 ? '0' : '') + s;
    }

    // Toggle Play/Pause
    function togglePlay(e) {
      if (e) e.stopPropagation();
      if (video.paused || video.ended) {
        video.play().catch(function (err) {
          console.warn('Playback prevented:', err);
        });
      } else {
        video.pause();
      }
    }

    // Playback State Listeners
    video.addEventListener('play', function () {
      container.classList.add('is-playing', 'has-started');
      container.classList.remove('is-paused');

      if (playIcon) playIcon.style.display = 'none';
      if (pauseIcon) pauseIcon.style.display = 'block';
      if (badgePlaySvg) badgePlaySvg.style.display = 'none';
      if (badgePauseSvg) badgePauseSvg.style.display = 'block';
      if (badgePlayText) badgePlayText.textContent = 'Pause Preview';
    });

    video.addEventListener('pause', function () {
      container.classList.remove('is-playing');
      container.classList.add('is-paused');

      if (playIcon) playIcon.style.display = 'block';
      if (pauseIcon) pauseIcon.style.display = 'none';
      if (badgePlaySvg) badgePlaySvg.style.display = 'block';
      if (badgePauseSvg) badgePauseSvg.style.display = 'none';
      if (badgePlayText) badgePlayText.textContent = 'Resume Preview';
    });

    video.addEventListener('ended', function () {
      container.classList.remove('is-playing');
      container.classList.add('is-paused');

      if (playIcon) playIcon.style.display = 'block';
      if (pauseIcon) pauseIcon.style.display = 'none';
      if (badgePlaySvg) badgePlaySvg.style.display = 'block';
      if (badgePauseSvg) badgePauseSvg.style.display = 'none';
      if (badgePlayText) badgePlayText.textContent = 'Replay Preview';
      if (progressBar) progressBar.style.width = '100%';
    });

    // Time & Progress Updates
    video.addEventListener('timeupdate', function () {
      if (!video.duration) return;
      const pct = (video.currentTime / video.duration) * 100;
      if (progressBar) progressBar.style.width = pct + '%';
      if (timeDisplay) {
        timeDisplay.textContent = formatTime(video.currentTime) + ' / ' + formatTime(video.duration);
      }
    });

    function initVideoFrame() {
      if (timeDisplay) {
        timeDisplay.textContent = '0:00 / ' + formatTime(video.duration);
      }
      // Guarantee initial frame is decoded and painted without black screen
      if (video.currentTime === 0) {
        try {
          video.currentTime = 0.001;
        } catch (e) {
          // Ignore if pre-playback seek is restricted by browser policy
        }
      }
    }

    if (video.readyState >= 1) {
      initVideoFrame();
    } else {
      video.addEventListener('loadedmetadata', initVideoFrame);
    }

    // Interactive Timeline Scrubbing
    function seekFromEvent(e) {
      if (!video.duration || !progressWrap) return;
      const rect = progressWrap.getBoundingClientRect();
      let clickX = e.clientX - rect.left;
      clickX = Math.max(0, Math.min(clickX, rect.width));
      const seekRatio = clickX / rect.width;
      video.currentTime = seekRatio * video.duration;
    }

    if (progressWrap) {
      let isScrubbing = false;

      progressWrap.addEventListener('mousedown', function (e) {
        isScrubbing = true;
        seekFromEvent(e);
      });

      window.addEventListener('mousemove', function (e) {
        if (isScrubbing) seekFromEvent(e);
      });

      window.addEventListener('mouseup', function () {
        isScrubbing = false;
      });

      // Touch Scrubbing for Mobile
      progressWrap.addEventListener('touchstart', function (e) {
        if (e.touches && e.touches[0]) {
          isScrubbing = true;
          seekFromEvent(e.touches[0]);
        }
      }, { passive: true });

      window.addEventListener('touchmove', function (e) {
        if (isScrubbing && e.touches && e.touches[0]) {
          seekFromEvent(e.touches[0]);
        }
      }, { passive: true });

      window.addEventListener('touchend', function () {
        isScrubbing = false;
      });
    }

    // Volume & Mute Controls
    let lastVolume = 1;

    function updateVolumeUI() {
      const isMuted = video.muted || video.volume === 0;
      if (volumeIcon) volumeIcon.style.display = isMuted ? 'none' : 'block';
      if (muteIcon) muteIcon.style.display = isMuted ? 'block' : 'none';
      if (volumeSlider) volumeSlider.value = isMuted ? 0 : video.volume;
    }

    if (volumeSlider) {
      volumeSlider.addEventListener('input', function () {
        const val = parseFloat(this.value);
        video.volume = val;
        video.muted = (val === 0);
        if (val > 0) lastVolume = val;
        updateVolumeUI();
      });
    }

    if (muteBtn) {
      muteBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (video.muted || video.volume === 0) {
          video.muted = false;
          video.volume = lastVolume > 0 ? lastVolume : 1;
        } else {
          lastVolume = video.volume;
          video.muted = true;
        }
        updateVolumeUI();
      });
    }

    // Fullscreen Controls
    function isFullscreen() {
      return !!(document.fullscreenElement || document.webkitFullscreenElement);
    }

    function toggleFullscreen(e) {
      if (e) e.stopPropagation();
      const target = container;
      if (!isFullscreen()) {
        if (target.requestFullscreen) {
          target.requestFullscreen();
        } else if (target.webkitRequestFullscreen) {
          target.webkitRequestFullscreen();
        } else if (video.webkitEnterFullscreen) {
          video.webkitEnterFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    }

    function updateFullscreenUI() {
      const fs = isFullscreen();
      if (fsExpandIcon) fsExpandIcon.style.display = fs ? 'none' : 'block';
      if (fsCollapseIcon) fsCollapseIcon.style.display = fs ? 'block' : 'none';
    }

    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', toggleFullscreen);
    }

    document.addEventListener('fullscreenchange', updateFullscreenUI);
    document.addEventListener('webkitfullscreenchange', updateFullscreenUI);

    // Event Bindings for Play Triggers
    if (centerPlayBtn) centerPlayBtn.addEventListener('click', togglePlay);
    if (platformBadge) platformBadge.addEventListener('click', togglePlay);
    if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);

    // Keyboard Shortcuts (when container or video is active)
    container.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        video.currentTime = Math.min(video.duration, video.currentTime + 5);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        video.currentTime = Math.max(0, video.currentTime - 5);
      }
    });

  }
})();
