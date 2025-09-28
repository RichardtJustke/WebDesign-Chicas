// Navbar System - Chicas Eventos
// Sistema funcional para navbar dinâmico com detecção automática de login

class NavbarSystem {
    constructor() {
        this.isLoggedIn = false;
        this.currentUser = null;
        this.isLoggingOut = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkLoginStatus();
        this.updateNavbarState();
    }

    setupEventListeners() {
        // Botão de login
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.handleLoginClick());
        }

        // Botão do usuário (dropdown toggle)
        const userBtn = document.getElementById('user-btn');
        if (userBtn) {
            userBtn.addEventListener('click', (e) => this.toggleDropdown(e));
        }

        // Botão de logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => this.handleLogout(e));
        }

        // Fechar dropdown ao clicar fora
        document.addEventListener('click', (e) => this.closeDropdownOnOutsideClick(e));
    }

    checkLoginStatus() {
        // Verificar se há sessão ativa
        const sessionData = localStorage.getItem('chicasEventos_session');
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                const now = new Date().getTime();
                const sessionTimeout = 24 * 60 * 60 * 1000; // 24 horas

                if (now - session.timestamp < sessionTimeout) {
                    // Só atualizar se não estivermos em processo de logout
                    if (!this.isLoggingOut) {
                        this.currentUser = session.user;
                        this.isLoggedIn = true;
                        console.log('Usuário logado detectado:', this.currentUser.nome);
                    }
                } else {
                    this.logout();
                }
            } catch (error) {
                console.error('Erro ao verificar sessão:', error);
                this.logout();
            }
        } else {
            // Se não há sessão, garantir que estamos deslogados
            this.currentUser = null;
            this.isLoggedIn = false;
            this.isLoggingOut = false;
        }
    }

    // Verificar se o novo sistema está disponível
    checkNewAuthSystem() {
        if (window.newAuthSystem) {
            this.currentUser = window.newAuthSystem.getCurrentUser();
            this.isLoggedIn = window.newAuthSystem.isUserLoggedIn();
            console.log('🔄 Sincronizado com novo sistema de autenticação');
        }
    }

    // Atualizar estado do navbar baseado no status de login
    updateNavbarState() {
        console.log('🔄 NavbarSystem: Atualizando estado do navbar...');
        console.log('📊 Status:', { isLoggedIn: this.isLoggedIn, currentUser: this.currentUser });
        
        if (this.isLoggedIn && this.currentUser) {
            console.log('👤 Mostrando navbar para usuário logado');
            this.showLoggedInNavbar();
        } else {
            console.log('🚪 Mostrando navbar para usuário deslogado');
            this.showLoggedOutNavbar();
        }
    }

    // Mostrar navbar para usuário logado
    showLoggedInNavbar() {
        console.log('👤 NavbarSystem: Mostrando botão do usuário');
        
        const loginBtn = document.getElementById('login-btn');
        const userBtn = document.getElementById('user-btn');
        const userContainer = document.querySelector('.user-button-container');

        // ESCONDER botão de login
        if (loginBtn) {
            loginBtn.classList.add('hidden');
            console.log('✅ Botão de login escondido');
        }
        
        // MOSTRAR botão do usuário
        if (userBtn) {
            userBtn.style.display = 'block';
            userBtn.classList.remove('hidden');
            userBtn.classList.add('visible');
            
            // Atualizar texto do botão com nome do usuário
            if (this.currentUser) {
                const displayName = this.getDisplayName(this.currentUser.nome);
                userBtn.textContent = displayName.toUpperCase();
                console.log('✅ Botão do usuário atualizado:', this.currentUser.nome);
            }
        }
        
        // Atualizar classe do container
        if (userContainer) {
            userContainer.classList.remove('logged-out');
            userContainer.classList.add('logged-in');
        }
        
        console.log('✅ Botão do usuário ativado na mesma posição');
    }

    // Mostrar navbar para usuário não logado
    showLoggedOutNavbar() {
        console.log('🚪 NavbarSystem: Mostrando botão de login');
        
        const loginBtn = document.getElementById('login-btn');
        const userBtn = document.getElementById('user-btn');
        const userContainer = document.querySelector('.user-button-container');
        const dropdown = document.getElementById('user-dropdown');

        // MOSTRAR botão de login
        if (loginBtn) {
            loginBtn.style.display = 'block';
            loginBtn.classList.remove('hidden');
            console.log('✅ Botão de login mostrado');
        }
        
        // ESCONDER botão do usuário
        if (userBtn) {
            userBtn.classList.remove('visible');
            userBtn.classList.add('hidden');
            console.log('✅ Botão do usuário escondido');
        }
        
        // Fechar dropdown se estiver aberto
        if (dropdown) {
            dropdown.classList.remove('show');
            console.log('✅ Dropdown fechado');
        }
        
        // Atualizar classe do container
        if (userContainer) {
            userContainer.classList.remove('logged-in');
            userContainer.classList.add('logged-out');
        }
        
        console.log('✅ Botão de login ativado na mesma posição');
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
        e.stopPropagation();
        const dropdown = document.getElementById('dropdown-menu');
        console.log('🖱️ Toggle dropdown clicado!', dropdown);
        if (dropdown) {
            const isOpen = dropdown.classList.contains('show');
            console.log('📊 Menu estava aberto:', isOpen);
            dropdown.classList.toggle('show');
            console.log('🔄 Menu agora está:', dropdown.classList.contains('show') ? 'ABERTO' : 'FECHADO');
        } else {
            console.error('❌ Dropdown não encontrado!');
        }
    }

    closeDropdownOnOutsideClick(e) {
        const userMenu = document.getElementById('user-menu');
        const dropdown = document.getElementById('dropdown-menu');
        
        if (userMenu && dropdown && !userMenu.contains(e.target)) {
            console.log('🚪 Fechando dropdown por clique fora');
            dropdown.classList.remove('show');
        }
    }

    handleLogout(e) {
        e.preventDefault();
        
        // Confirmar logout
        if (confirm('Tem certeza que deseja sair da sua conta?')) {
            // Chamar logout do AuthSystem se disponível
            if (window.authSystem) {
                window.authSystem.logout();
            } else {
                // Fallback: fazer logout local
                this.logout();
                localStorage.removeItem('chicasEventos_session');
                
                // Redirecionar para página inicial
                const currentPath = window.location.pathname;
                let redirectUrl = 'index.html';
                
                // Determinar o caminho correto baseado na localização atual
                if (currentPath.includes('pages/dashboard/') || currentPath.includes('pages/login/') || 
                    currentPath.includes('pages/sobre/') || currentPath.includes('pages/portifolio/')) {
                    redirectUrl = '../../index.html';
                } else if (currentPath.includes('pages/serviços/')) {
                    redirectUrl = '../../../index.html';
                } else if (currentPath.includes('pages/carrinho/') || currentPath.includes('pages/criar evento/') || 
                           currentPath.includes('pages/editar evento/')) {
                    redirectUrl = '../../index.html';
                } else if (currentPath.includes('pages/')) {
                    redirectUrl = '../index.html';
                }
                
                // Aguardar um pouco antes de redirecionar
                setTimeout(() => {
                    window.location.href = redirectUrl;
                }, 100);
            }
        }
    }

    login(user) {
        this.isLoggedIn = true;
        this.currentUser = user;
        this.updateNavbarState();
        console.log('Usuário logado:', user.nome);
    }

    logout() {
        console.log('🚪 NavbarSystem: Iniciando logout...');
        this.isLoggingOut = true;
        this.isLoggedIn = false;
        this.currentUser = null;
        
        // Atualizar navbar IMEDIATAMENTE
        this.updateNavbarState();
        console.log('🎨 NavbarSystem: UI atualizada para logout');
        
        // Resetar flag após um tempo
        setTimeout(() => {
            this.isLoggingOut = false;
            console.log('🔄 NavbarSystem: Flag de logout resetada');
        }, 1000);
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
    
    // Verificar novo sistema de autenticação
    setTimeout(() => {
        window.navbarSystem.checkNewAuthSystem();
        window.navbarSystem.updateNavbarState();
    }, 1000);
    
    // Escutar mudanças no localStorage para atualizar navbar em tempo real
    window.addEventListener('storage', (e) => {
        if (e.key === 'chicasEventos_session') {
            window.navbarSystem.checkLoginStatus();
            window.navbarSystem.checkNewAuthSystem();
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
    
    // Forçar configuração do dropdown após 3 segundos (fallback)
    setTimeout(() => {
        console.log('🔧 FALLBACK: Forçando configuração do dropdown...');
        const userBtn = document.getElementById('user-btn');
        const dropdownMenu = document.getElementById('dropdown-menu');
        
        if (userBtn && dropdownMenu) {
            console.log('✅ Elementos encontrados no fallback, configurando...');
            
            // Remover listeners existentes
            const newUserBtn = userBtn.cloneNode(true);
            userBtn.parentNode.replaceChild(newUserBtn, userBtn);
            
            newUserBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🖱️ FALLBACK: Botão clicado!');
                
                const isOpen = dropdownMenu.classList.contains('show');
                console.log('Menu estava aberto:', isOpen);
                
                if (isOpen) {
                    dropdownMenu.classList.remove('show');
                    newUserBtn.classList.remove('active');
                    console.log('❌ FALLBACK: Menu fechado');
                } else {
                    dropdownMenu.classList.add('show');
                    newUserBtn.classList.add('active');
                    console.log('✅ FALLBACK: Menu aberto');
                }
            });
            
            // Fechar ao clicar fora
            document.addEventListener('click', function(e) {
                if (!newUserBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                    dropdownMenu.classList.remove('show');
                    newUserBtn.classList.remove('active');
                    console.log('🚪 FALLBACK: Menu fechado por clique fora');
                }
            });
            
            console.log('🎉 FALLBACK: Dropdown configurado com sucesso!');
        } else {
            console.error('❌ FALLBACK: Elementos não encontrados!');
        }
    }, 3000);
});

// Exportar para uso global
window.NavbarSystem = NavbarSystem;
