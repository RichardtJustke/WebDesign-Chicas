// Sistema de autenticação para Chicas Eventos
class AuthManager {
  constructor() {
    this.currentUser = null;
    this.init();
  }

  init() {
    // Verificar se há usuário logado
    this.checkCurrentUser();
    
    // Atualizar estado do header
    this.updateHeaderAuthState();
    
    // Adicionar botão de logout se necessário
    this.addLogoutButton();
  }

  checkCurrentUser() {
    const userData = localStorage.getItem('chicas_current_user');
    if (userData) {
      this.currentUser = JSON.parse(userData);
      this.updateUIForLoggedUser();
    }
  }

  /**
   * Atualiza o atributo data-auth do header baseado no estado de autenticação
   */
  updateHeaderAuthState() {
    const header = document.getElementById('mainHeader');
    if (!header) return;

    if (this.currentUser) {
      header.setAttribute('data-auth', 'user');
      this.updateUserProfile();
    } else {
      header.setAttribute('data-auth', 'guest');
    }
  }

  /**
   * Atualiza informações do perfil do usuário (avatar, nome, etc.)
   */
  updateUserProfile() {
    if (!this.currentUser) return;

    // Atualizar avatar com iniciais
    const avatarInitials = document.getElementById('avatarInitials');
    const mobileAvatarInitials = document.getElementById('mobileAvatarInitials');
    const initials = this.getInitials(this.currentUser.name);
    
    if (avatarInitials) avatarInitials.textContent = initials;
    if (mobileAvatarInitials) mobileAvatarInitials.textContent = initials;

    // Atualizar nome do usuário
    const profileName = document.getElementById('profileName');
    const mobileProfileName = document.getElementById('mobileProfileName');
    
    if (profileName) profileName.textContent = this.currentUser.name;
    if (mobileProfileName) mobileProfileName.textContent = this.currentUser.name;
  }

  /**
   * Extrai iniciais do nome do usuário
   */
  getInitials(name) {
    if (!name) return 'U';
    
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  }

  updateUIForLoggedUser() {
    if (!this.currentUser) return;

    // Atualizar estado do header
    this.updateHeaderAuthState();
  }

  showUserMenu(triggerElement) {
    // Remover menu existente se houver
    const existingMenu = document.getElementById('userMenu');
    if (existingMenu) {
      existingMenu.remove();
      return;
    }

    // Criar menu dropdown
    const menu = document.createElement('div');
    menu.id = 'userMenu';
    menu.className = 'tw-absolute tw-bg-white tw-border tw-border-slate-200 tw-rounded-lg tw-shadow-lg tw-py-2 tw-min-w-48 tw-z-50';
    menu.style.top = (triggerElement.offsetTop + triggerElement.offsetHeight + 5) + 'px';
    menu.style.left = triggerElement.offsetLeft + 'px';

    menu.innerHTML = `
      <div class="tw-px-4 tw-py-2 tw-border-b tw-border-slate-100">
        <p class="tw-text-sm tw-font-semibold tw-text-slate-900">${this.currentUser.name}</p>
        <p class="tw-text-xs tw-text-slate-500">${this.currentUser.email}</p>
      </div>
      <a href="#" class="tw-block tw-px-4 tw-py-2 tw-text-sm tw-text-slate-700 hover:tw-bg-slate-50" onclick="authManager.logout()">
        <svg class="tw-w-4 tw-h-4 tw-inline tw-mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
        Sair
      </a>
    `;

    // Adicionar ao DOM
    triggerElement.parentNode.style.position = 'relative';
    triggerElement.parentNode.appendChild(menu);

    // Fechar menu ao clicar fora
    setTimeout(() => {
      document.addEventListener('click', function closeMenu(e) {
        if (!menu.contains(e.target) && !triggerElement.contains(e.target)) {
          menu.remove();
          document.removeEventListener('click', closeMenu);
        }
      });
    }, 100);
  }

  addLogoutButton() {
    // Adicionar botão de logout em páginas específicas se necessário
    if (this.currentUser && window.location.pathname.includes('index.html')) {
      const navMenu = document.querySelector('.nav-menu');
      if (navMenu && !document.getElementById('logoutBtn')) {
        const logoutBtn = document.createElement('a');
        logoutBtn.id = 'logoutBtn';
        logoutBtn.href = '#';
        logoutBtn.className = 'nav-link menu-item';
        logoutBtn.innerHTML = 'Sair';
        logoutBtn.onclick = (e) => {
          e.preventDefault();
          this.logout();
        };
        navMenu.appendChild(logoutBtn);
      }
    }
  }

  logout() {
    // Confirmar logout
    if (confirm('Tem certeza que deseja sair?')) {
      // Salvar carrinho do usuário antes do logout
      this.salvarCarrinhoUsuarioAntesLogout();
      
      localStorage.removeItem('chicas_current_user');
      this.currentUser = null;
      
      // Atualizar estado do header
      this.updateHeaderAuthState();
      
      // Notificar mudança de usuário para outros componentes
      this.notificarMudancaUsuario();
      
      // Recarregar página para atualizar UI
      window.location.reload();
    }
  }

  /**
   * Salva carrinho do usuário antes do logout
   */
  salvarCarrinhoUsuarioAntesLogout() {
    if (this.currentUser && window.carrinhoManager) {
      const userId = this.currentUser.email.toLowerCase().trim();
      const userKey = `cart:${userId}`;
      
      // Salvar estado atual do carrinho
      if (window.carrinhoManager.carrinho && window.carrinhoManager.carrinho.length > 0) {
        localStorage.setItem(userKey, JSON.stringify(window.carrinhoManager.carrinho));
        console.log(`Carrinho salvo para usuário ${userId} antes do logout`);
      }
    }
  }

  /**
   * Notifica outros componentes sobre mudança de usuário
   */
  notificarMudancaUsuario() {
    // Disparar evento customizado
    const event = new CustomEvent('userChanged', {
      detail: { 
        previousUser: this.currentUser,
        newUser: null 
      }
    });
    window.dispatchEvent(event);
  }

  /**
   * Login de usuário com migração de carrinho
   */
  login(userData) {
    // Salvar dados do usuário
    localStorage.setItem('chicas_current_user', JSON.stringify(userData));
    this.currentUser = userData;
    
    // Atualizar estado do header
    this.updateHeaderAuthState();
    
    // Migrar carrinho guest para usuário se necessário
    this.migrarCarrinhoGuestParaUsuario();
    
    // Notificar mudança de usuário
    this.notificarMudancaUsuario();
    
    console.log(`Usuário ${userData.email} logado com sucesso`);
  }

  /**
   * Migra carrinho de guest para usuário logado
   */
  migrarCarrinhoGuestParaUsuario() {
    if (this.currentUser && window.carrinhoManager) {
      const userId = this.currentUser.email.toLowerCase().trim();
      window.carrinhoManager.migrarCarrinhoGuestParaUsuario(userId);
    }
  }

  isLoggedIn() {
    return this.currentUser !== null;
  }

  getCurrentUser() {
    return this.currentUser;
  }
}

// Inicializar sistema de autenticação
const authManager = new AuthManager();

// Função global para verificar se usuário está logado
function requireAuth() {
  if (!authManager.isLoggedIn()) {
    alert('Você precisa fazer login para acessar esta página.');
    window.location.href = 'pages/login.html';
    return false;
  }
  return true;
}
