// Wave Animation Effect for Hero Section
// Creates a smooth wave animation using CSS transforms and JavaScript

class WaveEffect {
    constructor() {
        this.waveContainer = null;
        this.waves = [];
        this.animationId = null;
        this.isAnimating = false;
        this.config = {
            waveCount: 3,
            waveHeight: 60,
            waveSpeed: 0.02,
            waveAmplitude: 20,
            colors: [
                'rgba(255, 107, 107, 0.3)',
                'rgba(78, 205, 196, 0.3)',
                'rgba(255, 209, 102, 0.3)'
            ]
        };
        this.init();
    }

    init() {
        this.createWaveContainer();
        this.createWaves();
        this.startAnimation();
        this.setupEventListeners();
    }

    createWaveContainer() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        // Create wave container
        this.waveContainer = document.createElement('div');
        this.waveContainer.className = 'wave-container';
        this.waveContainer.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 200px;
            overflow: hidden;
            pointer-events: none;
            z-index: 1;
        `;

        heroSection.appendChild(this.waveContainer);
        heroSection.style.position = 'relative';
        heroSection.style.overflow = 'hidden';
    }

    createWaves() {
        for (let i = 0; i < this.config.waveCount; i++) {
            const wave = this.createWave(i);
            this.waves.push(wave);
            this.waveContainer.appendChild(wave.element);
        }
    }

    createWave(index) {
        const wave = document.createElement('div');
        wave.className = `wave wave-${index + 1}`;
        
        const svg = this.createWaveSVG(index);
        wave.appendChild(svg);

        // Apply initial styles
        wave.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: ${this.config.waveHeight + index * 15}px;
            opacity: ${0.8 - index * 0.2};
            transform: translateX(-${index * 10}%);
            transition: transform 0.3s ease-out;
        `;

