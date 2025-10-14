/**
 * Sistema de Fallback para Carregamento de Imagens
 * Garante que as imagens sejam carregadas corretamente mesmo após atualizações
 */

class ImageFallback {
    constructor() {
        this.maxRetries = 3;
        this.retryDelay = 1000;
        this.init();
    }

    init() {
        this.setupImageLoading();
        this.setupCacheManagement();
        this.setupErrorHandling();
    }

    /**
     * Configura carregamento robusto de imagens
     */
    setupImageLoading() {
        // Interceptar todas as imagens
        const images = document.querySelectorAll('img');
        
        images.forEach((img, index) => {
            // Adicionar atributos para melhor controle
            img.setAttribute('data-index', index);
            img.setAttribute('data-retry-count', '0');
            
            // Configurar eventos de erro
            img.addEventListener('error', (e) => this.handleImageError(e));
            img.addEventListener('load', (e) => this.handleImageLoad(e));
            
            // Forçar carregamento se necessário
            if (!img.complete || img.naturalHeight === 0) {
                this.forceImageLoad(img);
            }
        });
    }

    /**
     * Força o carregamento de uma imagem
     */
    forceImageLoad(img) {
        const originalSrc = img.src;
        const retryCount = parseInt(img.getAttribute('data-retry-count')) || 0;
        
        if (retryCount < this.maxRetries) {
            console.log(`🔄 Tentativa ${retryCount + 1} de carregar:`, originalSrc);
            
            // Adicionar timestamp para evitar cache
            const newSrc = originalSrc + (originalSrc.includes('?') ? '&' : '?') + 't=' + Date.now();
            
            setTimeout(() => {
                img.src = newSrc;
                img.setAttribute('data-retry-count', (retryCount + 1).toString());
            }, retryCount * this.retryDelay);
        } else {
            console.error('❌ Falha ao carregar após múltiplas tentativas:', originalSrc);
            this.showPlaceholder(img);
        }
    }

    /**
     * Manipula erro de carregamento de imagem
     */
    handleImageError(event) {
        const img = event.target;
        const retryCount = parseInt(img.getAttribute('data-retry-count')) || 0;
        
        console.warn('⚠️ Erro ao carregar imagem:', img.src);
        
        if (retryCount < this.maxRetries) {
            this.forceImageLoad(img);
        } else {
            this.showPlaceholder(img);
        }
    }

    /**
     * Manipula carregamento bem-sucedido
     */
    handleImageLoad(event) {
        const img = event.target;
        console.log('✅ Imagem carregada com sucesso:', img.src);
        
        // Remover indicadores de erro
        img.classList.remove('image-error');
        img.classList.add('image-loaded');
    }

    /**
     * Mostra placeholder para imagem que falhou
     */
    showPlaceholder(img) {
        img.classList.add('image-error');
        
        // Criar placeholder SVG
        const placeholder = `
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f0f0f0"/>
                <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" 
                      fill="#999" font-family="Arial, sans-serif" font-size="14">
                    Imagem não disponível
                </text>
            </svg>
        `;
        
        // Se a imagem tem dimensões definidas, usar placeholder
        if (img.width > 0 && img.height > 0) {
            img.style.background = `url("data:image/svg+xml,${encodeURIComponent(placeholder)}") center/contain no-repeat`;
        }
    }

    /**
     * Configura gerenciamento de cache
     */
    setupCacheManagement() {
        // Limpar cache antigo ao carregar a página
        if ('caches' in window) {
            caches.keys().then(cacheNames => {
                cacheNames.forEach(cacheName => {
                    if (cacheName.includes('chicas') || cacheName.includes('image')) {
                        console.log('🧹 Limpando cache antigo:', cacheName);
                        caches.delete(cacheName);
                    }
                });
            });
        }
    }

    /**
     * Configura tratamento de erros globais
     */
    setupErrorHandling() {
        // Interceptar erros de carregamento de recursos
        window.addEventListener('error', (event) => {
            if (event.target.tagName === 'IMG') {
                console.error('🚨 Erro global de imagem:', event.target.src);
                this.handleImageError(event);
            }
        }, true);
    }

    /**
     * Recarregar todas as imagens
     */
    reloadAllImages() {
        console.log('🔄 Recarregando todas as imagens...');
        
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.setAttribute('data-retry-count', '0');
            this.forceImageLoad(img);
        });
    }

    /**
     * Verificar status das imagens
     */
    checkImageStatus() {
        const images = document.querySelectorAll('img');
        let loaded = 0;
        let failed = 0;
        let loading = 0;
        
        images.forEach(img => {
            if (img.complete && img.naturalHeight > 0) {
                loaded++;
            } else if (img.classList.contains('image-error')) {
                failed++;
            } else {
                loading++;
            }
        });
        
        console.log(`📊 Status das imagens: ${loaded} carregadas, ${failed} falharam, ${loading} carregando`);
        
        return { loaded, failed, loading, total: images.length };
    }
}

// Inicializar sistema de fallback
document.addEventListener('DOMContentLoaded', function() {
    console.log('🖼️ Sistema de fallback de imagens ativado');
    window.imageFallback = new ImageFallback();
});

// Sistema de fallback ativo - sem botão de debug para produção
