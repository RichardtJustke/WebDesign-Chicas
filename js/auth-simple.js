// Sistema de Autenticação Simplificado - Chicas Eventos
// Versão simplificada para garantir funcionamento

class SimpleAuthSystem {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.init();
    }

    init() {
        console.log('🚀 Inicializando sistema de autenticação simplificado...');
        this.checkSession();
        this.setupFormListeners();
        this.initNotifications();
        console.log('✅ Sistema simplificado inicializado');
    }

    // Verificar sessão existente
    checkSession() {
        try {
            const sessionData = localStorage.getItem('chicasEventos_session');
            if (sessionData) {
                const session = JSON.parse(sessionData);
                const now = new Date().getTime();
                const sessionTimeout = 24 * 60 * 60 * 1000; // 24 horas
                
                if (now - session.timestamp < sessionTimeout) {
                    this.currentUser = session.user;
                    this.isLoggedIn = true;
                    this.updateUIForLoggedInUser();
                    console.log('✅ Sessão restaurada:', this.currentUser.nome);
                } else {
                    this.logout();
                }
            }
        } catch (error) {
            console.error('❌ Erro ao verificar sessão:', error);
            this.logout();
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
    }

    // Processar login
    async handleLogin(e) {
        e.preventDefault();
        console.log('🔑 Processando login...');
        
        try {
            const formData = new FormData(e.target);
            const email = formData.get('email')?.trim() || '';
            const senha = formData.get('senha') || '';
            const lembrar = formData.get('lembrar') === 'on';

            console.log('📝 Dados:', { email: email ? '***' : 'vazio', lembrar });

            // Validação
            if (!email || !senha) {
                this.showError('Por favor, preencha todos os campos.');
                return;
            }

            if (!this.isValidEmail(email)) {
                this.showError('Por favor, digite um email válido.');
                return;
            }

            // Mostrar loading
            const submitButton = e.target.querySelector('.btn-primary');
            if (submitButton) {
                this.showLoading(submitButton);
            }

            // Autenticar
            const user = await this.authenticateUser(email, senha);
            
            if (user) {
                console.log('✅ Usuário autenticado:', user.nome);
                this.login(user, lembrar);
                this.showSuccess('Login realizado com sucesso!');
                
                setTimeout(() => {
                    this.redirectAfterLogin();
                }, 1500);
            } else {
                this.showError('Email ou senha incorretos.');
            }
        } catch (error) {
            console.error('❌ Erro no login:', error);
            this.showError('Erro interno. Tente novamente.');
        } finally {
            const submitButton = e.target.querySelector('.btn-primary');
            if (submitButton) {
                this.hideLoading(submitButton);
            }
        }
    }

    // Processar cadastro
    async handleCadastro(e) {
        e.preventDefault();
        console.log('🔧 Processando cadastro...');
        
        try {
            const formData = new FormData(e.target);
            const nome = formData.get('nome')?.trim() || '';
            const email = formData.get('email')?.trim() || '';
            const ddd = formData.get('ddd')?.trim() || '';
            const numero = formData.get('numero')?.trim() || '';
            const senha = formData.get('senha') || '';
            const confirmarSenha = formData.get('confirmar-senha') || '';
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
            const submitButton = e.target.querySelector('.btn-primary');
            if (submitButton) {
                this.showLoading(submitButton);
            }

            // Criar usuário
            const user = await this.registerUser({
                nome,
                email,
                telefone: `(${ddd}) ${numero}`,
                senha
            });
            
            if (user) {
                this.showSuccess('Cadastro realizado com sucesso!');
                e.target.reset();
                
                setTimeout(() => {
                    this.login(user, false);
                    this.redirectAfterLogin();
                }, 2000);
            } else {
                this.showError('Falha ao criar usuário.');
            }
        } catch (error) {
            console.error('❌ Erro no cadastro:', error);
            this.showError(`Erro: ${error.message}`);
        } finally {
            const submitButton = e.target.querySelector('.btn-primary');
            if (submitButton) {
                this.hideLoading(submitButton);
            }
        }
    }

    // Autenticar usuário
    async authenticateUser(email, senha) {
        console.log('🔐 Autenticando usuário...');
        
        try {
            // Simular delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Usuários de teste
            const testUsers = [
                {
                    id: 1,
                    nome: 'João Silva',
                    email: 'joao@teste.com',
                    senha: '123456',
                    telefone: '(11) 99999-9999',
                    tipo: 'cliente',
                    dataCadastro: new Date().toISOString(),
                    ativo: true
                },
                {
                    id: 2,
                    nome: 'Maria Santos',
                    email: 'maria@teste.com',
                    senha: '123456',
                    telefone: '(11) 88888-8888',
                    tipo: 'admin',
                    dataCadastro: new Date().toISOString(),
                    ativo: true
                },
                {
                    id: 3,
                    nome: 'Ana Costa',
                    email: 'ana@teste.com',
                    senha: '123456',
                    telefone: '(11) 77777-7777',
                    tipo: 'cliente',
                    dataCadastro: new Date().toISOString(),
                    ativo: true
                }
            ];

            console.log('👥 Verificando usuários de teste...');
            const user = testUsers.find(u => u.email === email && u.senha === senha);
            
            if (user) {
                console.log('✅ Usuário encontrado:', user.nome);
                // Remover senha do objeto retornado
                const { senha, ...userWithoutPassword } = user;
                return userWithoutPassword;
            } else {
                console.log('❌ Usuário não encontrado');
                return null;
            }
        } catch (error) {
            console.error('❌ Erro na autenticação:', error);
            throw new Error(`Erro na autenticação: ${error.message}`);
        }
    }

    // Registrar usuário
    async registerUser(userData) {
        console.log('🔄 Registrando usuário...');
        
        try {
            // Simular delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Criar novo usuário
            const newUser = {
                id: Date.now(),
                nome: userData.nome,
                email: userData.email,
                telefone: userData.telefone,
                tipo: 'cliente',
                dataCadastro: new Date().toISOString(),
                ativo: true
            };
            
            console.log('👤 Usuário criado:', newUser);
            return newUser;
        } catch (error) {
            console.error('❌ Erro ao registrar usuário:', error);
            throw error;
        }
    }

    // Fazer login
    login(user, lembrar = false) {
        console.log('🔑 Fazendo login...');
        
        this.currentUser = user;
        this.isLoggedIn = true;
        
        // Salvar sessão
        const sessionData = {
            user: user,
            timestamp: new Date().getTime(),
            lembrar: lembrar
        };
        
        localStorage.setItem('chicasEventos_session', JSON.stringify(sessionData));
        
        // Disparar evento
        window.dispatchEvent(new CustomEvent('userLoggedIn', {
            detail: { user: user }
        }));
        
        // Atualizar UI
        this.updateUIForLoggedInUser();
        
        console.log('✅ Login realizado:', user.nome);
    }

    // Fazer logout
    logout() {
        console.log('🚪 Fazendo logout...');
        
        // Remover sessão
        localStorage.removeItem('chicasEventos_session');
        
        // Limpar estado
        this.currentUser = null;
        this.isLoggedIn = false;
        
        // Disparar evento
        window.dispatchEvent(new CustomEvent('userLoggedOut', {
            detail: { user: null }
        }));
        
        // Atualizar UI
        this.updateUIForLoggedOutUser();
        
        // Redirecionar
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 100);
        
        console.log('✅ Logout realizado');
    }

    // Redirecionar após login
    redirectAfterLogin() {
        const currentPath = window.location.pathname;
        if (currentPath.includes('pages/login/')) {
            window.location.href = '../dashboard/dashboard.html';
        } else {
            window.location.href = 'pages/dashboard/dashboard.html';
        }
    }

    // Atualizar UI para usuário logado
    updateUIForLoggedInUser() {
        console.log('🎨 Atualizando UI para usuário logado');
        
        const loginBtn = document.getElementById('login-btn');
        const userBtn = document.getElementById('user-btn');
        
        if (loginBtn) {
            loginBtn.style.display = 'none';
        }

        if (userBtn) {
            userBtn.style.display = 'block';
            if (this.currentUser) {
                userBtn.textContent = this.currentUser.nome.toUpperCase();
            }
        }

        // Configurar dropdown
        this.setupUserDropdown();
    }

    // Atualizar UI para usuário deslogado
    updateUIForLoggedOutUser() {
        console.log('🎨 Atualizando UI para usuário deslogado');
        
        const loginBtn = document.getElementById('login-btn');
        const userBtn = document.getElementById('user-btn');
        
        if (loginBtn) {
            loginBtn.style.display = 'block';
        }

        if (userBtn) {
            userBtn.style.display = 'none';
        }
    }

    // Configurar dropdown do usuário
    setupUserDropdown() {
        const userBtn = document.getElementById('user-btn');
        const dropdownMenu = document.getElementById('dropdown-menu');
        const logoutBtn = document.getElementById('logout-btn');

        if (userBtn && dropdownMenu) {
            userBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const isOpen = dropdownMenu.classList.contains('show');
                if (isOpen) {
                    dropdownMenu.classList.remove('show');
                    userBtn.classList.remove('active');
                } else {
                    dropdownMenu.classList.add('show');
                    userBtn.classList.add('active');
                }
            });

            // Fechar ao clicar fora
            document.addEventListener('click', (e) => {
                if (!userBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                    dropdownMenu.classList.remove('show');
                    userBtn.classList.remove('active');
                }
            });

            // Configurar logout
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (confirm('Tem certeza que deseja sair da sua conta?')) {
                        this.logout();
                    }
                });
            }
        }
    }

    // Inicializar notificações
    initNotifications() {
        setTimeout(() => {
            if (!document.querySelector('.notifications-container')) {
                const container = document.createElement('div');
                container.className = 'notifications-container';
                container.style.cssText = `
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    z-index: 10000;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                `;
                document.body.appendChild(container);
            }
        }, 100);
    }

    // Mostrar erro
    showError(message) {
        console.error('❌ Erro:', message);
        alert('❌ ' + message);
    }

    // Mostrar sucesso
    showSuccess(message) {
        console.log('✅ Sucesso:', message);
        alert('✅ ' + message);
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

    // Validar email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Verificar se usuário está logado
    isUserLoggedIn() {
        return this.isLoggedIn && this.currentUser !== null;
    }

    // Obter usuário atual
    getCurrentUser() {
        return this.currentUser;
    }
}

// Inicializar sistema quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.simpleAuthSystem = new SimpleAuthSystem();
});

// Exportar para uso global
window.SimpleAuthSystem = SimpleAuthSystem;
