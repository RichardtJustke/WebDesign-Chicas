/**
 * Sistema de otimização de imagens para o site Chicas Eventos
 * Inclui lazy loading, compressão automática e fallback para WebP
 */

class ImageOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.optimizeExistingImages();
        this.setupWebPSupport();
    }

    /**
     * Configura lazy loading para todas as imagens
     */
    setupLazyLoading() {
        // Verificar se o navegador suporta Intersection Observer
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            // Observar todas as imagens com data-src
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback para navegadores antigos
            document.querySelectorAll('img[data-src]').forEach(img => {
                this.loadImage(img);
            });
        }
    }

    /**
     * Carrega uma imagem com otimizações
     */
    loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;

        // Criar nova imagem para pré-carregamento
        const newImg = new Image();
        
        newImg.onload = () => {
            img.src = src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        };

        newImg.onerror = () => {
            // Fallback para imagem original se WebP falhar
            const fallbackSrc = img.dataset.fallback || src.replace('.webp', '.jpg');
            img.src = fallbackSrc;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        };

        newImg.src = src;
    }

    /**
     * Otimiza imagens existentes
     */
    optimizeExistingImages() {
        document.querySelectorAll('img').forEach(img => {
            // Adicionar loading="lazy" se não tiver
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }

            // Adicionar classes para transições suaves
            if (!img.classList.contains('image-optimized')) {
                img.classList.add('image-optimized');
            }
        });
    }

    /**
     * Configura suporte para WebP com fallback
     */
    setupWebPSupport() {
        // Verificar se o navegador suporta WebP
        const webpSupported = this.checkWebPSupport();
        
        if (webpSupported) {
            this.convertImagesToWebP();
        }
    }

    /**
     * Verifica se o navegador suporta WebP
     */
    checkWebPSupport() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    /**
     * Converte imagens para WebP quando possível
     */
    convertImagesToWebP() {
        document.querySelectorAll('img[src*=".jpg"], img[src*=".png"]').forEach(img => {
            const originalSrc = img.src;
            const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            
            // Tentar carregar WebP
            const testImg = new Image();
            testImg.onload = () => {
                img.src = webpSrc;
            };
            testImg.onerror = () => {
                // Manter imagem original se WebP não existir
            };
            testImg.src = webpSrc;
        });
    }

    /**
     * Comprime imagens dinamicamente usando Canvas
     */
    compressImage(img, quality = 0.8) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        
        ctx.drawImage(img, 0, 0);
        
        return canvas.toDataURL('image/jpeg', quality);
    }

    /**
     * Adiciona efeitos de carregamento
     */
    addLoadingEffects() {
        const style = document.createElement('style');
        style.textContent = `
            .image-optimized {
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .image-optimized.loaded {
                opacity: 1;
            }
            
            .image-optimized[data-src] {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: loading 1.5s infinite;
            }
            
            @keyframes loading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new ImageOptimizer();
});

// Exportar para uso global
window.ImageOptimizer = ImageOptimizer;
