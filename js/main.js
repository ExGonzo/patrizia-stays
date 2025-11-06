// Main JavaScript functionality for Patrizia Stays website

// Global variables
let currentLanguage = localStorage.getItem('language') || 'en';
let mobileMenuOpen = false;
let currentPage = window.location.pathname.split('/').pop() || 'index.html';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Main initialization function
function initializeWebsite() {
    setupNavigation();
    setupLanguageSwitcher();
    setupSmoothScrolling();
    setupCardHoverEffects();
    setupModalSystem();
    setupFormValidation();
    updateActiveNavigation();
    
    // Page-specific initialization
    if (currentPage === 'index.html') {
        initializeHomepage();
    } else if (currentPage === 'apartments.html') {
        initializeApartmentsPage();
    } else if (currentPage === 'apartment-detail.html') {
        initializeApartmentDetail();
    } else if (currentPage === 'excursions.html') {
        initializeExcursionsPage();
    } else if (currentPage === 'dining.html') {
        initializeDiningPage();
    } else if (currentPage === 'to-visit.html') {
        initializeToVisitPage();
    } else if (currentPage === 'reservation.html') {
        initializeReservationPage();
    }
}

// Navigation functionality
function setupNavigation() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navbarNav = document.getElementById('navbarNav');
    
    if (mobileToggle && navbarNav) {
        mobileToggle.addEventListener('click', function() {
            mobileMenuOpen = !mobileMenuOpen;
            navbarNav.classList.toggle('active', mobileMenuOpen);
            
            // Update hamburger icon
            const icon = this.querySelector('i');
            if (mobileMenuOpen) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close mobile menu when clicking on a link
        navbarNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    mobileMenuOpen = false;
                    navbarNav.classList.remove('active');
                    mobileToggle.querySelector('i').classList.remove('fa-times');
                    mobileToggle.querySelector('i').classList.add('fa-bars');
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (mobileMenuOpen && !navbarNav.contains(event.target) && !mobileToggle.contains(event.target)) {
                mobileMenuOpen = false;
                navbarNav.classList.remove('active');
                mobileToggle.querySelector('i').classList.remove('fa-times');
                mobileToggle.querySelector('i').classList.add('fa-bars');
            }
        });
    }
}

// Language switching functionality
function setupLanguageSwitcher() {
    const languageSwitcher = document.getElementById('languageSwitcher');
    if (!languageSwitcher) return;
    
    const langButtons = languageSwitcher.querySelectorAll('.lang-btn');
    
    // Set active language button
    langButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLanguage);
    });
    
    // Add click handlers
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const newLang = this.dataset.lang;
            if (newLang !== currentLanguage) {
                switchLanguage(newLang);
            }
        });
    });
}

function switchLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Update language switcher UI
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Translate all elements with data attributes
    translatePage();
    
    // Update page title and meta tags if needed
    updatePageMetadata(lang);
}

function translatePage() {
    // Translate all elements with data-en and data-it attributes
    document.querySelectorAll('[data-en][data-it]').forEach(element => {
        const text = element.getAttribute(`data-${currentLanguage}`);
        if (text) {
            element.textContent = text;
        }
    });
    
    // Translate placeholder attributes
    document.querySelectorAll('[data-en-placeholder][data-it-placeholder]').forEach(element => {
        const placeholder = element.getAttribute(`data-${currentLanguage}-placeholder`);
        if (placeholder) {
            element.placeholder = placeholder;
        }
    });
    
    // Update dynamic content
    updateDynamicContent();
}

function updatePageMetadata(lang) {
    // Update page title based on current page
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

function updateActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Smooth scrolling functionality
function setupSmoothScrolling() {
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Smooth scroll to top functionality
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Show/hide scroll to top button
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
    }
}

// Card hover effects
function setupCardHoverEffects() {
    const cards = document.querySelectorAll('.card, .apartment-card, .excursion-card, .restaurant-card, .attraction-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        });
    });
}

