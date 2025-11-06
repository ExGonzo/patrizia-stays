// Reservation Manager - Enhancements and Helpers
// Integrates with existing inline logic in reservation.html without conflicts

(function() {
  const state = {
    step: 1,
    dates: { checkIn: null, checkOut: null, nights: 0 },
    apartment: null,
    guest: null,
    payment: { method: 'credit-card' },
  };

  function safeQuery(selector) {
    return document.querySelector(selector);
  }

  function getLang() {
    return (window.LanguageManager?.languageManager?.currentLanguage) || localStorage.getItem('language') || 'en';
  }

  function t(key, fallback) {
    try {
      const v = window.LanguageManager?.translateText(key);
      return v || fallback;
    } catch {
      return fallback;
    }
  }

  function notify(type, message) {
    if (typeof window.showNotification === 'function') {
      window.showNotification(message, type);
    } else {
      alert(message);
    }
  }

  function parseSession() {
    try {
      state.apartment = JSON.parse(sessionStorage.getItem('selectedApartment') || 'null');
    } catch {}
    try {
      state.guest = JSON.parse(sessionStorage.getItem('guestInfo') || 'null');
    } catch {}
    state.dates.checkIn = safeQuery('#checkInDate')?.value || null;
    state.dates.checkOut = safeQuery('#checkOutDate')?.value || null;
    state.dates.nights = parseInt(safeQuery('#nightsCount')?.value || '0', 10);
  }

  function formatCurrency(amount) {
    try {
      return window.LanguageManager?.formatCurrencyLocalized(amount, 'USD') || `$${amount}`;
    } catch {
      return `$${amount}`;
    }
  }

  function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  function validatePhone(phone) {
    return /[0-9\-\+\s]{6,}/.test(phone);
  }

  function validateStep1() {
    const lang = getLang();
    const checkIn = safeQuery('#checkInDate')?.value;
    const checkOut = safeQuery('#checkOutDate')?.value;
    if (!checkIn || !checkOut) {
      const msg = lang === 'it' ? 'Seleziona entrambe le date' : 'Please select both dates';
      notify('warning', msg);
      return false;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      const msg = lang === 'it' ? 'Intervallo di date non valido' : 'Invalid date range';
      notify('warning', msg);
      return false;
    }
    return true;
  }

  function validateStep2() {
    const lang = getLang();
    const selected = sessionStorage.getItem('selectedApartment');
    if (!selected) {
      const msg = lang === 'it' ? 'Seleziona un appartamento' : 'Please select an apartment';
      notify('warning', msg);
      return false;
    }
    return true;
  }

  function validateStep3() {
    const lang = getLang();
    const firstName = safeQuery('#firstName')?.value?.trim();
    const lastName = safeQuery('#lastName')?.value?.trim();
    const email = safeQuery('#email')?.value?.trim();
    const phone = safeQuery('#phone')?.value?.trim();
    if (!firstName || !lastName || !email || !phone) {
      const msg = lang === 'it' ? 'Compila tutti i campi obbligatori' : 'Please fill in all required fields';
      notify('warning', msg);
      return false;
    }
    if (!validateEmail(email)) {
      const msg = lang === 'it' ? 'Inserisci un indirizzo email valido' : 'Please enter a valid email address';
      notify('warning', msg);
      return false;
    }
    if (!validatePhone(phone)) {
      const msg = lang === 'it' ? 'Inserisci un numero di telefono valido' : 'Please enter a valid phone number';
      notify('warning', msg);
      return false;
    }
    return true;
  }

  function recalcPricing() {
    parseSession();
    const rate = state.apartment?.price || 0;
    const nights = state.dates.nights || 0;
    const subtotal = rate * nights;
    const fee = subtotal * 0.10;
    const total = subtotal + fee;
    const rateEl = safeQuery('#summaryRate');
    const subEl = safeQuery('#summarySubtotal');
    const feeEl = safeQuery('#summaryFee');
    const totalEl = safeQuery('#summaryTotal');
    if (rateEl) rateEl.textContent = formatCurrency(rate);
    if (subEl) subEl.textContent = formatCurrency(subtotal);
    if (feeEl) feeEl.textContent = formatCurrency(fee.toFixed(2));
    if (totalEl) totalEl.textContent = formatCurrency(total.toFixed(2));
  }

  function attachEnhancements() {
    // Prevent double-binding: only add lightweight helpers
    const pmRadios = document.querySelectorAll('input[name="paymentMethod"]');
    pmRadios.forEach(r => {
      r.addEventListener('change', () => {
        state.payment.method = r.value;
      }, { once: true });
    });

    // Live pricing recalculation when language changes or inputs change
    document.addEventListener('change', (e) => {
      if (['#checkInDate', '#checkOutDate', '#nightsCount'].includes('#' + (e.target?.id || ''))) {
        recalcPricing();
      }
    });

    // Language change observer
    try {
      window.LanguageManager?.languageManager?.addObserver((event) => {
        if (event === 'languageChanged') {
          recalcPricing();
        }
      });
    } catch {}
  }

  function enhanceCompleteBooking() {
    const btn = safeQuery('#completeBooking');
    if (!btn) return;
    btn.addEventListener('click', () => {
      // Additional validation for credit card
      if (state.payment.method === 'credit-card') {
        const cardNumber = safeQuery('#cardNumber')?.value?.replace(/\s+/g, '');
        const cvv = safeQuery('#cvv')?.value;
        const month = safeQuery('#expiryMonth')?.value;
        const year = safeQuery('#expiryYear')?.value;
        if (!cardNumber || cardNumber.length < 12 || !cvv || cvv.length < 3 || !month || !year) {
          const lang = getLang();
          const msg = lang === 'it' ? 'Compila tutti i dettagli della carta' : 'Please fill in all card details';
          notify('error', msg);
          return;
        }
      }
      recalcPricing();
    }, { once: true });
  }

  function init() {
    // Do not duplicate step bindings defined inline; only enhance
    parseSession();
    recalcPricing();
    attachEnhancements();
    enhanceCompleteBooking();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for debugging
  window.ReservationManager = { init, recalcPricing, state };
})();