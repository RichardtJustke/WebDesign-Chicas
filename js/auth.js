// Sistema de Autenticação - Chicas Eventos
// Sistema completo de login, cadastro e gerenciamento de sessão

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.sessionTimeout = 24 * 60 * 60 * 1000; // 24 horas em millisegundos
        this.init();
    }

    init() {
        // Verificar se há uma sessão ativa
        this.checkSession();
        
        // Configurar listeners para formulários
        this.setupFormListeners();
        
        // Configurar botão de login
        this.setupLoginButton();
        
        // Verificar autenticação em páginas protegidas
        this.protectRoutes();
        
        console.log('Sistema de autenticação inicializado');
    }

    // Verificar sessão existente
    checkSession() {
        const sessionData = localStorage.getItem('chicasEventos_session');
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                const now = new Date().getTime();
                
                // Verificar se a sessão não expirou
                if (now - session.timestamp < this.sessionTimeout) {
                    this.currentUser = session.user;
                    this.isLoggedIn = true;
                    this.updateUIForLoggedInUser();
                    console.log('Usuário logado:', this.currentUser.nome);
                } else {
                    // Sessão expirada
                    this.logout();
                }
            } catch (error) {
                console.error('Erro ao verificar sessão:', error);
                this.logout();
            }
        }
    }

    // Configurar listeners dos formulários
    setupFormListeners() {
        // Formulário de login
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Formulário de cadastro
        const cadastroForm = document.getElementById('cadastro-form');
        if (cadastroForm) {
            cadastroForm.addEventListener('submit', (e) => this.handleCadastro(e));
        }

        // Botão de logout (se existir)
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    // Processar login
    async handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const email = formData.get('email').trim();
        const senha = formData.get('senha');
        const lembrar = formData.get('lembrar') === 'on';

        // Validação básica
        if (!email || !senha) {
            this.showError('Por favor, preencha todos os campos.');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showError('Por favor, digite um email válido.');
            return;
        }

        // Mostrar loading
        this.showLoading(e.target.querySelector('.btn-primary'));

        try {
            // Simular autenticação (em um projeto real, isso seria uma chamada para API)
            const user = await this.authenticateUser(email, senha);
            
            if (user) {
                // Login bem-sucedido
                this.login(user, lembrar);
                this.showSuccess('Login realizado com sucesso!');
                
                // Redirecionar após um breve delay
                setTimeout(() => {
                    this.redirectAfterLogin();
                }, 1500);
            } else {
                this.showError('Email ou senha incorretos.');
            }
        } catch (error) {
            console.error('Erro no login:', error);
            this.showError('Erro interno. Tente novamente.');
        } finally {
            this.hideLoading(e.target.querySelector('.btn-primary'));
        }
    }

    // Processar cadastro
    async handleCadastro(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const nome = formData.get('nome').trim();
        const email = formData.get('email').trim();
        const ddd = formData.get('ddd').trim();
        const numero = formData.get('numero').trim();
        const senha = formData.get('senha');
        const confirmarSenha = formData.get('confirmar-senha');
        const termos = formData.get('termos') === 'on';

        // Validações
        if (!nome || !email || !ddd || !numero || !senha || !confirmarSenha) {
            this.showError('Por favor, preencha todos os campos.');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showError('Por favor, digite um email válido.');
            return;
        }

        if (senha !== confirmarSenha) {
            this.showError('As senhas não coincidem.');
            return;
        }

        if (senha.length < 6) {
            this.showError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        if (!termos) {
            this.showError('Você deve aceitar os termos de uso.');
            return;
        }

        // Mostrar loading
        this.showLoading(e.target.querySelector('.btn-primary'));

        try {
            // Simular cadastro (em um projeto real, isso seria uma chamada para API)
            const user = await this.registerUser({
                nome,
                email,
                telefone: `(${ddd}) ${numero}`,
                senha
            });
            
            if (user) {
                this.showSuccess('Cadastro realizado com sucesso!');
                
                // Limpar formulário
                e.target.reset();
                
                // Opcional: fazer login automático após cadastro
                setTimeout(() => {
                    this.login(user, false);
                    this.redirectAfterLogin();
                }, 2000);
            }
        } catch (error) {
            console.error('Erro no cadastro:', error);
            this.showError('Erro interno. Tente novamente.');
        } finally {
            this.hideLoading(e.target.querySelector('.btn-primary'));
        }
    }

    // Simular autenticação (substituir por chamada real de API)
    async authenticateUser(email, senha) {
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Usuários de teste (em produção, isso viria de um banco de dados)
        const testUsers = [
            {
                id: 1,
                nome: 'João Silva',
                email: 'joao@teste.com',
                senha: '123456',
                telefone: '(11) 99999-9999',
                tipo: 'cliente',
                dataCadastro: new Date().toISOString()
            },
            {
                id: 2,
                nome: 'Maria Santos',
                email: 'maria@teste.com',
                senha: '123456',
                telefone: '(11) 88888-8888',
                tipo: 'admin',
                dataCadastro: new Date().toISOString()
            }
        ];

        const user = testUsers.find(u => u.email === email && u.senha === senha);
        
        if (user) {
            // Remover senha do objeto retornado
            const { senha, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        
        return null;
    }

    // Simular cadastro (substituir por chamada real de API)
    async registerUser(userData) {
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Verificar se email já existe
        const existingUsers = this.getStoredUsers();
        if (existingUsers.find(u => u.email === userData.email)) {
            throw new Error('Email já cadastrado');
        }
        
        // Criar novo usuário
        const newUser = {
            id: Date.now(),
            nome: userData.nome,
            email: userData.email,
            telefone: userData.telefone,
            tipo: 'cliente',
            dataCadastro: new Date().toISOString()
        };
        
        // Salvar usuário (em produção, isso seria feito no servidor)
        existingUsers.push(newUser);
        localStorage.setItem('chicasEventos_users', JSON.stringify(existingUsers));
        
        return newUser;
    }

    // Obter usuários armazenados localmente
    getStoredUsers() {
        const users = localStorage.getItem('chicasEventos_users');
        return users ? JSON.parse(users) : [];
    }

    // Realizar login
    login(user, lembrar = false) {
        this.currentUser = user;
        this.isLoggedIn = true;
        
        // Salvar sessão
        const sessionData = {
            user: user,
            timestamp: new Date().getTime(),
            lembrar: lembrar
        };
        
        localStorage.setItem('chicasEventos_session', JSON.stringify(sessionData));
        
        // Atualizar UI
        this.updateUIForLoggedInUser();
        
        console.log('Usuário logado:', user.nome);
    }

    // Realizar logout
    logout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        
        // Remover sessão
        localStorage.removeItem('chicasEventos_session');
        
        // Atualizar UI
        this.updateUIForLoggedOutUser();
        
        // Redirecionar para página inicial
        const currentPath = window.location.pathname;
        if (currentPath.includes('dashboard') || currentPath.includes('pages/')) {
            window.location.href = '../../index.html';
        } else {
            window.location.href = 'index.html';
        }
        
        console.log('Usuário deslogado');
    }

    // Redirecionar após login
    redirectAfterLogin() {
        // Limpar qualquer URL de retorno salva
        sessionStorage.removeItem('chicasEventos_returnUrl');
        
        // Sempre redirecionar para dashboard após login
        const currentPath = window.location.pathname;
        if (currentPath.includes('pages/login/')) {
            window.location.href = '../dashboard/dashboard.html';
        } else {
            window.location.href = 'pages/dashboard/dashboard.html';
        }
    }

    // Proteger rotas que requerem autenticação
    protectRoutes() {
        const protectedRoutes = ['dashboard', 'criar-evento', 'editar-evento', 'carrinho'];
        const currentPath = window.location.pathname;
        
        const isProtectedRoute = protectedRoutes.some(route => 
            currentPath.includes(route)
        );
        
        if (isProtectedRoute && !this.isLoggedIn) {
            // Salvar URL atual para redirecionamento após login
            sessionStorage.setItem('chicasEventos_returnUrl', window.location.href);
            
            // Redirecionar para login
            const currentPath = window.location.pathname;
            let loginPath = '../login/login.html';
            
            // Ajustar caminho baseado na profundidade da página atual
            if (currentPath.includes('/pages/')) {
                const pathDepth = currentPath.split('/').length - 3;
                loginPath = '../'.repeat(pathDepth) + 'login/login.html';
            } else if (currentPath.includes('/index/')) {
                loginPath = '../login/login.html';
            } else {
                loginPath = 'pages/login/login.html';
            }
            
            window.location.href = loginPath;
        }
    }

    // Atualizar UI para usuário logado
    updateUIForLoggedInUser() {
        // Esconder botão de login
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.style.display = 'none';
        }

        // Mostrar menu do usuário
        const userMenu = document.getElementById('user-menu');
        if (userMenu) {
            userMenu.style.display = 'block';
        }

        // Atualizar nome do usuário
        const userNameElement = document.getElementById('user-name');
        if (userNameElement && this.currentUser) {
            userNameElement.textContent = this.currentUser.nome.toUpperCase();
        }

        // Configurar dropdown do usuário
        this.setupUserDropdown();

        // Mostrar informações do usuário se houver elementos para isso
        const userInfoElements = document.querySelectorAll('.user-info');
        userInfoElements.forEach(element => {
            element.textContent = `Olá, ${this.currentUser.nome}`;
            element.style.display = 'block';
        });

        // Adicionar classe ao body para estilos condicionais
        document.body.classList.add('user-logged-in');
    }

    // Atualizar navbar para usuário logado
    updateNavbarForLoggedUser() {
        // Atualizar nome do usuário no botão
        const userNameElement = document.querySelector('.user-name');
        if (userNameElement && this.currentUser) {
            userNameElement.textContent = this.currentUser.nome.toUpperCase();
        }

        // Configurar dropdown menu
        this.setupUserDropdown();
    }

    // Configurar dropdown do usuário
    setupUserDropdown() {
        const userBtn = document.getElementById('user-btn');
        const dropdownMenu = document.getElementById('dropdown-menu');
        const logoutBtn = document.getElementById('logout-btn');

        if (userBtn && dropdownMenu) {
            // Toggle do dropdown
            userBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownMenu.classList.toggle('show');
            });

            // Fechar dropdown ao clicar fora
            document.addEventListener('click', (e) => {
                if (!userBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                    dropdownMenu.classList.remove('show');
                }
            });

            // Configurar logout
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
            }
        }
    }

    // Atualizar UI para usuário deslogado
    updateUIForLoggedOutUser() {
        // Mostrar botão de login
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.style.display = 'block';
            loginBtn.textContent = 'LOG IN';
            loginBtn.onclick = () => this.redirectToLogin();
        }

        // Esconder menu do usuário
        const userMenu = document.getElementById('user-menu');
        if (userMenu) {
            userMenu.style.display = 'none';
        }

        // Fechar dropdown se estiver aberto
        const dropdownMenu = document.getElementById('dropdown-menu');
        if (dropdownMenu) {
            dropdownMenu.classList.remove('show');
        }

        // Esconder informações do usuário
        const userInfoElements = document.querySelectorAll('.user-info');
        userInfoElements.forEach(element => {
            element.style.display = 'none';
        });

        // Remover classe do body
        document.body.classList.remove('user-logged-in');
    }

    // Validação de email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Mostrar erro
    showError(message) {
        if (window.ChicasEventos && window.ChicasEventos.showNotification) {
            window.ChicasEventos.showNotification(message, 'error');
        } else {
            alert(message);
        }
    }

    // Mostrar sucesso
    showSuccess(message) {
        if (window.ChicasEventos && window.ChicasEventos.showNotification) {
            window.ChicasEventos.showNotification(message, 'success');
        } else {
            alert(message);
        }
    }

    // Mostrar loading
    showLoading(button) {
        if (button) {
            button.disabled = true;
            button.dataset.originalText = button.textContent;
            button.textContent = 'Carregando...';
            button.style.opacity = '0.7';
        }
    }

    // Esconder loading
    hideLoading(button) {
        if (button) {
            button.disabled = false;
            button.textContent = button.dataset.originalText || 'Entrar';
            button.style.opacity = '1';
        }
    }

    // Verificar se usuário está logado
    isUserLoggedIn() {
        return this.isLoggedIn && this.currentUser !== null;
    }

    // Obter usuário atual
    getCurrentUser() {
        return this.currentUser;
    }

    // Verificar se usuário é admin
    isAdmin() {
        return this.currentUser && this.currentUser.tipo === 'admin';
    }

    // Redirecionar para página de login
    redirectToLogin() {
        // Salvar URL atual para retorno após login
        sessionStorage.setItem('chicasEventos_returnUrl', window.location.href);
        
        // Determinar caminho para login baseado na localização atual
        const currentPath = window.location.pathname;
        let loginPath;
        
        if (currentPath.includes('pages/')) {
            loginPath = '../login/login.html';
        } else {
            loginPath = 'pages/login/login.html';
        }
        
        // Redirecionar
        if (window.location.pathname !== loginPath) {
            window.location.href = loginPath;
        }
    }

    // Configurar botão de login
    setupLoginButton() {
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn && !this.isLoggedIn) {
            loginBtn.onclick = () => this.redirectToLogin();
        }
    }
}

// Inicializar sistema de autenticação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});

// Exportar para uso global
window.AuthSystem = AuthSystem;
