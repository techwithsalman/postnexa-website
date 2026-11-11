/**
 * PostNexa Tools — Image Processing Controller
 * Client-Side In-Browser Canvas API
 */

(function () {
  'use strict';

  function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // ==========================================
  // IMAGE COMPRESSOR
  // ==========================================
  function initImageCompressor() {
    const dropzone = document.getElementById('compressorDropzone');
    const fileInput = document.getElementById('compressorFileInput');
    const controls = document.getElementById('compressorControls');
    const qualitySlider = document.getElementById('compressorQuality');
    const qualityVal = document.getElementById('compressorQualityVal');
    const origPreview = document.getElementById('compressorOrigPreview');
    const origSize = document.getElementById('compressorOrigSize');
    const compPreview = document.getElementById('compressorCompPreview');
    const compSize = document.getElementById('compressorCompSize');
    const compSaved = document.getElementById('compressorCompSaved');
    const downloadBtn = document.getElementById('compressorDownloadBtn');
    const resetBtn = document.getElementById('compressorResetBtn');
    const errorBox = document.getElementById('compressorError');

    if (!dropzone || !fileInput) return;

    let currentFile = null;
    let currentImg = null;
    let compressedUrl = null;

    function showError(msg) {
      if (errorBox) {
        errorBox.textContent = msg;
        errorBox.style.display = msg ? 'block' : 'none';
      }
    }

    function processImage(file, quality) {
      showError('');
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
          currentImg = img;
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');

          const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          if (mimeType === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            function (blob) {
              if (!blob) {
                showError('Compression failed.');
                return;
              }
              if (compressedUrl) URL.revokeObjectURL(compressedUrl);
              compressedUrl = URL.createObjectURL(blob);

              if (compPreview) compPreview.src = compressedUrl;
              if (compSize) compSize.textContent = formatBytes(blob.size);

              const savedBytes = file.size - blob.size;
              const savedPct = Math.max(0, Math.round((savedBytes / file.size) * 100));
              if (compSaved) compSaved.textContent = `Saved ${savedPct}%`;

              if (downloadBtn) {
                downloadBtn.href = compressedUrl;
                const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || 'image';
                const ext = mimeType === 'image/png' ? 'png' : 'jpg';
                downloadBtn.download = `compressed_${baseName}.${ext}`;
                downloadBtn.style.display = 'inline-flex';
              }
            },
            mimeType,
            quality / 100
          );
        };
        img.onerror = () => showError('Failed to decode image data.');
        img.src = e.target.result;
      };
      reader.onerror = () => showError('Failed to read file.');
      reader.readAsDataURL(file);
    }

    function handleFile(file) {
      if (!file) return;
      if (!file.type.match(/^image\/(jpeg|png|webp)/i)) {
        showError('Please upload a JPG, PNG, or WebP image.');
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        showError('File size exceeds the 50MB browser limit.');
        return;
      }

      currentFile = file;
      if (origSize) origSize.textContent = formatBytes(file.size);
      if (origPreview) origPreview.src = URL.createObjectURL(file);

      if (controls) controls.style.display = 'block';
      if (dropzone) dropzone.style.display = 'none';

      processImage(file, qualitySlider ? parseInt(qualitySlider.value, 10) : 75);
    }

    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('is-dragover');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('is-dragover'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('is-dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files[0]) {
        handleFile(fileInput.files[0]);
      }
    });

    if (qualitySlider) {
      qualitySlider.addEventListener('input', (e) => {
        const val = e.target.value;
        if (qualityVal) qualityVal.textContent = `${val}%`;
        if (currentFile) processImage(currentFile, parseInt(val, 10));
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentFile = null;
        currentImg = null;
        if (compressedUrl) URL.revokeObjectURL(compressedUrl);
        compressedUrl = null;
        fileInput.value = '';
        if (controls) controls.style.display = 'none';
        if (dropzone) dropzone.style.display = 'block';
        showError('');
      });
    }
  }

  // ==========================================
  // IMAGE RESIZER
  // ==========================================
  function initImageResizer() {
    const dropzone = document.getElementById('resizerDropzone');
    const fileInput = document.getElementById('resizerFileInput');
    const controls = document.getElementById('resizerControls');
    const widthInput = document.getElementById('resizerWidth');
    const heightInput = document.getElementById('resizerHeight');
    const lockAspect = document.getElementById('resizerLockAspect');
    const formatSelect = document.getElementById('resizerFormat');
    const origInfo = document.getElementById('resizerOrigInfo');
    const previewImg = document.getElementById('resizerPreview');
    const resizeBtn = document.getElementById('resizerActionBtn');
    const downloadBtn = document.getElementById('resizerDownloadBtn');
    const resetBtn = document.getElementById('resizerResetBtn');
    const errorBox = document.getElementById('resizerError');

    if (!dropzone || !fileInput) return;

    let currentFile = null;
    let nativeWidth = 0;
    let nativeHeight = 0;
    let aspectRatio = 1;
    let resizedUrl = null;

    function showError(msg) {
      if (errorBox) {
        errorBox.textContent = msg;
        errorBox.style.display = msg ? 'block' : 'none';
      }
    }

    function handleFile(file) {
      if (!file || !file.type.startsWith('image/')) {
        showError('Please select a valid image file.');
        return;
      }
      currentFile = file;
      showError('');

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          nativeWidth = img.width;
          nativeHeight = img.height;
          aspectRatio = nativeWidth / nativeHeight;

          if (widthInput) widthInput.value = nativeWidth;
          if (heightInput) heightInput.value = nativeHeight;
          if (origInfo) origInfo.textContent = `Original: ${nativeWidth} × ${nativeHeight} px (${formatBytes(file.size)})`;
          if (previewImg) previewImg.src = e.target.result;

          if (dropzone) dropzone.style.display = 'none';
          if (controls) controls.style.display = 'block';
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('is-dragover');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('is-dragover'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('is-dragover');
      if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
    });
    fileInput.addEventListener('change', () => {
      if (fileInput.files?.[0]) handleFile(fileInput.files[0]);
    });

    if (widthInput && heightInput && lockAspect) {
      widthInput.addEventListener('input', () => {
        if (lockAspect.checked && aspectRatio) {
          const w = parseInt(widthInput.value, 10);
          if (w > 0) heightInput.value = Math.round(w / aspectRatio);
        }
      });

      heightInput.addEventListener('input', () => {
        if (lockAspect.checked && aspectRatio) {
          const h = parseInt(heightInput.value, 10);
          if (h > 0) widthInput.value = Math.round(h * aspectRatio);
        }
      });
    }

    // Preset buttons (25%, 50%, 75%, 200%)
    document.querySelectorAll('.th-preset-scale').forEach((btn) => {
      btn.addEventListener('click', () => {
        const scale = parseFloat(btn.getAttribute('data-scale'));
        if (nativeWidth && nativeHeight && scale) {
          if (widthInput) widthInput.value = Math.round(nativeWidth * scale);
          if (heightInput) heightInput.value = Math.round(nativeHeight * scale);
        }
      });
    });

    if (resizeBtn) {
      resizeBtn.addEventListener('click', () => {
        if (!currentFile || !nativeWidth) return;
        const targetW = parseInt(widthInput?.value || nativeWidth, 10);
        const targetH = parseInt(heightInput?.value || nativeHeight, 10);

        if (targetW <= 0 || targetH <= 0 || targetW > 10000 || targetH > 10000) {
          showError('Please enter valid dimensions between 1 and 10,000 pixels.');
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = targetW;
            canvas.height = targetH;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            const format = formatSelect ? formatSelect.value : 'jpeg';
            const mimeType = `image/${format}`;
            if (format === 'jpeg') {
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, targetW, targetH);
            }
            ctx.drawImage(img, 0, 0, targetW, targetH);

            canvas.toBlob(
              (blob) => {
                if (!blob) return showError('Resizing failed.');
                if (resizedUrl) URL.revokeObjectURL(resizedUrl);
                resizedUrl = URL.createObjectURL(blob);

                if (previewImg) previewImg.src = resizedUrl;
                if (downloadBtn) {
                  downloadBtn.href = resizedUrl;
                  const ext = format === 'jpeg' ? 'jpg' : format;
                  const baseName = currentFile.name.substring(0, currentFile.name.lastIndexOf('.')) || 'resized';
                  downloadBtn.download = `${baseName}_${targetW}x${targetH}.${ext}`;
                  downloadBtn.style.display = 'inline-flex';
                }
              },
              mimeType,
              0.92
            );
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(currentFile);
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentFile = null;
        if (resizedUrl) URL.revokeObjectURL(resizedUrl);
        resizedUrl = null;
        fileInput.value = '';
        if (controls) controls.style.display = 'none';
        if (dropzone) dropzone.style.display = 'block';
        showError('');
      });
    }
  }

  // ==========================================
  // IMAGE CONVERTER (JPG-to-PNG, PNG-to-JPG, Images-to-WebP)
  // ==========================================
  function initImageConverter() {
    const container = document.getElementById('converterTool');
    if (!container) return;

    const targetFormat = container.getAttribute('data-target-format') || 'png';
    const dropzone = document.getElementById('converterDropzone');
    const fileInput = document.getElementById('converterFileInput');
    const controls = document.getElementById('converterControls');
    const origPreview = document.getElementById('converterOrigPreview');
    const origSize = document.getElementById('converterOrigSize');
    const convPreview = document.getElementById('converterConvPreview');
    const convSize = document.getElementById('converterConvSize');
    const convActionBtn = document.getElementById('converterActionBtn');
    const downloadBtn = document.getElementById('converterDownloadBtn');
    const resetBtn = document.getElementById('converterResetBtn');
    const errorBox = document.getElementById('converterError');
    const qualitySlider = document.getElementById('converterQuality');
    const qualityVal = document.getElementById('converterQualityVal');

    let currentFile = null;
    let convertedUrl = null;

    function showError(msg) {
      if (errorBox) {
        errorBox.textContent = msg;
        errorBox.style.display = msg ? 'block' : 'none';
      }
    }

    function convert() {
      if (!currentFile) return;
      showError('');

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');

          const mimeType = targetFormat === 'png' ? 'image/png' : targetFormat === 'jpeg' ? 'image/jpeg' : 'image/webp';
          if (targetFormat === 'jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(img, 0, 0);

          const q = qualitySlider ? parseInt(qualitySlider.value, 10) / 100 : 0.92;
          canvas.toBlob(
            (blob) => {
              if (!blob) return showError('Conversion failed.');
              if (convertedUrl) URL.revokeObjectURL(convertedUrl);
              convertedUrl = URL.createObjectURL(blob);

              if (convPreview) convPreview.src = convertedUrl;
              if (convSize) convSize.textContent = formatBytes(blob.size);

              if (downloadBtn) {
                downloadBtn.href = convertedUrl;
                const ext = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
                const baseName = currentFile.name.substring(0, currentFile.name.lastIndexOf('.')) || 'converted';
                downloadBtn.download = `${baseName}.${ext}`;
                downloadBtn.style.display = 'inline-flex';
              }
            },
            mimeType,
            q
          );
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(currentFile);
    }

    function handleFile(file) {
      if (!file || !file.type.startsWith('image/')) {
        showError('Please upload an image file.');
        return;
      }
      currentFile = file;
      if (origSize) origSize.textContent = formatBytes(file.size);
      if (origPreview) origPreview.src = URL.createObjectURL(file);

      if (dropzone) dropzone.style.display = 'none';
      if (controls) controls.style.display = 'block';

      convert();
    }

    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('is-dragover');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('is-dragover'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('is-dragover');
      if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
    });
    fileInput.addEventListener('change', () => {
      if (fileInput.files?.[0]) handleFile(fileInput.files[0]);
    });

    if (qualitySlider) {
      qualitySlider.addEventListener('input', (e) => {
        if (qualityVal) qualityVal.textContent = `${e.target.value}%`;
        convert();
      });
    }

    if (convActionBtn) convActionBtn.addEventListener('click', convert);

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentFile = null;
        if (convertedUrl) URL.revokeObjectURL(convertedUrl);
        convertedUrl = null;
        fileInput.value = '';
        if (controls) controls.style.display = 'none';
        if (dropzone) dropzone.style.display = 'block';
        showError('');
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initImageCompressor();
    initImageResizer();
    initImageConverter();
  });
})();
