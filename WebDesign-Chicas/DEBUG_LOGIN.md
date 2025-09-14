# Debug do Sistema de Login - Chicas Eventos

## Problema Atual
O login não está funcionando mesmo com credenciais válidas (`rj.justke@gmail.com`).

## Como Debuggar

### 1. Abra o Console do Navegador
1. Acesse a página de login: `pages/login.html`
2. Pressione `F12` ou `Ctrl+Shift+I` para abrir as ferramentas de desenvolvedor
3. Vá para a aba **Console**

### 2. Verifique se o LoginManager foi inicializado
No console, você deve ver estas mensagens:
```
🚀 DOM carregado, inicializando LoginManager...
✅ LoginManager inicializado com sucesso
✅ Formulário de login encontrado: <form id="loginForm">
✅ Handlers do formulário de login configurados
```

**Se não aparecer essas mensagens:**
- O script `login.js` não está sendo carregado
- Há um erro JavaScript impedindo a inicialização

### 3. Teste o Login Manualmente
No console, digite:
```javascript
testLogin('rj.justke@gmail.com', '123456')
```

Isso deve mostrar logs detalhados do processo de login.

### 4. Teste o Formulário Real
1. Preencha o email: `rj.justke@gmail.com`
2. Preencha a senha: `123456`
3. Clique em "Entrar"
4. Observe os logs no console

### 5. Logs Esperados
Quando você clicar em "Entrar", deve aparecer:
```
🚀 Iniciando processo de login...
📧 Email: rj.justke@gmail.com
🔒 Senha: ***
💾 Lembrar-me: null
✅ Validação de formulário passou
🔐 Iniciando autenticação...
🔍 Verificando credenciais...
📧 Email recebido: rj.justke@gmail.com
🔒 Senha recebida: 123456
🔑 Senhas válidas: ['123456', 'password', 'senha123']
🔑 Senha em lowercase: 123456
✅ Senha é válida? true
📊 Resultado da autenticação: {name: "Rj.justke", email: "rj.justke@gmail.com", id: "user_rj.justke_gmail_com"}
✅ Login bem-sucedido!
```

## Possíveis Problemas

### Problema 1: Script não carregado
**Sintomas:** Não aparecem as mensagens de inicialização
**Solução:** Verificar se o arquivo `login.js` existe e está sendo carregado

### Problema 2: Formulário não encontrado
**Sintomas:** "Formulário de login NÃO encontrado!"
**Solução:** Verificar se o HTML tem `id="loginForm"`

### Problema 3: Event listener não funciona
**Sintomas:** Clicar em "Entrar" não gera logs
**Solução:** Verificar se há conflitos com outros scripts

### Problema 4: Validação falha
**Sintomas:** "Validação de formulário falhou"
**Solução:** Verificar formato do email e tamanho da senha

## Teste Rápido
Execute no console:
```javascript
// Verificar se LoginManager existe
console.log('LoginManager:', window.loginManager);

// Verificar se formulário existe
console.log('Formulário:', document.getElementById('loginForm'));

// Testar login diretamente
testLogin('teste@exemplo.com', '123456');
```

## Credenciais de Teste
- **Email:** Qualquer email válido (ex: `teste@exemplo.com`)
- **Senhas válidas:** `123456`, `password`, `senha123`

## Próximos Passos
1. Execute os testes acima
2. Copie os logs do console
3. Identifique onde o processo está falhando
4. Reporte os resultados para correção
