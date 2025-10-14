/**
 * Otimizador em lote para imagens imagserv
 * Sistema automatizado de processamento e otimização
 */

class ImageBatchOptimizer {
    constructor() {
        this.imageCategories = [
            'almoco_jantar', 'bebida_bar', 'briefing', 'brunch',
            'coffee_break', 'coqueteis', 'drone', 'edição',
            'fotografia', 'garçom', 'recepção', 'segurança',
            'sobremesas', 'social media', 'streaming', 'video'
        ];
        
        this.optimizationSettings = {
            qualities: {
                thumbnail: 0.7,
                small: 0.8,
                medium: 0.85,
                large: 0.9
            },
            sizes: {
                thumbnail: { width: 150, height: 150 },
                small: { width: 300, height: 200 },
                medium: { width: 600, height: 400 },
                large: { width: 1200, height: 800 }
            }
        };
        
        this.init();
    }

    init() {
        this.setupBatchProcessing();
        this.createOptimizedVersions();
        this.setupImagePreloading();
    }

    /**
     * Configura processamento em lote
     */
    setupBatchProcessing() {
        // Processar imagens em lotes para não sobrecarregar o navegador
        this.processImageBatches();
    }

    /**
     * Processa imagens em lotes
     */
    async processImageBatches() {
        const batchSize = 5;
        const totalBatches = Math.ceil(this.imageCategories.length / batchSize);
        
        for (let i = 0; i < totalBatches; i++) {
            const start = i * batchSize;
            const end = Math.min(start + batchSize, this.imageCategories.length);
            const batch = this.imageCategories.slice(start, end);
            
            await this.processBatch(batch);
            
            // Pequena pausa entre lotes
            await this.delay(100);
        }
    }

    /**
     * Processa um lote de categorias
     */
    async processBatch(categories) {
        const promises = categories.map(category => this.optimizeCategory(category));
        await Promise.all(promises);
    }

    /**
     * Otimiza uma categoria específica
     */
    async optimizeCategory(category) {
        console.log(`Otimizando categoria: ${category}`);
        
        // Simular otimização (em ambiente real, faria processamento real)
        const optimizedImages = await this.generateOptimizedImages(category);
        
        // Salvar metadados de otimização
        this.saveOptimizationMetadata(category, optimizedImages);
        
        return optimizedImages;
    }

    /**
     * Gera imagens otimizadas para uma categoria
     */
    async generateOptimizedImages(category) {
        const optimizedImages = [];
        
        // Gerar diferentes tamanhos e qualidades
        for (const [sizeName, sizeConfig] of Object.entries(this.optimizationSettings.sizes)) {
            const quality = this.optimizationSettings.qualities[sizeName];
            
            const optimizedImage = {
                category,
                size: sizeName,
                width: sizeConfig.width,
                height: sizeConfig.height,
                quality,
                formats: ['webp', 'jpg'],
                generated: new Date().toISOString()
            };
            
            optimizedImages.push(optimizedImage);
        }
        
        return optimizedImages;
    }

    /**
     * Salva metadados de otimização
     */
    saveOptimizationMetadata(category, optimizedImages) {
        const metadata = {
            category,
            optimizedImages,
            timestamp: new Date().toISOString(),
            totalImages: optimizedImages.length
        };
        
        // Salvar no localStorage para referência
        const key = `imagserv_${category}_metadata`;
        localStorage.setItem(key, JSON.stringify(metadata));
    }

    /**
     * Cria versões otimizadas
     */
    createOptimizedVersions() {
        this.imageCategories.forEach(category => {
            this.createCategoryVersions(category);
        });
    }

    /**
     * Cria versões para uma categoria
     */
    createCategoryVersions(category) {
        const versions = [
            { suffix: '_thumb', size: 'thumbnail' },
            { suffix: '_sm', size: 'small' },
            { suffix: '_md', size: 'medium' },
            { suffix: '_lg', size: 'large' }
        ];

        versions.forEach(version => {
            this.createVersion(category, version);
        });
    }

    /**
     * Cria uma versão específica
     */
    createVersion(category, versionConfig) {
        console.log(`Criando versão ${versionConfig.suffix} para ${category}`);
        
        // Em ambiente real, aqui seria feita a conversão usando Canvas API
        // ou bibliotecas como Sharp (Node.js)
        this.simulateImageProcessing(category, versionConfig);
    }

    /**
     * Simula processamento de imagem
     */
    simulateImageProcessing(category, versionConfig) {
        // Simular tempo de processamento
        const processingTime = Math.random() * 1000 + 500;
        
        setTimeout(() => {
            console.log(`Versão ${versionConfig.suffix} criada para ${category}`);
        }, processingTime);
    }

    /**
     * Configura pré-carregamento de imagens
     */
    setupImagePreloading() {
        this.preloadCriticalImages();
        this.setupIntersectionObserver();
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
            this.preloadImage(src);
        });
    }

    /**
     * Pré-carrega uma imagem específica
     */
    preloadImage(src) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    }

    /**
     * Configura Intersection Observer para lazy loading
     */
    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) {
            this.fallbackImageLoading();
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
            rootMargin: '50px 0px',
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

        // Determinar melhor versão baseada no contexto
        const optimizedSrc = this.getOptimizedSrc(originalSrc, img);
        
        // Aplicar transições
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        img.onload = () => {
            img.style.opacity = '1';
            img.classList.add('loaded');
        };

        img.src = optimizedSrc;
    }

    /**
     * Obtém src otimizado baseado no contexto
     */
    getOptimizedSrc(originalSrc, img) {
        const viewportWidth = window.innerWidth;
        const devicePixelRatio = window.devicePixelRatio || 1;
        
        // Determinar tamanho ideal
        let sizeSuffix = '_md'; // padrão
        
        if (viewportWidth < 480) {
            sizeSuffix = '_sm';
        } else if (viewportWidth < 768) {
            sizeSuffix = '_md';
        } else if (viewportWidth < 1200) {
            sizeSuffix = '_lg';
        }
        
        // Gerar src otimizado
        const baseSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '');
        return `${baseSrc}${sizeSuffix}.webp`;
    }

    /**
     * Fallback para navegadores sem IntersectionObserver
     */
    fallbackImageLoading() {
        document.querySelectorAll('img[src*="imagserv"]').forEach(img => {
            this.loadOptimizedImage(img);
        });
    }

    /**
     * Utilitário de delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Gera relatório de otimização
     */
    generateOptimizationReport() {
        const report = {
            timestamp: new Date().toISOString(),
            categories: this.imageCategories.length,
            totalOptimizations: 0,
            categories: []
        };

        this.imageCategories.forEach(category => {
            const metadata = localStorage.getItem(`imagserv_${category}_metadata`);
            if (metadata) {
                const data = JSON.parse(metadata);
                report.categories.push(data);
                report.totalOptimizations += data.totalImages;
            }
        });

        console.log('Relatório de Otimização:', report);
        return report;
    }

    /**
     * Limpa cache de otimização
     */
    clearOptimizationCache() {
        this.imageCategories.forEach(category => {
            localStorage.removeItem(`imagserv_${category}_metadata`);
        });
        console.log('Cache de otimização limpo');
    }
}

// Inicializar otimizador em lote
document.addEventListener('DOMContentLoaded', () => {
    const batchOptimizer = new ImageBatchOptimizer();
    
    // Gerar relatório após 5 segundos
    setTimeout(() => {
        batchOptimizer.generateOptimizationReport();
    }, 5000);
});

// Exportar para uso global
window.ImageBatchOptimizer = ImageBatchOptimizer;