        return {
            element: wave,
            svg: svg,
            path: svg.querySelector('path'),
            offset: index * 50,
            speed: this.config.waveSpeed * (1 + index * 0.3),
            amplitude: this.config.waveAmplitude * (1 + index * 0.2)
        };
    }

    createWaveSVG(index) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 1200 120');
        svg.setAttribute('preserveAspectRatio', 'none');
        svg.style.cssText = `
            width: 100%;
            height: 100%;
            display: block;
        `;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const pathData = this.generateWavePath(0, index);
        path.setAttribute('d', pathData);
        path.setAttribute('fill', this.config.colors[index]);
        path.setAttribute('stroke', 'none');

        svg.appendChild(path);
        return svg;
    }

    generateWavePath(time, index) {
        const width = 1200;
        const height = 120;
        const amplitude = this.config.waveAmplitude + index * 5;
        const frequency = 0.01;
        const speed = this.config.waveSpeed * (1 + index * 0.3);
        
        let path = `M0,${height} `;
        
        for (let x = 0; x <= width; x += 5) {
            const y = height / 2 + Math.sin((x * frequency) + (time * speed)) * amplitude;
            path += `L${x},${y} `;
        }
        
        path += `L${width},${height} L0,${height} Z`;
        return path;
    }

    startAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        let time = 0;
        
        const animate = () => {
            if (!this.isAnimating) return;
            
            time += 1;
            
            this.waves.forEach((wave, index) => {
                const pathData = this.generateWavePath(time + wave.offset, index);
                wave.path.setAttribute('d', pathData);
            });
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }

    stopAnimation() {
        this.isAnimating = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    setupEventListeners() {
        // Pause animation when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimation();
            } else {
                this.resumeAnimation();
            }
        });

        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        // Handle scroll for parallax effect
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) return;
            
            scrollTimeout = requestAnimationFrame(() => {
                this.handleScroll();
                scrollTimeout = null;
            });
        });

        // Handle mouse movement for interactive effect
        this.waveContainer?.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e);
        });
    }

    pauseAnimation() {
        if (this.isAnimating) {
            this.stopAnimation();
        }
    }

    resumeAnimation() {
        if (!this.isAnimating) {
            this.startAnimation();
        }
    }

    handleResize() {
        // Recalculate wave dimensions on resize
        this.waves.forEach((wave, index) => {
            const newHeight = this.config.waveHeight + index * 15;
            wave.element.style.height = `${newHeight}px`;
        });
    }

    handleScroll() {
        const scrollY = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const heroBottom = this.waveContainer?.getBoundingClientRect().bottom || 0;
        
        // Parallax effect - waves move slower than scroll
        const parallaxSpeed = 0.5;
        const translateY = scrollY * parallaxSpeed;
        
        this.waves.forEach((wave, index) => {
            const layerSpeed = 0.2 + (index * 0.1);
            wave.element.style.transform = `translateY(${translateY * layerSpeed}px)`;
        });

        // Fade out waves as they go off screen
        if (heroBottom < 0) {
            const fadeAmount = Math.min(1, Math.abs(heroBottom) / 200);
            this.waveContainer.style.opacity = Math.max(0, 1 - fadeAmount);
        } else {
            this.waveContainer.style.opacity = 1;
        }
    }

    handleMouseMove(e) {
        if (!this.waveContainer) return;
        
        const rect = this.waveContainer.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        // Create subtle mouse interaction
        this.waves.forEach((wave, index) => {
            const influence = 0.1 + (index * 0.05);
            const translateX = (x - 0.5) * 20 * influence;
            const translateY = (y - 0.5) * 10 * influence;
            
            wave.element.style.transform += ` translate(${translateX}px, ${translateY}px)`;
        });
    }

    // Public methods
    destroy() {
        this.stopAnimation();
        
        if (this.waveContainer) {
            this.waveContainer.remove();
        }
        
        this.waves = [];
        this.waveContainer = null;
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.destroy();
        this.init();
    }

    setWaveColors(colors) {
        this.config.colors = colors;
        this.waves.forEach((wave, index) => {
            if (wave.path && this.config.colors[index]) {
                wave.path.setAttribute('fill', this.config.colors[index]);
            }
        });
    }

    setWaveSpeed(speed) {
        this.config.waveSpeed = speed;
        this.waves.forEach((wave, index) => {
            wave.speed = this.config.waveSpeed * (1 + index * 0.3);
        });
    }

    // Performance optimization
    optimizeForMobile() {
        if (window.innerWidth <= 768) {
            // Reduce wave count and complexity for mobile
            this.updateConfig({
                waveCount: 2,
                waveHeight: 40
            });
        }
    }

    // Accessibility improvements
    addAccessibility() {
        if (this.waveContainer) {
            this.waveContainer.setAttribute('role', 'presentation');
            this.waveContainer.setAttribute('aria-hidden', 'true');
        }
    }
}

// Enhanced wave effect with multiple animation modes
class AdvancedWaveEffect extends WaveEffect {
    constructor(options = {}) {
        super();
        this.modes = {
            calm: { waveSpeed: 0.01, waveAmplitude: 10 },
            normal: { waveSpeed: 0.02, waveAmplitude: 20 },
            energetic: { waveSpeed: 0.04, waveAmplitude: 30 }
        };
        this.currentMode = options.mode || 'normal';
        this.interactionEnabled = options.interaction !== false;
        this.parallaxEnabled = options.parallax !== false;
    }

    init() {
        super.init();
        this.setMode(this.currentMode);
        this.setupAdvancedFeatures();
    }

    setupAdvancedFeatures() {
        // Add mode switching capability
        this.setupModeControls();
        
        // Add color cycling
        this.setupColorCycling();
        
        // Add sound reactivity (if audio context available)
        this.setupAudioReactivity();
    }

