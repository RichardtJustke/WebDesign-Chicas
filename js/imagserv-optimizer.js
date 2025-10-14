/**
 * Otimizador específico para imagens da pasta imagserv
 * Sistema avançado de otimização com compressão, WebP e lazy loading
 */

class ImagservOptimizer {
    constructor() {
        this.imageConfig = {
            quality: 0.85,
            maxWidth: 1920,
            maxHeight: 1080,
            formats: ['webp', 'jpg', 'png'],
            lazyLoadThreshold: 100
        };
        
        this.optimizedImages = new Map();
        this.init();
    }

    init() {
        this.setupImageOptimization();
        this.createResponsiveImages();
        this.setupAdvancedLazyLoading();
        this.addImageCompression();
    }

    /**
     * Configura otimização automática para imagens imagserv
     */
    setupImageOptimization() {
        // Interceptar carregamento de imagens imagserv
        const originalImage = window.Image;
        const self = this;

        window.Image = function() {
            const img = new originalImage();
            const originalSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
            
            Object.defineProperty(img, 'src', {
                get: originalSrc.get,
                set: function(value) {
                    if (value && value.includes('imagserv')) {
                        const optimizedSrc = self.optimizeImagePath(value);
                        originalSrc.set.call(this, optimizedSrc);
                    } else {
                        originalSrc.set.call(this, value);
                    }
                }
            });
            
            return img;
        };

        // Preservar propriedades originais
        Object.setPrototypeOf(window.Image, originalImage);
        Object.setPrototypeOf(window.Image.prototype, originalImage.prototype);
    }

    /**
     * Otimiza caminho da imagem baseado no contexto
     */
    optimizeImagePath(src) {
        if (!src.includes('imagserv')) return src;

        // Verificar se já foi otimizada
        if (this.optimizedImages.has(src)) {
            return this.optimizedImages.get(src);
        }

        // Determinar formato otimizado
        const optimizedSrc = this.getOptimizedImagePath(src);
        this.optimizedImages.set(src, optimizedSrc);
        
        return optimizedSrc;
    }

    /**
     * Gera caminho otimizado para a imagem
     */
    getOptimizedImagePath(originalPath) {
        const supportsWebP = this.checkWebPSupport();
        const connectionSpeed = this.getConnectionSpeed();
        
        // Ajustar qualidade baseada na velocidade da conexão
        let quality = this.imageConfig.quality;
        if (connectionSpeed === 'slow') {
            quality = 0.6;
        } else if (connectionSpeed === 'fast') {
            quality = 0.9;
        }

        // Gerar parâmetros de otimização
        const params = new URLSearchParams({
            q: quality,
            w: this.getOptimalWidth(),
            h: this.getOptimalHeight(),
            f: supportsWebP ? 'webp' : 'auto'
        });

        // Retornar URL otimizada (simulada para demonstração)
        return `${originalPath}?${params.toString()}`;
    }

    /**
     * Cria versões responsivas das imagens
     */
    createResponsiveImages() {
        const imageCategories = [
            'almoco_jantar', 'bebida_bar', 'briefing', 'brunch', 
            'coffee_break', 'coqueteis', 'drone', 'edição', 
            'fotografia', 'garçom', 'recepção', 'segurança',
            'sobremesas', 'social media', 'streaming', 'video'
        ];

        imageCategories.forEach(category => {
            this.generateResponsiveSet(category);
        });
    }

    /**
     * Gera conjunto responsivo para uma categoria
     */
    generateResponsiveSet(category) {
        const sizes = [
            { suffix: '_sm', width: 480, height: 320 },
            { suffix: '_md', width: 768, height: 512 },
            { suffix: '_lg', width: 1024, height: 683 },
            { suffix: '_xl', width: 1920, height: 1280 }
        ];

        sizes.forEach(size => {
            this.createOptimizedVariant(category, size);
        });
    }

    /**
     * Cria variante otimizada da imagem
     */
    createOptimizedVariant(category, sizeConfig) {
        // Simulação de criação de variantes otimizadas
        console.log(`Criando variante ${sizeConfig.suffix} para ${category}`);
        
        // Em um ambiente real, aqui seria feita a compressão/redimensionamento
        // usando Canvas API ou bibliotecas como Sharp (Node.js)
    }

    /**
     * Configura lazy loading avançado
     */
    setupAdvancedLazyLoading() {
        if (!('IntersectionObserver' in window)) {
            this.fallbackLazyLoading();
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadOptimizedImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: `${this.imageConfig.lazyLoadThreshold}px`,
            threshold: 0.1
        });

