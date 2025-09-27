# 🧪 Teste de Carrinho - Instruções

## 🚀 Como Testar o Sistema de Carrinho

### **1. Acesse a Página de Teste**
```
http://seudominio.com/teste-carrinho.html
```

### **2. Adicione Itens ao Carrinho**
- ✅ Clique em **"Adicionar ao Carrinho"** em qualquer serviço
- ✅ Veja o contador atualizar em tempo real
- ✅ Adicione múltiplos itens para testar

### **3. Vá para o Carrinho**
- ✅ Clique em **"Ver Carrinho e Finalizar Compra"**
- ✅ Ou acesse diretamente: `pages/carrinho/carrinho.html`

### **4. Teste as Funcionalidades do Carrinho**
- ✅ **Alterar quantidade** com os botões +/-
- ✅ **Remover itens** com o botão "Remover"
- ✅ **Ver resumo** com subtotal, taxa e total
- ✅ **Finalizar pagamento** com o botão verde

### **5. Teste o Checkout**
- ✅ Clique em **"Finalizar Pagamento"**
- ✅ Modal abre com loading
- ✅ Redireciona para Mercado Pago (sandbox)
- ✅ Use cartões de teste para simular pagamento

## 🎯 **Cenários de Teste**

### **Teste Básico:**
1. Adicione 1 item
2. Vá para o carrinho
3. Finalize o pagamento
4. Use cartão de teste: `4009 1753 3280 6176`

### **Teste Avançado:**
1. Adicione múltiplos itens
2. Altere quantidades
3. Remova alguns itens
4. Finalize o pagamento
5. Teste diferentes cartões

### **Teste de Erro:**
1. Desconecte a internet
2. Tente finalizar pagamento
3. Veja a mensagem de erro
4. Reconecte e tente novamente

## 💳 **Cartões de Teste (Sandbox)**

| Cartão | Resultado | CVV | Vencimento |
|--------|-----------|-----|------------|
| 4009 1753 3280 6176 | ✅ Aprovado | 123 | 11/25 |
| 4000 0000 0000 0002 | ❌ Rejeitado | 123 | 11/25 |
| 4000 0000 0000 0004 | ⏳ Pendente | 123 | 11/25 |

## 🔧 **Configuração Necessária**

### **1. Arquivos Obrigatórios:**
- ✅ `config.php` - Configurações
- ✅ `endpoint.php` - API de pagamento
- ✅ `webhook.php` - Confirmações
- ✅ `checkout_env.txt` - Credenciais

### **2. Credenciais do Mercado Pago:**
```env
MP_ACCESS_TOKEN=TEST-SEU-TOKEN-AQUI
MP_PUBLIC_KEY=TEST-SUA-KEY-AQUI
```

### **3. URLs de Retorno:**
```env
MP_SUCCESS_URL=https://seudominio.com/success.html
MP_FAILURE_URL=https://seudominio.com/failure.html
MP_PENDING_URL=https://seudominio.com/pending.html
```

## 📱 **Teste em Diferentes Dispositivos**

### **Desktop:**
- ✅ Chrome, Firefox, Safari
- ✅ Resolução 1920x1080
- ✅ Teste com zoom 100%, 125%, 150%

### **Mobile:**
- ✅ iPhone (Safari)
- ✅ Android (Chrome)
- ✅ Teste em modo paisagem e retrato

### **Tablet:**
- ✅ iPad (Safari)
- ✅ Android (Chrome)
- ✅ Teste responsivo

## 🐛 **Problemas Comuns e Soluções**

### **Erro: "Erro ao criar checkout"**
- ✅ Verifique se `endpoint.php` está acessível
- ✅ Confirme as credenciais no `.env`
- ✅ Teste a conexão com a API do MP

### **Erro: "Carrinho vazio"**
- ✅ Limpe o localStorage: `localStorage.clear()`
- ✅ Recarregue a página
- ✅ Adicione itens novamente

### **Modal não abre:**
- ✅ Verifique se há erros no console
- ✅ Confirme se o JavaScript está carregando
- ✅ Teste em navegador diferente

### **Checkout não redireciona:**
- ✅ Verifique se as URLs estão corretas
- ✅ Teste em modo incógnito
- ✅ Confirme se o popup não está bloqueado

## 📊 **Logs e Debug**

### **Console do Navegador:**
```javascript
// Ver carrinho atual
console.log(JSON.parse(localStorage.getItem('chicas_carrinho')));

// Limpar carrinho
localStorage.removeItem('chicas_carrinho');

// Ver logs de checkout
// Verifique o arquivo checkout_logs.txt no servidor
```

### **Logs do Servidor:**
- `checkout_logs.txt` - Todas as transações
- `approved_payments.txt` - Pagamentos aprovados
- `security_logs.txt` - Eventos de segurança

## ✅ **Checklist de Teste**

### **Funcionalidades Básicas:**
- [ ] Adicionar item ao carrinho
- [ ] Alterar quantidade
- [ ] Remover item
- [ ] Calcular total corretamente
- [ ] Abrir modal de checkout
- [ ] Redirecionar para MP
- [ ] Processar pagamento
- [ ] Receber confirmação

### **Funcionalidades Avançadas:**
- [ ] Múltiplos itens
- [ ] Taxa de serviço (10%)
- [ ] Responsividade mobile
- [ ] Tratamento de erros
- [ ] Validação de dados
- [ ] Logs de auditoria

### **Segurança:**
- [ ] HTTPS obrigatório
- [ ] Validação de webhook
- [ ] Sanitização de dados
- [ ] Rate limiting
- [ ] Logs de segurança

## 🎉 **Resultado Esperado**

Após todos os testes, você deve ter:
- ✅ **Carrinho funcional** com adição/remoção de itens
- ✅ **Checkout integrado** com Mercado Pago
- ✅ **Pagamentos processados** com confirmação
- ✅ **Interface responsiva** em todos os dispositivos
- ✅ **Logs detalhados** para auditoria
- ✅ **Sistema seguro** com proteções implementadas

---

## 🚀 **Próximos Passos**

1. **Teste completo** em sandbox
2. **Configure credenciais** de produção
3. **Teste final** com valores reais
4. **Deploy** para produção
5. **Monitoramento** contínuo

**Seu sistema de checkout está pronto para receber pagamentos reais!** 🎊
