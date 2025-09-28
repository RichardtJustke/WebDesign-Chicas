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
        
        // Garantir que o sistema de notificações esteja disponível
        this.ensureNotificationsAvailable();
        
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

        // Botão de logout será configurado pelo NavbarSystem
        // Removido para evitar duplicação de event listeners
    }

    // Processar login
    async handleLogin(e) {
        e.preventDefault();
        
        console.log('🔑 Iniciando processo de login...');
        
        try {
            const formData = new FormData(e.target);
            const email = formData.get('email') ? formData.get('email').trim() : '';
            const senha = formData.get('senha') || '';
            const lembrar = formData.get('lembrar') === 'on';

            console.log('📝 Dados coletados:', { email: email ? '***' : 'vazio', senha: senha ? '***' : 'vazio', lembrar });

            // Validação básica
            if (!email || !senha) {
                console.log('❌ Campos obrigatórios não preenchidos');
                this.showError('Por favor, preencha todos os campos.');
                return;
            }

            if (!this.isValidEmail(email)) {
                console.log('❌ Email inválido:', email);
                this.showError('Por favor, digite um email válido.');
                return;
            }

            console.log('✅ Validações passaram, iniciando autenticação...');

            // Mostrar loading
            const submitButton = e.target.querySelector('.btn-primary');
            if (submitButton) {
                this.showLoading(submitButton);
            }

            // Simular autenticação (em um projeto real, isso seria uma chamada para API)
            console.log('🔄 Chamando authenticateUser...');
            const user = await this.authenticateUser(email, senha);
            
            if (user) {
                console.log('✅ Usuário autenticado:', user.nome);
                
                // Login bem-sucedido
                this.login(user, lembrar);
                this.showSuccess('Login realizado com sucesso!');
                
                // Redirecionar após um breve delay
                setTimeout(() => {
                    console.log('🔄 Redirecionando após login...');
                    this.redirectAfterLogin();
                }, 1500);
            } else {
                console.log('❌ Credenciais inválidas');
                this.showError('Email ou senha incorretos.');
            }
        } catch (error) {
            console.error('❌ Erro no login:', error);
            console.error('Stack trace:', error.stack);
            
            // Tentar identificar o tipo de erro
            let errorMessage = 'Erro interno. Tente novamente.';
            
            if (error.message.includes('notifications')) {
                errorMessage = 'Erro no sistema de notificações. Tente novamente.';
            } else if (error.message.includes('localStorage')) {
                errorMessage = 'Erro no armazenamento local. Tente novamente.';
            } else if (error.message.includes('DOM')) {
                errorMessage = 'Erro na interface. Recarregue a página.';
            }
            
            this.showError(errorMessage);
        } finally {
            const submitButton = e.target.querySelector('.btn-primary');
            if (submitButton) {
                this.hideLoading(submitButton);
            }
            console.log('🏁 Processo de login finalizado');
        }
    }

    // Processar cadastro
    async handleCadastro(e) {
        e.preventDefault();
        console.log('🔧 Iniciando processo de cadastro...');
        
        const formData = new FormData(e.target);
        const nome = formData.get('nome').trim();
        const email = formData.get('email').trim();
        const ddd = formData.get('ddd').trim();
        const numero = formData.get('numero').trim();
        const senha = formData.get('senha');
        const confirmarSenha = formData.get('confirmar-senha');
        const termos = formData.get('termos') === 'on';

        console.log('📝 Dados coletados:', { nome, email, ddd, numero, termos });

        // Validações
        if (!nome || !email || !ddd || !numero || !senha || !confirmarSenha) {
            console.log('❌ Campos obrigatórios não preenchidos');
            this.showError('Por favor, preencha todos os campos.');
            return;
        }

        if (!this.isValidEmail(email)) {
            console.log('❌ Email inválido:', email);
            this.showError('Por favor, digite um email válido.');
            return;
        }

        if (senha !== confirmarSenha) {
            console.log('❌ Senhas não coincidem');
            this.showError('As senhas não coincidem.');
            return;
        }

        if (senha.length < 6) {
            console.log('❌ Senha muito curta:', senha.length);
            this.showError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        if (!termos) {
            console.log('❌ Termos não aceitos');
            this.showError('Você deve aceitar os termos de uso.');
            return;
        }

        console.log('✅ Validações passaram, iniciando cadastro...');

        // Mostrar loading
        this.showLoading(e.target.querySelector('.btn-primary'));

        try {
            // Simular cadastro (em um projeto real, isso seria uma chamada para API)
            console.log('🔄 Chamando registerUser...');
            const user = await this.registerUser({
                nome,
                email,
                telefone: `(${ddd}) ${numero}`,
                senha
            });
            
            console.log('👤 Usuário criado:', user);
            
            if (user) {
                this.showSuccess('Cadastro realizado com sucesso!');
                
                // Limpar formulário
                e.target.reset();
                
                // Opcional: fazer login automático após cadastro
                setTimeout(() => {
                    console.log('🔑 Fazendo login automático...');
                    this.login(user, false);
                    this.redirectAfterLogin();
                }, 2000);
            } else {
                console.log('❌ Usuário não foi criado');
                this.showError('Falha ao criar usuário.');
            }
        } catch (error) {
            console.error('❌ Erro no cadastro:', error);
            this.showError(`Erro: ${error.message}`);
        } finally {
            this.hideLoading(e.target.querySelector('.btn-primary'));
        }
    }

    // Simular autenticação (substituir por chamada real de API)
    async authenticateUser(email, senha) {
        console.log('🔐 Iniciando autenticação...');
        
        try {
            // Simular delay de rede
            console.log('⏳ Simulando delay de rede...');
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
                },
                {
                    id: 3,
                    nome: 'Ana Costa',
                    email: 'ana@teste.com',
                    senha: '123456',
                    telefone: '(11) 77777-7777',
                    tipo: 'cliente',
                    dataCadastro: new Date().toISOString()
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
                console.log('❌ Usuário não encontrado ou credenciais inválidas');
                return null;
            }
        } catch (error) {
            console.error('❌ Erro na autenticação:', error);
            throw new Error(`Erro na autenticação: ${error.message}`);
        }
    }

    // Simular cadastro (substituir por chamada real de API)
    async registerUser(userData) {
        console.log('🔄 registerUser chamado com:', userData);
        
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Verificar se email já existe
        const existingUsers = this.getStoredUsers();
        console.log('👥 Usuários existentes:', existingUsers.length);
        
        if (existingUsers.find(u => u.email === userData.email)) {
            console.log('❌ Email já cadastrado:', userData.email);
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
        
        console.log('👤 Novo usuário criado:', newUser);
        
        // Salvar usuário usando o novo sistema
        existingUsers.push(newUser);
        this.saveUsers(existingUsers);
        
        console.log('💾 Usuário salvo com backup automático');
        
        return newUser;
    }

    // Obter usuários armazenados localmente
    getStoredUsers() {
        const users = localStorage.getItem('chicasEventos_users');
        return users ? JSON.parse(users) : [];
    }

    // Salvar usuários no localStorage com backup
    saveUsers(users) {
        try {
            // Salvar usuários principais
            localStorage.setItem('chicasEventos_users', JSON.stringify(users));
            
            // Criar backup com timestamp
            const backupKey = `chicasEventos_users_backup_${Date.now()}`;
            localStorage.setItem(backupKey, JSON.stringify(users));
            
            // Manter apenas os últimos 5 backups
            this.cleanOldBackups();
            
            // Salvar estatísticas
            this.saveUserStats(users);
            
            console.log('💾 Usuários salvos com backup:', users.length);
            return true;
        } catch (error) {
            console.error('❌ Erro ao salvar usuários:', error);
            return false;
        }
    }

    // Limpar backups antigos (manter apenas os últimos 5)
    cleanOldBackups() {
        const backupKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('chicasEventos_users_backup_')) {
                backupKeys.push(key);
            }
        }
        
        // Ordenar por timestamp (mais recente primeiro)
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
    }

    // Salvar estatísticas dos usuários
    saveUserStats(users) {
        const stats = {
            totalUsers: users.length,
            lastUpdate: new Date().toISOString(),
            usersByType: {
                cliente: users.filter(u => u.tipo === 'cliente').length,
                admin: users.filter(u => u.tipo === 'admin').length
            },
            recentUsers: users
                .sort((a, b) => new Date(b.dataCadastro) - new Date(a.dataCadastro))
                .slice(0, 10)
        };
        
        localStorage.setItem('chicasEventos_user_stats', JSON.stringify(stats));
    }

    // Obter estatísticas dos usuários
    getUserStats() {
        const stats = localStorage.getItem('chicasEventos_user_stats');
        return stats ? JSON.parse(stats) : null;
    }

    // Exportar todas as contas para JSON
    exportAccounts() {
        const users = this.getStoredUsers();
        const exportData = {
            exportDate: new Date().toISOString(),
            version: '1.0',
            totalUsers: users.length,
            users: users
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `chicas_eventos_contas_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        console.log('📤 Contas exportadas:', users.length);
        return exportData;
    }

    // Importar contas de arquivo JSON
    async importAccounts(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const importData = JSON.parse(e.target.result);
                    
                    if (!importData.users || !Array.isArray(importData.users)) {
                        throw new Error('Formato de arquivo inválido');
                    }
                    
                    const existingUsers = this.getStoredUsers();
                    const importedUsers = importData.users;
                    let newUsers = 0;
                    let updatedUsers = 0;
                    
                    importedUsers.forEach(importedUser => {
                        const existingIndex = existingUsers.findIndex(u => u.email === importedUser.email);
                        
                        if (existingIndex >= 0) {
                            // Atualizar usuário existente
                            existingUsers[existingIndex] = {
                                ...existingUsers[existingIndex],
                                ...importedUser,
                                dataImportacao: new Date().toISOString()
                            };
                            updatedUsers++;
                        } else {
                            // Adicionar novo usuário
                            existingUsers.push({
                                ...importedUser,
                                dataImportacao: new Date().toISOString()
                            });
                            newUsers++;
                        }
                    });
                    
                    this.saveUsers(existingUsers);
                    
                    console.log(`📥 Importação concluída: ${newUsers} novos, ${updatedUsers} atualizados`);
                    resolve({ newUsers, updatedUsers, total: existingUsers.length });
                    
                } catch (error) {
                    console.error('❌ Erro na importação:', error);
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
            reader.readAsText(file);
        });
    }

    // Obter relatório de contas
    getAccountsReport() {
        const users = this.getStoredUsers();
        const stats = this.getUserStats();
        
        return {
            totalAccounts: users.length,
            stats: stats,
            recentAccounts: users
                .sort((a, b) => new Date(b.dataCadastro) - new Date(a.dataCadastro))
                .slice(0, 5),
            accountsByType: {
                cliente: users.filter(u => u.tipo === 'cliente'),
                admin: users.filter(u => u.tipo === 'admin')
            }
        };
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
        
        // Disparar evento customizado para outros sistemas
        window.dispatchEvent(new CustomEvent('userLoggedIn', {
            detail: { user: user }
        }));
        
        // Atualizar UI
        this.updateUIForLoggedInUser();
        
        console.log('Usuário logado:', user.nome);
    }

    // Realizar logout
    logout() {
        console.log('🚪 Iniciando logout...');
        
        // Remover sessão IMEDIATAMENTE
        localStorage.removeItem('chicasEventos_session');
        console.log('🗑️ Sessão removida do localStorage');
        
        // Limpar estado interno
        this.currentUser = null;
        this.isLoggedIn = false;
        console.log('🧹 Estado interno limpo');
        
        // Disparar evento customizado para outros sistemas
        window.dispatchEvent(new CustomEvent('userLoggedOut', {
            detail: { user: null }
        }));
        console.log('📡 Evento userLoggedOut disparado');
        
        // Atualizar UI IMEDIATAMENTE
        this.updateUIForLoggedOutUser();
        console.log('🎨 UI atualizada para logout');
        
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
        
        // Aguardar um pouco antes de redirecionar para garantir que a UI seja atualizada
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 100);
        
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
        console.log('🎨 AuthSystem: Mostrando botão do usuário');
        
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

        // Configurar dropdown do usuário
        this.setupUserDropdown();

        // Atualizar classe do container
        if (userContainer) {
            userContainer.classList.remove('logged-out');
            userContainer.classList.add('logged-in');
        }

        // Adicionar classe ao body para estilos condicionais
        document.body.classList.add('user-logged-in');
        
        console.log('✅ Botão do usuário ativado na mesma posição');
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

    // Configurar dropdown do usuário - REFEITO
    setupUserDropdown() {
        const userBtn = document.getElementById('user-btn');
        const dropdownMenu = document.getElementById('dropdown-menu');
        const logoutBtn = document.getElementById('logout-btn');

        console.log('🔧 Configurando dropdown:', { userBtn, dropdownMenu, logoutBtn });

        if (userBtn && dropdownMenu) {
            console.log('✅ Elementos encontrados, configurando eventos...');
            
            // Remover event listeners existentes
            const newUserBtn = userBtn.cloneNode(true);
            userBtn.parentNode.replaceChild(newUserBtn, userBtn);
            
            // Toggle do dropdown
            newUserBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🖱️ Botão clicado!');
                
                const isOpen = dropdownMenu.classList.contains('show');
                console.log('📊 Menu estava aberto:', isOpen);
                
                if (isOpen) {
                    dropdownMenu.classList.remove('show');
                    newUserBtn.classList.remove('active');
                    console.log('❌ Menu fechado');
                } else {
                    dropdownMenu.classList.add('show');
                    newUserBtn.classList.add('active');
                    console.log('✅ Menu aberto');
                }
            });

            // Fechar dropdown ao clicar fora
            document.addEventListener('click', (e) => {
                if (!newUserBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                    dropdownMenu.classList.remove('show');
                    newUserBtn.classList.remove('active');
                    console.log('🚪 Menu fechado por clique fora');
                }
            });

            // Fechar dropdown ao pressionar Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    dropdownMenu.classList.remove('show');
                    newUserBtn.classList.remove('active');
                    console.log('⌨️ Menu fechado com Escape');
                }
            });

            // Configurar logout
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('🚪 Logout clicado');
                    
                    if (confirm('Tem certeza que deseja sair da sua conta?')) {
                        this.logout();
                    }
                });
            }
            
            console.log('🎉 Dropdown configurado com sucesso!');
        } else {
            console.error('❌ Elementos não encontrados!');
        }
    }

    // Atualizar UI para usuário deslogado
    updateUIForLoggedOutUser() {
        console.log('🎨 AuthSystem: Mostrando botão de login');
        
        const loginBtn = document.getElementById('login-btn');
        const userBtn = document.getElementById('user-btn');
        const userContainer = document.querySelector('.user-button-container');
        
        // MOSTRAR botão de login
        if (loginBtn) {
            loginBtn.style.display = 'block';
            loginBtn.classList.remove('hidden');
            loginBtn.textContent = 'LOG IN';
            loginBtn.onclick = () => this.redirectToLogin();
            console.log('✅ Botão de login mostrado');
        }

        // ESCONDER botão do usuário
        if (userBtn) {
            userBtn.classList.remove('visible');
            userBtn.classList.add('hidden');
            console.log('✅ Botão do usuário escondido');
        }

        // Fechar dropdown se estiver aberto
        const dropdownMenu = document.getElementById('user-dropdown');
        if (dropdownMenu) {
            dropdownMenu.classList.remove('show');
            console.log('✅ Dropdown fechado');
        }

        // Atualizar classe do container
        if (userContainer) {
            userContainer.classList.remove('logged-in');
            userContainer.classList.add('logged-out');
        }

        // Remover classe do body
        document.body.classList.remove('user-logged-in');
        
        console.log('✅ Botão de login ativado na mesma posição');
    }

    // Validação de email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Mostrar erro
    showError(message) {
        console.error('Erro de autenticação:', message);
        
        try {
            // Tentar usar o sistema de notificações global
            if (window.ChicasEventos && typeof window.ChicasEventos.showNotification === 'function') {
                window.ChicasEventos.showNotification(message, 'error');
                return;
            }
            
            // Tentar usar a função showNotification diretamente
            if (typeof showNotification === 'function') {
                showNotification(message, 'error');
                return;
            }
            
            // Criar notificação manual se necessário
            this.createManualNotification(message, 'error');
            
        } catch (error) {
            console.error('Erro ao mostrar notificação:', error);
            // Fallback final
            alert('❌ ' + message);
        }
    }

    // Mostrar sucesso
    showSuccess(message) {
        console.log('Sucesso de autenticação:', message);
        
        try {
            // Tentar usar o sistema de notificações global
            if (window.ChicasEventos && typeof window.ChicasEventos.showNotification === 'function') {
                window.ChicasEventos.showNotification(message, 'success');
                return;
            }
            
            // Tentar usar a função showNotification diretamente
            if (typeof showNotification === 'function') {
                showNotification(message, 'success');
                return;
            }
            
            // Criar notificação manual se necessário
            this.createManualNotification(message, 'success');
            
        } catch (error) {
            console.error('Erro ao mostrar notificação de sucesso:', error);
            // Fallback final
            alert('✅ ' + message);
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

    // Garantir que o sistema de notificações esteja disponível
    ensureNotificationsAvailable() {
        // Aguardar um pouco para garantir que o global.js foi carregado
        setTimeout(() => {
            if (!document.querySelector('.notifications-container')) {
                console.log('🔧 Criando container de notificações...');
                
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
                
                console.log('✅ Container de notificações criado');
            }
        }, 100);
    }

    // Criar notificação manual
    createManualNotification(message, type = 'info') {
        try {
            // Garantir que o container existe
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
            
            // Criar notificação
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
            
            // Adicionar CSS de animação se não existir
            if (!document.querySelector('#notification-styles')) {
                const style = document.createElement('style');
                style.id = 'notification-styles';
                style.textContent = `
                    @keyframes slideIn {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                    @keyframes slideOut {
                        from {
                            transform: translateX(0);
                            opacity: 1;
                        }
                        to {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            container.appendChild(notification);
            
            // Remover após 5 segundos
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
            console.error('Erro ao criar notificação manual:', error);
            // Fallback final
            alert(`${type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'} ${message}`);
        }
    }
}

// Inicializar sistema de autenticação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});

// Exportar para uso global
window.AuthSystem = AuthSystem;
