// Lazy Loading Avançado - Chicas Eventos
class LazyLoader {
    constructor() {
        this.observer = null;
        this.images = [];
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
                rootMargin: '50px 0px',
                threshold: 0.1
            });
        }
        this.loadImages();
    }

    loadImages() {
        this.images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
        this.images.forEach(img => {
            if (this.observer) {
                this.observer.observe(img);
            } else {
                this.loadImage(img);
            }
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadImage(entry.target);
                this.observer.unobserve(entry.target);
            }
        });
    }

    loadImage(img) {
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }
        
        img.classList.add('loaded');
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        img.onload = () => {
            img.style.opacity = '1';
        };
    }

    // Preload de imagens críticas
    preloadCriticalImages() {
        const criticalImages = [
            'assets/img g/logo/CHICAS EVENTOS_LOGO_VERMELHO.png',
            'pages/index/selective-focus-point-catering-buffet-food 2.png'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    // Otimização de imagens baseada na conexão
    optimizeForConnection() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        if (connection) {
            const effectiveType = connection.effectiveType;
            const saveData = connection.saveData;
            
            if (effectiveType === 'slow-2g' || effectiveType === '2g' || saveData) {
                // Carregar imagens de baixa qualidade
                this.loadLowQualityImages();
            }
        }
    }

    loadLowQualityImages() {
        const images = document.querySelectorAll('img[data-src-low]');
        images.forEach(img => {
            if (img.dataset.srcLow) {
                img.src = img.dataset.srcLow;
            }
        });
    }
}

// Inicializar lazy loading quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const lazyLoader = new LazyLoader();
    lazyLoader.preloadCriticalImages();
    lazyLoader.optimizeForConnection();
});

// Service Worker para cache de imagens
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw-images.js')
            .then(registration => {
                console.log('SW Images registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW Images registration failed: ', registrationError);
            });
    });
}
