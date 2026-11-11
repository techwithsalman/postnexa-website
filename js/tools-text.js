/**
 * PostNexa Tools — Text Processing & Formatting Controller
 * Client-Side In-Browser Pure Text Manipulation
 */

(function () {
  'use strict';

  // ==========================================
  // WORD & CHARACTER COUNTER
  // ==========================================
  function initWordCounter() {
    const textarea = document.getElementById('wordCounterInput');
    const wordsEl = document.getElementById('statWords');
    const charsEl = document.getElementById('statChars');
    const charsNoSpaceEl = document.getElementById('statCharsNoSpace');
    const sentencesEl = document.getElementById('statSentences');
    const paragraphsEl = document.getElementById('statParagraphs');
    const readingTimeEl = document.getElementById('statReadingTime');
    const copyBtn = document.getElementById('wordCounterCopyBtn');
    const clearBtn = document.getElementById('wordCounterClearBtn');

    if (!textarea) return;

    function update() {
      const text = textarea.value;
      const trimmed = text.trim();

      const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
      const chars = text.length;
      const charsNoSpace = text.replace(/\s/g, '').length;
      const sentences = trimmed ? (text.match(/[^.!?]+[.!?]+/g) || [text]).length : 0;
      const paragraphs = trimmed ? text.split(/\n+/).filter((p) => p.trim().length > 0).length : 0;
      const readingTime = Math.ceil(words / 200);

      if (wordsEl) wordsEl.textContent = words.toLocaleString();
      if (charsEl) charsEl.textContent = chars.toLocaleString();
      if (charsNoSpaceEl) charsNoSpaceEl.textContent = charsNoSpace.toLocaleString();
      if (sentencesEl) sentencesEl.textContent = sentences.toLocaleString();
      if (paragraphsEl) paragraphsEl.textContent = paragraphs.toLocaleString();
      if (readingTimeEl) readingTimeEl.textContent = `${readingTime} min`;
    }

    textarea.addEventListener('input', update);
    update();

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        if (!textarea.value) return;
        navigator.clipboard.writeText(textarea.value).then(() => {
          const orig = copyBtn.textContent;
          copyBtn.textContent = 'Copied!';
          setTimeout(() => (copyBtn.textContent = orig), 2000);
        });
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        textarea.value = '';
        update();
      });
    }
  }

  // ==========================================
  // CASE CONVERTER
  // ==========================================
  function initCaseConverter() {
    const textarea = document.getElementById('caseConverterInput');
    const copyBtn = document.getElementById('caseCopyBtn');
    const clearBtn = document.getElementById('caseClearBtn');

    if (!textarea) return;

    function bindTransform(btnId, fn) {
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.addEventListener('click', () => {
          if (!textarea.value) return;
          textarea.value = fn(textarea.value);
        });
      }
    }

    bindTransform('caseUpperBtn', (t) => t.toUpperCase());
    bindTransform('caseLowerBtn', (t) => t.toLowerCase());
    bindTransform('caseTitleBtn', (t) =>
      t.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase())
    );
    bindTransform('caseSentenceBtn', (t) =>
      t.toLowerCase().replace(/(^\s*|\.\s*)([a-z])/g, (_, sep, char) => sep + char.toUpperCase())
    );
    bindTransform('caseSlugBtn', (t) =>
      t
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
    );
    bindTransform('caseCamelBtn', (t) =>
      t
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, idx) => (idx === 0 ? word.toLowerCase() : word.toUpperCase()))
        .replace(/\s+/g, '')
    );

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        if (!textarea.value) return;
        navigator.clipboard.writeText(textarea.value).then(() => {
          const orig = copyBtn.textContent;
          copyBtn.textContent = 'Copied!';
          setTimeout(() => (copyBtn.textContent = orig), 2000);
        });
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        textarea.value = '';
      });
    }
  }

  // ==========================================
  // REMOVE DUPLICATE LINES
  // ==========================================
  function initRemoveDuplicateLines() {
    const textarea = document.getElementById('dedupeInput');
    const caseCheck = document.getElementById('dedupeCaseCheck');
    const trimCheck = document.getElementById('dedupeTrimCheck');
    const origCountEl = document.getElementById('dedupeOrigCount');
    const cleanCountEl = document.getElementById('dedupeCleanCount');
    const removedCountEl = document.getElementById('dedupeRemovedCount');
    const applyBtn = document.getElementById('dedupeApplyBtn');
    const copyBtn = document.getElementById('dedupeCopyBtn');
    const clearBtn = document.getElementById('dedupeClearBtn');

    if (!textarea) return;

    function getDeduplicated() {
      const text = textarea.value;
      if (!text) return { lines: [], orig: 0, clean: 0, removed: 0 };

      const lines = text.split('\n');
      const orig = lines.length;
      const caseSensitive = caseCheck ? caseCheck.checked : false;
      const trimLines = trimCheck ? trimCheck.checked : true;

      const seen = new Set();
      const cleanLines = [];

      for (const line of lines) {
        const processed = trimLines ? line.trim() : line;
        const key = caseSensitive ? processed : processed.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          cleanLines.push(processed);
        }
      }

      return {
        lines: cleanLines,
        orig,
        clean: cleanLines.length,
        removed: orig - cleanLines.length,
      };
    }

    let lastRemoved = 0;

    function updateStats(overrideRemoved) {
      const { orig, clean, removed } = getDeduplicated();
      if (origCountEl) origCountEl.textContent = orig;
      if (cleanCountEl) cleanCountEl.textContent = clean;
      if (removedCountEl) {
        removedCountEl.textContent = typeof overrideRemoved === 'number' ? overrideRemoved : removed;
      }
    }

    textarea.addEventListener('input', () => updateStats());
    if (caseCheck) caseCheck.addEventListener('change', () => updateStats());
    if (trimCheck) trimCheck.addEventListener('change', () => updateStats());

    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        const { lines, removed } = getDeduplicated();
        lastRemoved = removed;
        textarea.value = lines.join('\n');
        updateStats(lastRemoved);
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const { lines } = getDeduplicated();
        const text = lines.join('\n');
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
          const orig = copyBtn.textContent;
          copyBtn.textContent = 'Copied!';
          setTimeout(() => (copyBtn.textContent = orig), 2000);
        });
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        textarea.value = '';
        updateStats();
      });
    }
  }

  // ==========================================
  // TEXT CLEANER
  // ==========================================
  function initTextCleaner() {
    const textarea = document.getElementById('textCleanerInput');
    const htmlCheck = document.getElementById('cleanerHtmlCheck');
    const spaceCheck = document.getElementById('cleanerSpaceCheck');
    const linesCheck = document.getElementById('cleanerLinesCheck');
    const applyBtn = document.getElementById('cleanerApplyBtn');
    const copyBtn = document.getElementById('cleanerCopyBtn');
    const clearBtn = document.getElementById('cleanerClearBtn');

    if (!textarea) return;

    function clean() {
      let result = textarea.value;
      if (!result) return;

      if (htmlCheck && htmlCheck.checked) {
        result = result.replace(/<[^>]*>?/gm, '');
      }
      if (spaceCheck && spaceCheck.checked) {
        result = result.replace(/[ \t]+/g, ' ');
      }
      if (linesCheck && linesCheck.checked) {
        result = result
          .split('\n')
          .filter((line) => line.trim().length > 0)
          .join('\n');
      }

      textarea.value = result.trim();
    }

    if (applyBtn) applyBtn.addEventListener('click', clean);

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        if (!textarea.value) return;
        navigator.clipboard.writeText(textarea.value).then(() => {
          const orig = copyBtn.textContent;
          copyBtn.textContent = 'Copied!';
          setTimeout(() => (copyBtn.textContent = orig), 2000);
        });
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        textarea.value = '';
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initWordCounter();
    initCaseConverter();
    initRemoveDuplicateLines();
    initTextCleaner();
  });
})();
