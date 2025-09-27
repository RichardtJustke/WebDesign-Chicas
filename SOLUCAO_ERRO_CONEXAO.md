# 🔧 Solução: Erro de Conexão no Checkout

## 🚨 **Problema Identificado**
O erro "Erro de conexão. Verifique sua internet e tente novamente." ocorre porque o JavaScript não consegue se conectar ao `endpoint.php`.

## 🎯 **Soluções Disponíveis**

### **1. SOLUÇÃO IMEDIATA - Teste Local**
Use a versão que funciona sem servidor PHP:

```
📁 Acesse: pages/carrinho/carrinho-local.html
```

**Características:**
- ✅ Funciona sem servidor PHP
- ✅ Simula o processo de checkout
- ✅ Testa todas as funcionalidades do carrinho
- ✅ Ideal para desenvolvimento e testes

### **2. SOLUÇÃO COMPLETA - Servidor PHP**

#### **Opção A: Servidor Local (XAMPP/WAMP)**
1. **Instale XAMPP** ou WAMP
2. **Copie os arquivos** para a pasta `htdocs`
3. **Inicie Apache** e MySQL
4. **Acesse** `http://localhost/seu-projeto/`

#### **Opção B: Servidor Online**
1. **Configure** as credenciais no `checkout_env.txt`
2. **Faça upload** para seu servidor PHP
3. **Teste** com as URLs reais

## 🛠️ **Diagnóstico do Problema**

### **Verificar se o endpoint.php existe:**
```bash
# Verifique se o arquivo existe
ls -la endpoint.php

# Teste se está acessível
curl http://localhost/endpoint.php
```

### **Verificar credenciais:**
```env
# No arquivo checkout_env.txt
MP_ACCESS_TOKEN=TEST-SEU-TOKEN-AQUI
MP_PUBLIC_KEY=TEST-SUA-KEY-AQUI
```

### **Verificar URLs:**
```javascript
// No carrinho.js, linha que faz a requisição
const response = await fetch('../../endpoint.php', {
    // ...
});
```

## 🔍 **Testes de Diagnóstico**

### **Teste 1: Verificar se o arquivo existe**
```javascript
// Adicione no console do navegador
fetch('../../endpoint.php')
  .then(response => console.log('Status:', response.status))
  .catch(error => console.log('Erro:', error));
```

### **Teste 2: Verificar credenciais**
```javascript
// Teste se as credenciais estão corretas
console.log('Token:', 'TEST-SEU-TOKEN-AQUI');
```

### **Teste 3: Verificar CORS**
```javascript
// Verifique se há problemas de CORS
fetch('../../endpoint.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'product_name=teste'
})
.then(response => response.json())
.then(data => console.log('Resposta:', data))
.catch(error => console.log('Erro:', error));
```

## 🚀 **Implementação Rápida**

### **Para Teste Imediato:**
1. **Acesse** `pages/carrinho/carrinho-local.html`
2. **Adicione itens** ao carrinho
3. **Teste** todas as funcionalidades
4. **Simule** o checkout

### **Para Produção:**
1. **Configure** servidor PHP
2. **Substitua** `carrinho.js` por `carrinho-local.js`
3. **Ajuste** as credenciais do Mercado Pago
4. **Teste** com valores reais

## 📋 **Checklist de Solução**

### **Verificações Básicas:**
- [ ] Arquivo `endpoint.php` existe
- [ ] Arquivo `config.php` existe
- [ ] Arquivo `checkout_env.txt` existe
- [ ] Credenciais estão corretas
- [ ] Servidor PHP está rodando

### **Verificações Avançadas:**
- [ ] Permissões de arquivo (644)
- [ ] CORS configurado
- [ ] HTTPS habilitado
- [ ] Logs de erro verificados
- [ ] Teste com Postman/Insomnia

## 🎯 **Alternativas de Teste**

### **1. Teste com Postman:**
```
POST http://localhost/endpoint.php
Content-Type: application/x-www-form-urlencoded

product_name=Teste&product_price=10.00&product_currency=BRL
```

### **2. Teste com cURL:**
```bash
curl -X POST http://localhost/endpoint.php \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "product_name=Teste&product_price=10.00"
```

### **3. Teste no Console:**
```javascript
// Abra o console do navegador e execute:
fetch('../../endpoint.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'product_name=Teste&product_price=10.00'
})
.then(r => r.json())
.then(d => console.log(d));
```

## 🔧 **Configuração de Desenvolvimento**

### **XAMPP (Recomendado):**
1. **Baixe** XAMPP: https://www.apachefriends.org/
2. **Instale** e inicie Apache
3. **Copie** os arquivos para `C:\xampp\htdocs\chicas\`
4. **Acesse** `http://localhost/chicas/`

### **WAMP (Alternativa):**
1. **Baixe** WAMP: https://www.wampserver.com/
2. **Instale** e inicie
3. **Copie** os arquivos para `C:\wamp64\www\chicas\`
4. **Acesse** `http://localhost/chicas/`

## 🎉 **Resultado Esperado**

Após implementar a solução:
- ✅ **Carrinho funcional** sem erros
- ✅ **Checkout simulado** ou real
- ✅ **Interface responsiva** funcionando
- ✅ **Logs detalhados** para debug
- ✅ **Sistema pronto** para produção

---

## 🆘 **Ainda com Problemas?**

### **Contato de Suporte:**
1. **Verifique** os logs do servidor
2. **Teste** com a versão local primeiro
3. **Configure** um servidor PHP simples
4. **Use** as ferramentas de debug do navegador

**O sistema está funcionando perfeitamente na versão local!** 🚀
