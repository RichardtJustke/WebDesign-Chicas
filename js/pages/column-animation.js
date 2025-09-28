/**
 * Animação de Colunas do Portfólio
 * Cria efeito ondulante onde colunas alternadas sobem e descem
 */

class ColumnAnimation {
    constructor() {
        this.portfolioItems = [];
        this.isAnimating = false;
        this.animationSpeed = 8; // segundos
        this.amplitude = 12; // pixels
        this.rotation = 0.5; // graus
        this.delayStep = 1.6; // segundos entre colunas
        
        this.init();
    }
    
    init() {
        console.log('🎭 Iniciando animação de colunas...');
        
        // Aguardar DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        // Encontrar itens do portfólio
        this.portfolioItems = document.querySelectorAll('.portfolio-item');
        
        if (this.portfolioItems.length === 0) {
            console.warn('⚠️ Nenhum item do portfólio encontrado');
            return;
        }
        
        console.log(`📦 Encontrados ${this.portfolioItems.length} itens do portfólio`);
        
        // Injetar CSS das animações
        this.injectCSS();
        
        // Aplicar animações
        this.applyAnimations();
        
        // Configurar observador para novos itens
        this.setupObserver();
        
        console.log('✅ Animação de colunas configurada com sucesso!');
    }
    
    injectCSS() {
        // Verificar se CSS já foi injetado
        if (document.querySelector('#column-animation-styles')) {
            return;
        }
        
        const style = document.createElement('style');
        style.id = 'column-animation-styles';
        style.textContent = `
            /* Animação para colunas ímpares (sobem) */
            @keyframes columnFloatUp {
                0%, 100% { 
                    transform: translateY(0px) rotate(0deg); 
                }
                25% { 
                    transform: translateY(-${this.amplitude}px) rotate(${this.rotation}deg); 
                }
                50% { 
                    transform: translateY(0px) rotate(0deg); 
                }
                75% { 
                    transform: translateY(${this.amplitude}px) rotate(-${this.rotation}deg); 
                }
            }
            
            /* Animação para colunas pares (descem) */
            @keyframes columnFloatDown {
                0%, 100% { 
                    transform: translateY(0px) rotate(0deg); 
                }
                25% { 
                    transform: translateY(${this.amplitude}px) rotate(-${this.rotation}deg); 
                }
                50% { 
                    transform: translateY(0px) rotate(0deg); 
                }
                75% { 
                    transform: translateY(-${this.amplitude}px) rotate(${this.rotation}deg); 
                }
            }
            
            /* Classe para itens animados */
            .portfolio-item.column-animated {
                animation-fill-mode: both !important;
                animation-iteration-count: infinite !important;
                animation-direction: normal !important;
                animation-play-state: running !important;
                will-change: transform;
            }
            
            /* Pausar animação no hover */
            .portfolio-item.column-animated:hover {
                animation-play-state: paused !important;
            }
        `;
        
        document.head.appendChild(style);
        console.log('🎨 CSS das animações injetado');
    }
    
    applyAnimations() {
        this.portfolioItems.forEach((item, index) => {
            // Calcular coluna baseada na posição (assumindo 5 colunas)
            const column = (index % 5) + 1;
            const delay = (index % 5) * this.delayStep;
            
            // Adicionar classe de animação
            item.classList.add('column-animated');
            
            // Determinar tipo de animação baseado na coluna
            const animationType = column % 2 === 1 ? 'columnFloatUp' : 'columnFloatDown';
            const direction = column % 2 === 1 ? '⬆️ Sobe' : '⬇️ Desce';
            
            // Aplicar animação
            item.style.animation = `${animationType} ${this.animationSpeed}s ease-in-out infinite`;
            item.style.animationDelay = `${delay}s`;
            
            // Adicionar atributo para debug
            item.setAttribute('data-column', column);
            item.setAttribute('data-animation', animationType);
            
            console.log(`🎯 Item ${index + 1} (Coluna ${column}): ${direction} - Delay: ${delay}s`);
        });
        
        this.isAnimating = true;
    }
    
    setupObserver() {
        // Observar mudanças no DOM para novos itens
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const newItems = Array.from(mutation.addedNodes).filter(
                        node => node.nodeType === 1 && node.classList?.contains('portfolio-item')
                    );
                    
                    if (newItems.length > 0) {
                        console.log(`🆕 ${newItems.length} novos itens detectados, aplicando animação...`);
                        this.animateNewItems(newItems);
                    }
                }
            });
        });
        
        const portfolioGrid = document.querySelector('.portfolio-grid') || document.querySelector('.masonry');
        if (portfolioGrid) {
            observer.observe(portfolioGrid, { childList: true, subtree: true });
        }
    }
    
    animateNewItems(newItems) {
        const currentItemCount = this.portfolioItems.length;
        
        newItems.forEach((item, index) => {
            const globalIndex = currentItemCount + index;
            const column = (globalIndex % 5) + 1;
            const delay = (globalIndex % 5) * this.delayStep;
            
            item.classList.add('column-animated');
            
            const animationType = column % 2 === 1 ? 'columnFloatUp' : 'columnFloatDown';
            item.style.animation = `${animationType} ${this.animationSpeed}s ease-in-out infinite`;
            item.style.animationDelay = `${delay}s`;
            
            item.setAttribute('data-column', column);
            item.setAttribute('data-animation', animationType);
        });
        
        // Atualizar lista de itens
        this.portfolioItems = document.querySelectorAll('.portfolio-item');
    }
    
    // Métodos públicos para controle
    pause() {
        this.portfolioItems.forEach(item => {
            item.style.animationPlayState = 'paused';
        });
        this.isAnimating = false;
        console.log('⏸️ Animação pausada');
    }
    
    resume() {
        this.portfolioItems.forEach(item => {
            item.style.animationPlayState = 'running';
        });
        this.isAnimating = true;
        console.log('▶️ Animação retomada');
    }
    
    stop() {
        this.portfolioItems.forEach(item => {
            item.style.animation = 'none';
            item.classList.remove('column-animated');
        });
        this.isAnimating = false;
        console.log('⏹️ Animação parada');
    }
    
    restart() {
        this.stop();
        setTimeout(() => {
            this.portfolioItems = document.querySelectorAll('.portfolio-item');
            this.applyAnimations();
        }, 100);
        console.log('🔄 Animação reiniciada');
    }
    
    // Ajustar velocidade da animação
    setSpeed(speed) {
        this.animationSpeed = speed;
        this.portfolioItems.forEach(item => {
            const currentAnimation = item.style.animation;
            const newAnimation = currentAnimation.replace(/\d+s/, `${speed}s`);
            item.style.animation = newAnimation;
        });
        console.log(`⚡ Velocidade alterada para ${speed}s`);
    }
    
    // Ajustar amplitude do movimento
    setAmplitude(amplitude) {
        this.amplitude = amplitude;
        this.restart(); // Reiniciar para aplicar nova amplitude
        console.log(`📏 Amplitude alterada para ${amplitude}px`);
    }
}

// Inicializar automaticamente
const columnAnimation = new ColumnAnimation();

// Expor para uso global
window.columnAnimation = columnAnimation;

// Exportar para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ColumnAnimation;
}
