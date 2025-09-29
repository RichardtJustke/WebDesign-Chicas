/**
 * Sistema de Carrinho Moderno - Chicas Eventos
 * Gerenciamento completo do carrinho de compras
 */

class ModernCartManager {
    constructor() {
        this.cartItems = [];
        this.discountCode = '';
        this.discountAmount = 0;
        this.discountPercentage = 0;
        this.isLoading = false;
        
        this.init();
    }

    async init() {
        try {
            this.showLoading();
            await this.loadCartData();
            this.renderCart();
            this.bindEvents();
            this.hideLoading();
        } catch (error) {
            console.error('Erro ao inicializar carrinho:', error);
            this.showError('Erro ao carregar carrinho. Tente novamente.');
        }
    }

    showLoading() {
        const cartItems = document.getElementById('cart-items');
        if (cartItems) {
            cartItems.innerHTML = '<div class="loading">Carregando...</div>';
        }
    }

    hideLoading() {
        const loading = document.querySelector('.loading');
        if (loading) {
            loading.remove();
        }
    }

    showError(message) {
        const cartItems = document.getElementById('cart-items');
        if (cartItems) {
            cartItems.innerHTML = `
                <div class="error-message">
                    <strong>Erro:</strong> ${message}
                    <button onclick="location.reload()" class="btn-primary" style="margin-top: 1rem;">
                        Recarregar Página
                    </button>
                </div>
            `;
        }
    }

    async loadCartData() {
        try {
            // Carregar itens do localStorage
            const eventCart = JSON.parse(localStorage.getItem('eventCart') || '[]');
            const chicasCart = JSON.parse(localStorage.getItem('chicasEventos_cart') || '[]');
            
            // Combinar carrinhos
            this.cartItems = [...eventCart, ...chicasCart];
            
            // Carregar desconto
            this.discountCode = localStorage.getItem('cartDiscountCode') || '';
            this.discountAmount = parseFloat(localStorage.getItem('cartDiscountAmount') || '0');
            this.discountPercentage = parseFloat(localStorage.getItem('cartDiscountPercentage') || '0');
            
            // Se não há itens, adicionar itens de exemplo
            if (this.cartItems.length === 0) {
                this.addSampleItems();
            }
            
            console.log('Carrinho carregado:', this.cartItems);
        } catch (error) {
            console.error('Erro ao carregar dados do carrinho:', error);
            throw error;
        }
    }

    addSampleItems() {
        const sampleItems = [
            {
                id: 'buffet-premium',
                title: 'Buffet Premium',
                description: 'Menu completo com entrada, prato principal e sobremesa para até 100 pessoas',
                price: 150.00,
                quantity: 1,
                type: 'package',
                category: 'Buffet',
                image: '../../assets/img g/logo/icone.png',
                features: ['Cardápio personalizado', 'Equipe de cozinha', 'Decoração de mesa']
            },
            {
                id: 'audiovisual-basic',
                title: 'Captação Audiovisual Básica',
                description: 'Fotografia e filmagem profissional do evento com entrega digital',
                price: 300.00,
                quantity: 1,
                type: 'service',
                category: 'Audiovisual',
                image: '../../assets/img g/logo/icone.png',
                features: ['Fotógrafo profissional', 'Filmagem HD', 'Entrega em 7 dias']
            },
            {
                id: 'rh-staff',
                title: 'Equipe de Recepção',
                description: 'Recepção e apoio durante o evento com equipe treinada',
                price: 200.00,
                quantity: 2,
                type: 'service',
                category: 'Recursos Humanos',
                image: '../../assets/img g/logo/icone.png',
                features: ['Recepção personalizada', 'Controle de acesso', 'Suporte durante evento']
            }
        ];

        this.cartItems = sampleItems;
        this.saveCartData();
    }

    renderCart() {
        this.renderCartItems();
        this.renderOrderSummary();
        this.updateItemCount();
    }

    renderCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        const emptyCart = document.getElementById('empty-cart');
        
        if (!cartItemsContainer) return;

        if (this.cartItems.length === 0) {
            cartItemsContainer.style.display = 'none';
            if (emptyCart) emptyCart.style.display = 'block';
            return;
        }

        if (emptyCart) emptyCart.style.display = 'none';
        cartItemsContainer.style.display = 'block';

