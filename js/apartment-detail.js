// Apartment Detail Enhancements: gallery, keyboard nav, lightbox, pricing localization
// Complements the inline logic in apartment-detail.html without duplicating core functions

(function() {
  function qs(sel) { return document.querySelector(sel); }
  function qsa(sel) { return Array.from(document.querySelectorAll(sel)); }

  const state = {
    images: [],
    currentIndex: 0,
    price: 0,
  };

  function getLang() {
    return (window.LanguageManager?.languageManager?.currentLanguage) || localStorage.getItem('language') || 'en';
  }

  function formatCurrency(amount) {
    try {
      return window.LanguageManager?.formatCurrencyLocalized(Number(amount) || 0, 'USD') || `$${amount}`;
    } catch {
      return `$${amount}`;
    }
  }

  function parsePriceFromEl(el) {
    if (!el) return 0;
    const text = el.textContent || '';
    const m = text.match(/([0-9]+(?:\.[0-9]+)?)/);
    return m ? Number(m[1]) : 0;
  }

  function collectImages() {
    const thumbs = qsa('.gallery-thumb');
    state.images = thumbs.map(t => t.getAttribute('data-image'));
    // Fallback to main image if no thumbs yet
    if (!state.images.length) {
      const mainSrc = qs('#mainGalleryImage')?.getAttribute('src') || '';
      if (mainSrc) {
        const name = mainSrc.split('/').pop();
        state.images = [name];
      }
    }
  }

  function setMainImageByIndex(index) {
    if (!state.images.length) return;
    state.currentIndex = (index + state.images.length) % state.images.length;
    const imgName = state.images[state.currentIndex];
    const main = qs('#mainGalleryImage');
    if (main) main.src = `images/${imgName}`;
    qsa('.gallery-thumb').forEach((thumb, i) => thumb.classList.toggle('active', i === state.currentIndex));
  }

  function bindKeyboardNav() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        setMainImageByIndex(state.currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        setMainImageByIndex(state.currentIndex + 1);
      } else if (e.key === 'Escape') {
        closeLightbox();
      }
    });
  }

  // Simple lightbox implementation
  let lightboxEl = null;
  function openLightbox() {
    if (lightboxEl) return;
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(0,0,0,0.8)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9999';
    overlay.style.cursor = 'zoom-out';

    const img = document.createElement('img');
    img.src = qs('#mainGalleryImage')?.src || '';
    img.alt = 'Gallery image';
    img.style.maxWidth = '90%';
    img.style.maxHeight = '90%';
    img.style.borderRadius = '8px';

    overlay.appendChild(img);
    document.body.appendChild(overlay);
    lightboxEl = overlay;

    const close = () => closeLightbox();
    overlay.addEventListener('click', close);
    overlay.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  function closeLightbox() {
    if (!lightboxEl) return;
    lightboxEl.remove();
    lightboxEl = null;
  }

  function bindGalleryEnhancements() {
    collectImages();
    bindKeyboardNav();

    // Swipe gestures on main image
    const main = qs('#mainGalleryImage');
    if (main) {
      let startX = null;
      main.addEventListener('touchstart', (e) => {
        startX = e.changedTouches[0].clientX;
      });
      main.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        if (startX != null) {
          if (endX - startX > 40) setMainImageByIndex(state.currentIndex - 1);
          else if (startX - endX > 40) setMainImageByIndex(state.currentIndex + 1);
        }
        startX = null;
      });
      // Lightbox on click
      main.addEventListener('click', openLightbox);
    }

    // Sync currentIndex if a thumb was set active by inline script
    const activeIndex = qsa('.gallery-thumb').findIndex(t => t.classList.contains('active'));
    if (activeIndex >= 0) state.currentIndex = activeIndex;
  }

  function recalcTotalsLocalized() {
    const nights = Number(qs('#nightCount')?.textContent || '0');
    const price = state.price || parsePriceFromEl(qs('#bookingPrice'));
    const total = nights * price;
    const lang = getLang();
    const nightsLabel = lang === 'it' ? 'notti' : 'nights';
    const perNightLabel = lang === 'it' ? 'per notte' : 'per night';
    const pricePerNightEl = qs('#pricePerNight');
    const totalPriceEl = qs('#totalPrice');
    const finalTotalEl = qs('#finalTotal');
    const bookingPriceEl = qs('#bookingPrice');
    if (pricePerNightEl) pricePerNightEl.textContent = `${formatCurrency(price)} x ${nights} ${nightsLabel}`;
    if (totalPriceEl) totalPriceEl.textContent = formatCurrency(total);
    if (finalTotalEl) finalTotalEl.textContent = formatCurrency(total);
    if (bookingPriceEl) bookingPriceEl.textContent = formatCurrency(price);
  }

  function bindLanguageObserver() {
    try {
      window.LanguageManager?.languageManager?.addObserver((event) => {
        if (event === 'languageChanged') {
          recalcTotalsLocalized();
        }
      });
    } catch {}
  }

  function bindBookingPersistence() {
    const form = qs('#bookingForm');
    if (!form) return;
    form.addEventListener('submit', () => {
      const id = new URLSearchParams(window.location.search).get('id');
      const name = qs('#apartmentName')?.textContent || '';
      const price = state.price || parsePriceFromEl(qs('#bookingPrice'));
      try {
        sessionStorage.setItem('selectedApartment', JSON.stringify({ id, name, price }));
      } catch {}
    }, { once: true });
  }

  function init() {
    // Wait until inline loadApartmentDetails populates
    const waitReady = () => {
      if (!qs('#galleryThumbs') || !qs('#bookingPrice')) {
        requestAnimationFrame(waitReady);
        return;
      }
      state.price = parsePriceFromEl(qs('#bookingPrice'));
      bindGalleryEnhancements();
      bindLanguageObserver();
      bindBookingPersistence();
      recalcTotalsLocalized();
    };
    waitReady();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.ApartmentDetailManager = { state, recalcTotalsLocalized, setMainImageByIndex };
})();