    setupModeControls() {
        // Create mode control buttons
        const controls = document.createElement('div');
        controls.className = 'wave-mode-controls';
        controls.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            z-index: 10;
            display: flex;
            gap: 10px;
        `;

        Object.keys(this.modes).forEach(mode => {
            const button = document.createElement('button');
            button.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
            button.className = `wave-mode-btn ${mode === this.currentMode ? 'active' : ''}`;
            button.style.cssText = `
                padding: 8px 16px;
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                border-radius: 20px;
                cursor: pointer;
                font-size: 12px;
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
            `;
            
            button.addEventListener('click', () => {
                this.setMode(mode);
                controls.querySelectorAll('.wave-mode-btn').forEach(btn => 
                    btn.classList.remove('active'));
                button.classList.add('active');
            });

            controls.appendChild(button);
        });

        document.querySelector('.hero-section')?.appendChild(controls);
    }

    setMode(mode) {
        if (!this.modes[mode]) return;
        
        this.currentMode = mode;
        const modeConfig = this.modes[mode];
        
        this.config.waveSpeed = modeConfig.waveSpeed;
        this.config.waveAmplitude = modeConfig.waveAmplitude;
        
        // Update existing waves
        this.waves.forEach((wave, index) => {
            wave.speed = this.config.waveSpeed * (1 + index * 0.3);
            wave.amplitude = this.config.waveAmplitude * (1 + index * 0.2);
        });
    }

    setupColorCycling() {
        // Cycle through different color schemes
        this.colorSchemes = [
            ['rgba(255, 107, 107, 0.3)', 'rgba(78, 205, 196, 0.3)', 'rgba(255, 209, 102, 0.3)'],
            ['rgba(74, 144, 226, 0.3)', 'rgba(80, 227, 194, 0.3)', 'rgba(245, 166, 35, 0.3)'],
            ['rgba(155, 89, 182, 0.3)', 'rgba(52, 152, 219, 0.3)', 'rgba(46, 204, 113, 0.3)']
        ];
        
        this.currentColorScheme = 0;
        
        // Change colors every 10 seconds
        setInterval(() => {
            this.cycleColors();
        }, 10000);
    }

    cycleColors() {
        this.currentColorScheme = (this.currentColorScheme + 1) % this.colorSchemes.length;
        this.setWaveColors(this.colorSchemes[this.currentColorScheme]);
    }

    setupAudioReactivity() {
        // Basic audio reactivity using Web Audio API (if available)
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            this.audioContext = new (AudioContext || webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            
            // Create audio reactivity loop
            this.audioReactivityLoop();
        }
    }

    audioReactivityLoop() {
        if (!this.audioContext || !this.analyser) return;
        
        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(dataArray);
        
        // Calculate average frequency
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        const normalized = average / 255;
        
        // Adjust wave amplitude based on audio
        const audioAmplitude = this.config.waveAmplitude * (1 + normalized * 0.5);
        this.waves.forEach((wave, index) => {
            wave.amplitude = audioAmplitude * (1 + index * 0.2);
        });
        
        requestAnimationFrame(() => this.audioReactivityLoop());
    }
}

// Initialize wave effect
let waveEffect;

function initWaveEffect() {
    // Check if hero section exists
    if (!document.querySelector('.hero-section')) return;
    
    // Use advanced wave effect on desktop, simple on mobile
    const isMobile = window.innerWidth <= 768;
    waveEffect = isMobile ? new WaveEffect() : new AdvancedWaveEffect({
        mode: 'normal',
        interaction: true,
        parallax: true
    });
    
    if (isMobile) {
        waveEffect.optimizeForMobile();
    }
    
    waveEffect.addAccessibility();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWaveEffect);
} else {
    initWaveEffect();
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (waveEffect) {
        if (document.hidden) {
            waveEffect.pauseAnimation();
        } else {
            waveEffect.resumeAnimation();
        }
    }
});

// Export for use in other modules
window.WaveEffect = {
    WaveEffect,
    AdvancedWaveEffect,
    waveEffect,
    initWaveEffect
};