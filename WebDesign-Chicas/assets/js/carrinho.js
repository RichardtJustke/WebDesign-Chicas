// ====== SISTEMA DE CARRINHO UNIFICADO COM ISOLAMENTO POR USUÁRIO ======

class CarrinhoManager {
  constructor() {
    this.userId = this.getCurrentUserId();
    this.deviceId = this.getOrCreateDeviceId();
    this.carrinho = this.carregarCarrinho();
    this.init();
  }

  init() {
    this.atualizarContadorCarrinho();
    this.setupEventListeners();
    this.setupUserChangeListener();
  }

  /**
   * Obtém o ID único do usuário atual
   * Se logado: usa userId do sistema de auth
   * Se guest: usa deviceId único
   */
  getCurrentUserId() {
    // Verificar se há usuário logado
    const userData = localStorage.getItem('chicas_current_user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        // Normalizar email como userId (lowercase + trim)
        return user.email ? user.email.toLowerCase().trim() : null;
      } catch (error) {
        console.error('Erro ao parsear dados do usuário:', error);
        return null;
      }
    }
    
    // Se não há usuário logado, usar deviceId para guest
    return `guest:${this.getOrCreateDeviceId()}`;
  }

  /**
   * Gera ou recupera um ID único para o dispositivo (para usuários guest)
   */
  getOrCreateDeviceId() {
    let deviceId = localStorage.getItem('chicas_device_id');
    if (!deviceId) {
      // Gerar ID único baseado em timestamp + random
      deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('chicas_device_id', deviceId);
    }
    return deviceId;
  }

  /**
   * Obtém a chave de storage baseada no tipo de usuário
   */
  getStorageKey() {
    if (this.userId && !this.userId.startsWith('guest:')) {
      return `cart:${this.userId}`;
    } else {
      return `cart:guest:${this.deviceId}`;
    }
  }

  /**
   * Carrega carrinho do localStorage com namespacing por usuário
   */
  carregarCarrinho() {
    try {
      const storageKey = this.getStorageKey();
      const carrinhoSalvo = localStorage.getItem(storageKey);
      return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      return [];
    }
  }

  /**
   * Salva carrinho no localStorage com namespacing por usuário
   */
  salvarCarrinho() {
    try {
      const storageKey = this.getStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(this.carrinho));
      this.atualizarContadorCarrinho();
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error);
    }
  }

  /**
   * Migra carrinho de guest para usuário logado
   * Estratégia: merge somando quantidades de itens idênticos
   */
  migrarCarrinhoGuestParaUsuario(userId) {
    const guestKey = `cart:guest:${this.deviceId}`;
    const userKey = `cart:${userId}`;
    
    try {
      // Carregar carrinho guest
      const guestCarrinho = localStorage.getItem(guestKey);
      if (!guestCarrinho) return;
      
      const guestItems = JSON.parse(guestCarrinho);
      
      // Carregar carrinho do usuário (se existir)
      const userCarrinho = localStorage.getItem(userKey);
      const userItems = userCarrinho ? JSON.parse(userCarrinho) : [];
      
      // Merge dos carrinhos
      guestItems.forEach(guestItem => {
        const itemExistente = userItems.find(userItem => 
          userItem.id === guestItem.id && 
          userItem.opcao === guestItem.opcao &&
          userItem.categoria === guestItem.categoria
        );
        
        if (itemExistente) {
          // Somar quantidades se item já existe
          itemExistente.quantidade += guestItem.quantidade;
        } else {
          // Adicionar novo item
          userItems.push(guestItem);
        }
      });
      
      // Salvar carrinho merged
      localStorage.setItem(userKey, JSON.stringify(userItems));
      
      // Limpar carrinho guest
      localStorage.removeItem(guestKey);
      
      console.log(`Carrinho migrado de guest para usuário ${userId}:`, userItems);
      
    } catch (error) {
      console.error('Erro ao migrar carrinho:', error);
    }
  }

  /**
   * Limpa carrinho guest após migração
   */
  limparCarrinhoGuest() {
    const guestKey = `cart:guest:${this.deviceId}`;
    localStorage.removeItem(guestKey);
  }

  /**
   * Atualiza userId quando há mudança de usuário
   */
  atualizarUserId() {
    const novoUserId = this.getCurrentUserId();
    
    if (novoUserId !== this.userId) {
      console.log(`Mudança de usuário detectada: ${this.userId} -> ${novoUserId}`);
      
      // Se estava como guest e agora é usuário logado, migrar carrinho
      if (this.userId && this.userId.startsWith('guest:') && 
          novoUserId && !novoUserId.startsWith('guest:')) {
        this.migrarCarrinhoGuestParaUsuario(novoUserId);
      }
      
      // Atualizar userId e recarregar carrinho
      this.userId = novoUserId;
      this.carrinho = this.carregarCarrinho();
      this.atualizarContadorCarrinho();
    }
  }

  // Adiciona item ao carrinho
  adicionarItem(item) {
    // Verifica se o item já existe no carrinho
    const itemExistente = this.carrinho.find(carrinhoItem => 
      carrinhoItem.id === item.id && 
      carrinhoItem.opcao === item.opcao
    );

    if (itemExistente) {
      // Se já existe, aumenta a quantidade
      itemExistente.quantidade += item.quantidade || 1;
    } else {
      // Se não existe, adiciona novo item
      const novoItem = {
        id: item.id || this.gerarId(),
        nome: item.nome,
        categoria: item.categoria,
        opcao: item.opcao || '',
        preco: item.preco,
        quantidade: item.quantidade || 1,
        imagem: item.imagem || this.getImagemPadrao(item.categoria),
        timestamp: Date.now()
      };
      this.carrinho.push(novoItem);
    }

    this.salvarCarrinho();
    this.mostrarNotificacao(`${item.nome} adicionado ao carrinho!`, 'success');
  }

  // Adiciona item ao carrinho com optimistic update
  async adicionarItemOptimistic(item) {
    try {
      // Backup do estado anterior para rollback se necessário
      const backupCarrinho = [...this.carrinho];
      
      // Optimistic update local
      this.adicionarItemLocal(item);
      
      // Sincronizar com servidor (se implementado futuramente)
      // const serverSuccess = await this.syncWithServer(item);
      
      // Por enquanto, sempre retorna sucesso para update local
      return true;
      
    } catch (error) {
      console.error('Erro no optimistic update:', error);
      // Rollback em caso de erro
      this.carrinho = backupCarrinho;
      this.salvarCarrinho();
      return false;
    }
  }

  // Adiciona item localmente sem notificação (para optimistic update)
  adicionarItemLocal(item) {
    // Verifica se o item já existe no carrinho
    const itemExistente = this.carrinho.find(carrinhoItem => 
      carrinhoItem.id === item.id && 
      carrinhoItem.opcao === item.opcao
    );

    if (itemExistente) {
      // Se já existe, aumenta a quantidade
      itemExistente.quantidade += item.quantidade || 1;
    } else {
      // Se não existe, adiciona novo item
      const novoItem = {
        id: item.id || this.gerarId(),
        nome: item.nome,
        categoria: item.categoria,
        opcao: item.opcao || '',
        preco: item.preco,
        quantidade: item.quantidade || 1,
        imagem: item.imagem || this.getImagemPadrao(item.categoria),
        timestamp: Date.now(),
        meta: item.meta || {}
      };
      this.carrinho.push(novoItem);
    }

    this.salvarCarrinho();
  }

  // Remove item do carrinho
  removerItem(itemId) {
    this.carrinho = this.carrinho.filter(item => item.id !== itemId);
    this.salvarCarrinho();
    this.mostrarNotificacao('Item removido do carrinho', 'info');
  }

  // Atualiza quantidade de um item
  atualizarQuantidade(itemId, novaQuantidade) {
    const item = this.carrinho.find(item => item.id === itemId);
    if (item) {
      if (novaQuantidade <= 0) {
        this.removerItem(itemId);
      } else {
        item.quantidade = novaQuantidade;
        this.salvarCarrinho();
      }
    }
  }

  // Limpa o carrinho
  limparCarrinho() {
    this.carrinho = [];
    this.salvarCarrinho();
    this.mostrarNotificacao('Carrinho limpo', 'info');
  }

  // Calcula total do carrinho
  calcularTotal() {
    return this.carrinho.reduce((total, item) => {
      return total + (item.preco * item.quantidade);
    }, 0);
  }

  // Conta total de itens no carrinho
  contarItens() {
    return this.carrinho.reduce((total, item) => total + item.quantidade, 0);
  }

  // Atualiza contador no header
  atualizarContadorCarrinho() {
    const totalItens = this.contarItens();
    
    // Atualiza badges do header novo
    this.atualizarBadgeHeader(totalItens);
    
    // Procura por contador existente no header antigo
    let contador = document.querySelector('.carrinho-contador');
    
    if (totalItens > 0) {
      if (!contador) {
        // Cria contador se não existir
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
          contador = document.createElement('div');
          contador.className = 'carrinho-contador';
          contador.innerHTML = `
            <a href="${this.getCarrinhoPath()}" class="carrinho-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              <span class="carrinho-badge">${totalItens > 99 ? '99+' : totalItens}</span>
            </a>
          `;
          navMenu.appendChild(contador);
        }
      } else {
        // Atualiza contador existente
        const badge = contador.querySelector('.carrinho-badge');
        if (badge) {
          badge.textContent = totalItens > 99 ? '99+' : totalItens;
        }
      }
    } else if (contador) {
      // Remove contador se carrinho estiver vazio
      contador.remove();
    }
  }

  // Atualiza badges do header novo
  atualizarBadgeHeader(totalItens) {
    const cartBadge = document.getElementById('cartBadge');
    const mobileCartBadge = document.getElementById('mobileCartBadge');
    const cartIcon = document.getElementById('cartIcon');
    const mobileCartIcon = document.getElementById('mobileCartIcon');
    
    // Atualiza badge desktop
    if (cartBadge) {
      if (totalItens === 0) {
        cartBadge.style.display = 'none';
        cartBadge.textContent = '0';
      } else {
        cartBadge.style.display = 'block';
        cartBadge.textContent = totalItens > 99 ? '99+' : totalItens;
      }
    }
    
    // Atualiza badge mobile
    if (mobileCartBadge) {
      if (totalItens === 0) {
        mobileCartBadge.style.display = 'none';
        mobileCartBadge.textContent = '0';
      } else {
        mobileCartBadge.style.display = 'block';
        mobileCartBadge.textContent = totalItens > 99 ? '99+' : totalItens;
      }
    }
    
    // Atualiza aria-label
    const labelText = totalItens === 0 ? 'Abrir carrinho (0 itens)' : 
                     totalItens > 99 ? 'Abrir carrinho (99+ itens)' : 
                     `Abrir carrinho (${totalItens} itens)`;
    
    if (cartIcon) {
      cartIcon.setAttribute('aria-label', labelText);
    }
    if (mobileCartIcon) {
      mobileCartIcon.setAttribute('aria-label', labelText);
    }
  }

  // Determina o caminho correto para a página do carrinho
  getCarrinhoPath() {
    const currentPath = window.location.pathname;
    
    // Se estiver na página principal (index.html)
    if (currentPath.endsWith('/') || currentPath.endsWith('/index.html') || currentPath.endsWith('/WebDesign-Chicas/')) {
      return 'pages/carrinho.html';
    }
    
    // Se estiver em uma página de serviço (pages/servicos/)
    if (currentPath.includes('/servicos/')) {
      return '../carrinho.html';
    }
    
    // Se estiver em outras páginas dentro de pages/
    if (currentPath.includes('/pages/')) {
      return 'carrinho.html';
    }
    
    // Fallback para página principal
    return 'pages/carrinho.html';
  }

  // Mostra notificação
  mostrarNotificacao(mensagem, tipo = 'success') {
    // Remove notificação existente se houver
    const notificacaoExistente = document.querySelector('.notificacao-carrinho');
    if (notificacaoExistente) {
      notificacaoExistente.remove();
    }

    // Cria nova notificação
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao-carrinho notificacao-${tipo}`;
    notificacao.innerHTML = `
      <div class="notificacao-conteudo">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="notificacao-icone">
          ${tipo === 'success' ? 
            '<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>' : 
            '<path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>'
          }
        </svg>
        <span>${mensagem}</span>
      </div>
    `;
    
    // Adiciona ao body
    document.body.appendChild(notificacao);
    
    // Mostra notificação
    setTimeout(() => {
      notificacao.classList.add('mostrar');
    }, 100);
    
    // Remove após 3 segundos
    setTimeout(() => {
      notificacao.classList.remove('mostrar');
      setTimeout(() => {
        if (notificacao.parentNode) {
          notificacao.parentNode.removeChild(notificacao);
        }
      }, 300);
    }, 3000);
  }

  // Gera ID único para itens
  gerarId() {
    return 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Retorna imagem padrão baseada na categoria
  getImagemPadrao(categoria) {
    const imagensPadrao = {
      'audiovisual': '../assets/public/img/aud/fotografo.jpg',
      'buffet': '../assets/public/img/buffet/buffet.jpg',
      'cerimonial': '../assets/public/img/org/ale.jpg',
      'rh': '../assets/public/img/rh/operacional.jpg'
    };
    return imagensPadrao[categoria] || '../assets/public/img/org/ale.jpg';
  }

  // Configura event listeners
  setupEventListeners() {
    // Escuta mudanças no localStorage de outras abas
    window.addEventListener('storage', (e) => {
      // Verificar mudanças em chaves de carrinho
      if (e.key && e.key.startsWith('cart:')) {
        // Verificar se é para o usuário atual
        const currentKey = this.getStorageKey();
        if (e.key === currentKey) {
          this.carrinho = this.carregarCarrinho();
          this.atualizarContadorCarrinho();
        }
      }
      
      // Verificar mudanças no usuário logado
      if (e.key === 'chicas_current_user') {
        this.atualizarUserId();
      }
    });
  }

  /**
   * Configura listener para mudanças de usuário
   */
  setupUserChangeListener() {
    // Verificar mudanças periódicas no estado do usuário
    setInterval(() => {
      this.atualizarUserId();
    }, 1000);
    
    // Listener para eventos customizados de mudança de usuário
    window.addEventListener('userChanged', () => {
      this.atualizarUserId();
    });
  }

  // Renderiza carrinho na página do carrinho
  renderizarCarrinho() {
    const carrinhoVazio = document.getElementById('carrinhoVazio');
    const carrinhoComItens = document.getElementById('carrinhoComItens');
    
    if (!carrinhoVazio || !carrinhoComItens) return;

    if (this.carrinho.length === 0) {
      carrinhoVazio.classList.remove('tw-hidden');
      carrinhoComItens.classList.add('tw-hidden');
    } else {
      carrinhoVazio.classList.add('tw-hidden');
      carrinhoComItens.classList.remove('tw-hidden');
      
      this.renderizarListaItens();
      this.renderizarResumo();
    }
  }

  // Renderiza lista de itens
  renderizarListaItens() {
    const container = document.querySelector('#carrinhoComItens .lg\\:tw-col-span-2 .tw-bg-white');
    if (!container) return;

    const listaItens = container.querySelector('.tw-space-y-6') || this.criarListaItens(container);
    listaItens.innerHTML = '';

    this.carrinho.forEach(item => {
      const itemElement = this.criarElementoItem(item);
      listaItens.appendChild(itemElement);
    });
  }

  // Cria container da lista de itens
  criarListaItens(container) {
    const listaItens = document.createElement('div');
    listaItens.className = 'tw-space-y-6';
    
    // Remove itens estáticos existentes
    const itensExistentes = container.querySelectorAll('.carrinho-item');
    itensExistentes.forEach(item => item.remove());
    
    container.appendChild(listaItens);
    return listaItens;
  }

  // Cria elemento de item do carrinho
  criarElementoItem(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'carrinho-item tw-border-b tw-border-slate-200 tw-pb-6 tw-mb-6 last:tw-border-b-0 last:tw-mb-0';
    itemDiv.innerHTML = `
      <div class="tw-flex tw-gap-4">
        <!-- Imagem do serviço -->
        <div class="tw-w-20 tw-h-20 tw-rounded-xl tw-overflow-hidden tw-flex-shrink-0">
          <img src="${item.imagem}" alt="${item.nome}" class="tw-w-full tw-h-full tw-object-cover">
        </div>
        
        <!-- Detalhes do item -->
        <div class="tw-flex-1">
          <h3 class="tw-font-bold tw-text-lg tw-text-slate-900 tw-mb-2">${item.nome}</h3>
          <p class="tw-text-slate-600 tw-text-sm tw-mb-3">${item.opcao}</p>
          
          <!-- Preço e quantidade -->
          <div class="tw-flex tw-items-center tw-justify-between">
            <div class="tw-flex tw-items-center tw-gap-3">
              <span class="tw-text-sm tw-text-slate-600">Quantidade:</span>
              <div class="tw-flex tw-items-center tw-border tw-border-slate-300 tw-rounded-lg">
                <button class="tw-px-3 tw-py-1 tw-text-slate-600 hover:tw-bg-slate-100" onclick="carrinhoManager.atualizarQuantidade('${item.id}', ${item.quantidade - 1})">-</button>
                <span class="tw-px-4 tw-py-1 tw-font-semibold">${item.quantidade}</span>
                <button class="tw-px-3 tw-py-1 tw-text-slate-600 hover:tw-bg-slate-100" onclick="carrinhoManager.atualizarQuantidade('${item.id}', ${item.quantidade + 1})">+</button>
              </div>
            </div>
            
            <div class="tw-text-right">
              <div class="tw-text-2xl tw-font-bold tw-text-emerald-600">R$ ${(item.preco * item.quantidade).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
              <button class="tw-text-sm tw-text-red-600 hover:tw-text-red-700 tw-mt-1" onclick="carrinhoManager.removerItem('${item.id}')">
                Remover item
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    return itemDiv;
  }

  // Renderiza resumo do pedido
  renderizarResumo() {
    const resumoContainer = document.querySelector('#carrinhoComItens .lg\\:tw-col-span-1 .tw-bg-white');
    if (!resumoContainer) return;

    const total = this.calcularTotal();
    
    // Atualiza itens no resumo
    const itensResumo = resumoContainer.querySelector('.tw-space-y-4');
    if (itensResumo) {
      itensResumo.innerHTML = '';
      this.carrinho.forEach(item => {
        const itemResumo = document.createElement('div');
        itemResumo.className = 'tw-flex tw-justify-between tw-text-sm';
        itemResumo.innerHTML = `
          <span class="tw-text-slate-600">${item.nome}</span>
          <span class="tw-font-semibold">R$ ${(item.preco * item.quantidade).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
        `;
        itensResumo.appendChild(itemResumo);
      });
    }

    // Atualiza total
    const totalElement = resumoContainer.querySelector('.tw-text-emerald-600:last-of-type');
    if (totalElement) {
      totalElement.textContent = `R$ ${total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    }

    // Atualiza subtotal
    const subtotalElement = resumoContainer.querySelector('.tw-flex.tw-justify-between.tw-text-sm:first-of-type span:last-child');
    if (subtotalElement) {
      subtotalElement.textContent = `R$ ${total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    }
  }

  // Método para abrir carrinho (mini-cart ou página)
  openCart() {
    // Por enquanto, navegar para página do carrinho
    const currentPath = window.location.pathname;
    let cartPath = 'pages/carrinho.html';
    
    // Ajustar caminho baseado na localização atual
    if (currentPath.includes('/servicos/')) {
      cartPath = '../carrinho.html';
    } else if (currentPath.includes('/pages/') && !currentPath.includes('/servicos/')) {
      cartPath = 'carrinho.html';
    } else if (currentPath.endsWith('/') || currentPath.endsWith('/index.html') || currentPath.endsWith('/WebDesign-Chicas/')) {
      cartPath = 'pages/carrinho.html';
    }
    
    console.log('Navegando para carrinho:', cartPath);
    window.location.href = cartPath;
  }
}

// ====== FUNÇÃO CENTRALIZADA ADDTOCART ======

/**
 * Função centralizada para adicionar itens ao carrinho
 * @param {Object} params - Parâmetros do item
 * @param {string} params.userId - ID do usuário (extraído da sessão)
 * @param {string} params.itemType - Tipo do item: "package" | "service"
 * @param {string} params.itemId - ID do item/pacote
 * @param {string} params.variantId - Variante (tier/duração)
 * @param {number} params.quantity - Quantidade
 * @param {Object} params.meta - Metadados extras (título, página, etc.)
 * @returns {Promise<boolean>} - Sucesso da operação
 */
async function addToCart({ userId, itemType, itemId, variantId, quantity = 1, meta = {} }) {
  // Guardas de segurança
  if (!userId) {
    console.warn('addToCart: userId é obrigatório');
    showToast('Faça login para adicionar itens ao carrinho', 'warning');
    return false;
  }

  if (!itemType || !itemId || !variantId) {
    console.error('addToCart: Parâmetros obrigatórios não fornecidos', { itemType, itemId, variantId });
    showToast('Erro: dados do item incompletos', 'error');
    return false;
  }

  try {
    // Desabilitar botões durante o processo
    const buttons = document.querySelectorAll('.js-add-to-cart');
    buttons.forEach(btn => {
      btn.disabled = true;
      btn.setAttribute('aria-busy', 'true');
    });

    // Optimistic update no store local
    const cartItem = createCartItem({ itemType, itemId, variantId, quantity, meta });
    const success = await carrinhoManager.adicionarItemOptimistic(cartItem);

    if (success) {
      // Feedback de sucesso
      showAddToCartFeedback(cartItem);
    } else {
      showToast('Não foi possível adicionar o item ao carrinho', 'error');
    }

    return success;

  } catch (error) {
    console.error('Erro ao adicionar ao carrinho:', error);
    showToast('Erro interno. Tente novamente.', 'error');
    return false;
  } finally {
    // Reabilitar botões
    const buttons = document.querySelectorAll('.js-add-to-cart');
    buttons.forEach(btn => {
      btn.disabled = false;
      btn.removeAttribute('aria-busy');
    });
  }
}

/**
 * Cria item do carrinho baseado nos parâmetros
 */
function createCartItem({ itemType, itemId, variantId, quantity, meta }) {
  const serviceKey = meta.serviceKey || getCurrentServiceKey();
  const serviceData = getServiceData(serviceKey);
  
  let cartItem = {
    id: `${serviceKey}-${itemId}-${variantId}-${Date.now()}`,
    categoria: serviceKey,
    quantidade: quantity,
    timestamp: Date.now()
  };

  if (itemType === 'package') {
    const packageData = serviceData?.packages?.find(pkg => pkg.id === itemId);
    if (packageData) {
      cartItem = {
        ...cartItem,
        nome: packageData.title,
        opcao: `${packageData.tierOrService} - ${variantId}`,
        preco: 0, // Preço será definido no orçamento
        imagem: getDefaultServiceImage(serviceKey),
        meta: {
          ...meta,
          packageId: itemId,
          tier: variantId,
          description: packageData.description,
          includes: packageData.includes
        }
      };
    }
  } else if (itemType === 'service') {
    const itemData = serviceData?.items?.find(item => item.id === itemId);
    if (itemData) {
      cartItem = {
        ...cartItem,
        nome: itemData.title,
        opcao: variantId, // Duração ou especificação
        preco: 0, // Preço será definido no orçamento
        imagem: itemData.images?.[0] || getDefaultServiceImage(serviceKey),
        meta: {
          ...meta,
          itemId: itemId,
          variant: variantId,
          description: itemData.description,
          offerings: itemData.offerings
        }
      };
    }
  }

  return cartItem;
}

/**
 * Feedback após adicionar ao carrinho
 */
function showAddToCartFeedback(cartItem) {
  // Verificar se existe mini-cart/drawer
  const miniCart = document.querySelector('.mini-cart, .cart-drawer, .cart-sidebar');
  
  if (miniCart) {
    // Abrir mini-cart automaticamente
    if (typeof window.openMiniCart === 'function') {
      window.openMiniCart();
    } else if (typeof window.carrinhoManager?.openMiniCart === 'function') {
      carrinhoManager.openMiniCart();
    } else {
      // Fallback: mostrar toast com link
      showToastWithLink(cartItem.nome);
    }
  } else {
    // Mostrar toast com link para carrinho
    showToastWithLink(cartItem.nome);
  }
}

/**
 * Toast com link para carrinho
 */
function showToastWithLink(itemName) {
  const toast = document.createElement('div');
  toast.className = 'add-to-cart-toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `
    <div class="toast-content">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="toast-icon">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <div class="toast-text">
        <strong>${itemName}</strong> adicionado ao carrinho
      </div>
    </div>
    <a href="${getCartPath()}" class="toast-link">
      Ver carrinho
    </a>
  `;

  // Adicionar ao DOM
  document.body.appendChild(toast);

  // Animar entrada
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Remover após 4 segundos
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 4000);
}

/**
 * Toast simples para mensagens
 */
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `simple-toast toast-${type}`;
  toast.setAttribute('role', 'status');
  toast.textContent = message;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

/**
 * Obtém caminho correto para página do carrinho
 */
function getCartPath() {
  const currentPath = window.location.pathname;
  
  if (currentPath.endsWith('/') || currentPath.endsWith('/index.html')) {
    return 'pages/carrinho.html';
  }
  
  if (currentPath.includes('/servicos/')) {
    return '../carrinho.html';
  }
  
  if (currentPath.includes('/pages/')) {
    return 'carrinho.html';
  }
  
  return 'pages/carrinho.html';
}

// ====== FUNÇÕES GLOBAIS PARA COMPATIBILIDADE ======

// Instância global do carrinho
let carrinhoManager;

// Função para adicionar ao carrinho (usada pelas páginas de serviços)
function adicionarAoCarrinho() {
  const itensSelecionados = [];
  
  // Coleta itens selecionados do popup
  const checkboxes = document.querySelectorAll('#popupAdicionar input[type="checkbox"]:checked');
  
  checkboxes.forEach(checkbox => {
    const opcoes = document.getElementById(`opcoes-${checkbox.id}`);
    if (!opcoes) return;
    
    let preco = 0;
    let opcaoTexto = '';
    
    if (checkbox.id === 'garcom') {
      // Caso especial para garçom (baseado em número de pessoas)
      const input = opcoes.querySelector('input[type="number"]');
      const pessoas = parseInt(input.value) || 50;
      preco = pessoas * 150;
      opcaoTexto = `${pessoas} pessoas`;
    } else {
      // Caso padrão com select
      const select = opcoes.querySelector('select');
      if (select) {
        const opcaoSelecionada = select.options[select.selectedIndex];
        preco = parseFloat(opcaoSelecionada.textContent.match(/R\$\s*([\d.,]+)/)[1].replace('.', '').replace(',', '.'));
        opcaoTexto = opcaoSelecionada.textContent;
      }
    }
    
    itensSelecionados.push({
      id: checkbox.id,
      nome: checkbox.nextElementSibling.textContent,
      opcao: opcaoTexto,
      preco: preco,
      categoria: getCategoriaAtual()
    });
  });
  
  if (itensSelecionados.length === 0) {
    alert('Selecione pelo menos um serviço!');
    return;
  }
  
  // Adiciona itens ao carrinho
  itensSelecionados.forEach(item => {
    carrinhoManager.adicionarItem(item);
  });
  
  // Fecha popup e redireciona
  fecharPopupAdicionar();
  window.location.href = carrinhoManager.getCarrinhoPath();
}

// Função para adicionar pacote ao evento (usada pela página de buffet)
function adicionarPacoteAoEvento() {
  const packageTitle = document.getElementById('packageDetailsTitle').textContent;
  const packageDescription = document.getElementById('packageDetailsDescription').textContent;
  const packageImage = document.getElementById('packageDetailsMainImage').src;
  
  const pacote = {
    id: 'buffet-' + Date.now(),
    nome: packageTitle,
    opcao: packageDescription,
    preco: 0, // Preço será definido no orçamento
    categoria: 'buffet',
    imagem: packageImage
  };

  carrinhoManager.adicionarItem(pacote);
  closePackageDetails();
}

// Função para obter categoria atual baseada na URL
function getCategoriaAtual() {
  const path = window.location.pathname;
  if (path.includes('audiovisual')) return 'audiovisual';
  if (path.includes('buffet')) return 'buffet';
  if (path.includes('cerimonial')) return 'cerimonial';
  if (path.includes('rh')) return 'rh';
  return 'outros';
}

// ====== EXPORTAÇÃO DE FUNÇÕES GLOBAIS ======

// Exportar função addToCart para uso global
window.addToCart = addToCart;

// ====== INICIALIZAÇÃO ======

document.addEventListener('DOMContentLoaded', function() {
  // Inicializa o gerenciador de carrinho
  carrinhoManager = new CarrinhoManager();
  
  // Se estiver na página do carrinho, renderiza o carrinho
  if (window.location.pathname.includes('carrinho.html')) {
    carrinhoManager.renderizarCarrinho();
  }

  // Configurar event listeners para botões addToCart
  setupAddToCartListeners();
});

/**
 * Configura event listeners para botões .js-add-to-cart
 */
function setupAddToCartListeners() {
  document.addEventListener('click', async function(e) {
    const button = e.target.closest('.js-add-to-cart');
    if (!button) return;

    e.preventDefault();
    e.stopPropagation();

    // Obter dados do botão
    const itemType = button.dataset.itemType;
    const itemId = button.dataset.itemId;
    const variantId = button.dataset.variantId || button.dataset.variant;
    const quantity = parseInt(button.dataset.qty) || 1;
    const meta = button.dataset.meta ? JSON.parse(button.dataset.meta) : {};

    // Obter userId do sistema de auth
    const userId = getCurrentUserId();

    // Chamar função centralizada
    await addToCart({
      userId,
      itemType,
      itemId,
      variantId,
      quantity,
      meta: {
        ...meta,
        serviceKey: getCurrentServiceKey(),
        page: window.location.pathname
      }
    });
  });
}

/**
 * Obtém userId atual do sistema de auth
 */
function getCurrentUserId() {
  if (!window.carrinhoManager) return null;
  return window.carrinhoManager.userId;
}

// ====== ESTILOS PARA NOTIFICAÇÕES ======

const carrinhoStyles = `
  .notificacao-carrinho {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    padding: 16px 20px;
    min-width: 300px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  }

  .notificacao-carrinho.mostrar {
    transform: translateX(0);
  }

  .notificacao-conteudo {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .notificacao-icone {
    flex-shrink: 0;
  }

  .notificacao-success .notificacao-icone {
    color: #059669;
  }

  .notificacao-info .notificacao-icone {
    color: #1c7cc7;
  }

  .notificacao-carrinho span {
    font-weight: 500;
    color: #0f172a;
  }

  .carrinho-contador {
    position: relative;
  }

  .carrinho-link {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #64748b;
    text-decoration: none;
    padding: 8px 12px;
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .carrinho-link:hover {
    background: #f1f5f9;
    color: #0f172a;
  }

  .carrinho-badge {
    background: #059669;
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 10px;
    min-width: 18px;
    text-align: center;
  }
`;

// Adiciona estilos ao head
const carrinhoStyleSheet = document.createElement('style');
carrinhoStyleSheet.textContent = carrinhoStyles;
document.head.appendChild(carrinhoStyleSheet);

// ====== ESTILOS PARA TOASTS ADDTOCART ======

const addToCartStyles = `
  .add-to-cart-toast {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    padding: 16px 20px;
    min-width: 320px;
    max-width: 400px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    display: flex;
    align-items: center;
    gap: 12px;
    border-left: 4px solid #059669;
  }

  .add-to-cart-toast.show {
    transform: translateX(0);
  }

  .toast-content {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
  }

  .toast-icon {
    color: #059669;
    flex-shrink: 0;
  }

  .toast-text {
    font-weight: 500;
    color: #0f172a;
    line-height: 1.4;
  }

  .toast-link {
    background: #059669;
    color: white;
    text-decoration: none;
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.875rem;
    transition: background-color 0.2s ease;
    white-space: nowrap;
  }

  .toast-link:hover {
    background: #047857;
  }

  .simple-toast {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    padding: 16px 20px;
    min-width: 300px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    font-weight: 500;
    color: #0f172a;
  }

  .simple-toast.show {
    transform: translateX(0);
  }

  .simple-toast.toast-success {
    border-left: 4px solid #059669;
  }

  .simple-toast.toast-warning {
    border-left: 4px solid #f59e0b;
  }

  .simple-toast.toast-error {
    border-left: 4px solid #dc2626;
  }

  .simple-toast.toast-info {
    border-left: 4px solid #3b82f6;
  }

  /* Responsividade */
  @media (max-width: 640px) {
    .add-to-cart-toast,
    .simple-toast {
      top: 10px;
      right: 10px;
      left: 10px;
      min-width: auto;
      max-width: none;
      transform: translateY(-100%);
    }

    .add-to-cart-toast.show,
    .simple-toast.show {
      transform: translateY(0);
    }

    .add-to-cart-toast {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
    }

    .toast-content {
      justify-content: center;
    }

    .toast-link {
      text-align: center;
    }
  }
`;

// Adiciona estilos dos toasts ao head
const addToCartStyleSheet = document.createElement('style');
addToCartStyleSheet.textContent = addToCartStyles;
document.head.appendChild(addToCartStyleSheet);
