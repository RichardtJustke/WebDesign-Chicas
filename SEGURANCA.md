# 🔐 Guia de Segurança - Sistema de Gerenciamento de Contas

## ⚠️ IMPORTANTE: Configurações de Segurança

### 🛡️ Proteções Implementadas

#### 1. **Autenticação por Senha**
- ✅ Senha de administrador obrigatória
- ✅ Máximo de 3 tentativas de login
- ✅ Bloqueio por 15 minutos após tentativas falhadas
- ✅ Timeout de sessão de 30 minutos

#### 2. **Proteção de Arquivos**
- ✅ Meta tags para evitar indexação
- ✅ Arquivo .htaccess para proteção do servidor
- ✅ Bloqueio de acesso direto a arquivos sensíveis

#### 3. **Segurança de Sessão**
- ✅ Verificação de timeout automática
- ✅ Logout automático por inatividade
- ✅ Sessões armazenadas com timestamp

### 🔧 Como Configurar a Segurança

#### **1. Alterar Senha de Administrador**

Edite o arquivo `security-config.js`:
```javascript
adminPassword: 'SUA_SENHA_SEGURA_AQUI'
```

**Requisitos da senha:**
- Mínimo 8 caracteres
- Incluir letras maiúsculas e minúsculas
- Incluir números
- Incluir símbolos especiais

#### **2. Configurar Servidor Web (Opcional)**

Se usar Apache, configure o arquivo `.htaccess`:
```apache
# Criar arquivo .htpasswd com usuário e senha
htpasswd -c .htpasswd admin
```

#### **3. Restrições de Acesso**

**Por IP (se necessário):**
```javascript
// Em security-config.js
enableIPRestriction: true,
allowedIPs: ['192.168.1.100', '10.0.0.50']
```

**Por Horário:**
```javascript
// Em security-config.js
enableTimeRestriction: true,
allowedHours: { start: 8, end: 18 }
```

### 🚨 Medidas de Segurança Adicionais

#### **1. Ocultar Arquivo**
- Renomeie `gerenciar-contas.html` para algo não óbvio
- Exemplo: `admin-panel-2025.html`

#### **2. Proteção por Domínio**
- Use apenas em localhost ou domínio específico
- Não hospede em servidores públicos sem proteção

#### **3. Backup de Segurança**
- Faça backup regular dos dados
- Mantenha cópias offline das contas exportadas

#### **4. Monitoramento**
- Verifique logs de acesso regularmente
- Monitore tentativas de login suspeitas

### 🔒 Níveis de Segurança

#### **Nível Básico (Atual)**
- ✅ Senha de administrador
- ✅ Timeout de sessão
- ✅ Proteção contra força bruta

#### **Nível Intermediário**
- 🔧 Autenticação de dois fatores
- 🔧 Criptografia de dados sensíveis
- 🔧 Logs de auditoria detalhados

#### **Nível Avançado**
- 🔧 Integração com sistema de autenticação externo
- 🔧 Certificados SSL/TLS
- 🔧 Firewall de aplicação

### 📋 Checklist de Segurança

- [ ] Alterar senha padrão
- [ ] Configurar timeout adequado
- [ ] Testar proteção contra força bruta
- [ ] Verificar logs de acesso
- [ ] Fazer backup dos dados
- [ ] Ocultar arquivo de gerenciamento
- [ ] Configurar servidor web (se aplicável)
- [ ] Testar em ambiente seguro

### 🆘 Em Caso de Comprometimento

1. **Imediato:**
   - Altere a senha de administrador
   - Revogue todas as sessões ativas
   - Verifique logs de acesso

2. **Investigar:**
   - Analise logs de segurança
   - Verifique dados exportados
   - Identifique origem do acesso

3. **Recuperar:**
   - Restaure backup mais recente
   - Reconfigure senhas
   - Implemente medidas adicionais

### 📞 Suporte de Segurança

Para questões de segurança:
- Verifique logs do sistema
- Consulte documentação de segurança
- Implemente medidas adicionais conforme necessário

---

**⚠️ AVISO:** Este sistema contém dados sensíveis. Mantenha sempre as melhores práticas de segurança e monitore o acesso regularmente.
