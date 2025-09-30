// Script de otimização para página de buffet
(function() {
    'use strict';
    
    // Preload das imagens mais importantes
    const criticalImages = [
        '../../../assets/img g/buffet/alexander-fae-uo9TCt61o30-unsplash.jpg',
        '../../../assets/img g/buffet/chuttersnap-a5Cobl3QB5A-unsplash.jpg',
        '../../../assets/img g/buffet/engin-akyurt-6dPXcMvniHU-unsplash.jpg'
    ];
    
    // Preload das imagens críticas
    function preloadCriticalImages() {
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    // Intersection Observer para lazy loading otimizado
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            img.classList.remove('lazy');
                            observer.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            // Observar imagens lazy
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    // Otimizar animações CSS
    function optimizeAnimations() {
        // Adicionar classes CSS para otimização
        const style = document.createElement('style');
        style.textContent = `
            .popup-overlay,
            .packages-popup-overlay,
            .package-detail-popup-overlay {
                will-change: opacity, visibility;
                transform: translateZ(0);
                backface-visibility: hidden;
            }
            
            .popup-content,
            .packages-popup-content,
            .package-detail-popup-content {
                will-change: transform;
                transform: translateZ(0);
                backface-visibility: hidden;
            }
            
            .popup-image img,
            .package-image img,
            .package-detail-main-image img {
                will-change: transform;
                transform: translateZ(0);
                backface-visibility: hidden;
                transition: opacity 0.3s ease, transform 0.3s ease;
            }
            
                backface-visibility: hidden;
            }
            
            /* Otimização para imagens lazy */
            img.lazy {
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            img.lazy.loaded {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Debounce para eventos de scroll e resize
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
    
    // Otimizar performance de scroll
    function optimizeScroll() {
        let ticking = false;
        
        function updateScroll() {
            // Lógica de scroll otimizada aqui se necessário
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateScroll);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }
    
    // Inicializar otimizações
    function init() {
        // Preload das imagens críticas
        preloadCriticalImages();
        
        // Inicializar lazy loading
        initLazyLoading();
        
        // Otimizar animações
        optimizeAnimations();
        
        // Otimizar scroll
        optimizeScroll();
        
        console.log('✅ Otimizações de performance aplicadas na página de buffet');
    }
    
    // Inicializar quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
