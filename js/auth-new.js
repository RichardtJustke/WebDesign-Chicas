// Sistema de Autenticação Refatorado - Chicas Eventos
// Sistema completo com persistência de dados e rastreamento de atividades

class NewAuthSystem {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.sessionTimeout = 24 * 60 * 60 * 1000; // 24 horas
        this.init();
    }

    init() {
        console.log('🚀 Inicializando novo sistema de autenticação...');
        
        // Verificar sessão existente
        this.checkSession();
        
        // Configurar listeners
        this.setupFormListeners();
        
        // Configurar botão de login
        this.setupLoginButton();
        
        // Proteger rotas
        this.protectRoutes();
        
        // Inicializar sistema de notificações
        this.initNotifications();
        
        console.log('✅ Novo sistema de autenticação inicializado');
    }

    // Verificar sessão existente
    checkSession() {
        try {
            const sessionData = localStorage.getItem('chicasEventos_session');
            if (sessionData) {
                const session = JSON.parse(sessionData);
                const now = new Date().getTime();
                
                if (now - session.timestamp < this.sessionTimeout) {
                    this.currentUser = session.user;
                    this.isLoggedIn = true;
                    this.updateUIForLoggedInUser();
                    this.logActivity('session_restored', 'Sessão restaurada');
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
        
        console.log('🔑 Iniciando processo de login...');
        
        try {
            const formData = new FormData(e.target);
            const email = formData.get('email')?.trim() || '';
            const senha = formData.get('senha') || '';
            const lembrar = formData.get('lembrar') === 'on';

            console.log('📝 Dados coletados:', { email: email ? '***' : 'vazio', lembrar });

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

            // Autenticar usuário
            const user = await this.authenticateUser(email, senha);
            
            if (user) {
                console.log('✅ Usuário autenticado:', user.nome);
                
                // Fazer login
                this.login(user, lembrar);
                this.showSuccess('Login realizado com sucesso!');
                
                // Log da atividade
                this.logActivity('login_success', 'Login realizado com sucesso', { email });
                
                // Redirecionar
                setTimeout(() => {
                    this.redirectAfterLogin();
                }, 1500);
            } else {
                this.showError('Email ou senha incorretos.');
                this.logActivity('login_failed', 'Tentativa de login falhou', { email });
            }
        } catch (error) {
            console.error('❌ Erro no login:', error);
            this.showError('Erro interno. Tente novamente.');
            this.logActivity('login_error', 'Erro interno no login', { error: error.message });
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
        console.log('🔧 Iniciando processo de cadastro...');
        
        try {
            const formData = new FormData(e.target);
            const nome = formData.get('nome')?.trim() || '';
            const email = formData.get('email')?.trim() || '';
            const ddd = formData.get('ddd')?.trim() || '';
            const numero = formData.get('numero')?.trim() || '';
            const senha = formData.get('senha') || '';
            const confirmarSenha = formData.get('confirmar-senha') || '';
            const termos = formData.get('termos') === 'on';

            console.log('📝 Dados coletados:', { nome, email, ddd, numero, termos });

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
                
                // Log da atividade
                this.logActivity('user_registered', 'Novo usuário cadastrado', { email, nome });
                
                // Login automático
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
            this.logActivity('registration_error', 'Erro no cadastro', { error: error.message });
        } finally {
            const submitButton = e.target.querySelector('.btn-primary');
            if (submitButton) {
                this.hideLoading(submitButton);
            }
        }
    }

    // Autenticar usuário
    async authenticateUser(email, senha) {
        console.log('🔐 Iniciando autenticação...');
        
        try {
            // Simular delay de rede
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Buscar usuários salvos
            const savedUsers = this.getStoredUsers();
            console.log('👥 Usuários salvos encontrados:', savedUsers.length);
            
            // Usuários de teste padrão (só se não houver usuários salvos)
            const defaultUsers = [
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

            // Se não há usuários salvos, usar os padrão
            if (savedUsers.length === 0) {
                this.saveUsers(defaultUsers);
                console.log('✅ Usuários padrão salvos');
            }

            // Buscar usuário
            const allUsers = this.getStoredUsers();
            const user = allUsers.find(u => u.email === email && u.senha === senha && u.ativo !== false);
            
            if (user) {
                console.log('✅ Usuário encontrado:', user.nome);
                // Remover senha do objeto retornado
                const { senha, ...userWithoutPassword } = user;
                return userWithoutPassword;
            } else {
                console.log('❌ Usuário não encontrado ou credenciais inválidas');
                return null;
            }
        } catch (error) {
            console.error('❌ Erro na autenticação:', error);
            throw new Error(`Erro na autenticação: ${error.message}`);
        }
    }

    // Registrar usuário
    async registerUser(userData) {
        console.log('🔄 Registrando novo usuário...');
        
        try {
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
                dataCadastro: new Date().toISOString(),
                ativo: true,
                ultimoAcesso: new Date().toISOString(),
                totalLogins: 0,
                atividades: []
            };
            
            console.log('👤 Novo usuário criado:', newUser);
            
            // Salvar usuário
            existingUsers.push(newUser);
            this.saveUsers(existingUsers);
            
            console.log('💾 Usuário salvo com sucesso');
            
            return newUser;
        } catch (error) {
            console.error('❌ Erro ao registrar usuário:', error);
            throw error;
        }
    }

    // Obter usuários salvos
    getStoredUsers() {
        try {
            const users = localStorage.getItem('chicasEventos_users');
            return users ? JSON.parse(users) : [];
        } catch (error) {
            console.error('❌ Erro ao obter usuários:', error);
            return [];
        }
    }

    // Salvar usuários
    saveUsers(users) {
        try {
            localStorage.setItem('chicasEventos_users', JSON.stringify(users));
            
            // Criar backup
            const backupKey = `chicasEventos_users_backup_${Date.now()}`;
            localStorage.setItem(backupKey, JSON.stringify(users));
            
            // Limpar backups antigos (manter apenas os últimos 5)
            this.cleanOldBackups();
            
            console.log('💾 Usuários salvos com backup');
            return true;
        } catch (error) {
            console.error('❌ Erro ao salvar usuários:', error);
            return false;
        }
    }

    // Limpar backups antigos
    cleanOldBackups() {
        try {
            const backupKeys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('chicasEventos_users_backup_')) {
                    backupKeys.push(key);
                }
            }
            
            // Ordenar por timestamp
            backupKeys.sort((a, b) => {
                const timestampA = parseInt(a.split('_').pop());
                const timestampB = parseInt(b.split('_').pop());
                return timestampB - timestampA;
            });
            
            // Remover backups antigos (manter apenas os 5 mais recentes)
            if (backupKeys.length > 5) {
                for (let i = 5; i < backupKeys.length; i++) {
                    localStorage.removeItem(backupKeys[i]);
                }
            }
        } catch (error) {
            console.error('❌ Erro ao limpar backups:', error);
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
        
        // Atualizar dados do usuário
        this.updateUserActivity(user.id, 'login');
        
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
        
        if (this.currentUser) {
            this.updateUserActivity(this.currentUser.id, 'logout');
        }
        
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

    // Atualizar atividade do usuário
    updateUserActivity(userId, action, details = {}) {
        try {
            const users = this.getStoredUsers();
            const userIndex = users.findIndex(u => u.id === userId);
            
            if (userIndex >= 0) {
                const user = users[userIndex];
                
                // Atualizar dados básicos
                if (action === 'login') {
                    user.totalLogins = (user.totalLogins || 0) + 1;
                    user.ultimoAcesso = new Date().toISOString();
                }
                
                // Adicionar atividade
                const activity = {
                    id: Date.now(),
                    action: action,
                    timestamp: new Date().toISOString(),
                    details: details
                };
                
                if (!user.atividades) {
                    user.atividades = [];
                }
                
                user.atividades.push(activity);
                
                // Manter apenas as últimas 100 atividades
                if (user.atividades.length > 100) {
                    user.atividades = user.atividades.slice(-100);
                }
                
                // Salvar usuário atualizado
                users[userIndex] = user;
                this.saveUsers(users);
                
                console.log('📝 Atividade registrada:', action);
            }
        } catch (error) {
            console.error('❌ Erro ao atualizar atividade:', error);
        }
    }

    // Log de atividade do sistema
    logActivity(action, description, details = {}) {
        try {
            const logEntry = {
                id: Date.now(),
                action: action,
                description: description,
                timestamp: new Date().toISOString(),
                details: details,
                user: this.currentUser ? this.currentUser.nome : 'Sistema'
            };
            
            const logs = this.getSystemLogs();
            logs.push(logEntry);
            
            // Manter apenas os últimos 500 logs
            if (logs.length > 500) {
                logs.splice(0, logs.length - 500);
            }
            
            localStorage.setItem('chicasEventos_system_logs', JSON.stringify(logs));
            
            console.log('📋 Log do sistema:', description);
        } catch (error) {
            console.error('❌ Erro ao registrar log:', error);
        }
    }

    // Obter logs do sistema
    getSystemLogs() {
        try {
            const logs = localStorage.getItem('chicasEventos_system_logs');
            return logs ? JSON.parse(logs) : [];
        } catch (error) {
            console.error('❌ Erro ao obter logs:', error);
            return [];
        }
    }

    // Obter estatísticas
    getStats() {
        try {
            const users = this.getStoredUsers();
            const logs = this.getSystemLogs();
            
            return {
                totalUsers: users.length,
                activeUsers: users.filter(u => u.ativo !== false).length,
                totalLogins: users.reduce((sum, u) => sum + (u.totalLogins || 0), 0),
                systemLogs: logs.length,
                lastActivity: logs.length > 0 ? logs[logs.length - 1].timestamp : null
            };
        } catch (error) {
            console.error('❌ Erro ao obter estatísticas:', error);
            return {};
        }
    }

    // Exportar dados
    exportData() {
        try {
            const data = {
                users: this.getStoredUsers(),
                logs: this.getSystemLogs(),
                stats: this.getStats(),
                exportDate: new Date().toISOString()
            };
            
            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `chicas_eventos_data_${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            console.log('📤 Dados exportados');
            return data;
        } catch (error) {
            console.error('❌ Erro ao exportar dados:', error);
            return null;
        }
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

    // Proteger rotas
    protectRoutes() {
        const protectedRoutes = ['dashboard', 'criar-evento', 'editar-evento', 'carrinho'];
        const currentPath = window.location.pathname;
        
        const isProtectedRoute = protectedRoutes.some(route => 
            currentPath.includes(route)
        );
        
        if (isProtectedRoute && !this.isLoggedIn) {
            sessionStorage.setItem('chicasEventos_returnUrl', window.location.href);
            
            const currentPath = window.location.pathname;
            let loginPath = '../login/login.html';
            
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

    // Configurar botão de login
    setupLoginButton() {
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn && !this.isLoggedIn) {
            loginBtn.onclick = () => this.redirectToLogin();
        }
    }

    // Redirecionar para login
    redirectToLogin() {
        sessionStorage.setItem('chicasEventos_returnUrl', window.location.href);
        
        const currentPath = window.location.pathname;
        let loginPath;
        
        if (currentPath.includes('pages/')) {
            loginPath = '../login/login.html';
        } else {
            loginPath = 'pages/login/login.html';
        }
        
        window.location.href = loginPath;
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
        
        try {
            if (window.ChicasEventos && window.ChicasEventos.showNotification) {
                window.ChicasEventos.showNotification(message, 'error');
            } else if (typeof showNotification === 'function') {
                showNotification(message, 'error');
            } else {
                this.createManualNotification(message, 'error');
            }
        } catch (error) {
            console.error('❌ Erro ao mostrar notificação:', error);
            alert('❌ ' + message);
        }
    }

    // Mostrar sucesso
    showSuccess(message) {
        console.log('✅ Sucesso:', message);
        
        try {
            if (window.ChicasEventos && window.ChicasEventos.showNotification) {
                window.ChicasEventos.showNotification(message, 'success');
            } else if (typeof showNotification === 'function') {
                showNotification(message, 'success');
            } else {
                this.createManualNotification(message, 'success');
            }
        } catch (error) {
            console.error('❌ Erro ao mostrar notificação:', error);
            alert('✅ ' + message);
        }
    }

    // Criar notificação manual
    createManualNotification(message, type = 'info') {
        try {
            let container = document.querySelector('.notifications-container');
            if (!container) {
                container = document.createElement('div');
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
            
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            
            const colors = {
                success: '#059669',
                error: '#dc2626',
                warning: '#d97706',
                info: '#2563eb'
            };
            
            const icons = {
                success: '✅',
                error: '❌',
                warning: '⚠️',
                info: 'ℹ️'
            };
            
            notification.style.cssText = `
                background: ${colors[type] || colors.info};
                color: white;
                padding: 12px 16px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                font-size: 14px;
                font-weight: 500;
                max-width: 300px;
                word-wrap: break-word;
                animation: slideIn 0.3s ease-out;
            `;
            
            notification.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span>${icons[type] || icons.info}</span>
                    <span>${message}</span>
                </div>
            `;
            
            container.appendChild(notification);
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.animation = 'slideOut 0.3s ease-in';
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.parentNode.removeChild(notification);
                        }
                    }, 300);
                }
            }, 5000);
            
        } catch (error) {
            console.error('❌ Erro ao criar notificação:', error);
            alert(`${type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'} ${message}`);
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

    // Verificar se usuário é admin
    isAdmin() {
        return this.currentUser && this.currentUser.tipo === 'admin';
    }
}

// Inicializar sistema quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.newAuthSystem = new NewAuthSystem();
});

// Exportar para uso global
window.NewAuthSystem = NewAuthSystem;
