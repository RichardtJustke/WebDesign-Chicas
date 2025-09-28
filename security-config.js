// Configuração de Segurança - Chicas Eventos
// Este arquivo contém as configurações de segurança do sistema

const SecurityConfig = {
    // Senha de administrador (ALTERE ESTA SENHA!)
    adminPassword: 'Chicas2025!Admin',
    
    // Timeout de sessão (em milissegundos)
    sessionTimeout: 30 * 60 * 1000, // 30 minutos
    
    // Número máximo de tentativas de login
    maxAttempts: 3,
    
    // Tempo de bloqueio após muitas tentativas (em milissegundos)
    lockoutTime: 15 * 60 * 1000, // 15 minutos
    
    // URLs permitidas (se implementar restrição por domínio)
    allowedDomains: [
        'localhost',
        '127.0.0.1',
        'file://'
    ],
    
    // Configurações de log de segurança
    enableSecurityLogs: true,
    
    // Criptografia básica (para dados sensíveis)
    enableEncryption: false,
    
    // Verificações de segurança adicionais
    enableIPRestriction: false,
    enableTimeRestriction: false,
    
    // Horários permitidos (se enableTimeRestriction = true)
    allowedHours: {
        start: 8,  // 8:00
        end: 18    // 18:00
    },
    
    // Dias da semana permitidos (0 = domingo, 1 = segunda, etc.)
    allowedDays: [1, 2, 3, 4, 5], // Segunda a sexta
    
    // Configurações de backup de segurança
    enableSecurityBackup: true,
    securityBackupInterval: 24 * 60 * 60 * 1000, // 24 horas
    
    // Configurações de notificação
    enableSecurityNotifications: true,
    notificationMethods: ['console', 'alert']
};

// Função para validar configurações
function validateSecurityConfig() {
    const errors = [];
    
    if (!SecurityConfig.adminPassword || SecurityConfig.adminPassword.length < 8) {
        errors.push('Senha de administrador deve ter pelo menos 8 caracteres');
    }
    
    if (SecurityConfig.sessionTimeout < 5 * 60 * 1000) {
        errors.push('Timeout de sessão deve ser pelo menos 5 minutos');
    }
    
    if (SecurityConfig.maxAttempts < 1 || SecurityConfig.maxAttempts > 10) {
        errors.push('Número de tentativas deve estar entre 1 e 10');
    }
    
    if (errors.length > 0) {
        console.error('❌ Erros na configuração de segurança:', errors);
        return false;
    }
    
    console.log('✅ Configuração de segurança validada');
    return true;
}

// Função para gerar senha segura
function generateSecurePassword(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return password;
}

// Função para verificar força da senha
function checkPasswordStrength(password) {
    let score = 0;
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        numbers: /[0-9]/.test(password),
        symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    Object.values(checks).forEach(check => {
        if (check) score++;
    });
    
    return {
        score: score,
        maxScore: 5,
        strength: score < 3 ? 'fraca' : score < 4 ? 'média' : 'forte',
        checks: checks
    };
}

// Exportar configurações
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityConfig;
} else {
    window.SecurityConfig = SecurityConfig;
    window.validateSecurityConfig = validateSecurityConfig;
    window.generateSecurePassword = generateSecurePassword;
    window.checkPasswordStrength = checkPasswordStrength;
}