        // Observar todas as imagens imagserv
        document.querySelectorAll('img[src*="imagserv"]').forEach(img => {
            observer.observe(img);
        });
    }

    /**
     * Carrega imagem otimizada
     */
    loadOptimizedImage(img) {
        const originalSrc = img.src || img.dataset.src;
        if (!originalSrc) return;

        // Aplicar otimizações
        const optimizedSrc = this.optimizeImagePath(originalSrc);
        
        // Adicionar efeitos de transição
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        img.onload = () => {
            img.style.opacity = '1';
            img.classList.add('loaded');
        };

        img.src = optimizedSrc;
    }

    /**
     * Adiciona compressão dinâmica
     */
    addImageCompression() {
        // Interceptar imagens carregadas
        document.addEventListener('load', (e) => {
            if (e.target.tagName === 'IMG' && e.target.src.includes('imagserv')) {
                this.compressImageIfNeeded(e.target);
            }
        }, true);
    }

    /**
     * Comprime imagem se necessário
     */
    compressImageIfNeeded(img) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calcular dimensões otimizadas
        const { width, height } = this.calculateOptimalDimensions(
            img.naturalWidth, 
            img.naturalHeight
        );
        
        canvas.width = width;
        canvas.height = height;
        
        // Desenhar imagem redimensionada
        ctx.drawImage(img, 0, 0, width, height);
        
        // Aplicar compressão
        const compressedDataUrl = canvas.toDataURL('image/jpeg', this.imageConfig.quality);
        
        // Substituir src se a compressão for significativa
        if (compressedDataUrl.length < img.src.length * 0.8) {
            img.src = compressedDataUrl;
        }
    }

    /**
     * Calcula dimensões otimizadas
     */
    calculateOptimalDimensions(originalWidth, originalHeight) {
        const maxWidth = this.imageConfig.maxWidth;
        const maxHeight = this.imageConfig.maxHeight;
        
        let { width, height } = this.maintainAspectRatio(
            originalWidth, 
            originalHeight, 
            maxWidth, 
            maxHeight
        );
        
        return { width, height };
    }

    /**
     * Mantém proporção da imagem
     */
    maintainAspectRatio(originalWidth, originalHeight, maxWidth, maxHeight) {
        const aspectRatio = originalWidth / originalHeight;
        
        let width = originalWidth;
        let height = originalHeight;
        
        if (width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
        }
        
        if (height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
        }
        
        return { width: Math.round(width), height: Math.round(height) };
    }

    /**
     * Verifica suporte a WebP
     */
    checkWebPSupport() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    /**
     * Detecta velocidade da conexão
     */
    getConnectionSpeed() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        if (!connection) return 'medium';
        
        const effectiveType = connection.effectiveType;
        
        if (effectiveType === 'slow-2g' || effectiveType === '2g') return 'slow';
        if (effectiveType === '4g') return 'fast';
        
        return 'medium';
    }

    /**
     * Obtém largura otimizada baseada no viewport
     */
    getOptimalWidth() {
        const viewportWidth = window.innerWidth;
        const devicePixelRatio = window.devicePixelRatio || 1;
        
        return Math.min(viewportWidth * devicePixelRatio, this.imageConfig.maxWidth);
    }

    /**
     * Obtém altura otimizada baseada no viewport
     */
    getOptimalHeight() {
        const viewportHeight = window.innerHeight;
        const devicePixelRatio = window.devicePixelRatio || 1;
        
        return Math.min(viewportHeight * devicePixelRatio, this.imageConfig.maxHeight);
    }

    /**
     * Fallback para navegadores sem IntersectionObserver
     */
    fallbackLazyLoading() {
        document.querySelectorAll('img[src*="imagserv"]').forEach(img => {
            this.loadOptimizedImage(img);
        });
    }

    /**
     * Pré-carrega imagens críticas
     */
    preloadCriticalImages() {
        const criticalImages = [
            'assets/imagserv/coqueteis/coq1.jpg',
            'assets/imagserv/fotografia/ff1.jpg',
            'assets/imagserv/recepção/rr1.jpeg'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = this.optimizeImagePath(src);
            document.head.appendChild(link);
        });
    }

    /**
     * Adiciona estilos de otimização
     */
    addOptimizationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            img[src*="imagserv"] {
                transition: opacity 0.3s ease, transform 0.3s ease;
                will-change: opacity, transform;
            }
            
            img[src*="imagserv"]:not(.loaded) {
                opacity: 0;
                transform: scale(0.95);
            }
            
            img[src*="imagserv"].loaded {
                opacity: 1;
                transform: scale(1);
            }
            
            .imagserv-container {
                position: relative;
                overflow: hidden;
            }
            
            .imagserv-container::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: shimmer 1.5s infinite;
                z-index: 1;
            }
            
            .imagserv-container img.loaded + ::before {
                display: none;
            }
            
            @keyframes shimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Inicializar otimizador quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const optimizer = new ImagservOptimizer();
    optimizer.preloadCriticalImages();
    optimizer.addOptimizationStyles();
});

// Exportar para uso global
window.ImagservOptimizer = ImagservOptimizer;
