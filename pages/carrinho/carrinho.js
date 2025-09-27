// Dados do carrinho (simulando localStorage)
let carrinho = JSON.parse(localStorage.getItem('chicas_carrinho') || '[]');

// Itens disponíveis para teste
const itensDisponiveis = [
    {
        id: 1,
        nome: 'Buffet Corporativo Premium',
        descricao: 'Coffee break completo para 50 pessoas',
        preco: 25.00,
        imagem: '🍽️',
        categoria: 'buffet'
    },
    {
        id: 2,
        nome: 'Captação Audiovisual',
        descricao: 'Foto e vídeo profissional do evento',
        preco: 150.00,
        imagem: '📸',
        categoria: 'audiovisual'
    },
    {
        id: 3,
        nome: 'Equipe de RH',
        descricao: 'Recepção e controle de acesso',
        preco: 80.00,
        imagem: '👥',
        categoria: 'rh'
    },
    {
        id: 4,
        nome: 'Organização Cerimonial',
        descricao: 'Planejamento completo do evento',
        preco: 200.00,
        imagem: '🎯',
        categoria: 'cerimonial'
    }
];

// Função para renderizar o carrinho
function renderizarCarrinho() {
    const container = document.getElementById('itens-carrinho');
    
    if (carrinho.length === 0) {
        container.innerHTML = `
            <div class="carrinho-vazio">
                <h3>Seu carrinho está vazio</h3>
                <p>Adicione alguns serviços para começar</p>
                <a href="../../index.html" class="btn-continuar-comprando">
                    Continuar Comprando
                </a>
                </div>
            `;
        document.getElementById('btn-checkout').disabled = true;
            return;
        }

    let html = '';
    carrinho.forEach((item, index) => {
        const itemData = itensDisponiveis.find(i => i.id === item.id);
        if (itemData) {
            html += `
                <div class="item-carrinho">
                    <div class="item-imagem">${itemData.imagem}</div>
                    <div class="item-info">
                        <div class="item-nome">${itemData.nome}</div>
                        <div class="item-descricao">${itemData.descricao}</div>
                        <div class="item-controles">
                            <div class="quantidade-controle">
                                <button class="btn-quantidade" onclick="alterarQuantidade(${index}, -1)">-</button>
                                <input type="number" class="quantidade-input" value="${item.quantidade}" 
                                       min="1" max="10" onchange="atualizarQuantidade(${index}, this.value)">
                                <button class="btn-quantidade" onclick="alterarQuantidade(${index}, 1)">+</button>
                            </div>
                            <button class="btn-remover" onclick="removerItem(${index})">Remover</button>
                        </div>
                    </div>
                    <div class="item-preco">R$ ${(itemData.preco * item.quantidade).toFixed(2)}</div>
                </div>
            `;
        }
    });
    
    container.innerHTML = html;
    atualizarResumo();
    document.getElementById('btn-checkout').disabled = false;
}

// Função para alterar quantidade
function alterarQuantidade(index, delta) {
    carrinho[index].quantidade = Math.max(1, Math.min(10, carrinho[index].quantidade + delta));
    salvarCarrinho();
    renderizarCarrinho();
}

// Função para atualizar quantidade via input
function atualizarQuantidade(index, valor) {
    const quantidade = Math.max(1, Math.min(10, parseInt(valor) || 1));
    carrinho[index].quantidade = quantidade;
    salvarCarrinho();
    renderizarCarrinho();
}

// Função para remover item
function removerItem(index) {
    carrinho.splice(index, 1);
    salvarCarrinho();
    renderizarCarrinho();
}

// Função para atualizar resumo
function atualizarResumo() {
    let subtotal = 0;
    
    carrinho.forEach(item => {
        const itemData = itensDisponiveis.find(i => i.id === item.id);
        if (itemData) {
            subtotal += itemData.preco * item.quantidade;
        }
    });
    
    const taxaServico = subtotal * 0.1; // 10% de taxa de serviço
    const total = subtotal + taxaServico;
    
    document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
    document.getElementById('taxa-servico').textContent = `R$ ${taxaServico.toFixed(2)}`;
    document.getElementById('total').textContent = `R$ ${total.toFixed(2)}`;
}

// Função para salvar carrinho
function salvarCarrinho() {
    localStorage.setItem('chicas_carrinho', JSON.stringify(carrinho));
}

// Função para adicionar item de teste
function adicionarItemTeste() {
    if (carrinho.length === 0) {
        // Adiciona alguns itens de exemplo
        carrinho.push(
            { id: 1, quantidade: 1 },
            { id: 2, quantidade: 1 }
        );
        salvarCarrinho();
        renderizarCarrinho();
    }
}

// Função para mostrar erro
function showError(message) {
    const checkoutContent = document.getElementById('checkoutContent');
    checkoutContent.innerHTML = `
        <div class="error">
            <strong>Erro:</strong> ${message}
        </div>
        <button onclick="closeCheckoutModal()" class="btn-checkout" style="width: 100%;">
            Fechar
        </button>
    `;
}

