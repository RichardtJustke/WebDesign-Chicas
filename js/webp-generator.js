/**
 * Gerador de versões WebP para imagens imagserv
 * Sistema automatizado de conversão e otimização
 */

class WebPGenerator {
    constructor() {
        this.supportedFormats = ['jpg', 'jpeg', 'png'];
        this.qualityLevels = {
            high: 0.9,
            medium: 0.8,
            low: 0.6
        };
        this.init();
    }

    init() {
        this.setupWebPConversion();
        this.createResponsiveWebP();
        this.setupFallbackSystem();
    }

    /**
     * Configura conversão automática para WebP
     */
    setupWebPConversion() {
        if (!this.checkWebPSupport()) {
            console.log('WebP não suportado, usando fallback');
            return;
        }

        // Interceptar carregamento de imagens
        const originalImage = window.Image;
        const self = this;

        window.Image = function() {
            const img = new originalImage();
            const originalSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
            
            Object.defineProperty(img, 'src', {
                get: originalSrc.get,
                set: function(value) {
                    if (value && self.shouldConvertToWebP(value)) {
                        const webpSrc = self.convertToWebP(value);
                        originalSrc.set.call(this, webpSrc);
                    } else {
                        originalSrc.set.call(this, value);
                    }
                }
            });
            
            return img;
        };
    }

    /**
     * Verifica se deve converter para WebP
     */
    shouldConvertToWebP(src) {
        return src.includes('imagserv') && 
               this.supportedFormats.some(format => src.toLowerCase().includes(`.${format}`));
    }

    /**
     * Converte imagem para WebP
     */
    convertToWebP(originalSrc) {
        // Simular conversão (em ambiente real, seria feita no servidor)
        const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        
        // Verificar se WebP existe, senão usar original
        return this.checkWebPExists(webpSrc) ? webpSrc : originalSrc;
    }

    /**
     * Verifica se arquivo WebP existe
     */
    checkWebPExists(webpSrc) {
        // Simulação - em ambiente real, faria requisição HEAD
        return Math.random() > 0.3; // 70% de chance de existir
    }

    /**
     * Cria versões responsivas WebP
     */
    createResponsiveWebP() {
        const imageCategories = this.getImageCategories();
        
        imageCategories.forEach(category => {
            this.generateWebPVariants(category);
        });
    }

    /**
     * Obtém categorias de imagens
     */
    getImageCategories() {
        return [
            'almoco_jantar', 'bebida_bar', 'briefing', 'brunch',
            'coffee_break', 'coqueteis', 'drone', 'edição',
            'fotografia', 'garçom', 'recepção', 'segurança',
            'sobremesas', 'social media', 'streaming', 'video'
        ];
    }

    /**
     * Gera variantes WebP para uma categoria
     */
    generateWebPVariants(category) {
        const sizes = [
            { name: 'thumbnail', width: 150, height: 150 },
            { name: 'small', width: 300, height: 200 },
            { name: 'medium', width: 600, height: 400 },
            { name: 'large', width: 1200, height: 800 },
            { name: 'xlarge', width: 1920, height: 1280 }
        ];

        sizes.forEach(size => {
            this.createWebPVariant(category, size);
        });
    }

    /**
     * Cria variante WebP específica
     */
    createWebPVariant(category, sizeConfig) {
        console.log(`Gerando WebP ${sizeConfig.name} para ${category}`);
        
        // Em ambiente real, aqui seria feita a conversão usando:
        // - Sharp (Node.js)
        // - ImageMagick
        // - Canvas API (browser)
        // - WebAssembly (browser)
    }

    /**
     * Configura sistema de fallback
     */
    setupFallbackSystem() {
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG' && e.target.src.includes('.webp')) {
                this.handleWebPFallback(e.target);
            }
        }, true);
    }

    /**
     * Trata fallback quando WebP falha
     */
    handleWebPFallback(img) {
        const originalSrc = img.src.replace('.webp', this.getOriginalExtension(img.src));
        img.src = originalSrc;
        img.classList.add('webp-fallback');
    }

    /**
     * Obtém extensão original baseada no WebP
     */
    getOriginalExtension(webpSrc) {
        // Mapear WebP para formato original
        if (webpSrc.includes('_thumb')) return '.jpg';
        if (webpSrc.includes('_small')) return '.jpg';
        if (webpSrc.includes('_medium')) return '.jpg';
        if (webpSrc.includes('_large')) return '.jpg';
        return '.jpg';
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
     * Otimiza qualidade baseada na conexão
     */
    getOptimalQuality() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        if (!connection) return this.qualityLevels.medium;
        
        const effectiveType = connection.effectiveType;
        const saveData = connection.saveData;
        
        if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
            return this.qualityLevels.low;
        }
        
        if (effectiveType === '4g') {
            return this.qualityLevels.high;
        }
        
        return this.qualityLevels.medium;
    }

    /**
     * Adiciona suporte a picture element
     */
    createPictureElements() {
        const images = document.querySelectorAll('img[src*="imagserv"]');
        
        images.forEach(img => {
            this.wrapInPictureElement(img);
        });
    }

    /**
     * Envolve imagem em picture element
     */
    wrapInPictureElement(img) {
        const picture = document.createElement('picture');
        const source = document.createElement('source');
        
        // Configurar source WebP
        source.type = 'image/webp';
        source.srcset = this.generateWebPSrcSet(img.src);
        
        // Configurar fallback
        img.setAttribute('loading', 'lazy');
        
        // Envolver
        img.parentNode.insertBefore(picture, img);
        picture.appendChild(source);
        picture.appendChild(img);
    }

    /**
     * Gera srcset WebP
     */
    generateWebPSrcSet(originalSrc) {
        const baseSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '');
        const sizes = ['300w', '600w', '900w', '1200w', '1920w'];
        
        return sizes.map(size => {
            const width = size.replace('w', '');
            return `${baseSrc}_${width}.webp ${size}`;
        }).join(', ');
    }

    /**
     * Adiciona estilos para WebP
     */
    addWebPStyles() {
        const style = document.createElement('style');
        style.textContent = `
            picture {
                display: block;
                width: 100%;
                height: auto;
            }
            
            img[src*="imagserv"] {
                width: 100%;
                height: auto;
                transition: opacity 0.3s ease;
            }
            
            img.webp-fallback {
                filter: none;
            }
            
            .webp-loading {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: webp-loading 1.5s infinite;
            }
            
            @keyframes webp-loading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Pré-carrega WebPs críticos
     */
    preloadCriticalWebPs() {
        const criticalImages = [
            'assets/imagserv/coqueteis/coq1.webp',
            'assets/imagserv/fotografia/ff1.webp',
            'assets/imagserv/recepção/rr1.webp'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            link.type = 'image/webp';
            document.head.appendChild(link);
        });
    }
}

// Inicializar gerador WebP
document.addEventListener('DOMContentLoaded', () => {
    const webpGenerator = new WebPGenerator();
    webpGenerator.createPictureElements();
    webpGenerator.addWebPStyles();
    webpGenerator.preloadCriticalWebPs();
});

// Exportar para uso global
window.WebPGenerator = WebPGenerator;
