/**
 * PostNexa Tools — PDF Processing Controller
 * Powered by client-side PDF-Lib (assets/vendor/pdf-lib.min.js)
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

  function getPdfLib() {
    return window.PDFLib || null;
  }

  // ==========================================
  // MERGE PDF
  // ==========================================
  function initMergePdf() {
    const dropzone = document.getElementById('mergePdfDropzone');
    const fileInput = document.getElementById('mergePdfFileInput');
    const fileListEl = document.getElementById('mergePdfList');
    const controls = document.getElementById('mergePdfControls');
    const mergeBtn = document.getElementById('mergePdfActionBtn');
    const downloadBtn = document.getElementById('mergePdfDownloadBtn');
    const resetBtn = document.getElementById('mergePdfResetBtn');
    const errorBox = document.getElementById('mergePdfError');
    const statusBox = document.getElementById('mergePdfStatus');

    if (!dropzone || !fileInput) return;

    let pdfFiles = [];
    let mergedUrl = null;

    function showError(msg) {
      if (errorBox) {
        errorBox.textContent = msg;
        errorBox.style.display = msg ? 'block' : 'none';
      }
    }

    function renderList() {
      if (!fileListEl) return;
      fileListEl.innerHTML = '';

      if (pdfFiles.length === 0) {
        if (controls) controls.style.display = 'none';
        if (dropzone) dropzone.style.display = 'block';
        return;
      }

      if (controls) controls.style.display = 'block';

      pdfFiles.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'th-pdf-item';
        row.innerHTML = `
          <div class="th-pdf-item-info">
            <span style="font-size: 20px;">📄</span>
            <div style="min-width: 0; flex: 1;">
              <div class="th-pdf-item-name">${item.name}</div>
              <div class="th-pdf-item-size">${formatBytes(item.size)}</div>
            </div>
          </div>
          <div class="th-pdf-item-actions">
            ${index > 0 ? `<button type="button" class="th-btn th-btn-secondary th-pdf-up" data-idx="${index}" title="Move Up">↑</button>` : ''}
            ${index < pdfFiles.length - 1 ? `<button type="button" class="th-btn th-btn-secondary th-pdf-down" data-idx="${index}" title="Move Down">↓</button>` : ''}
            <button type="button" class="th-btn th-btn-ghost th-pdf-del" data-idx="${index}" title="Remove">✕</button>
          </div>
        `;
        fileListEl.appendChild(row);
      });

      // Bind buttons
      fileListEl.querySelectorAll('.th-pdf-up').forEach((b) => {
        b.addEventListener('click', () => {
          const idx = parseInt(b.getAttribute('data-idx'), 10);
          const temp = pdfFiles[idx];
          pdfFiles[idx] = pdfFiles[idx - 1];
          pdfFiles[idx - 1] = temp;
          renderList();
        });
      });

      fileListEl.querySelectorAll('.th-pdf-down').forEach((b) => {
        b.addEventListener('click', () => {
          const idx = parseInt(b.getAttribute('data-idx'), 10);
          const temp = pdfFiles[idx];
          pdfFiles[idx] = pdfFiles[idx + 1];
          pdfFiles[idx + 1] = temp;
          renderList();
        });
      });

      fileListEl.querySelectorAll('.th-pdf-del').forEach((b) => {
        b.addEventListener('click', () => {
          const idx = parseInt(b.getAttribute('data-idx'), 10);
          pdfFiles.splice(idx, 1);
          renderList();
        });
      });
    }

    function addFiles(files) {
      showError('');
      Array.from(files).forEach((file) => {
        if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
          pdfFiles.push(file);
        } else {
          showError('Only PDF files are supported.');
        }
      });
      renderList();
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
      if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
    });
    fileInput.addEventListener('change', () => {
      if (fileInput.files) addFiles(fileInput.files);
    });

    if (mergeBtn) {
      mergeBtn.addEventListener('click', async () => {
        if (pdfFiles.length < 2) {
          showError('Please add at least 2 PDF files to merge.');
          return;
        }
        const PDFLib = getPdfLib();
        if (!PDFLib) {
          showError('PDF engine is still loading. Please try again in a moment.');
          return;
        }

        showError('');
        if (statusBox) {
          statusBox.textContent = 'Merging documents...';
          statusBox.style.display = 'block';
        }
        mergeBtn.disabled = true;

        try {
          const mergedPdf = await PDFLib.PDFDocument.create();

          for (const file of pdfFiles) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
          }

          const pdfBytes = await mergedPdf.save();
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          if (mergedUrl) URL.revokeObjectURL(mergedUrl);
          mergedUrl = URL.createObjectURL(blob);

          if (downloadBtn) {
            downloadBtn.href = mergedUrl;
            downloadBtn.download = 'postnexa_merged.pdf';
            downloadBtn.style.display = 'inline-flex';
          }
          if (statusBox) {
            statusBox.textContent = `Merge complete! Total size: ${formatBytes(blob.size)}`;
          }
        } catch (err) {
          showError('Failed to merge PDFs. One of the documents may be encrypted or corrupted.');
        } finally {
          mergeBtn.disabled = false;
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        pdfFiles = [];
        if (mergedUrl) URL.revokeObjectURL(mergedUrl);
        mergedUrl = null;
        fileInput.value = '';
        renderList();
        showError('');
        if (downloadBtn) downloadBtn.style.display = 'none';
        if (statusBox) statusBox.style.display = 'none';
      });
    }
  }

  // ==========================================
  // SPLIT PDF
  // ==========================================
  function initSplitPdf() {
    const dropzone = document.getElementById('splitPdfDropzone');
    const fileInput = document.getElementById('splitPdfFileInput');
    const controls = document.getElementById('splitPdfControls');
    const docInfo = document.getElementById('splitPdfInfo');
    const rangeInput = document.getElementById('splitPdfRange');
    const splitBtn = document.getElementById('splitPdfActionBtn');
    const downloadBtn = document.getElementById('splitPdfDownloadBtn');
    const resetBtn = document.getElementById('splitPdfResetBtn');
    const errorBox = document.getElementById('splitPdfError');
    const statusBox = document.getElementById('splitPdfStatus');

    if (!dropzone || !fileInput) return;

    let currentFile = null;
    let totalPages = 0;
    let splitUrl = null;

    function showError(msg) {
      if (errorBox) {
        errorBox.textContent = msg;
        errorBox.style.display = msg ? 'block' : 'none';
      }
    }

    async function handleFile(file) {
      if (!file || (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf'))) {
        showError('Please upload a valid PDF document.');
        return;
      }
      const PDFLib = getPdfLib();
      if (!PDFLib) {
        showError('PDF library loading...');
        return;
      }

      showError('');
      try {
        const buffer = await file.arrayBuffer();
        const pdf = await PDFLib.PDFDocument.load(buffer);
        totalPages = pdf.getPageCount();
        currentFile = file;

        if (docInfo) {
          docInfo.textContent = `${file.name} — ${totalPages} page${totalPages > 1 ? 's' : ''} (${formatBytes(file.size)})`;
        }
        if (rangeInput) rangeInput.value = `1-${totalPages}`;

        if (dropzone) dropzone.style.display = 'none';
        if (controls) controls.style.display = 'block';
      } catch (err) {
        showError('Could not open PDF. It may be password protected.');
      }
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

    function parseRange(str, max) {
      const indices = new Set();
      const parts = str.split(',');
      for (const p of parts) {
        const trimmed = p.trim();
        if (trimmed.includes('-')) {
          const [s, e] = trimmed.split('-');
          const start = parseInt(s, 10);
          const end = parseInt(e, 10);
          if (!isNaN(start) && !isNaN(end)) {
            for (let i = Math.max(1, start); i <= Math.min(max, end); i++) {
              indices.add(i - 1);
            }
          }
        } else {
          const n = parseInt(trimmed, 10);
          if (!isNaN(n) && n >= 1 && n <= max) indices.add(n - 1);
        }
      }
      return Array.from(indices).sort((a, b) => a - b);
    }

    if (splitBtn) {
      splitBtn.addEventListener('click', async () => {
        if (!currentFile || totalPages === 0) return;
        const PDFLib = getPdfLib();
        if (!PDFLib) return;

        const indices = parseRange(rangeInput?.value || '', totalPages);
        if (indices.length === 0) {
          showError(`Please enter a valid page range between 1 and ${totalPages}.`);
          return;
        }

        showError('');
        if (statusBox) {
          statusBox.textContent = 'Extracting specified pages...';
          statusBox.style.display = 'block';
        }

        try {
          const buffer = await currentFile.arrayBuffer();
          const srcPdf = await PDFLib.PDFDocument.load(buffer);
          const newPdf = await PDFLib.PDFDocument.create();

          const copied = await newPdf.copyPages(srcPdf, indices);
          copied.forEach((p) => newPdf.addPage(p));

          const bytes = await newPdf.save();
          const blob = new Blob([bytes], { type: 'application/pdf' });
          if (splitUrl) URL.revokeObjectURL(splitUrl);
          splitUrl = URL.createObjectURL(blob);

          if (downloadBtn) {
            downloadBtn.href = splitUrl;
            const baseName = currentFile.name.substring(0, currentFile.name.lastIndexOf('.')) || 'split';
            downloadBtn.download = `${baseName}_extracted.pdf`;
            downloadBtn.style.display = 'inline-flex';
          }
          if (statusBox) {
            statusBox.textContent = `Extracted ${indices.length} page${indices.length > 1 ? 's' : ''}! File size: ${formatBytes(blob.size)}`;
          }
        } catch (err) {
          showError('Failed to extract pages from PDF.');
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentFile = null;
        totalPages = 0;
        if (splitUrl) URL.revokeObjectURL(splitUrl);
        splitUrl = null;
        fileInput.value = '';
        if (controls) controls.style.display = 'none';
        if (dropzone) dropzone.style.display = 'block';
        showError('');
        if (downloadBtn) downloadBtn.style.display = 'none';
        if (statusBox) statusBox.style.display = 'none';
      });
    }
  }

  // ==========================================
  // COMPRESS PDF
  // ==========================================
  function initCompressPdf() {
    const dropzone = document.getElementById('compressPdfDropzone');
    const fileInput = document.getElementById('compressPdfFileInput');
    const controls = document.getElementById('compressPdfControls');
    const origInfo = document.getElementById('compressPdfOrigInfo');
    const compressBtn = document.getElementById('compressPdfActionBtn');
    const downloadBtn = document.getElementById('compressPdfDownloadBtn');
    const resetBtn = document.getElementById('compressPdfResetBtn');
    const errorBox = document.getElementById('compressPdfError');
    const statusBox = document.getElementById('compressPdfStatus');

    if (!dropzone || !fileInput) return;

    let currentFile = null;
    let compressedUrl = null;

    function showError(msg) {
      if (errorBox) {
        errorBox.textContent = msg;
        errorBox.style.display = msg ? 'block' : 'none';
      }
    }

    function handleFile(file) {
      if (!file || (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf'))) {
        showError('Please upload a PDF document.');
        return;
      }
      currentFile = file;
      if (origInfo) origInfo.textContent = `${file.name} (${formatBytes(file.size)})`;

      if (dropzone) dropzone.style.display = 'none';
      if (controls) controls.style.display = 'block';
      showError('');
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

    if (compressBtn) {
      compressBtn.addEventListener('click', async () => {
        if (!currentFile) return;
        const PDFLib = getPdfLib();
        if (!PDFLib) return;

        showError('');
        if (statusBox) {
          statusBox.textContent = 'Optimizing and compressing PDF streams...';
          statusBox.style.display = 'block';
        }
        compressBtn.disabled = true;

        try {
          const buffer = await currentFile.arrayBuffer();
          const pdf = await PDFLib.PDFDocument.load(buffer);

          // Save with maximum object stream compression and stripped metadata
          const bytes = await pdf.save({
            useObjectStreams: true,
            addDefaultPage: false,
            objectsPerTick: 50,
          });

          const blob = new Blob([bytes], { type: 'application/pdf' });
          if (compressedUrl) URL.revokeObjectURL(compressedUrl);
          compressedUrl = URL.createObjectURL(blob);

          const savedBytes = currentFile.size - blob.size;
          const savedPct = Math.max(0, Math.round((savedBytes / currentFile.size) * 100));

          if (downloadBtn) {
            downloadBtn.href = compressedUrl;
            const baseName = currentFile.name.substring(0, currentFile.name.lastIndexOf('.')) || 'document';
            downloadBtn.download = `compressed_${baseName}.pdf`;
            downloadBtn.style.display = 'inline-flex';
          }

          if (statusBox) {
            if (savedBytes > 0) {
              statusBox.textContent = `Compressed to ${formatBytes(blob.size)} (Saved ${savedPct}%)!`;
            } else {
              statusBox.textContent = `PDF is already highly optimized. Output size: ${formatBytes(blob.size)}`;
            }
          }
        } catch (err) {
          showError('Compression error. Document may be encrypted.');
        } finally {
          compressBtn.disabled = false;
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentFile = null;
        if (compressedUrl) URL.revokeObjectURL(compressedUrl);
        compressedUrl = null;
        fileInput.value = '';
        if (controls) controls.style.display = 'none';
        if (dropzone) dropzone.style.display = 'block';
        showError('');
        if (downloadBtn) downloadBtn.style.display = 'none';
        if (statusBox) statusBox.style.display = 'none';
      });
    }
  }

  // ==========================================
  // IMAGES TO PDF
  // ==========================================
  function initImagesToPdf() {
    const dropzone = document.getElementById('imgToPdfDropzone');
    const fileInput = document.getElementById('imgToPdfFileInput');
    const fileListEl = document.getElementById('imgToPdfList');
    const controls = document.getElementById('imgToPdfControls');
    const orientationSelect = document.getElementById('imgToPdfOrientation');
    const marginSelect = document.getElementById('imgToPdfMargin');
    const convertBtn = document.getElementById('imgToPdfActionBtn');
    const downloadBtn = document.getElementById('imgToPdfDownloadBtn');
    const resetBtn = document.getElementById('imgToPdfResetBtn');
    const errorBox = document.getElementById('imgToPdfError');
    const statusBox = document.getElementById('imgToPdfStatus');

    if (!dropzone || !fileInput) return;

    let imageFiles = [];
    let generatedPdfUrl = null;

    function showError(msg) {
      if (errorBox) {
        errorBox.textContent = msg;
        errorBox.style.display = msg ? 'block' : 'none';
      }
    }

    function renderList() {
      if (!fileListEl) return;
      fileListEl.innerHTML = '';

      if (imageFiles.length === 0) {
        if (controls) controls.style.display = 'none';
        if (dropzone) dropzone.style.display = 'block';
        return;
      }

      if (controls) controls.style.display = 'block';

      imageFiles.forEach((file, index) => {
        const row = document.createElement('div');
        row.className = 'th-pdf-item';
        row.innerHTML = `
          <div class="th-pdf-item-info">
            <span style="font-size: 20px;">🖼️</span>
            <div style="min-width: 0; flex: 1;">
              <div class="th-pdf-item-name">${file.name}</div>
              <div class="th-pdf-item-size">${formatBytes(file.size)}</div>
            </div>
          </div>
          <div class="th-pdf-item-actions">
            ${index > 0 ? `<button type="button" class="th-btn th-btn-secondary th-img-up" data-idx="${index}">↑</button>` : ''}
            ${index < imageFiles.length - 1 ? `<button type="button" class="th-btn th-btn-secondary th-img-down" data-idx="${index}">↓</button>` : ''}
            <button type="button" class="th-btn th-btn-ghost th-img-del" data-idx="${index}">✕</button>
          </div>
        `;
        fileListEl.appendChild(row);
      });

      fileListEl.querySelectorAll('.th-img-up').forEach((b) => {
        b.addEventListener('click', () => {
          const idx = parseInt(b.getAttribute('data-idx'), 10);
          const t = imageFiles[idx];
          imageFiles[idx] = imageFiles[idx - 1];
          imageFiles[idx - 1] = t;
          renderList();
        });
      });

      fileListEl.querySelectorAll('.th-img-down').forEach((b) => {
        b.addEventListener('click', () => {
          const idx = parseInt(b.getAttribute('data-idx'), 10);
          const t = imageFiles[idx];
          imageFiles[idx] = imageFiles[idx + 1];
          imageFiles[idx + 1] = t;
          renderList();
        });
      });

      fileListEl.querySelectorAll('.th-img-del').forEach((b) => {
        b.addEventListener('click', () => {
          const idx = parseInt(b.getAttribute('data-idx'), 10);
          imageFiles.splice(idx, 1);
          renderList();
        });
      });
    }

    function addImages(files) {
      showError('');
      Array.from(files).forEach((f) => {
        if (f.type.startsWith('image/')) {
          imageFiles.push(f);
        } else {
          showError('Only image files (JPG, PNG, WebP) are allowed.');
        }
      });
      renderList();
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
      if (e.dataTransfer.files) addImages(e.dataTransfer.files);
    });
    fileInput.addEventListener('change', () => {
      if (fileInput.files) addImages(fileInput.files);
    });

    function fileToJpegBuffer(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
              if (!blob) return reject('Failed to convert image');
              blob.arrayBuffer().then((buf) => resolve({ buffer: new Uint8Array(buf), width: img.width, height: img.height }));
            }, 'image/jpeg', 0.9);
          };
          img.onerror = () => reject('Image decode error');
          img.src = e.target.result;
        };
        reader.onerror = () => reject('File read error');
        reader.readAsDataURL(file);
      });
    }

    if (convertBtn) {
      convertBtn.addEventListener('click', async () => {
        if (imageFiles.length === 0) {
          showError('Please add at least one image.');
          return;
        }
        const PDFLib = getPdfLib();
        if (!PDFLib) return;

        showError('');
        if (statusBox) {
          statusBox.textContent = 'Generating PDF document...';
          statusBox.style.display = 'block';
        }
        convertBtn.disabled = true;

        try {
          const pdfDoc = await PDFLib.PDFDocument.create();
          const isLandscape = orientationSelect?.value === 'landscape';
          const margin = parseInt(marginSelect?.value || '20', 10);

          // Standard A4 dimensions in points: 595.28 x 841.89
          const pageWidth = isLandscape ? 841.89 : 595.28;
          const pageHeight = isLandscape ? 595.28 : 841.89;

          for (const imgFile of imageFiles) {
            const { buffer, width, height } = await fileToJpegBuffer(imgFile);
            const embeddedImg = await pdfDoc.embedJpg(buffer);

            const page = pdfDoc.addPage([pageWidth, pageHeight]);
            const printableWidth = pageWidth - margin * 2;
            const printableHeight = pageHeight - margin * 2;

            const scale = Math.min(printableWidth / width, printableHeight / height, 1);
            const renderWidth = width * scale;
            const renderHeight = height * scale;

            const x = margin + (printableWidth - renderWidth) / 2;
            const y = margin + (printableHeight - renderHeight) / 2;

            page.drawImage(embeddedImg, {
              x,
              y,
              width: renderWidth,
              height: renderHeight,
            });
          }

          const pdfBytes = await pdfDoc.save();
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          if (generatedPdfUrl) URL.revokeObjectURL(generatedPdfUrl);
          generatedPdfUrl = URL.createObjectURL(blob);

          if (downloadBtn) {
            downloadBtn.href = generatedPdfUrl;
            downloadBtn.download = 'images_converted.pdf';
            downloadBtn.style.display = 'inline-flex';
          }
          if (statusBox) {
            statusBox.textContent = `PDF created successfully with ${imageFiles.length} image(s)! (${formatBytes(blob.size)})`;
          }
        } catch (err) {
          showError('Failed to generate PDF from images.');
        } finally {
          convertBtn.disabled = false;
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        imageFiles = [];
        if (generatedPdfUrl) URL.revokeObjectURL(generatedPdfUrl);
        generatedPdfUrl = null;
        fileInput.value = '';
        renderList();
        showError('');
        if (downloadBtn) downloadBtn.style.display = 'none';
        if (statusBox) statusBox.style.display = 'none';
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initMergePdf();
    initSplitPdf();
    initCompressPdf();
    initImagesToPdf();
  });
})();
