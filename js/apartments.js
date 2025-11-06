// Apartments Page Filters and Enhancements
// Works alongside inline loadApartments() without interfering

(function() {
  function qs(sel) { return document.querySelector(sel); }
  function qsa(sel) { return Array.from(document.querySelectorAll(sel)); }

  const storageKey = 'apartments.lastFilter';

  function getLastFilter() {
    try { return localStorage.getItem(storageKey) || 'all'; } catch { return 'all'; }
  }

  function setLastFilter(val) {
    try { localStorage.setItem(storageKey, val); } catch {}
  }

  function applyFilter(filter) {
    const items = qsa('.apartment-item');
    if (!items.length) return; // wait until loadApartments() renders

    items.forEach(item => {
      const cats = (item.getAttribute('data-category') || '').toLowerCase();
      const show = filter === 'all' ? true : cats.split(/\s+/).includes(filter) || cats.includes(filter);
      item.style.display = show ? '' : 'none';
    });

    // Update active button state
    qsa('#apartmentFilters .filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
      btn.setAttribute('aria-pressed', btn.classList.contains('active'));
    });

    setLastFilter(filter);
  }

  function bindFilters() {
    const container = qs('#apartmentFilters');
    if (!container) return;
    container.setAttribute('role', 'tablist');

    qsa('#apartmentFilters .filter-btn').forEach(btn => {
      btn.setAttribute('role', 'tab');
      btn.addEventListener('click', (e) => {
        const filter = btn.dataset.filter || 'all';
        applyFilter(filter);
      });
      // Keyboard support: Enter/Space
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });
  }

  function init() {
    bindFilters();

    // Try applying persisted filter after apartments render
    const initial = getLastFilter();
    const tryApply = () => {
      const itemsReady = !!document.querySelector('.apartment-item');
      if (!itemsReady) {
        requestAnimationFrame(tryApply);
        return;
      }
      applyFilter(initial);
    };
    tryApply();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose minimal API for debugging
  window.Apartments = { applyFilter };
})();