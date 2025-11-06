/**
 * Excursions page enhancements
 * - Filter controls for excursion cards
 * - Price localization for cards and booking modal
 * - Persistence of last selected filter
 * - Accessibility improvements for filters
 */

(function () {
  const LS_FILTER_KEY = 'excursions.lastFilter';

  function $(selector, root = document) {
    return root.querySelector(selector);
  }
  function $all(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function getCurrentLanguage() {
    try {
      return window.LanguageManager?.getCurrentLanguage?.() || localStorage.getItem('language') || 'en';
    } catch (_) {
      return localStorage.getItem('language') || 'en';
    }
  }
  function formatCurrency(amount, currency = 'USD') {
    try {
      return window.LanguageManager?.formatCurrencyLocalized?.(amount, currency) || `$${amount}`;
    } catch (_) {
      return `$${amount}`;
    }
  }

  // Filter logic
  function applyFilter(filter) {
    const items = $all('#excursionsGrid .excursion-item');
    const buttons = $all('#excursionFilters .filter-btn');

    // Update active button state
    buttons.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === filter));

    // Persist selection
    try { localStorage.setItem(LS_FILTER_KEY, filter); } catch (_) {}

    if (!items.length) return;

    if (filter === 'all') {
      items.forEach(el => { el.style.display = ''; el.setAttribute('aria-hidden', 'false'); });
      return;
    }

    items.forEach(el => {
      const categories = (el.dataset.category || '').toLowerCase();
      const show = categories.split(/\s+/).includes(filter) || categories.includes(filter);
      el.style.display = show ? '' : 'none';
      el.setAttribute('aria-hidden', show ? 'false' : 'true');
    });
  }

  function bindFilters() {
    const container = $('#excursionFilters');
    if (!container) return;
    const buttons = $all('.filter-btn', container);

    buttons.forEach(btn => {
      btn.setAttribute('role', 'button');
      btn.setAttribute('tabindex', '0');
      btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          applyFilter(btn.dataset.filter);
        }
        // Arrow key navigation
        const idx = buttons.indexOf(btn);
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          const next = buttons[idx + 1] || buttons[0];
          next.focus();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const prev = buttons[idx - 1] || buttons[buttons.length - 1];
          prev.focus();
        }
      });
    });
  }

  // Price localization in cards
  function localizeCardPrices() {
    const cards = $all('#excursionsGrid .excursion-item');
    if (!cards.length) return;
    cards.forEach(card => {
      const priceSpan = $('.excursion-price', card);
      const bookBtn = $('.book-excursion-btn', card);
      if (priceSpan && bookBtn) {
        const raw = parseFloat(bookBtn.dataset.excursionPrice || priceSpan.textContent.replace(/[^0-9.]/g, ''));
        if (!isNaN(raw)) {
          priceSpan.textContent = formatCurrency(raw, 'USD');
        }
      }
    });
  }

  // Price localization in booking modal
  function localizeBookingModalPrices() {
    const modal = $('#bookingModal');
    if (!modal || modal.style.display === 'none') return;
    const perPersonEl = $('#pricePerPerson');
    const totalEl = $('#excursionTotal');
    const participantCountEl = $('#participantCount');
    const priceRaw = parseFloat(modal.dataset.excursionPrice || '0');
    const participants = parseInt(participantCountEl?.value || '1', 10);
    if (perPersonEl) perPersonEl.textContent = formatCurrency(priceRaw, 'USD');
    if (totalEl) totalEl.textContent = formatCurrency(priceRaw * (isNaN(participants) ? 1 : participants), 'USD');
  }

  function observeModalOpen() {
    const modal = $('#bookingModal');
    if (!modal) return;
    const obs = new MutationObserver(() => {
      // When style changes (e.g., display becomes flex), update localized prices
      localizeBookingModalPrices();
    });
    obs.observe(modal, { attributes: true, attributeFilter: ['style'] });

    // Also ensure we localize after inline updateExcursionPrice runs on participant change
    const participant = $('#participantCount');
    if (participant) {
      participant.addEventListener('change', () => setTimeout(localizeBookingModalPrices, 0));
      participant.addEventListener('input', () => setTimeout(localizeBookingModalPrices, 0));
    }
  }

  // Try to apply last filter after cards render
  function applyPersistedFilterWhenReady() {
    const saved = localStorage.getItem(LS_FILTER_KEY) || 'all';
    const attempt = () => {
      const hasCards = !!$('#excursionsGrid .excursion-item');
      if (hasCards) {
        applyFilter(saved);
        localizeCardPrices();
        return true;
      }
      return false;
    };
    // Quick attempts first, then fallback
    if (attempt()) return;
    const start = performance.now();
    const timer = setInterval(() => {
      if (attempt() || performance.now() - start > 3000) {
        clearInterval(timer);
      }
    }, 100);
  }

  // React to language changes
  function setupLanguageObserver() {
    try {
      const lm = window.LanguageManager?.languageManager;
      if (!lm) return;
      lm.addObserver((event) => {
        if (event === 'languageChanged') {
          // Update prices according to new locale
          localizeCardPrices();
          localizeBookingModalPrices();
        }
      });
    } catch (_) {}
  }

  function init() {
    bindFilters();
    observeModalOpen();
    setupLanguageObserver();
    applyPersistedFilterWhenReady();
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose minimal API for debugging
  window.ExcursionsModule = {
    applyFilter,
    localizeCardPrices,
    localizeBookingModalPrices,
    getCurrentLanguage
  };
})();