// Função para fechar modal
function closeCheckoutModal() {
    document.getElementById('checkoutModal').style.display = 'none';
}

// Função para abrir checkout do Mercado Pago
function openMercadoPagoCheckout(preferenceId, checkoutUrl) {
    const checkoutContent = document.getElementById('checkoutContent');
    checkoutContent.innerHTML = `
        <div class="success">
            <strong>Redirecionando para o Mercado Pago...</strong>
            <p>Você será redirecionado para finalizar o pagamento.</p>
        </div>
    `;
    
    setTimeout(() => {
        window.open(checkoutUrl, '_blank');
        closeCheckoutModal();
    }, 1500);
}

// Função para criar checkout
async function criarCheckout() {
    try {
        const btnCheckout = document.getElementById('btn-checkout');
        btnCheckout.disabled = true;
        btnCheckout.textContent = 'Processando...';
        
        // Mostra o modal
        document.getElementById('checkoutModal').style.display = 'block';
        
        // Prepara dados do carrinho
        const itens = carrinho.map(item => {
            const itemData = itensDisponiveis.find(i => i.id === item.id);
            return {
                id: itemData.id,
                title: itemData.nome,
                description: itemData.descricao,
                quantity: item.quantidade,
                unit_price: itemData.preco
            };
        });
        
        // Calcula total
        let subtotal = 0;
        carrinho.forEach(item => {
            const itemData = itensDisponiveis.find(i => i.id === item.id);
            if (itemData) {
                subtotal += itemData.preco * item.quantidade;
            }
        });
        const taxaServico = subtotal * 0.1;
        const total = subtotal + taxaServico;
        
        // Faz a requisição para criar a preferência
        const response = await fetch('../../endpoint.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                product_name: `Evento Chicas - ${carrinho.length} serviço(s)`,
                product_description: `Serviços: ${itens.map(i => i.title).join(', ')}`,
                product_price: total,
                product_currency: 'BRL',
                quantity: 1
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            const checkoutUrl = data.sandbox_init_point || data.checkout_url;
            openMercadoPagoCheckout(data.preference_id, checkoutUrl);
        } else {
            showError(data.error || 'Erro ao criar checkout');
            }

        } catch (error) {
        console.error('Erro:', error);
        showError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
        const btnCheckout = document.getElementById('btn-checkout');
        btnCheckout.disabled = false;
        btnCheckout.textContent = '💳 Finalizar Pagamento';
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se há sessão ativa (código do navbar)
    const sessionData = localStorage.getItem('chicasEventos_session');
    if (sessionData) {
        try {
            const session = JSON.parse(sessionData);
            const now = new Date().getTime();
            const sessionTimeout = 24 * 60 * 60 * 1000;
            
            if (now - session.timestamp < sessionTimeout && session.user) {
                const loginBtn = document.getElementById('login-btn');
                const userMenu = document.getElementById('user-menu');
                const userName = document.getElementById('user-name');
                
                if (loginBtn) loginBtn.style.display = 'none';
                if (userMenu) userMenu.style.display = 'block';
                if (userName) userName.textContent = session.user.nome.toUpperCase();
            } else {
                localStorage.removeItem('chicasEventos_session');
            }
        } catch (error) {
            localStorage.removeItem('chicasEventos_session');
        }
    }
    
    // Configurar dropdown
    const userBtn = document.getElementById('user-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const dropdown = document.getElementById('dropdown-menu');
    
    if (userBtn) {
        userBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (dropdown) {
                dropdown.classList.toggle('show');
            }
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('chicasEventos_session');
            const loginBtn = document.getElementById('login-btn');
            const userMenu = document.getElementById('user-menu');
            if (loginBtn) loginBtn.style.display = 'block';
            if (userMenu) userMenu.style.display = 'none';
            if (dropdown) dropdown.classList.remove('show');
        });
    }
    
    // Fechar dropdown ao clicar fora
    document.addEventListener('click', function(e) {
        const userMenu = document.getElementById('user-menu');
        if (userMenu && dropdown && !userMenu.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
    
    // Botão de login
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            window.location.href = '../login/login.html';
        });
    }
    
    // Renderizar carrinho
    renderizarCarrinho();
    
    // Adicionar itens de teste se carrinho estiver vazio
    if (carrinho.length === 0) {
        adicionarItemTeste();
    }
    
    // Event listener para checkout
    document.getElementById('btn-checkout').addEventListener('click', criarCheckout);
    
    // Event listeners do modal
    document.querySelector('.checkout-close').addEventListener('click', closeCheckoutModal);
    
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('checkoutModal');
        if (event.target === modal) {
            closeCheckoutModal();
        }
    });
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeCheckoutModal();
        }
    });
});