        cartItemsContainer.innerHTML = this.cartItems.map((item, index) => 
            this.createCartItemHTML(item, index)
        ).join('');
    }

    createCartItemHTML(item, index) {
        const itemInfo = this.getItemInfo(item);
        
        return `
            <div class="cart-item" data-index="${index}">
                <div class="item-image">
                    <img src="${itemInfo.image}" alt="${itemInfo.title}" 
                         onerror="this.src='../../assets/img g/logo/icone.png'">
                </div>
                <div class="item-details">
                    <div class="item-title">${itemInfo.title}</div>
                    <div class="item-description">${itemInfo.description}</div>
                    <div class="item-meta">
                        <span class="item-type">${itemInfo.category}</span>
                        ${item.quantity > 1 ? `<span class="item-quantity">Qtd: ${item.quantity}</span>` : ''}
                    </div>
                </div>
                <div class="item-actions">
                    <div class="item-price">${itemInfo.priceDisplay}</div>
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="cartManager.updateQuantity(${index}, -1)" 
                                ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn" onclick="cartManager.updateQuantity(${index}, 1)">+</button>
                    </div>
                    <button class="btn-remove" onclick="cartManager.removeItem(${index})">
                        Remover
                    </button>
                </div>
            </div>
        `;
    }

    renderOrderSummary() {
        this.updateTotals();
        this.updateDiscountStatus();
    }

    updateItemCount() {
        const itemCount = document.getElementById('item-count');
        if (itemCount) {
            const totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
            itemCount.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`;
        }
    }

    updateTotals() {
        const subtotal = this.calculateSubtotal();
        const total = subtotal - this.discountAmount;
        
        const subtotalEl = document.getElementById('subtotal');
        const discountEl = document.getElementById('discount');
        const totalEl = document.getElementById('total');
        
        if (subtotalEl) {
            subtotalEl.textContent = this.formatCurrency(subtotal);
        }
        
        if (discountEl) {
            if (this.discountAmount > 0) {
                discountEl.textContent = `- ${this.formatCurrency(this.discountAmount)}`;
                discountEl.style.display = 'block';
            } else {
                discountEl.style.display = 'none';
            }
        }
        
        if (totalEl) {
            totalEl.textContent = this.formatCurrency(total);
        }
    }

    updateDiscountStatus() {
        const statusEl = document.getElementById('discount-status');
        if (!statusEl) return;

        if (this.discountCode) {
            statusEl.innerHTML = `
                <span class="discount-status success">
                    ✓ Desconto aplicado: ${this.discountCode}
                </span>
            `;
        } else {
            statusEl.innerHTML = '';
        }
    }

    getItemInfo(item) {
        return {
            title: item.title || 'Item do Carrinho',
            description: item.description || 'Descrição do serviço',
            price: item.price || 0,
            priceDisplay: this.formatCurrency(item.price || 0),
            image: item.image || '../../assets/img g/logo/icone.png',
            category: this.getCategoryName(item.type || 'service')
        };
    }

    getCategoryName(type) {
        const categories = {
            'package': 'Pacote',
            'service': 'Serviço',
            'audiovisual': 'Audiovisual',
            'rh': 'Recursos Humanos',
            'ceremonial': 'Cerimonial',
            'buffet': 'Buffet'
        };
        return categories[type] || 'Serviço';
    }

    calculateSubtotal() {
        return this.cartItems.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    updateQuantity(index, change) {
        if (index < 0 || index >= this.cartItems.length) return;
        
        const item = this.cartItems[index];
        const newQuantity = Math.max(1, item.quantity + change);
        
        if (newQuantity !== item.quantity) {
            item.quantity = newQuantity;
            this.saveCartData();
            this.renderCart();
            this.showSuccessMessage('Quantidade atualizada!');
        }
    }

    removeItem(index) {
        if (index < 0 || index >= this.cartItems.length) return;
        
        const item = this.cartItems[index];
        
        if (confirm(`Tem certeza que deseja remover "${item.title}" do carrinho?`)) {
            this.cartItems.splice(index, 1);
            this.saveCartData();
            this.renderCart();
            this.showSuccessMessage('Item removido do carrinho!');
        }
    }

    applyDiscount() {
        const discountInput = document.getElementById('discount-code');
        if (!discountInput) return;

        const code = discountInput.value.trim().toUpperCase();
        
        if (!code) {
            this.showErrorMessage('Por favor, digite um código de desconto.');
            return;
        }

        // Códigos de desconto válidos
        const validCodes = {
            'CHICAS10': { type: 'percentage', value: 10, description: '10% de desconto' },
            'CHICAS20': { type: 'percentage', value: 20, description: '20% de desconto' },
            'PRIMEIRA': { type: 'percentage', value: 15, description: '15% de desconto para primeira compra' },
            'FIDELIDADE': { type: 'percentage', value: 25, description: '25% de desconto para clientes fiéis' },
            'DESCONTO50': { type: 'fixed', value: 50, description: 'R$ 50,00 de desconto' },
            'BEMVINDO': { type: 'percentage', value: 5, description: '5% de desconto de boas-vindas' }
        };

        const discount = validCodes[code];
        
        if (discount) {
            const subtotal = this.calculateSubtotal();
            let discountAmount = 0;
            
            if (discount.type === 'percentage') {
                discountAmount = (subtotal * discount.value) / 100;
                this.discountPercentage = discount.value;
            } else if (discount.type === 'fixed') {
                discountAmount = Math.min(discount.value, subtotal);
                this.discountPercentage = 0;
            }
            
            this.discountCode = code;
            this.discountAmount = discountAmount;
            
            this.saveCartData();
            this.renderOrderSummary();
            
            // Feedback visual
            discountInput.style.borderColor = '#38a169';
            discountInput.value = '';
            
            this.showSuccessMessage(`Desconto aplicado! ${discount.description}`);
        } else {
            this.showErrorMessage('Código de desconto inválido. Tente: CHICAS10, CHICAS20, PRIMEIRA, FIDELIDADE, DESCONTO50 ou BEMVINDO');
            discountInput.style.borderColor = '#e53e3e';
        }
    }

    async checkout() {
        if (this.cartItems.length === 0) {
            this.showErrorMessage('Seu carrinho está vazio. Adicione alguns serviços primeiro.');
            return;
        }

        try {
            this.isLoading = true;
            this.showLoading();
            
            // Criar resumo do pedido
            const orderSummary = this.createOrderSummary();
            
            // Salvar no localStorage
            localStorage.setItem('orderSummary', JSON.stringify(orderSummary));
            
            // Simular processamento
            await this.simulateCheckout();
            
            // Mostrar confirmação
            this.showOrderConfirmation(orderSummary);
            
        } catch (error) {
            console.error('Erro no checkout:', error);
            this.showErrorMessage('Erro ao processar pedido. Tente novamente.');
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    }

    async simulateCheckout() {
        // Simular delay de processamento
        return new Promise(resolve => {
            setTimeout(resolve, 2000);
        });
    }

    createOrderSummary() {
        const subtotal = this.calculateSubtotal();
        const total = subtotal - this.discountAmount;
        
        return {
            items: this.cartItems.map(item => ({
                id: item.id,
                title: item.title,
                description: item.description,
                quantity: item.quantity,
                price: item.price,
                total: item.price * item.quantity,
                category: item.category
            })),
            subtotal: subtotal,
            discount: this.discountAmount,
            discountCode: this.discountCode,
            discountPercentage: this.discountPercentage,
            total: total,
            timestamp: new Date().toISOString(),
            orderId: this.generateOrderId()
        };
    }

    generateOrderId() {
        return 'CHICAS-' + Date.now().toString(36).toUpperCase();
    }

    showOrderConfirmation(orderSummary) {
        const modal = this.createModal(`
            <div style="text-align: center;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
                <h2 style="color: #38a169; margin-bottom: 1rem;">Orçamento Enviado com Sucesso!</h2>
                <p style="margin-bottom: 2rem; color: #4a5568;">
                    Seu orçamento foi enviado com sucesso. Nossa equipe entrará em contato em até 24 horas.
                </p>
                <div style="background: #f7fafc; padding: 1.5rem; border-radius: 0.75rem; margin: 1.5rem 0; text-align: left;">
                    <h3 style="margin-bottom: 1rem; color: #2d3748;">Resumo do Pedido:</h3>
                    <div style="margin-bottom: 1rem;">
                        <strong>ID do Pedido:</strong> ${orderSummary.orderId}
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <strong>Total:</strong> ${this.formatCurrency(orderSummary.total)}
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <strong>Itens:</strong> ${orderSummary.items.length}
                    </div>
                    ${orderSummary.discountCode ? `
                        <div style="color: #38a169;">
                            <strong>Desconto aplicado:</strong> ${orderSummary.discountCode}
                        </div>
                    ` : ''}
                </div>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button onclick="this.closest('.modal').remove(); cartManager.clearCart();" 
                            style="background: #38a169; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 0.5rem; cursor: pointer;">
                        Finalizar
                    </button>
                    <button onclick="this.closest('.modal').remove();" 
                            style="background: #e2e8f0; color: #4a5568; padding: 0.75rem 1.5rem; border: none; border-radius: 0.5rem; cursor: pointer;">
                        Fechar
                    </button>
                </div>
            </div>
        `);
        
        document.body.appendChild(modal);
    }

    createModal(content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease-out;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease-out;
        `;
        
        modalContent.innerHTML = content;
        modal.appendChild(modalContent);
        
        // Fechar modal ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        return modal;
    }

    clearCart() {
        this.cartItems = [];
        this.discountCode = '';
        this.discountAmount = 0;
        this.discountPercentage = 0;
        this.saveCartData();
        this.renderCart();
        this.showSuccessMessage('Carrinho limpo com sucesso!');
    }

    saveCartData() {
        try {
            // Separar itens por tipo
            const eventCartItems = this.cartItems.filter(item => item.type === 'package');
            const chicasCartItems = this.cartItems.filter(item => item.type !== 'package');
            
            localStorage.setItem('eventCart', JSON.stringify(eventCartItems));
            localStorage.setItem('chicasEventos_cart', JSON.stringify(chicasCartItems));
            localStorage.setItem('cartDiscountCode', this.discountCode);
            localStorage.setItem('cartDiscountAmount', this.discountAmount.toString());
            localStorage.setItem('cartDiscountPercentage', this.discountPercentage.toString());
        } catch (error) {
            console.error('Erro ao salvar carrinho:', error);
        }
    }

    bindEvents() {
        // Botão aplicar desconto
        const applyDiscountBtn = document.getElementById('apply-discount');
        if (applyDiscountBtn) {
            applyDiscountBtn.addEventListener('click', () => this.applyDiscount());
        }

        // Botão checkout
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.checkout());
        }

        // Botão continuar comprando
        const continueShoppingBtn = document.getElementById('continue-shopping');
        if (continueShoppingBtn) {
            continueShoppingBtn.addEventListener('click', () => {
                window.location.href = '../../index.html';
            });
        }

        // Botão adicionar ao evento
        const addToEventBtn = document.getElementById('add-to-event');
        if (addToEventBtn) {
            addToEventBtn.addEventListener('click', () => {
                this.addToEvent();
            });
        }

        // Enter no campo de desconto
        const discountInput = document.getElementById('discount-code');
        if (discountInput) {
            discountInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.applyDiscount();
                }
            });
        }

        // Cards de recomendação
        const recommendationCards = document.querySelectorAll('.recommendation-card');
        recommendationCards.forEach(card => {
            card.addEventListener('click', () => {
                const service = card.dataset.service;
                this.handleRecommendationClick(service);
            });
        });
    }

    handleRecommendationClick(service) {
        const serviceNames = {
            'audiovisual': 'Captação Audiovisual',
            'rh': 'Recursos Humanos',
            'ceremonial': 'Organização Cerimonial'
        };
        
        const serviceName = serviceNames[service] || 'Serviço';
        this.showSuccessMessage(`Redirecionando para ${serviceName}...`);
        
        // Aqui você pode redirecionar para a página específica do serviço
        setTimeout(() => {
            window.location.href = `../serviços/${service}/${service}.html`;
        }, 1000);
    }

    showSuccessMessage(message) {
        this.showToast(message, 'success');
    }

    showErrorMessage(message) {
        this.showToast(message, 'error');
    }

    addToEvent() {
        if (this.cartItems.length === 0) {
            this.showErrorMessage('Seu carrinho está vazio. Adicione alguns serviços primeiro.');
            return;
        }

        // Verificar se há sessão ativa
        const sessionData = localStorage.getItem('chicasEventos_session');
        if (!sessionData) {
            this.showErrorMessage('Você precisa estar logado para adicionar itens ao evento. Faça login primeiro.');
            return;
        }

        try {
            // Salvar itens do carrinho para o evento
            const eventData = {
                items: this.cartItems,
                timestamp: new Date().toISOString(),
                total: this.calculateSubtotal(),
                discount: this.discountAmount,
                discountCode: this.discountCode
            };

            // Salvar no localStorage
            localStorage.setItem('eventItems', JSON.stringify(eventData));
            
            this.showSuccessMessage('Itens adicionados ao evento com sucesso!');
            
            // Opcional: redirecionar para dashboard
            setTimeout(() => {
                if (confirm('Deseja ir para seus eventos para gerenciar os itens adicionados?')) {
                    window.location.href = '../dashboard/dashboard.html';
                }
            }, 1500);
            
        } catch (error) {
            console.error('Erro ao adicionar ao evento:', error);
            this.showErrorMessage('Erro ao adicionar itens ao evento. Tente novamente.');
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            color: white;
            font-weight: 500;
            z-index: 10001;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
        `;
        
        if (type === 'success') {
            toast.style.background = '#38a169';
        } else if (type === 'error') {
            toast.style.background = '#e53e3e';
        } else {
            toast.style.background = '#667eea';
        }
        
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    window.cartManager = new ModernCartManager();
    
    // Sistema de alternância de botões de login (igual ao index)
    const loginBtn = document.getElementById('login-btn');
    const userBtn = document.getElementById('user-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Verificar se usuário está logado
    function checkUserStatus() {
        const sessionData = localStorage.getItem('chicasEventos_session');
        
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                const now = new Date().getTime();
                const sessionTimeout = 24 * 60 * 60 * 1000; // 24 horas
                
                if (now - session.timestamp < sessionTimeout) {
                    // Usuário logado
                    showUserButton(session.user);
                    return true;
                } else {
                    // Sessão expirada
                    localStorage.removeItem('chicasEventos_session');
                    showLoginButton();
                    return false;
                }
            } catch (error) {
                console.error('Erro ao verificar sessão:', error);
                showLoginButton();
                return false;
            }
        } else {
            // Nenhuma sessão
            showLoginButton();
            return false;
        }
    }
    
    // Mostrar botão de login
    function showLoginButton() {
        if (loginBtn) {
            loginBtn.style.display = 'block';
            loginBtn.classList.remove('hidden');
        }
        if (userBtn) {
            userBtn.style.display = 'none';
            userBtn.classList.add('hidden');
        }
    }
    
    // Mostrar botão do usuário
    function showUserButton(user) {
        if (loginBtn) {
            loginBtn.style.display = 'none';
            loginBtn.classList.add('hidden');
        }
        if (userBtn) {
            userBtn.style.display = 'block';
            userBtn.classList.remove('hidden');
            
            // Aplicar nome do usuário
            if (user && user.nome) {
                const userNameElement = document.getElementById('user-name');
                if (userNameElement) {
                    userNameElement.textContent = user.nome.toUpperCase();
                }
            }
        }
    }
    
    // Toggle dropdown do usuário
    if (userBtn) {
        userBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });
    }
    
    // Fechar dropdown ao clicar fora
    document.addEventListener('click', function(e) {
        if (!userBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove('show');
        }
    });
    
    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (confirm('Tem certeza que deseja sair da sua conta?')) {
                // Remover sessão
                localStorage.removeItem('chicasEventos_session');
                
                // Mostrar botão de login
                showLoginButton();
                
                // Fechar dropdown
                dropdownMenu.classList.remove('show');
            }
        });
    }
    
    // Configurar evento de clique no botão de login
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Redirecionar para página de login
            window.location.href = '../login/login.html';
        });
    }
    
    // Verificar status inicial
    checkUserStatus();
    
    // Verificar mudanças na sessão
    window.addEventListener('storage', function(e) {
        if (e.key === 'chicasEventos_session') {
            checkUserStatus();
        }
    });
});

// Adicionar estilos para animações
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
    }
`;
document.head.appendChild(style);