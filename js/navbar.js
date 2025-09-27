// Navbar System - Chicas Eventos
// Sistema funcional para navbar dinâmico com detecção automática de login

class NavbarSystem {
    constructor() {
        this.isLoggedIn = false;
        this.currentUser = null;
        this.init();
    }

    init() {
        console.log('NavbarSystem inicializando...');
        this.setupEventListeners();
        
        // Aguardar um pouco para garantir que o auth.js foi carregado
        setTimeout(() => {
            console.log('Verificando status de login...');
            this.checkLoginStatus();
            this.updateNavbarState();
            
            // Verificar novamente após mais tempo para garantir sincronização
            setTimeout(() => {
                console.log('Verificação final do status de login...');
                this.checkLoginStatus();
                this.updateNavbarState();
            }, 500);
        }, 100);
    }

    setupEventListeners() {
        console.log('Configurando event listeners do navbar...');
        
        // Remover event listeners existentes para evitar duplicação
        this.removeExistingListeners();
        
        // Botão de login
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.handleLoginClick());
            console.log('Event listener do login configurado');
        }

        // Botão do usuário (dropdown toggle)
        const userBtn = document.getElementById('user-btn');
        if (userBtn) {
            userBtn.addEventListener('click', (e) => this.toggleDropdown(e));
            console.log('Event listener do dropdown configurado');
        } else {
            console.warn('Botão do usuário não encontrado');
        }

        // Botão de logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => this.handleLogout(e));
            console.log('Event listener do logout configurado');
        }

        // Fechar dropdown ao clicar fora
        document.addEventListener('click', (e) => this.closeDropdownOnOutsideClick(e));
        
        console.log('Event listeners configurados com sucesso');
    }

    removeExistingListeners() {
        // Remover listeners existentes para evitar duplicação
        const loginBtn = document.getElementById('login-btn');
        const userBtn = document.getElementById('user-btn');
        const logoutBtn = document.getElementById('logout-btn');
        
        if (loginBtn) {
            loginBtn.replaceWith(loginBtn.cloneNode(true));
        }
        if (userBtn) {
            userBtn.replaceWith(userBtn.cloneNode(true));
        }
        if (logoutBtn) {
            logoutBtn.replaceWith(logoutBtn.cloneNode(true));
        }
    }

    checkLoginStatus() {
        // Verificar se há sessão ativa
        const sessionData = localStorage.getItem('chicasEventos_session');
        
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                const now = new Date().getTime();
                const sessionTimeout = 24 * 60 * 60 * 1000; // 24 horas

                if (now - session.timestamp < sessionTimeout && session.user) {
                    this.currentUser = session.user;
                    this.isLoggedIn = true;
                    console.log('Usuário logado detectado pelo navbar:', this.currentUser.nome);
                } else {
                    console.log('Sessão expirada ou inválida, fazendo logout');
                    this.logout();
                }
            } catch (error) {
                console.error('Erro ao verificar sessão no navbar:', error);
                this.logout();
            }
        } else {
            // Não há sessão
            this.isLoggedIn = false;
            this.currentUser = null;
        }
    }

    // Atualizar estado do navbar baseado no status de login
    updateNavbarState() {
        if (this.isLoggedIn && this.currentUser) {
            this.showLoggedInNavbar();
        } else {
            this.showLoggedOutNavbar();
        }
    }

    // Mostrar navbar para usuário logado
    showLoggedInNavbar() {
        const loginBtn = document.getElementById('login-btn');
        const userMenu = document.getElementById('user-menu');
        const userName = document.getElementById('user-name');

        if (loginBtn) {
            loginBtn.style.display = 'none';
        }
        
        if (userMenu) {
            userMenu.style.display = 'block';
        }
        
        if (userName && this.currentUser) {
            const displayName = this.getDisplayName(this.currentUser.nome);
            userName.textContent = displayName.toUpperCase();
            console.log('Nome do usuário atualizado no navbar:', displayName);
        } else if (userName && !this.currentUser) {
            console.warn('Tentativa de mostrar navbar logado sem usuário atual');
        }
        
        // Reconfigurar event listeners após mostrar o menu do usuário
        setTimeout(() => {
            this.setupEventListeners();
        }, 100);
    }

    // Mostrar navbar para usuário não logado
    showLoggedOutNavbar() {
        const loginBtn = document.getElementById('login-btn');
        const userMenu = document.getElementById('user-menu');
        const dropdown = document.getElementById('dropdown-menu');

        if (loginBtn) {
            loginBtn.style.display = 'block';
        }
        
        if (userMenu) {
            userMenu.style.display = 'none';
        }
        
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    }

    handleLoginClick() {
        // Redirecionar para página de login
        const currentPath = window.location.pathname;
        let relativePath = 'pages/login/login.html';
        
        // Ajustar caminho baseado na profundidade da página atual
        if (currentPath.includes('/pages/')) {
            relativePath = '../login/login.html';
        } else if (currentPath.includes('/index/')) {
            relativePath = '../login/login.html';
        }
        
        window.location.href = relativePath;
    }

    toggleDropdown(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const dropdown = document.getElementById('dropdown-menu');
        const userBtn = document.getElementById('user-btn');
        
        if (dropdown && userBtn) {
            const isOpen = dropdown.classList.contains('show');
            
            // Fechar todos os outros dropdowns primeiro
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                if (menu !== dropdown) {
                    menu.classList.remove('show');
                }
            });
            
            // Toggle do dropdown atual
            if (isOpen) {
                dropdown.classList.remove('show');
                console.log('Dropdown fechado');
            } else {
                dropdown.classList.add('show');
                console.log('Dropdown aberto');
            }
        } else {
            console.warn('Elementos do dropdown não encontrados:', { dropdown, userBtn });
        }
    }

    closeDropdownOnOutsideClick(e) {
        const userMenu = document.getElementById('user-menu');
        const dropdown = document.getElementById('dropdown-menu');
        
        if (userMenu && dropdown && !userMenu.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    }

    handleLogout(e) {
        e.preventDefault();
        this.logout();
    }

    login(user) {
        this.isLoggedIn = true;
        this.currentUser = user;
        this.updateNavbarState();
        console.log('Usuário logado:', user.nome);
    }

    logout() {
        this.isLoggedIn = false;
        this.currentUser = null;
        
        // Remover sessão
        localStorage.removeItem('chicasEventos_session');
        
        // Chamar logout do sistema de autenticação se disponível
        if (window.authSystem && window.authSystem.logout) {
            window.authSystem.logout();
        } else {
            // Fallback: atualizar navbar e redirecionar
            this.updateNavbarState();
            
            // Redirecionar para página inicial
            const currentPath = window.location.pathname;
            if (currentPath.includes('dashboard') || currentPath.includes('pages/')) {
                window.location.href = '../../index.html';
            } else {
                window.location.href = 'index.html';
            }
        }
        
        console.log('Usuário deslogado');
    }

    // Método para obter nome de exibição (apenas primeiro nome se muito longo)
    getDisplayName(fullName) {
        const firstName = fullName.split(' ')[0];
        
        // Se o primeiro nome for muito longo (mais de 12 caracteres), usar apenas ele
        if (firstName.length > 12) {
            return firstName;
        }
        
        // Se o nome completo for muito longo (mais de 20 caracteres), usar apenas primeiro nome
        if (fullName.length > 20) {
            return firstName;
        }
        
        // Caso contrário, usar nome completo
        return fullName;
    }

    // Método para simular login (para testes)
    simulateLogin(userName = 'JOÃO SILVA') {
        const mockUser = {
            id: 1,
            nome: userName,
            email: 'teste@teste.com',
            tipo: 'cliente'
        };
        
        // Simular sessão
        const sessionData = {
            user: mockUser,
            timestamp: new Date().getTime()
        };
        localStorage.setItem('chicasEventos_session', JSON.stringify(sessionData));
        
        this.login(mockUser);
    }

    // Método para simular logout (para testes)
    simulateLogout() {
        this.logout();
    }
}

// Inicializar sistema quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.navbarSystem = new NavbarSystem();
    
    // Verificação adicional após um tempo para garantir que tudo foi carregado
    setTimeout(() => {
        window.navbarSystem.checkLoginStatus();
        window.navbarSystem.updateNavbarState();
    }, 1000);
    
    // Escutar mudanças no localStorage para atualizar navbar em tempo real
    window.addEventListener('storage', (e) => {
        if (e.key === 'chicasEventos_session') {
            window.navbarSystem.checkLoginStatus();
            window.navbarSystem.updateNavbarState();
        }
    });
    
    // Escutar eventos customizados de login/logout
    window.addEventListener('userLoggedIn', (e) => {
        window.navbarSystem.login(e.detail.user);
    });
    
    window.addEventListener('userLoggedOut', () => {
        window.navbarSystem.logout();
    });
});

// Exportar para uso global
window.NavbarSystem = NavbarSystem;
