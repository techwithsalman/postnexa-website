/**
 * PostNexa - Free Social Media Image & Media Size Checker (Client-Side)
 * =====================================================================
 * Analyzes image dimensions, aspect ratios, and resolution locally in the browser
 * and compares against 2026 specifications for Instagram, TikTok, Facebook,
 * YouTube, LinkedIn, and X without uploading files to any external server.
 */

(function () {
  'use strict';

  // 2026 Verified Social Media Dimensions Database
  const PLATFORM_SPECS = [
    {
      platform: "Instagram",
      type: "Feed Portrait (Recommended)",
      ratio: "4:5",
      targetWidth: 1080,
      targetHeight: 1350,
      numericRatio: 4 / 5,
      note: "Takes up the most screen real estate in mobile feed (+25% more than square)."
    },
    {
      platform: "Instagram",
      type: "Feed Square",
      ratio: "1:1",
      targetWidth: 1080,
      targetHeight: 1080,
      numericRatio: 1,
      note: "Classic grid format, safe for both profile grid and mobile feeds."
    },
    {
      platform: "Instagram",
      type: "Stories & Reels",
      ratio: "9:16",
      targetWidth: 1080,
      targetHeight: 1920,
      numericRatio: 9 / 16,
      note: "Full-screen vertical. Keep key text within the 1080×1420 safe zone."
    },
    {
      platform: "TikTok",
      type: "Feed Video & Photo Mode",
      ratio: "9:16",
      targetWidth: 1080,
      targetHeight: 1920,
      numericRatio: 9 / 16,
      note: "Standard vertical format. Keep text away from right side icons and bottom caption."
    },
    {
      platform: "Facebook",
      type: "Feed Landscape (Link / Post)",
      ratio: "1.91:1",
      targetWidth: 1200,
      targetHeight: 630,
      numericRatio: 1200 / 630,
      note: "Ideal for link shares, open graph images, and sponsored newsfeed posts."
    },
    {
      platform: "Facebook",
      type: "Feed Square",
      ratio: "1:1",
      targetWidth: 1200,
      targetHeight: 1200,
      numericRatio: 1,
      note: "Universal square post format for Facebook mobile and desktop feeds."
    },
    {
      platform: "YouTube",
      type: "Video Thumbnail",
      ratio: "16:9",
      targetWidth: 1280,
      targetHeight: 720,
      numericRatio: 16 / 9,
      note: "Standard 16:9 thumbnail format. Must be under 2MB for upload."
    },
    {
      platform: "YouTube",
      type: "YouTube Shorts",
      ratio: "9:16",
      targetWidth: 1080,
      targetHeight: 1920,
      numericRatio: 9 / 16,
      note: "Vertical video format for Shorts shelf across mobile and desktop."
    },
    {
      platform: "LinkedIn",
      type: "Feed Post Image",
      ratio: "1.91:1",
      targetWidth: 1200,
      targetHeight: 627,
      numericRatio: 1200 / 627,
      note: "Standard business landscape format. Displays cleanly on company feeds."
    },
    {
      platform: "LinkedIn",
      type: "Feed Square / Carousel Slide",
      ratio: "1:1",
      targetWidth: 1200,
      targetHeight: 1200,
      numericRatio: 1,
      note: "High engagement square format, ideal for document carousel slides."
    },
    {
      platform: "X (Twitter)",
      type: "Feed Post Image",
      ratio: "16:9",
      targetWidth: 1600,
      targetHeight: 900,
      numericRatio: 16 / 9,
      note: "Standard post ratio. Displays without automatic timeline cropping."
    }
  ];

  function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
  }

  function getSimplifiedRatio(w, h) {
    const divisor = gcd(w, h);
    const rw = w / divisor;
    const rh = h / divisor;

    // Detect common standard aspect ratios with tolerance
    const val = w / h;
    if (Math.abs(val - 1) < 0.02) return "1:1 (Square)";
    if (Math.abs(val - (4 / 5)) < 0.02) return "4:5 (Portrait)";
    if (Math.abs(val - (9 / 16)) < 0.02) return "9:16 (Vertical)";
    if (Math.abs(val - (16 / 9)) < 0.02) return "16:9 (Landscape)";
    if (Math.abs(val - (1.91 / 1)) < 0.03) return "1.91:1 (Landscape)";
    if (Math.abs(val - (3 / 2)) < 0.02) return "3:2 (Photo)";

    return `${rw}:${rh}`;
  }

  function evaluateCompatibility(imgW, imgH, spec) {
    const imgRatio = imgW / imgH;
    const targetRatio = spec.numericRatio;
    const ratioDiff = Math.abs(imgRatio - targetRatio);

    // Is resolution adequate?
    const hasEnoughResolution = imgW >= (spec.targetWidth * 0.85) && imgH >= (spec.targetHeight * 0.85);

    if (ratioDiff < 0.03) {
      if (hasEnoughResolution) {
        return {
          status: "perfect",
          badge: "✓ Perfect Fit",
          color: "#16A34A",
          bg: "#DCFCE7",
          message: `Aspect ratio and resolution align with ${spec.platform} recommendations.`
        };
      } else {
        return {
          status: "low-res",
          badge: "⚠ Low Resolution",
          color: "#D97706",
          bg: "#FEF3C7",
          message: `Aspect ratio matches, but image is smaller than recommended ${spec.targetWidth}×${spec.targetHeight}px. May look soft on high-res displays.`
        };
      }
    } else {
      let cropDirection = imgRatio > targetRatio ? "horizontal sides will be cropped" : "top/bottom will be cropped";
      return {
        status: "crop",
        badge: "⚠ Crop / Adjustment Needed",
        color: "#EA580C",
        bg: "#FFEDD5",
        message: `Aspect ratio differs from ${spec.ratio}. When uploaded, ${cropDirection} or black letterbox bars will appear.`
      };
    }
  }

  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function init() {
    const dropzone = document.getElementById('imageDropzone');
    const fileInput = document.getElementById('imageFileInput');
    const resultsContainer = document.getElementById('imageAnalysisResults');
    if (!dropzone || !fileInput || !resultsContainer) return;

    // Drag-and-drop events
    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, e => {
        e.preventDefault();
        dropzone.classList.add('is-dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, e => {
        e.preventDefault();
        dropzone.classList.remove('is-dragover');
      }, false);
    });

    dropzone.addEventListener('drop', e => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files[0]) {
        processFile(files[0]);
      }
    });

    fileInput.addEventListener('change', e => {
      if (fileInput.files && fileInput.files[0]) {
        processFile(fileInput.files[0]);
      }
    });
  }

  function processFile(file) {
    if (!file.type.startsWith('image/')) {
      alert("Please upload a valid image file (PNG, JPG, WebP, or SVG).");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        renderAnalysis({
          name: file.name,
          size: file.size,
          type: file.type,
          width: img.naturalWidth,
          height: img.naturalHeight,
          dataUrl: e.target.result
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function renderAnalysis(data) {
    const container = document.getElementById('imageAnalysisResults');
    if (!container) return;
    container.innerHTML = '';

    const ratioStr = getSimplifiedRatio(data.width, data.height);
    const sizeStr = formatBytes(data.size);

    const wrap = document.createElement('div');
    wrap.className = 'sc-image-analysis-wrap';
    wrap.innerHTML = `
      <div class="sc-analysis-overview-card">
        <div class="sc-analysis-split">
          <div class="sc-analysis-preview-box">
            <img src="${data.dataUrl}" alt="Uploaded Preview" class="sc-analysis-preview-img">
            <div class="sc-analysis-preview-overlay">
              <span>${data.width} × ${data.height} px</span>
            </div>
          </div>
          <div class="sc-analysis-specs">
            <span class="sc-badge-tag" style="margin-bottom: 8px;">Analysis Complete • Local Client-Side</span>
            <h3 style="font-size: 20px; font-weight: 800; color: #0F172A; margin: 0 0 14px;">${data.name}</h3>
            
            <div class="sc-specs-grid">
              <div class="sc-spec-item">
                <span class="sc-spec-label">Dimensions</span>
                <span class="sc-spec-value">${data.width} × ${data.height} px</span>
              </div>
              <div class="sc-spec-item">
                <span class="sc-spec-label">Aspect Ratio</span>
                <span class="sc-spec-value">${ratioStr}</span>
              </div>
              <div class="sc-spec-item">
                <span class="sc-spec-label">File Size</span>
                <span class="sc-spec-value">${sizeStr}</span>
              </div>
              <div class="sc-spec-item">
                <span class="sc-spec-label">Format</span>
                <span class="sc-spec-value">${data.type.replace('image/', '').toUpperCase()}</span>
              </div>
            </div>

            <p style="margin: 16px 0 0; font-size: 13.5px; color: #64748B;">
              🔒 <strong>100% Private:</strong> Your image was analyzed locally in your web browser. No pixels or metadata were transferred to any cloud server.
            </p>
          </div>
        </div>
      </div>

      <div class="sc-matrix-header" style="margin-top: 36px; margin-bottom: 18px;">
        <h3 style="font-size: 20px; font-weight: 800; color: #0F172A; margin: 0 0 4px;">Platform Compatibility Matrix (2026 Standards)</h3>
        <p style="margin: 0; font-size: 14px; color: #64748B;">Review how your image will render across major social network placements.</p>
      </div>

      <div class="sc-platform-matrix-grid">
        ${PLATFORM_SPECS.map(spec => {
          const evalResult = evaluateCompatibility(data.width, data.height, spec);
          return `
            <div class="sc-matrix-card">
              <div class="sc-matrix-card-head">
                <div>
                  <strong style="font-size: 15px; color: #0F172A;">${spec.platform}</strong>
                  <div style="font-size: 12.5px; color: #64748B;">${spec.type}</div>
                </div>
                <span class="sc-matrix-badge" style="background: ${evalResult.bg}; color: ${evalResult.color};">
                  ${evalResult.badge}
                </span>
              </div>
              <div class="sc-matrix-specs-row">
                <span>Recommended: <strong>${spec.targetWidth} × ${spec.targetHeight} px</strong> (${spec.ratio})</span>
              </div>
              <p class="sc-matrix-msg">${evalResult.message}</p>
              <div class="sc-matrix-note">💡 ${spec.note}</div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="sc-matrix-cta" style="margin-top: 36px; padding: 28px; background: linear-gradient(135deg, #FFF9F5 0%, #FFFFFF 100%); border: 1px solid #FED7AA; border-radius: 18px; text-align: center;">
        <h3 style="margin: 0 0 8px; font-size: 20px; font-weight: 800; color: #9A3412;">Ready to schedule this asset with perfect platform formatting?</h3>
        <p style="margin: 0 auto 18px; max-width: 600px; font-size: 14px; color: #431407;">PostNexa allows you to schedule, preview, and auto-publish content across Instagram, TikTok, Facebook, and YouTube from one intuitive workspace.</p>
        <a href="https://app.postnexa.world/signup" class="sc-btn sc-btn-primary" target="_blank" rel="noopener" style="padding: 12px 28px;">Start Free with PostNexa ➔</a>
      </div>
    `;

    container.appendChild(wrap);
    container.style.display = 'block';
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
