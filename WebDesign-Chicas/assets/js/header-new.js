/**
 * Header New - Sistema de controle do novo cabeçalho
 * Gerencia estados de login, menu mobile e funcionalidades
 */

class HeaderNew {
  constructor() {
    this.isLoggedIn = this.checkLoginStatus();
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateHeaderState();
    this.setupMobileMenu();
    this.setupCartIntegration();
  }

  /**
   * Verifica se o usuário está logado
   * Integra com o sistema de autenticação existente
   */
  checkLoginStatus() {
    // Verifica se há usuário logado no sistema de autenticação
    const userData = localStorage.getItem('chicas_current_user');
    return userData !== null;
  }

  /**
   * Configura todos os event listeners
   */
  setupEventListeners() {
    // Menu mobile toggle
    const menuToggle = document.getElementById('menuToggleNew');
    const mobileMenu = document.getElementById('mobileMenuNew');

    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener('click', () => {
        this.toggleMobileMenu();
      });

      // Fechar menu ao clicar fora
      document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
          this.closeMobileMenu();
        }
      });
    }

    // Profile dropdown (desktop) - com suporte a teclado
    const userProfile = document.getElementById('userProfile');
    if (userProfile) {
      console.log('✅ Elemento userProfile encontrado');
      
      userProfile.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('🖱️ Clique no perfil do usuário');
        this.toggleProfileDropdown();
      });

      // Suporte a navegação por teclado
      userProfile.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          console.log('⌨️ Tecla pressionada no perfil do usuário');
          this.toggleProfileDropdown();
        } else if (e.key === 'Escape') {
          this.closeProfileDropdown();
        }
      });
    } else {
      console.log('❌ Elemento userProfile NÃO encontrado');
    }

    // Fechar dropdown ao clicar fora
    document.addEventListener('click', (e) => {
      const profileDropdown = document.getElementById('profileDropdown');
      if (profileDropdown && !userProfile?.contains(e.target)) {
        this.closeProfileDropdown();
      }
    });

    // Carrinho - com suporte a teclado
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
      cartIcon.addEventListener('click', () => {
        this.openCart();
      });

      // Suporte a navegação por teclado
      cartIcon.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.openCart();
        }
      });
    }

    // Carrinho mobile - com suporte a teclado
    const mobileCartIcon = document.getElementById('mobileCartIcon');
    if (mobileCartIcon) {
      mobileCartIcon.addEventListener('click', () => {
        this.openCart();
      });

      // Suporte a navegação por teclado
      mobileCartIcon.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.openCart();
        }
      });
    }

    // Links de logout (simulação)
    this.setupLogoutLinks();
  }

  /**
   * Atualiza o estado do cabeçalho baseado no status de login
   * Agora usa o sistema data-auth para controle de visibilidade
   */
  updateHeaderState() {
    const header = document.getElementById('mainHeader');
    if (!header) return;

    // Atualizar atributo data-auth baseado no status de login
    if (this.isLoggedIn) {
      header.setAttribute('data-auth', 'user');
      console.log('✅ Header atualizado para estado: USER');
    } else {
      header.setAttribute('data-auth', 'guest');
      console.log('✅ Header atualizado para estado: GUEST');
    }
  }

  /**
   * Controla o menu mobile
   */
  setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggleNew');
    const mobileMenu = document.getElementById('mobileMenuNew');

    if (menuToggle && mobileMenu) {
      // Animação do hamburger
      menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
      });
    }
  }

  /**
   * Abre/fecha o menu mobile
   */
  toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenuNew');
    const menuToggle = document.getElementById('menuToggleNew');

    if (mobileMenu && menuToggle) {
      const isOpen = mobileMenu.classList.contains('active');
      
      if (isOpen) {
        this.closeMobileMenu();
      } else {
        this.openMobileMenu();
      }
    }
  }

  /**
   * Abre o menu mobile
   */
  openMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenuNew');
    const menuToggle = document.getElementById('menuToggleNew');

    if (mobileMenu && menuToggle) {
      mobileMenu.classList.add('active');
      menuToggle.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  /**
   * Fecha o menu mobile
   */
  closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenuNew');
    const menuToggle = document.getElementById('menuToggleNew');

    if (mobileMenu && menuToggle) {
      mobileMenu.classList.remove('active');
      menuToggle.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  /**
   * Abre/fecha o dropdown do perfil
   */
  toggleProfileDropdown() {
    console.log('🔄 toggleProfileDropdown chamado');
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
      console.log('✅ Dropdown encontrado:', dropdown);
      const isVisible = dropdown.style.opacity === '1' || dropdown.style.visibility === 'visible';
      console.log('👁️ Dropdown visível?', isVisible);
      if (isVisible) {
        this.closeProfileDropdown();
      } else {
        this.openProfileDropdown();
      }
    } else {
      console.log('❌ Dropdown NÃO encontrado');
    }
  }

  /**
   * Abre o dropdown do perfil
   */
  openProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
      dropdown.style.opacity = '1';
      dropdown.style.visibility = 'visible';
      dropdown.style.transform = 'translateY(0)';
      dropdown.style.display = 'block';
      
      // Adicionar classe para CSS adicional se necessário
      dropdown.classList.add('active');
      
      console.log('✅ Dropdown do perfil aberto');
    }
  }

  /**
   * Fecha o dropdown do perfil
   */
  closeProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
      dropdown.style.opacity = '0';
      dropdown.style.visibility = 'hidden';
      dropdown.style.transform = 'translateY(-10px)';
      
      // Remover classe ativa
      dropdown.classList.remove('active');
      
      console.log('✅ Dropdown do perfil fechado');
    }
  }

  /**
   * Abre o carrinho - navega para a página do carrinho
   */
  openCart() {
    console.log('🛒 Abrindo carrinho...');
    
    // Verificar se existe sistema de carrinho
    if (window.carrinhoManager && typeof window.carrinhoManager.getCarrinhoPath === 'function') {
      // Usar o sistema de carrinho existente
      const carrinhoPath = window.carrinhoManager.getCarrinhoPath();
      console.log('✅ Usando carrinhoManager, navegando para:', carrinhoPath);
      window.location.href = carrinhoPath;
    } else {
      // Fallback para navegação direta
      const currentPath = window.location.pathname;
      let carrinhoPath = 'pages/carrinho.html';
      
      // Ajustar path baseado na localização atual
      if (currentPath.includes('/servicos/')) {
        carrinhoPath = '../carrinho.html';
      } else if (currentPath.includes('/pages/') && !currentPath.includes('/servicos/')) {
        carrinhoPath = 'carrinho.html';
      } else if (currentPath.endsWith('/') || currentPath.endsWith('/index.html') || currentPath.endsWith('/WebDesign-Chicas/')) {
        carrinhoPath = 'pages/carrinho.html';
      }
      
      console.log('⚠️ Usando fallback, navegando para:', carrinhoPath);
      window.location.href = carrinhoPath;
    }
  }

  /**
   * Configura links de logout e navegação por teclado
   */
  setupLogoutLinks() {
    // Adiciona funcionalidade de logout aos itens do dropdown
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach((item, index) => {
      // Tornar focável
      item.setAttribute('tabindex', '0');
      
      // Adicionar navegação por teclado
      item.addEventListener('keydown', (e) => {
        switch (e.key) {
          case 'Enter':
          case ' ':
            e.preventDefault();
            item.click();
            break;
          case 'ArrowDown':
            e.preventDefault();
            const nextItem = dropdownItems[index + 1];
            if (nextItem) nextItem.focus();
            break;
          case 'ArrowUp':
            e.preventDefault();
            const prevItem = dropdownItems[index - 1];
            if (prevItem) prevItem.focus();
            else document.getElementById('userProfile')?.focus();
            break;
          case 'Escape':
            e.preventDefault();
            this.closeProfileDropdown();
            document.getElementById('userProfile')?.focus();
            break;
        }
      });

      // Funcionalidade de logout
      if (item.textContent.includes('LOGOUT') || item.textContent.includes('SAIR')) {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          this.logout();
        });
      }
    });
  }

  /**
   * Faz logout do usuário
   * Integra com o sistema de autenticação existente
   */
  logout() {
    // Usar o sistema de autenticação existente
    if (window.authManager) {
      window.authManager.logout();
    } else {
      // Fallback se authManager não estiver disponível
      localStorage.removeItem('chicas_current_user');
      this.isLoggedIn = false;
      this.updateHeaderState();
      this.closeMobileMenu();
      this.closeProfileDropdown();
      window.location.href = 'index.html';
    }
  }

  /**
   * Simula login (para demonstração)
   */
  login() {
    // Simular dados de usuário para demonstração
    const mockUser = {
      name: 'João Silva',
      email: 'joao@exemplo.com'
    };
    
    localStorage.setItem('chicas_current_user', JSON.stringify(mockUser));
    this.isLoggedIn = true;
    this.updateHeaderState();
    this.closeMobileMenu();
    
    // Atualizar perfil se authManager estiver disponível
    if (window.authManager) {
      window.authManager.currentUser = mockUser;
      window.authManager.updateUserProfile();
    }
  }

  /**
   * Alterna entre estados de login (para demonstração)
   */
  toggleLoginState() {
    if (this.isLoggedIn) {
      this.logout();
    } else {
      this.login();
    }
  }

  /**
   * Configura integração com o sistema de carrinho
   */
  setupCartIntegration() {
    // Aguardar o carrinhoManager estar disponível
    const checkCartManager = () => {
      if (window.carrinhoManager) {
        this.updateCartBadge();
        this.setupCartListeners();
      } else {
        // Tentar novamente em 100ms
        setTimeout(checkCartManager, 100);
      }
    };
    
    checkCartManager();
  }

  /**
   * Configura listeners para mudanças no carrinho
   */
  setupCartListeners() {
    if (!window.carrinhoManager) return;

    // Interceptar métodos do carrinho para atualizar badge
    const originalAdicionarItem = window.carrinhoManager.adicionarItem;
    const originalRemoverItem = window.carrinhoManager.removerItem;
    const originalAtualizarQuantidade = window.carrinhoManager.atualizarQuantidade;
    const originalLimparCarrinho = window.carrinhoManager.limparCarrinho;

    // Sobrescrever métodos para atualizar badge
    window.carrinhoManager.adicionarItem = function(item) {
      const result = originalAdicionarItem.call(this, item);
      if (window.headerNew) {
        window.headerNew.updateCartBadge();
      }
      return result;
    };

    window.carrinhoManager.removerItem = function(itemId) {
      const result = originalRemoverItem.call(this, itemId);
      if (window.headerNew) {
        window.headerNew.updateCartBadge();
      }
      return result;
    };

    window.carrinhoManager.atualizarQuantidade = function(itemId, novaQuantidade) {
      const result = originalAtualizarQuantidade.call(this, itemId, novaQuantidade);
      if (window.headerNew) {
        window.headerNew.updateCartBadge();
      }
      return result;
    };

    window.carrinhoManager.limparCarrinho = function() {
      const result = originalLimparCarrinho.call(this);
      if (window.headerNew) {
        window.headerNew.updateCartBadge();
      }
      return result;
    };

    // Listener para mudanças de usuário
    window.addEventListener('userChanged', () => {
      console.log('🔄 HeaderNew detectou mudança de usuário');
      this.updateCartBadge();
    });

    // Listener para mudanças no localStorage (sincronização entre abas)
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.startsWith('cart:')) {
        console.log('🔄 HeaderNew detectou mudança no carrinho de outra aba');
        this.updateCartBadge();
      }
    });

    // Atualizar badge inicial
    this.updateCartBadge();
  }

  /**
   * Atualiza o badge do carrinho com a contagem de itens
   * Agora usa o sistema de carrinho isolado por usuário
   */
  updateCartBadge() {
    let totalItens = 0;

    if (window.carrinhoManager && typeof window.carrinhoManager.contarItens === 'function') {
      totalItens = window.carrinhoManager.contarItens();
    } else {
      // Fallback: contar itens do localStorage com namespacing
      try {
        const currentUserId = this.getCurrentUserId();
        const storageKey = this.getCartStorageKey(currentUserId);
        const carrinhoSalvo = localStorage.getItem(storageKey);
        
        if (carrinhoSalvo) {
          const carrinho = JSON.parse(carrinhoSalvo);
          totalItens = carrinho.reduce((total, item) => total + (item.quantidade || 1), 0);
        }
      } catch (error) {
        console.error('Erro ao contar itens do carrinho:', error);
      }
    }

    // Atualizar badge desktop
    const cartBadge = document.getElementById('cartBadge');
    const cartIcon = document.getElementById('cartIcon');
    
    if (cartBadge && cartIcon) {
      this.updateCartBadgeElement(cartBadge, cartIcon, totalItens);
    }

    // Atualizar badge mobile
    const mobileCartBadge = document.getElementById('mobileCartBadge');
    const mobileCartIcon = document.getElementById('mobileCartIcon');
    
    if (mobileCartBadge && mobileCartIcon) {
      this.updateCartBadgeElement(mobileCartBadge, mobileCartIcon, totalItens);
    }
  }

  /**
   * Obtém o ID do usuário atual (compatível com CarrinhoManager)
   */
  getCurrentUserId() {
    const userData = localStorage.getItem('chicas_current_user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.email ? user.email.toLowerCase().trim() : null;
      } catch (error) {
        return null;
      }
    }
    
    // Se não há usuário logado, usar deviceId para guest
    let deviceId = localStorage.getItem('chicas_device_id');
    if (!deviceId) {
      deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('chicas_device_id', deviceId);
    }
    return `guest:${deviceId}`;
  }

  /**
   * Obtém a chave de storage do carrinho baseada no usuário
   */
  getCartStorageKey(userId) {
    if (userId && !userId.startsWith('guest:')) {
      return `cart:${userId}`;
    } else {
      const deviceId = userId ? userId.replace('guest:', '') : this.getCurrentUserId().replace('guest:', '');
      return `cart:guest:${deviceId}`;
    }
  }

  /**
   * Atualiza um elemento de badge específico
   */
  updateCartBadgeElement(badgeElement, iconElement, totalItens) {
    // Atualizar texto do badge
    if (totalItens === 0) {
      badgeElement.textContent = '';
      badgeElement.style.display = 'none';
    } else if (totalItens > 99) {
      badgeElement.textContent = '99+';
      badgeElement.style.display = 'flex';
    } else {
      badgeElement.textContent = totalItens.toString();
      badgeElement.style.display = 'flex';
    }

    // Atualizar aria-label
    let ariaLabel = 'Abrir carrinho';
    if (totalItens === 0) {
      ariaLabel += ' (0 itens)';
    } else if (totalItens === 1) {
      ariaLabel += ' (1 item)';
    } else if (totalItens > 99) {
      ariaLabel += ' (99+ itens)';
    } else {
      ariaLabel += ` (${totalItens} itens)`;
    }

    iconElement.setAttribute('aria-label', ariaLabel);
  }
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.headerNew = new HeaderNew();
  
});


// Exportar para uso global
window.HeaderNew = HeaderNew;
