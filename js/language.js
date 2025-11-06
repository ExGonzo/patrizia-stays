// Language Translation System for Patrizia Stays
// Supports English (EN) and Italian (IT) with localStorage persistence

class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.translations = this.loadTranslations();
        this.observers = [];
        this.init();
    }

    init() {
        this.setupLanguageSwitcher();
        this.translatePage();
        this.setupObserver();
    }

    loadTranslations() {
        return {
            // Navigation
            'nav.home': { en: 'Home', it: 'Casa' },
            'nav.apartments': { en: 'Apartments', it: 'Appartamenti' },
            'nav.excursions': { en: 'Excursions', it: 'Escursioni' },
            'nav.dining': { en: 'Dining', it: 'Ristorazione' },
            'nav.places': { en: 'Places to Visit', it: 'Luoghi da Visitare' },
            'nav.booking': { en: 'Book Now', it: 'Prenota Ora' },

            // Homepage
            'hero.title': { en: 'Luxury Living in Sharm El Sheikh', it: 'Vita di Lusso a Sharm El Sheikh' },
            'hero.subtitle': { 
                en: 'Experience premium apartments with stunning views and exceptional service', 
                it: 'Esperienza appartamenti premium con viste mozzafiato e servizio eccezionale' 
            },
            'hero.cta': { en: 'Explore Apartments', it: 'Esplora Appartamenti' },
            'hero.cta2': { en: 'Make Reservation', it: 'Fai una Prenotazione' },

            'featured.title': { en: 'Featured Apartments', it: 'Appartamenti in Evidenza' },
            'featured.view_all': { en: 'View All Apartments', it: 'Visualizza Tutti gli Appartamenti' },

            'quick_actions.title': { en: 'Quick Actions', it: 'Azioni Rapide' },
            'quick_actions.book': { en: 'Book Apartment', it: 'Prenota Appartamento' },
            'quick_actions.explore': { en: 'Explore Excursions', it: 'Esplora Escursioni' },
            'quick_actions.dine': { en: 'Dining Options', it: 'Opzioni di Ristorazione' },
            'quick_actions.visit': { en: 'Places to Visit', it: 'Luoghi da Visitare' },

            'about.title': { en: 'About Patrizia Stays', it: 'Chi Siamo' },
            'about.description': {
                en: 'Patrizia Stays offers luxury apartments in the heart of Sharm El Sheikh. Our properties feature modern amenities, stunning views, and exceptional service to make your stay unforgettable.',
                it: 'Patrizia Stays offre appartamenti di lusso nel cuore di Sharm El Sheikh. Le nostre proprietà offrono comfort moderni, viste mozzafiato e servizio eccezionale per rendere il tuo soggiorno indimenticabile.'
            },

            'testimonials.title': { en: 'What Our Guests Say', it: 'Cosa Dicono i Nostri Ospiti' },

            // Apartments Page
            'apartments.title': { en: 'Our Apartments', it: 'I Nostri Appartamenti' },
            'apartments.subtitle': { 
                en: 'Choose from our selection of premium apartments with stunning views', 
                it: 'Scegli dalla nostra selezione di appartamenti premium con viste mozzafiato' 
            },
            'apartments.filters.all': { en: 'All Apartments', it: 'Tutti gli Appartamenti' },
            'apartments.filters.sea': { en: 'Sea View', it: 'Vista Mare' },
            'apartments.filters.garden': { en: 'Garden View', it: 'Vista Giardino' },
            'apartments.filters.executive': { en: 'Executive', it: 'Esecutivo' },
            'apartments.filters.villa': { en: 'Villa', it: 'Villa' },
            'apartments.view_details': { en: 'View Details', it: 'Visualizza Dettagli' },
            'apartments.per_night': { en: 'per night', it: 'per notte' },
            'apartments.guests': { en: 'guests', it: 'ospiti' },
            'apartments.bedrooms': { en: 'bedrooms', it: 'camere da letto' },
            'apartments.bathrooms': { en: 'bathrooms', it: 'bagni' },

            // Apartment Detail Page
            'apartment_detail.book_now': { en: 'Book Now', it: 'Prenota Ora' },
            'apartment_detail.gallery': { en: 'Gallery', it: 'Galleria' },
            'apartment_detail.amenities': { en: 'Amenities', it: 'Servizi' },
            'apartment_detail.location': { en: 'Location', it: 'Posizione' },
            'apartment_detail.reviews': { en: 'Reviews', it: 'Recensioni' },
            'apartment_detail.check_in': { en: 'Check-in', it: 'Check-in' },
            'apartment_detail.check_out': { en: 'Check-out', it: 'Check-out' },
            'apartment_detail.guests': { en: 'Guests', it: 'Ospiti' },
            'apartment_detail.nights': { en: 'Nights', it: 'Notti' },
            'apartment_detail.price_calc': { en: 'Price Calculation', it: 'Calcolo Prezzo' },
            'apartment_detail.nightly_rate': { en: 'Nightly Rate', it: 'Tariffa Notturna' },
            'apartment_detail.total': { en: 'Total', it: 'Totale' },
            'apartment_detail.book_apartment': { en: 'Book This Apartment', it: 'Prenota Questo Appartamento' },

            // Excursions Page
            'excursions.title': { en: 'Excursions & Activities', it: 'Escursioni e Attività' },
            'excursions.subtitle': { 
                en: 'Discover amazing experiences and adventures in Sharm El Sheikh', 
                it: 'Scopri esperienze e avventure straordinarie a Sharm El Sheikh' 
            },
            'excursions.filters.all': { en: 'All Excursions', it: 'Tutte le Escursioni' },
            'excursions.filters.water': { en: 'Water Activities', it: 'Attività Acquatiche' },
            'excursions.filters.desert': { en: 'Desert Adventures', it: 'Avventure nel Deserto' },
            'excursions.filters.cultural': { en: 'Cultural Tours', it: 'Tour Culturali' },
            'excursions.filters.nature': { en: 'Nature & Wildlife', it: 'Natura e Fauna' },
            'excursions.book_now': { en: 'Book Now', it: 'Prenota Ora' },
            'excursions.duration': { en: 'Duration', it: 'Durata' },
            'excursions.hours': { en: 'hours', it: 'ore' },
            'excursions.includes': { en: 'Includes', it: 'Include' },
            'excursions.pickup': { en: 'Hotel Pickup', it: 'Ritiro in Hotel' },
            'excursions.guide': { en: 'Professional Guide', it: 'Guida Professionale' },
            'excursions.equipment': { en: 'Equipment', it: 'Attrezzatura' },

            // Dining Page
            'dining.title': { en: 'Dining & Culinary Experiences', it: 'Ristorazione ed Esperienze Culinarie' },
            'dining.subtitle': { 
                en: 'Discover the best restaurants and cooking experiences', 
                it: 'Scopri i migliori ristoranti ed esperienze culinarie' 
            },
            'dining.filters.all': { en: 'All Options', it: 'Tutte le Opzioni' },
            'dining.filters.restaurants': { en: 'Restaurants', it: 'Ristoranti' },
            'dining.filters.cooking': { en: 'Cooking Classes', it: 'Corsi di Cucina' },
            'dining.filters.local': { en: 'Local Cuisine', it: 'Cucina Locale' },
            'dining.filters.international': { en: 'International', it: 'Internazionale' },
            'dining.reserve_table': { en: 'Reserve Table', it: 'Prenota Tavolo' },
            'dining.book_class': { en: 'Book Class', it: 'Prenota Corso' },
            'dining.cuisine': { en: 'Cuisine', it: 'Cucina' },
            'dining.price_range': { en: 'Price Range', it: 'Fascia di Prezzo' },
            'dining.rating': { en: 'Rating', it: 'Valutazione' },
            'dining.hours': { en: 'Hours', it: 'Orari' },

            // Places to Visit Page
            'places.title': { en: 'Places to Visit', it: 'Luoghi da Visitare' },
            'places.subtitle': { 
                en: 'Explore the most beautiful attractions and destinations', 
                it: 'Esplora le attrazioni e destinazioni più belle' 
            },
            'places.filters.all': { en: 'All Attractions', it: 'Tutte le Attrazioni' },
            'places.filters.beaches': { en: 'Beaches', it: 'Spiagge' },
            'places.filters.historical': { en: 'Historical Sites', it: 'Siti Storici' },
            'places.filters.natural': { en: 'Natural Wonders', it: 'Meraviglie Naturali' },
            'places.filters.entertainment': { en: 'Entertainment', it: 'Intrattenimento' },
            'places.visit_now': { en: 'Visit Now', it: 'Visita Ora' },
            'places.best_time': { en: 'Best Time to Visit', it: 'Miglior Periodo per Visitare' },
            'places.duration': { en: 'Duration', it: 'Durata' },
            'places.tips': { en: 'Tips', it: 'Consigli' },
            'places.activities': { en: 'Activities', it: 'Attività' },
            'places.facilities': { en: 'Facilities', it: 'Servizi' },

            // Reservation Page
            'reservation.title': { en: 'Make a Reservation', it: 'Fai una Prenotazione' },
            'reservation.subtitle': { 
                en: 'Complete your booking in 4 simple steps', 
                it: 'Completa la tua prenotazione in 4 semplici passaggi' 
            },
            'reservation.step1': { en: 'Select Dates', it: 'Seleziona Date' },
            'reservation.step2': { en: 'Choose Apartment', it: 'Scegli Appartamento' },
            'reservation.step3': { en: 'Guest Details', it: 'Dettagli Ospite' },
            'reservation.step4': { en: 'Review & Pay', it: 'Rivedi e Paga' },
            'reservation.check_in': { en: 'Check-in Date', it: 'Data di Check-in' },
            'reservation.check_out': { en: 'Check-out Date', it: 'Data di Check-out' },
            'reservation.nights': { en: 'Number of Nights', it: 'Numero di Notti' },
            'reservation.next': { en: 'Next', it: 'Prossimo' },
            'reservation.back': { en: 'Back', it: 'Indietro' },
            'reservation.first_name': { en: 'First Name', it: 'Nome' },
            'reservation.last_name': { en: 'Last Name', it: 'Cognome' },
            'reservation.email': { en: 'Email Address', it: 'Indirizzo Email' },
            'reservation.phone': { en: 'Phone Number', it: 'Numero di Telefono' },
            'reservation.guests': { en: 'Number of Guests', it: 'Numero di Ospiti' },
            'reservation.requests': { en: 'Special Requests', it: 'Richieste Speciali' },
            'reservation.requests_placeholder': { 
                en: 'Any special requirements or requests...', 
                it: 'Eventuali requisiti o richieste speciali...' 
            },
            'reservation.summary': { en: 'Booking Summary', it: 'Riepilogo Prenotazione' },
            'reservation.payment': { en: 'Payment Method', it: 'Metodo di Pagamento' },
            'reservation.credit_card': { en: 'Credit Card', it: 'Carta di Credito' },
            'reservation.paypal': { en: 'PayPal', it: 'PayPal' },
            'reservation.card_number': { en: 'Card Number', it: 'Numero Carta' },
            'reservation.cvv': { en: 'CVV', it: 'CVV' },
            'reservation.expiry_month': { en: 'Expiry Month', it: 'Mese di Scadenza' },
            'reservation.expiry_year': { en: 'Expiry Year', it: 'Anno di Scadenza' },
            'reservation.complete': { en: 'Complete Booking', it: 'Completa Prenotazione' },
            'reservation.booking_details': { en: 'Booking Details', it: 'Dettagli Prenotazione' },
            'reservation.guest_info': { en: 'Guest Information', it: 'Informazioni Ospite' },
            'reservation.pricing': { en: 'Pricing', it: 'Prezzi' },
            'reservation.nightly_rate': { en: 'Nightly Rate', it: 'Tariffa Notturna' },
            'reservation.subtotal': { en: 'Subtotal', it: 'Subtotale' },
            'reservation.service_fee': { en: 'Service Fee (10%)', it: 'Tassa di Servizio (10%)' },
            'reservation.total': { en: 'Total', it: 'Totale' },

            // Common Elements
            'common.book_now': { en: 'Book Now', it: 'Prenota Ora' },
            'common.view_details': { en: 'View Details', it: 'Visualizza Dettagli' },
            'common.learn_more': { en: 'Learn More', it: 'Scopri di Più' },
            'common.read_more': { en: 'Read More', it: 'Leggi di Più' },
            'common.loading': { en: 'Loading...', it: 'Caricamento...' },
            'common.error': { en: 'Error', it: 'Errore' },
            'common.success': { en: 'Success', it: 'Successo' },
            'common.cancel': { en: 'Cancel', it: 'Annulla' },
            'common.close': { en: 'Close', it: 'Chiudi' },
            'common.submit': { en: 'Submit', it: 'Invia' },
            'common.send': { en: 'Send', it: 'Invia' },
            'common.save': { en: 'Save', it: 'Salva' },
            'common.edit': { en: 'Edit', it: 'Modifica' },
            'common.delete': { en: 'Delete', it: 'Elimina' },
            'common.confirm': { en: 'Confirm', it: 'Conferma' },
            'common.yes': { en: 'Yes', it: 'Sì' },
            'common.no': { en: 'No', it: 'No' },
            'common.ok': { en: 'OK', it: 'OK' },

            // Footer
            'footer.quick_links': { en: 'Quick Links', it: 'Collegamenti Rapidi' },
            'footer.contact': { en: 'Contact Info', it: 'Informazioni di Contatto' },
            'footer.newsletter': { en: 'Newsletter', it: 'Newsletter' },
            'footer.newsletter_text': { 
                en: 'Subscribe to get special offers and updates.', 
                it: 'Iscriviti per ricevere offerte speciali e aggiornamenti.' 
            },
            'footer.subscribe': { en: 'Subscribe', it: 'Iscriviti' },
            'footer.email_placeholder': { en: 'Your email', it: 'La tua email' },
            'footer.phone': { en: 'Phone', it: 'Telefono' },
            'footer.email': { en: 'Email', it: 'Email' },
            'footer.address': { en: 'Address', it: 'Indirizzo' },
            'footer.rights': { en: 'All rights reserved.', it: 'Tutti i diritti riservati.' },

            // Form Validation Messages
            'validation.required': { en: 'This field is required', it: 'Questo campo è obbligatorio' },
            'validation.email': { en: 'Please enter a valid email address', it: 'Inserisci un indirizzo email valido' },
            'validation.phone': { en: 'Please enter a valid phone number', it: 'Inserisci un numero di telefono valido' },
            'validation.number_min': { en: 'Value must be at least {min}', it: 'Il valore deve essere almeno {min}' },
            'validation.number_max': { en: 'Value cannot exceed {max}', it: 'Il valore non può superare {max}' },
            'validation.date_past': { en: 'Date cannot be in the past', it: 'La data non può essere nel passato' },
            'validation.date_range': { en: 'Invalid date range', it: 'Intervallo di date non valido' },

            // Booking Messages
            'booking.select_dates': { en: 'Please select both dates', it: 'Seleziona entrambe le date' },
            'booking.select_apartment': { en: 'Please select an apartment', it: 'Seleziona un appartamento' },
            'booking.fill_required': { en: 'Please fill in all required fields', it: 'Compila tutti i campi obbligatori' },
            'booking.fill_card': { en: 'Please fill in all card details', it: 'Compila tutti i dettagli della carta' },
            'booking.confirmed': { en: 'Booking confirmed!', it: 'Prenotazione confermata!' },
            'booking.number': { en: 'Your booking number is', it: 'Il tuo numero di prenotazione è' },

            // Filter Messages
            'filter.no_results': { en: 'No results found', it: 'Nessun risultato trovato' },
            'filter.clear': { en: 'Clear Filters', it: 'Cancella Filtri' },
            'filter.apply': { en: 'Apply Filters', it: 'Applica Filtri' },
            'filter.results': { en: 'results', it: 'risultati' },
            'filter.showing': { en: 'Showing', it: 'Mostrando' },
            'filter.of': { en: 'of', it: 'di' }
        };
    }

    setupLanguageSwitcher() {
        const languageSwitcher = document.getElementById('languageSwitcher');
        if (!languageSwitcher) return;

        const langButtons = languageSwitcher.querySelectorAll('.lang-btn');
        
        // Set active language button
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === this.currentLanguage);
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const newLang = btn.dataset.lang;
                if (newLang !== this.currentLanguage) {
                    this.switchLanguage(newLang);
                }
            });
        });
    }

    switchLanguage(newLang) {
        this.currentLanguage = newLang;
        localStorage.setItem('language', newLang);
        
        // Update language switcher UI
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === newLang);
        });

        // Translate page
        this.translatePage();
        
        // Notify observers
        this.notifyObservers('languageChanged', newLang);
        
        // Update page metadata
        this.updatePageMetadata(newLang);
    }

    translatePage() {
        // Translate all elements with data attributes
        this.translateElements();
        
        // Translate placeholder attributes
        this.translatePlaceholders();
        
        // Translate dynamic content
        this.translateDynamicContent();
        
        // Update document language attribute
        document.documentElement.lang = this.currentLanguage === 'it' ? 'it' : 'en';
    }

    translateElements() {
        // Elements with data-en and data-it attributes
        document.querySelectorAll('[data-en][data-it]').forEach(element => {
            const text = element.getAttribute(`data-${this.currentLanguage}`);
            if (text) {
                element.textContent = text;
            }
        });

        // Elements with data-translation-key
        document.querySelectorAll('[data-translation-key]').forEach(element => {
            const key = element.getAttribute('data-translation-key');
            const translation = this.getTranslation(key);
            if (translation) {
                element.textContent = translation;
            }
        });
    }

    translatePlaceholders() {
        document.querySelectorAll('[data-en-placeholder][data-it-placeholder]').forEach(element => {
            const placeholder = element.getAttribute(`data-${this.currentLanguage}-placeholder`);
            if (placeholder) {
                element.placeholder = placeholder;
            }
        });

        // Placeholders with data-translation-key
        document.querySelectorAll('[data-translation-key-placeholder]').forEach(element => {
            const key = element.getAttribute('data-translation-key-placeholder');
            const translation = this.getTranslation(key);
            if (translation) {
                element.placeholder = translation;
            }
        });
    }

    translateDynamicContent() {
        // Update any dynamically loaded content
        this.updateDynamicText();
        
        // Update form validation messages
        this.updateValidationMessages();
        
        // Update booking summaries
        this.updateBookingSummaries();
    }

    getTranslation(key) {
        return this.translations[key] ? this.translations[key][this.currentLanguage] : null;
    }

    updatePageMetadata(lang) {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        const titles = {
            'index.html': {
                en: 'Patrizia Stays - Luxury Apartments in Sharm El Sheikh',
                it: 'Patrizia Stays - Appartamenti di Lusso a Sharm El Sheikh'
            },
            'apartments.html': {
                en: 'Apartments - Patrizia Stays',
                it: 'Appartamenti - Patrizia Stays'
            },
            'apartment-detail.html': {
                en: 'Apartment Details - Patrizia Stays',
                it: 'Dettagli Appartamento - Patrizia Stays'
            },
            'excursions.html': {
                en: 'Excursions - Patrizia Stays',
                it: 'Escursioni - Patrizia Stays'
            },
            'dining.html': {
                en: 'Dining - Patrizia Stays',
                it: 'Ristorazione - Patrizia Stays'
            },
            'to-visit.html': {
                en: 'Places to Visit - Patrizia Stays',
                it: 'Luoghi da Visitare - Patrizia Stays'
            },
            'reservation.html': {
                en: 'Reservation - Patrizia Stays',
                it: 'Prenotazione - Patrizia Stays'
            }
        };
        
        const title = titles[currentPage] || titles['index.html'];
        document.title = title[lang] || title.en;
    }

    updateDynamicText() {
        // Update any text that was dynamically generated
        this.updateFilterResults();
        this.updateBookingCalculations();
        this.updateDateFormats();
    }

    updateFilterResults() {
        // Update filter result counts and messages
        const filterResults = document.querySelectorAll('[data-filter-results]');
        filterResults.forEach(element => {
            const count = element.getAttribute('data-filter-results');
            const template = this.currentLanguage === 'it' ? 
                `Mostrando ${count} risultati` : 
                `Showing ${count} results`;
            element.textContent = template;
        });
    }

    updateBookingCalculations() {
        // Update booking price calculations
        const priceElements = document.querySelectorAll('[data-booking-price]');
        priceElements.forEach(element => {
            const price = element.getAttribute('data-booking-price');
            const nights = element.getAttribute('data-booking-nights') || 1;
            const total = price * nights;
            
            const template = this.currentLanguage === 'it' ? 
                `$${total} (${nights} notti)` : 
                `$${total} (${nights} nights)`;
            element.textContent = template;
        });
    }

    updateDateFormats() {
        // Update date displays
        const dateElements = document.querySelectorAll('[data-date-display]');
        dateElements.forEach(element => {
            const dateStr = element.getAttribute('data-date-display');
            if (dateStr) {
                const date = new Date(dateStr);
                const formatted = this.formatDate(date);
                element.textContent = formatted;
            }
        });
    }

    updateValidationMessages() {
        // Update form validation error messages
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            const errorType = element.getAttribute('data-error-type');
            if (errorType && this.translations[`validation.${errorType}`]) {
                element.textContent = this.translations[`validation.${errorType}`][this.currentLanguage];
            }
        });
    }

    updateBookingSummaries() {
        // Update booking summary sections
        const summaryElements = document.querySelectorAll('[data-booking-summary]');
        summaryElements.forEach(element => {
            const summaryType = element.getAttribute('data-booking-summary');
            this.updateBookingSummaryElement(element, summaryType);
        });
    }

    updateBookingSummaryElement(element, type) {
        switch (type) {
            case 'dates':
                const checkIn = element.getAttribute('data-checkin');
                const checkOut = element.getAttribute('data-checkout');
                const nights = element.getAttribute('data-nights');
                
                if (this.currentLanguage === 'it') {
                    element.innerHTML = `
                        <div>Check-in: ${checkIn}</div>
                        <div>Check-out: ${checkOut}</div>
                        <div>Notti: ${nights}</div>
                    `;
                } else {
                    element.innerHTML = `
                        <div>Check-in: ${checkIn}</div>
                        <div>Check-out: ${checkOut}</div>
                        <div>Nights: ${nights}</div>
                    `;
                }
                break;
                
            case 'guests':
                const guests = element.getAttribute('data-guests');
                element.textContent = this.currentLanguage === 'it' ? 
                    `Ospiti: ${guests}` : 
                    `Guests: ${guests}`;
                break;
                
            case 'price':
                const price = element.getAttribute('data-price');
                const total = element.getAttribute('data-total');
                element.textContent = this.currentLanguage === 'it' ? 
                    `Totale: $${total}` : 
                    `Total: $${total}`;
                break;
        }
    }

    formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        return new Intl.DateTimeFormat(this.currentLanguage === 'it' ? 'it-IT' : 'en-US', {
            ...defaultOptions,
            ...options
        }).format(date);
    }

    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat(this.currentLanguage === 'it' ? 'it-IT' : 'en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    // Observer pattern for language changes
    addObserver(callback) {
        this.observers.push(callback);
    }

    removeObserver(callback) {
        this.observers = this.observers.filter(obs => obs !== callback);
    }

    notifyObservers(event, data) {
        this.observers.forEach(callback => {
            try {
                callback(event, data);
            } catch (error) {
                console.error('Error in language observer:', error);
            }
        });
    }

    setupObserver() {
        // Watch for DOM changes and translate new elements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        // Check if new elements need translation
                        const elementsToTranslate = node.querySelectorAll ? 
                            node.querySelectorAll('[data-en][data-it], [data-translation-key]') : [];
                        
                        if (node.matches && node.matches('[data-en][data-it], [data-translation-key]')) {
                            elementsToTranslate.unshift(node);
                        }
                        
                        elementsToTranslate.forEach(element => {
                            this.translateElement(element);
                        });
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Utility methods for dynamic translation
    translateElement(element) {
        if (element.hasAttribute('data-en') && element.hasAttribute('data-it')) {
            const text = element.getAttribute(`data-${this.currentLanguage}`);
            if (text) {
                element.textContent = text;
            }
        } else if (element.hasAttribute('data-translation-key')) {
            const key = element.getAttribute('data-translation-key');
            const translation = this.getTranslation(key);
            if (translation) {
                element.textContent = translation;
            }
        }
    }

    // Validation message helpers
    getValidationMessage(type, params = {}) {
        const key = `validation.${type}`;
        let message = this.getTranslation(key) || this.getTranslation('validation.required');
        
        // Replace placeholders
        Object.keys(params).forEach(param => {
            message = message.replace(`{${param}}`, params[param]);
        });
        
        return message;
    }

    // Booking message helpers
    getBookingMessage(type, params = {}) {
        const key = `booking.${type}`;
        let message = this.getTranslation(key) || 'Unknown error';
        
        // Replace placeholders
        Object.keys(params).forEach(param => {
            message = message.replace(`{${param}}`, params[param]);
        });
        
        return message;
    }
}

// Initialize language manager
const languageManager = new LanguageManager();

// Global language functions for easy access
function getCurrentLanguage() {
    return languageManager.currentLanguage;
}

function translateText(key, params = {}) {
    return languageManager.getTranslation(key) || key;
}

function formatDateLocalized(date, options = {}) {
    return languageManager.formatDate(date, options);
}

function formatCurrencyLocalized(amount, currency = 'USD') {
    return languageManager.formatCurrency(amount, currency);
}

function getValidationMessageLocalized(type, params = {}) {
    return languageManager.getValidationMessage(type, params);
}

function getBookingMessageLocalized(type, params = {}) {
    return languageManager.getBookingMessage(type, params);
}

// Export for use in other modules
window.LanguageManager = {
    languageManager,
    getCurrentLanguage,
    translateText,
    formatDateLocalized,
    formatCurrencyLocalized,
    getValidationMessageLocalized,
    getBookingMessageLocalized
};