// Modal system
function setupModalSystem() {
    // Add modal backdrop click to close
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    });
    
    // Add escape key to close modals
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const openModal = document.querySelector('.modal.active');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus first input if exists
        const firstInput = modal.querySelector('input, textarea, select');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Form validation
function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    });
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove previous error state
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
    
    // Check if field is required and empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = currentLanguage === 'it' ? 'Questo campo è obbligatorio' : 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = currentLanguage === 'it' ? 'Inserisci un indirizzo email valido' : 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = currentLanguage === 'it' ? 'Inserisci un numero di telefono valido' : 'Please enter a valid phone number';
        }
    }
    
    // Number validation
    if (field.type === 'number' && value) {
        const min = parseFloat(field.min);
        const max = parseFloat(field.max);
        const numValue = parseFloat(value);
        
        if (!isNaN(min) && numValue < min) {
            isValid = false;
            errorMessage = currentLanguage === 'it' ? `Il valore deve essere almeno ${min}` : `Value must be at least ${min}`;
        } else if (!isNaN(max) && numValue > max) {
            isValid = false;
            errorMessage = currentLanguage === 'it' ? `Il valore non può superare ${max}` : `Value cannot exceed ${max}`;
        }
    }
    
    // Apply error state if invalid
    if (!isValid) {
        field.classList.add('error');
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = errorMessage;
        field.parentNode.appendChild(errorElement);
    }
    
    return isValid;
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat(currentLanguage === 'it' ? 'it-IT' : 'en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

function formatDate(date, options = {}) {
    const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    return new Intl.DateTimeFormat(currentLanguage === 'it' ? 'it-IT' : 'en-US', {
        ...defaultOptions,
        ...options
    }).format(date);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Page-specific initialization functions
function initializeHomepage() {
    // Initialize featured apartments
    loadFeaturedApartments();
    
    // Initialize testimonials carousel if exists
    initializeTestimonialsCarousel();
    
    // Initialize hero wave effect
    if (typeof initializeWaveEffect === 'function') {
        initializeWaveEffect();
    }

    // Interactive hero background movement
    initializeInteractiveHeroBackground();
}

function initializeApartmentsPage() {
    // Apartment filters will be handled in apartments.js
}

function initializeApartmentDetail() {
    // Gallery and booking will be handled in apartment-detail.js
}

function initializeExcursionsPage() {
    // Excursion filters will be handled in excursions.js
}

function initializeDiningPage() {
    // Dining functionality will be handled in dining.js
}

function initializeToVisitPage() {
    // Attraction filters will be handled in to-visit.js
}

function initializeReservationPage() {
    // Reservation system will be handled in reservation.js
}

function loadFeaturedApartments() {
    const featuredContainer = document.getElementById('featuredApartments');
    if (!featuredContainer) return;
    
    // Sample featured apartments data
    const featuredApartments = [
        {
            id: 1,
            name: 'Sea View Deluxe',
            name_it: 'Vista Mare Deluxe',
            image: 'apartment1.jpg',
            price: 120,
            rating: 4.8,
            reviews: 24
        },
        {
            id: 2,
            name: 'Garden Paradise',
            name_it: 'Paradiso del Giardino',
            image: 'apartment2.jpg',
            price: 95,
            rating: 4.6,
            reviews: 18
        },
        {
            id: 3,
            name: 'Executive Suite',
            name_it: 'Suite Esecutiva',
            image: 'apartment3.jpg',
            price: 150,
            rating: 4.9,
            reviews: 31
        }
    ];
    
    const currentLang = localStorage.getItem('language') || 'en';
    
    featuredContainer.innerHTML = featuredApartments.map(apartment => `
        <div class="apartment-card featured">
            <img src="images/${apartment.image}" alt="${currentLang === 'it' ? apartment.name_it : apartment.name}" class="apartment-img">
            <div class="apartment-content">
                <div class="apartment-header">
                    <h3 class="apartment-title">${currentLang === 'it' ? apartment.name_it : apartment.name}</h3>
                    <div class="apartment-rating">
                        <i class="fas fa-star"></i>
                        <span>${apartment.rating} (${apartment.reviews})</span>
                    </div>
                </div>
                <div class="apartment-price">$${apartment.price}/night</div>
                <a href="apartment-detail.html?id=${apartment.id}" class="btn btn-primary btn-block">
                    ${currentLang === 'it' ? 'Visualizza Dettagli' : 'View Details'}
                </a>
            </div>
        </div>
    `).join('');
}

function initializeTestimonialsCarousel() {
    const testimonialsContainer = document.getElementById('testimonialsCarousel');
    if (!testimonialsContainer) return;
    
    const testimonials = [
        {
            name: 'Sarah Johnson',
            location: 'United Kingdom',
            location_it: 'Regno Unito',
            rating: 5,
            text: 'Amazing experience! The apartment was beautiful and the service was exceptional.',
            text_it: 'Esperienza straordinaria! L\'appartamento era bellissimo e il servizio eccezionale.'
        },
        {
            name: 'Marco Rossi',
            location: 'Italy',
            location_it: 'Italia',
            rating: 5,
            text: 'Perfect location and stunning views. Will definitely come back!',
            text_it: 'Posizione perfetta e viste mozzafiato. Tornerò sicuramente!'
        },
        {
            name: 'Anna Müller',
            location: 'Germany',
            location_it: 'Germania',
            rating: 5,
            text: 'Excellent service and beautiful apartments. Highly recommended!',
            text_it: 'Servizio eccellente e appartamenti bellissimi. Altamente consigliato!'
        }
    ];
    
    let currentTestimonial = 0;
    const currentLang = localStorage.getItem('language') || 'en';
    
    function showTestimonial(index) {
        const testimonial = testimonials[index];
        testimonialsContainer.innerHTML = `
            <div class="testimonial-card">
                <div class="testimonial-content">
                    <div class="testimonial-rating">
                        ${Array(testimonial.rating).fill('<i class="fas fa-star"></i>').join('')}
                    </div>
                    <p class="testimonial-text">
                        "${currentLang === 'it' ? testimonial.text_it : testimonial.text}"
                    </p>
                    <div class="testimonial-author">
                        <strong>${testimonial.name}</strong>
                        <span>${currentLang === 'it' ? testimonial.location_it : testimonial.location}</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Show first testimonial
    showTestimonial(0);
    
    // Auto-rotate testimonials
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 5000);
}

function updateDynamicContent() {
    // Update any dynamically loaded content based on language
    if (currentPage === 'index.html') {
        loadFeaturedApartments();
        initializeTestimonialsCarousel();
    }
}

// Export functions for use in other modules
window.PatriziaStays = {
    openModal,
    closeModal,
    showNotification,
    formatCurrency,
    formatDate,
    switchLanguage,
    currentLanguage: () => currentLanguage,
    debounce,
    throttle
};

// Interactive hero background with subtle parallax on mouse move
function initializeInteractiveHeroBackground() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Ensure background image is set (also set in CSS for fallback)
    const cssBg = getComputedStyle(hero).backgroundImage || '';
    // Only set a fallback if none is defined by CSS
    if (!cssBg || cssBg === 'none') {
        hero.style.backgroundImage = "url('images/ras-mohammed.jpg')";
        hero.style.backgroundSize = 'cover';
        hero.style.backgroundPosition = 'center';
    }

    const move = (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const moveX = (x - 0.5) * 10; // max 10% shift
        const moveY = (y - 0.5) * 10;
        hero.style.backgroundPosition = `${50 + moveX}% ${50 + moveY}%`;
    };

    const throttledMove = (window.PatriziaStays?.throttle || throttle)(move, 30);
    hero.addEventListener('mousemove', throttledMove);
    hero.addEventListener('mouseleave', () => {
        hero.style.backgroundPosition = '50% 50%';
    });
}