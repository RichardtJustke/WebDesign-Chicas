/**
 * Sistema de Redirecionamento para Carrinho - Sem Dependência de Login
 * Funciona independente do status de autenticação
 */

class CartRedirect {
    constructor() {
        this.init();
    }

    init() {
        // Interceptar cliques em botões de adicionar ao carrinho
        this.bindEvents();
    }

    bindEvents() {
        // Event delegation para capturar todos os cliques
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            // Botões "Adicionar ao Evento" ou "Adicionar ao evento"
            if (target.classList.contains('adiconar-ao-evento') || 
                target.classList.contains('add-to-event-btn') ||
                target.classList.contains('adicionar-evento-btn')) {
                
                e.preventDefault();
                this.handleAddToCart();
                return;
            }
        });
    }

    handleAddToCart() {
        // Simular adição ao carrinho (você pode personalizar esta parte)
        console.log('Item adicionado ao carrinho');
        
        // Redirecionar diretamente para o carrinho
        this.redirectToCart();
    }

    redirectToCart() {
        // Caminho direto para o carrinho
        const cartPath = this.getCartPath();
        
        console.log('Redirecionando para o carrinho:', cartPath);
        
        // Mostrar feedback
        this.showFeedback();
        
        // Redirecionar após delay
        setTimeout(() => {
            this.performRedirect(cartPath);
        }, 1000);
    }

    getCartPath() {
        const currentPath = window.location.pathname;
        
        // Lógica melhorada de caminho baseada na estrutura real
        if (currentPath.includes('/pages/serviços/')) {
            return '../../carrinho/carrinho.html';
        } else if (currentPath.includes('/pages/')) {
            return '../carrinho/carrinho.html';
        } else if (currentPath.includes('index.html') || currentPath.endsWith('/') || currentPath === '') {
            return 'pages/carrinho/carrinho.html';
        } else {
            return 'pages/carrinho/carrinho.html';
        }
    }

    showFeedback() {
        // Criar feedback visual
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        feedback.textContent = 'Item adicionado ao carrinho! Redirecionando...';
        
        document.body.appendChild(feedback);
        
        // Remover feedback após 3 segundos
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 3000);
    }

    performRedirect(cartPath) {
        try {
            // Tentar diferentes métodos de redirecionamento
            if (window.location.assign) {
                window.location.assign(cartPath);
            } else {
                window.location.href = cartPath;
            }
        } catch (error) {
            console.error('Erro ao redirecionar:', error);
            // Fallback: tentar caminho alternativo
            try {
                window.location.href = '../../carrinho/carrinho.html';
            } catch (fallbackError) {
                console.error('Erro no fallback:', fallbackError);
                alert('Erro ao acessar o carrinho. Tente navegar manualmente.');
            }
        }
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Só inicializar se não estiver na página do carrinho
    if (!window.location.pathname.includes('carrinho')) {
        window.cartRedirect = new CartRedirect();
    }
});
