/**
 * Sistema de Login para Chicas Eventos
 * Processa o formulário de login e integra com o sistema de autenticação
 */

class LoginManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupFormHandlers();
    this.setupPasswordToggle();
    this.setupFormValidation();
  }

  /**
   * Configura os handlers do formulário de login
   */
  setupFormHandlers() {
    const loginForm = document.getElementById('loginForm');
    
    if (!loginForm) {
      console.warn('Formulário de login não encontrado');
      return;
    }

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin(e);
    });

    console.log('✅ Handlers do formulário de login configurados');
  }

  /**
   * Processa o login do usuário
   */
  async handleLogin(event) {
    console.log('🚀 Iniciando processo de login...');
    
    const form = event.target;
    const formData = new FormData(form);
    
    const email = formData.get('email');
    const password = formData.get('password');
    const rememberMe = formData.get('rememberMe');

    console.log('📧 Email:', email);
    console.log('🔒 Senha:', password ? '***' : 'vazia');
    console.log('💾 Lembrar-me:', rememberMe);

    // Validar campos
    if (!this.validateForm(email, password)) {
      console.log('❌ Validação de formulário falhou');
      return;
    }

    console.log('✅ Validação de formulário passou');

    // Mostrar estado de carregamento
    this.setLoadingState(true);

    try {
      // Simular autenticação (substituir por chamada real à API)
      console.log('🔐 Iniciando autenticação...');
      const userData = await this.authenticateUser(email, password);
      
      console.log('📊 Resultado da autenticação:', userData);
      
      if (userData) {
        // Login bem-sucedido
        console.log('✅ Login bem-sucedido!');
        this.handleLoginSuccess(userData, rememberMe);
      } else {
        // Credenciais inválidas
        console.log('❌ Credenciais inválidas');
        this.handleLoginError('Email ou senha incorretos');
      }
    } catch (error) {
      console.error('💥 Erro no login:', error);
      this.handleLoginError('Erro interno. Tente novamente.');
    } finally {
      this.setLoadingState(false);
    }
  }

  /**
   * Valida os campos do formulário
   */
  validateForm(email, password) {
    let isValid = true;

    // Limpar erros anteriores
    this.clearErrors();

    // Validar email
    if (!email || !this.isValidEmail(email)) {
      this.showFieldError('email', 'Por favor, insira um email válido');
      isValid = false;
    }

    // Validar senha
    if (!password || password.length < 6) {
      this.showFieldError('password', 'A senha deve ter pelo menos 6 caracteres');
      isValid = false;
    }

    return isValid;
  }

  /**
   * Valida formato de email
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Simula autenticação do usuário (substituir por chamada real à API)
   */
  async authenticateUser(email, password) {
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simular validação de credenciais
    // Em um sistema real, isso seria uma chamada para a API
    const validCredentials = this.checkCredentials(email, password);
    
    if (validCredentials) {
      return {
        name: this.extractNameFromEmail(email),
        email: email,
        id: this.generateUserId(email)
      };
    }
    
    return null;
  }

  /**
   * Verifica credenciais (simulação - substituir por validação real)
   */
  checkCredentials(email, password) {
    console.log('🔍 Verificando credenciais...');
    console.log('📧 Email recebido:', email);
    console.log('🔒 Senha recebida:', password);
    
    // Simulação: aceitar qualquer email com senha "123456" ou "password"
    const validPasswords = ['123456', 'password', 'senha123'];
    const passwordLower = password ? password.toLowerCase() : '';
    
    console.log('🔑 Senhas válidas:', validPasswords);
    console.log('🔑 Senha em lowercase:', passwordLower);
    console.log('✅ Senha é válida?', validPasswords.includes(passwordLower));
    
    return validPasswords.includes(passwordLower);
  }

  /**
   * Extrai nome do email para exibição
   */
  extractNameFromEmail(email) {
    const username = email.split('@')[0];
    return username.charAt(0).toUpperCase() + username.slice(1);
  }

  /**
   * Gera ID único para o usuário
   */
  generateUserId(email) {
    return 'user_' + email.replace('@', '_').replace('.', '_');
  }

  /**
   * Processa login bem-sucedido
   */
  handleLoginSuccess(userData, rememberMe) {
    console.log('✅ Login bem-sucedido:', userData);

    // Salvar dados do usuário
    localStorage.setItem('chicas_current_user', JSON.stringify(userData));
    
    // Configurar "lembrar-me" se necessário
    if (rememberMe) {
      localStorage.setItem('chicas_remember_me', 'true');
    }

    // Notificar sistema de autenticação
    if (window.authManager) {
      window.authManager.currentUser = userData;
      window.authManager.updateHeaderAuthState();
      window.authManager.updateUserProfile();
    }

    // Mostrar mensagem de sucesso
    this.showSuccessMessage('Login realizado com sucesso! Redirecionando...');

    // Redirecionar após um breve delay
    setTimeout(() => {
      // Verificar se há página de destino
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get('redirect') || '../index.html';
      window.location.href = redirectTo;
    }, 1500);
  }

  /**
   * Processa erro de login
   */
  handleLoginError(message) {
    console.error('❌ Erro no login:', message);
    this.showGeneralError(message);
  }

  /**
   * Mostra estado de carregamento
   */
  setLoadingState(isLoading) {
    const loginText = document.getElementById('loginText');
    const loginLoading = document.getElementById('loginLoading');
    const submitButton = document.querySelector('#loginForm button[type="submit"]');

    if (loginText && loginLoading && submitButton) {
      if (isLoading) {
        loginText.classList.add('tw-hidden');
        loginLoading.classList.remove('tw-hidden');
        submitButton.disabled = true;
        submitButton.classList.add('tw-opacity-50', 'tw-cursor-not-allowed');
      } else {
        loginText.classList.remove('tw-hidden');
        loginLoading.classList.add('tw-hidden');
        submitButton.disabled = false;
        submitButton.classList.remove('tw-opacity-50', 'tw-cursor-not-allowed');
      }
    }
  }

  /**
   * Mostra erro em campo específico
   */
  showFieldError(fieldName, message) {
    const errorElement = document.getElementById(fieldName + 'Error');
    const fieldElement = document.getElementById(fieldName);

    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.remove('tw-hidden');
    }

    if (fieldElement) {
      fieldElement.classList.add('tw-border-red-500', 'tw-focus:tw-ring-red-500', 'tw-focus:tw-border-red-500');
      fieldElement.classList.remove('tw-border-slate-300', 'tw-focus:tw-ring-emerald-500', 'tw-focus:tw-border-emerald-500');
    }
  }

  /**
   * Mostra erro geral
   */
  showGeneralError(message) {
    const errorElement = document.getElementById('generalError');
    const errorText = document.getElementById('generalErrorText');

    if (errorElement && errorText) {
      errorText.textContent = message;
      errorElement.classList.remove('tw-hidden');
      
      // Scroll para o erro
      errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  /**
   * Mostra mensagem de sucesso
   */
  showSuccessMessage(message) {
    const errorElement = document.getElementById('generalError');
    const errorText = document.getElementById('generalErrorText');

    if (errorElement && errorText) {
      errorText.textContent = message;
      errorElement.classList.remove('tw-hidden');
      errorElement.classList.remove('tw-bg-red-50', 'tw-border-red-200');
      errorElement.classList.add('tw-bg-green-50', 'tw-border-green-200');
      
      // Scroll para a mensagem
      errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  /**
   * Limpa todos os erros
   */
  clearErrors() {
    // Limpar erros de campos
    const fieldErrors = document.querySelectorAll('[id$="Error"]');
    fieldErrors.forEach(error => {
      error.classList.add('tw-hidden');
      error.textContent = '';
    });

    // Limpar erro geral
    const generalError = document.getElementById('generalError');
    if (generalError) {
      generalError.classList.add('tw-hidden');
      generalError.classList.remove('tw-bg-green-50', 'tw-border-green-200');
      generalError.classList.add('tw-bg-red-50', 'tw-border-red-200');
    }

    // Limpar estilos de erro dos campos
    const fields = document.querySelectorAll('#loginForm input');
    fields.forEach(field => {
      field.classList.remove('tw-border-red-500', 'tw-focus:tw-ring-red-500', 'tw-focus:tw-border-red-500');
      field.classList.add('tw-border-slate-300', 'tw-focus:tw-ring-emerald-500', 'tw-focus:tw-border-emerald-500');
    });
  }

  /**
   * Configura toggle de visibilidade da senha
   */
  setupPasswordToggle() {
    const toggleButton = document.getElementById('togglePassword');
    const passwordField = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');

    if (toggleButton && passwordField && eyeIcon) {
      toggleButton.addEventListener('click', () => {
        const isPassword = passwordField.type === 'password';
        
        passwordField.type = isPassword ? 'text' : 'password';
        
        // Atualizar ícone
        if (isPassword) {
          // Mostrar ícone de olho fechado
          eyeIcon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
          `;
        } else {
          // Mostrar ícone de olho aberto
          eyeIcon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          `;
        }
      });
    }
  }

  /**
   * Configura validação em tempo real
   */
  setupFormValidation() {
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');

    // Validação em tempo real do email
    if (emailField) {
      emailField.addEventListener('blur', () => {
        const email = emailField.value.trim();
        if (email && !this.isValidEmail(email)) {
          this.showFieldError('email', 'Por favor, insira um email válido');
        } else {
          this.clearFieldError('email');
        }
      });

      emailField.addEventListener('input', () => {
        this.clearFieldError('email');
      });
    }

    // Validação em tempo real da senha
    if (passwordField) {
      passwordField.addEventListener('blur', () => {
        const password = passwordField.value;
        if (password && password.length < 6) {
          this.showFieldError('password', 'A senha deve ter pelo menos 6 caracteres');
        } else {
          this.clearFieldError('password');
        }
      });

      passwordField.addEventListener('input', () => {
        this.clearFieldError('password');
      });
    }
  }

  /**
   * Limpa erro de campo específico
   */
  clearFieldError(fieldName) {
    const errorElement = document.getElementById(fieldName + 'Error');
    const fieldElement = document.getElementById(fieldName);

    if (errorElement) {
      errorElement.classList.add('tw-hidden');
    }

    if (fieldElement) {
      fieldElement.classList.remove('tw-border-red-500', 'tw-focus:tw-ring-red-500', 'tw-focus:tw-border-red-500');
      fieldElement.classList.add('tw-border-slate-300', 'tw-focus:tw-ring-emerald-500', 'tw-focus:tw-border-emerald-500');
    }
  }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 DOM carregado, inicializando LoginManager...');
  
  try {
    window.loginManager = new LoginManager();
    console.log('✅ LoginManager inicializado com sucesso');
    
    // Teste adicional: verificar se o formulário existe
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      console.log('✅ Formulário de login encontrado:', loginForm);
    } else {
      console.error('❌ Formulário de login NÃO encontrado!');
    }
    
  } catch (error) {
    console.error('💥 Erro ao inicializar LoginManager:', error);
  }
});

// Exportar para uso global
window.LoginManager = LoginManager;

// Função de teste global para debug
window.testLogin = function(email = 'teste@exemplo.com', password = '123456') {
  console.log('🧪 Testando login com:', email, password);
  if (window.loginManager) {
    window.loginManager.handleLogin({
      target: document.getElementById('loginForm'),
      preventDefault: () => {}
    });
  } else {
    console.error('❌ LoginManager não está disponível');
  }
};
