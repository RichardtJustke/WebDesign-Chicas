/**
 * Sistema de Carrinho - Chicas Eventos
 * Gerencia a exibição e manipulação dos itens do carrinho
 */

class CartManager {
    constructor() {
        this.cartItems = [];
        this.init();
    }

    init() {
        this.loadCartItems();
        this.renderCartItems();
        this.bindEvents();
    }

    loadCartItems() {
        // Carregar itens do localStorage
        const eventCart = JSON.parse(localStorage.getItem('eventCart') || '[]');
        const chicasCart = JSON.parse(localStorage.getItem('chicasEventos_cart') || '[]');
        
        // Combinar ambos os carrinhos
        this.cartItems = [...eventCart, ...chicasCart];
        
        console.log('Itens carregados do carrinho:', this.cartItems);
    }

    renderCartItems() {
        const itemsContainer = document.querySelector('.frame-81');
        if (!itemsContainer) return;

        if (this.cartItems.length === 0) {
            itemsContainer.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-message">
                        <h3>Seu carrinho está vazio</h3>
                        <p>Adicione alguns serviços para começar a planejar seu evento!</p>
                        <a href="../../index.html" class="btn-continue-shopping">Continuar comprando</a>
                    </div>
                </div>
            `;
            return;
        }

        // Limpar container
        itemsContainer.innerHTML = '';

        // Renderizar cada item
        this.cartItems.forEach((item, index) => {
            const itemElement = this.createCartItemElement(item, index);
            itemsContainer.appendChild(itemElement);
        });

        // Atualizar resumo
        this.updateCartSummary();
    }

    createCartItemElement(item, index) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.setAttribute('data-index', index);

        // Determinar tipo de item e informações
        let itemInfo = this.getItemInfo(item);
        
        itemDiv.innerHTML = `
            <div class="cart-item-content">
                <div class="item-image">
                    <img src="${itemInfo.image}" alt="${itemInfo.title}" />
                </div>
                <div class="item-details">
                    <h4 class="item-title">${itemInfo.title}</h4>
                    <p class="item-description">${itemInfo.description}</p>
                    <div class="item-meta">
                        <span class="item-type">${itemInfo.type}</span>
                        ${item.quantity ? `<span class="item-quantity">Qtd: ${item.quantity}</span>` : ''}
                    </div>
                </div>
                <div class="item-actions">
                    <div class="item-price">
                        ${itemInfo.priceDisplay}
                    </div>
                    <button class="btn-remove" onclick="cartManager.removeItem(${index})">
                        Remover
                    </button>
                </div>
            </div>
        `;

        return itemDiv;
    }

    getItemInfo(item) {
        // Para pacotes do buffet
        if (item.type === 'package') {
            return {
                title: item.title,
                description: item.description,
                image: item.image || '../../assets/img g/logo/icone.png',
                type: 'Pacote Buffet',
                priceDisplay: item.price ? `R$ ${item.price.toLocaleString('pt-BR')}` : 'A combinar'
            };
        }
        
        // Para serviços individuais
        if (item.services && Array.isArray(item.services)) {
            const serviceNames = item.services.map(s => s.name).join(', ');
            return {
                title: 'Serviços Selecionados',
                description: serviceNames,
                image: '../../assets/img g/logo/icone.png',
                type: 'Serviços',
                priceDisplay: item.total ? `R$ ${item.total.toLocaleString('pt-BR')}` : 'A combinar'
            };
        }

        // Fallback
        return {
            title: item.title || 'Item do Carrinho',
            description: item.description || 'Descrição não disponível',
            image: '../../assets/img g/logo/icone.png',
            type: 'Serviço',
            priceDisplay: item.price ? `R$ ${item.price.toLocaleString('pt-BR')}` : 'A combinar'
        };
    }

    updateCartSummary() {
        const totalItems = document.getElementById('total-items');
        const totalPrice = document.getElementById('total-price');
        
        if (totalItems) {
            const itemCount = this.cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
            totalItems.textContent = itemCount;
        }

        if (totalPrice) {
            const total = this.calculateTotal();
            if (total > 0) {
                totalPrice.textContent = `R$ ${total.toLocaleString('pt-BR')}`;
            } else {
                totalPrice.textContent = 'A combinar';
            }
        }
    }

    calculateTotal() {
        return this.cartItems.reduce((sum, item) => {
            if (item.total) {
                return sum + item.total;
            } else if (item.price) {
                return sum + (item.price * (item.quantity || 1));
            }
            return sum;
        }, 0);
    }

    removeItem(index) {
        if (confirm('Tem certeza que deseja remover este item do carrinho?')) {
            this.cartItems.splice(index, 1);
            this.saveCartItems();
            this.renderCartItems();
        }
    }

    clearCart() {
        if (confirm('Tem certeza que deseja limpar todo o carrinho?')) {
            this.cartItems = [];
            this.saveCartItems();
            this.renderCartItems();
        }
    }

    saveCartItems() {
        // Separar itens por tipo para salvar nos respectivos storages
        const eventCartItems = this.cartItems.filter(item => item.type === 'package');
        const chicasCartItems = this.cartItems.filter(item => item.type !== 'package');
        
        localStorage.setItem('eventCart', JSON.stringify(eventCartItems));
        localStorage.setItem('chicasEventos_cart', JSON.stringify(chicasCartItems));
    }

    bindEvents() {
        // Botão finalizar orçamento
        const finalizeBtn = document.querySelector('.finalizar-or-amento');
        if (finalizeBtn) {
            finalizeBtn.addEventListener('click', () => {
                this.finalizeOrder();
            });
        }

        // Botão selecionar mais itens
        const selectMoreBtn = document.querySelector('.selecionar-mais-itens');
        if (selectMoreBtn) {
            selectMoreBtn.addEventListener('click', () => {
                window.location.href = '../../index.html';
            });
        }
    }

    finalizeOrder() {
        if (this.cartItems.length === 0) {
            alert('Seu carrinho está vazio. Adicione alguns serviços primeiro.');
            return;
        }

        // Aqui você pode implementar a lógica para finalizar o pedido
        // Por exemplo, enviar para um servidor ou abrir um formulário
        
        const orderData = {
            items: this.cartItems,
            total: this.calculateTotal(),
            timestamp: new Date().toISOString()
        };

        console.log('Finalizando pedido:', orderData);
        
        // Simular envio do pedido
        alert('Pedido enviado com sucesso! Nossa equipe entrará em contato em até 24h.');
        
        // Limpar carrinho após finalizar
        this.cartItems = [];
        this.saveCartItems();
        this.renderCartItems();
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    window.cartManager = new CartManager();
});
