/**
 * PostNexa Tools — Master Hub Directory Controller
 * Real-Time Instant Search & Category Filtering
 */

(function () {
  'use strict';

  function initToolsHub() {
    const searchInput = document.getElementById('thHubSearch');
    const tabButtons = document.querySelectorAll('.th-tab-btn');
    const toolCards = document.querySelectorAll('.th-card');
    const noResultsEl = document.getElementById('thNoResults');

    if (!searchInput && tabButtons.length === 0) return;

    let activeCategory = 'all';

    function filterTools() {
      const query = (searchInput?.value || '').toLowerCase().trim();
      let visibleCount = 0;

      toolCards.forEach((card) => {
        const cat = card.getAttribute('data-category') || '';
        const title = (card.querySelector('.th-card-title')?.textContent || '').toLowerCase();
        const desc = (card.querySelector('.th-card-desc')?.textContent || '').toLowerCase();
        const keywords = (card.getAttribute('data-keywords') || '').toLowerCase();

        const matchesCat = activeCategory === 'all' || cat === activeCategory;
        const matchesQuery = !query || title.includes(query) || desc.includes(query) || keywords.includes(query);

        if (matchesCat && matchesQuery) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (noResultsEl) {
        noResultsEl.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', filterTools);
    }

    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabButtons.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        activeCategory = btn.getAttribute('data-category') || 'all';
        filterTools();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initToolsHub);
})();
