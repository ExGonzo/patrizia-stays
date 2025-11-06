(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function getLang() {
    const lm = window.LanguageManager;
    if (lm && typeof lm.getCurrentLanguage === 'function') return lm.getCurrentLanguage();
    return localStorage.getItem('language') || 'en';
  }

  function formatCurrency(amount, currency = 'USD') {
    const lm = window.LanguageManager;
    if (lm && typeof lm.formatCurrency === 'function') return lm.formatCurrency(amount, currency);
    try {
      return new Intl.NumberFormat(getLang() === 'it' ? 'it-IT' : 'en-US', { style: 'currency', currency }).format(amount);
    } catch {
      return `$${Number(amount).toFixed(2)}`;
    }
  }

  function applyFilter(filter) {
    const items = $$('.dining-item');
    items.forEach(el => {
      const cats = (el.getAttribute('data-category') || '').split(/\s+/).filter(Boolean);
      const match = filter === 'all' || cats.includes(filter);
      el.style.display = match ? '' : 'none';
    });
  }

  function bindFilters() {
    const container = $('#diningFilters');
    if (!container) return;
    const btns = $$('.filter-btn', container);
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter') || 'all';
        localStorage.setItem('diningFilter', filter);
        applyFilter(filter);
      });
      btn.setAttribute('tabindex', '0');
      btn.addEventListener('keydown', e => {
        const i = btns.indexOf(btn);
        if (e.key === 'ArrowRight') {
          const n = btns[Math.min(i + 1, btns.length - 1)];
          n && n.focus();
        } else if (e.key === 'ArrowLeft') {
          const p = btns[Math.max(i - 1, 0)];
          p && p.focus();
        } else if (e.key === 'Enter' || e.key === ' ') {
          btn.click();
        }
      });
    });
  }

  function localizeCookingCardPrices() {
    const prices = $$('.dining-item .excursion-price');
    prices.forEach(span => {
      const raw = span.textContent.trim().replace(/^\$/,'');
      const num = Number(raw);
      if (!Number.isFinite(num)) return;
      span.textContent = formatCurrency(num);
    });
  }

  function localizeCookingModalPrices() {
    const modal = $('#cookingModal');
    if (!modal) return;
    const price = Number(modal.dataset.cookingPrice || '0');
    const participantsEl = $('#cookingParticipants');
    const count = participantsEl ? Number(participantsEl.value || '0') : 0;
    const total = price * count;
    const perEl = $('#cookingPricePerPerson');
    const totEl = $('#cookingTotal');
    const partDisp = $('#cookingParticipantsDisplay');
    if (perEl) perEl.textContent = formatCurrency(price);
    if (totEl) totEl.textContent = formatCurrency(total);
    if (partDisp && Number.isFinite(count)) partDisp.textContent = String(count);
  }

  function observeCookingModal() {
    const modal = $('#cookingModal');
    if (!modal) return;
    const obs = new MutationObserver(() => {
      localizeCookingModalPrices();
    });
    obs.observe(modal, { attributes: true, attributeFilter: ['style'] });

    const participantsEl = $('#cookingParticipants');
    if (participantsEl) {
      const sync = () => setTimeout(localizeCookingModalPrices, 0);
      participantsEl.addEventListener('change', sync);
      participantsEl.addEventListener('input', sync);
    }
  }

  function applyPersistedFilter() {
    const saved = localStorage.getItem('diningFilter') || 'all';
    const btn = $(`#diningFilters .filter-btn[data-filter="${saved}"]`);
    if (btn) btn.click(); else applyFilter(saved);
  }

  function setupLanguageObserver() {
    const lm = window.LanguageManager;
    if (!lm || typeof lm.addObserver !== 'function') return;
    lm.addObserver({
      update() {
        localizeCookingCardPrices();
        localizeCookingModalPrices();
      }
    });
  }

  function initOnce() {
    bindFilters();
    localizeCookingCardPrices();
    observeCookingModal();
    setupLanguageObserver();
    setTimeout(applyPersistedFilter, 50);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initOnce, 0));
  } else {
    setTimeout(initOnce, 0);
  }

  window.DiningModule = {
    applyFilter,
    localizeCookingCardPrices,
    localizeCookingModalPrices
  };
})();