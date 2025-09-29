# Sistema de Carrinho - Chicas Eventos

## Visão Geral

O sistema de carrinho foi configurado para redirecionar automaticamente o usuário para a página do carrinho após adicionar itens de qualquer página de serviços.

## Funcionalidades Implementadas

### 1. Redirecionamento Automático
- **Páginas de Serviços**: Quando o usuário adiciona itens nas páginas de RH, Cerimonial ou Audiovisual, é redirecionado automaticamente para o carrinho
- **Página do Buffet**: Quando o usuário adiciona pacotes do buffet, também é redirecionado para o carrinho
- **Caminhos Relativos**: O sistema detecta automaticamente a página atual e calcula o caminho correto para o carrinho

### 2. Exibição de Itens no Carrinho
- **Itens do Buffet**: Exibe pacotes com imagem, título, descrição e preço
- **Serviços Individuais**: Exibe serviços selecionados com detalhes
- **Informações Completas**: Mostra tipo de serviço, quantidade e preço

### 3. Funcionalidades do Carrinho
- **Remoção de Itens**: Botão para remover itens individuais
- **Cálculo de Total**: Soma automática dos valores
- **Carrinho Vazio**: Mensagem amigável quando não há itens
- **Finalização**: Botão para finalizar o orçamento

## Arquivos Modificados

### 1. `js/add-to-event-popup.js`
- Adicionada função `redirectToCart()` 
- Modificada função `addToCart()` para incluir redirecionamento
- Sistema de detecção de caminho relativo

### 2. `pages/serviços/buffet/buffet.js`
- Adicionada função `redirectToCart()`
- Modificada função `addPackageToCart()` para incluir redirecionamento
- Delay de 2 segundos para mostrar feedback visual

### 3. `pages/carrinho/carrinho.js` (NOVO)
- Classe `CartManager` para gerenciar o carrinho
- Carregamento de itens do localStorage
- Renderização dinâmica dos itens
- Funcionalidades de remoção e finalização

### 4. `pages/carrinho/carrinho.html`
- Adicionado script `carrinho.js`

### 5. `pages/carrinho/carrinho.css`
- Estilos para itens do carrinho
- Design responsivo
- Animações e hover effects

## Como Funciona

### Fluxo de Adição de Itens

1. **Usuário navega para página de serviço** (RH, Cerimonial, Audiovisual ou Buffet)
2. **Clica em "Adicionar ao Evento"** ou seleciona pacotes
3. **Sistema salva no localStorage** com chaves diferentes:
   - `eventCart`: Para pacotes do buffet
   - `chicasEventos_cart`: Para serviços individuais
4. **Redirecionamento automático** para a página do carrinho
5. **Exibição dos itens** com informações completas

### Estrutura dos Dados

#### Pacotes do Buffet (`eventCart`)
```javascript
{
  id: "package-bronze",
  type: "package",
  packageType: "bronze",
  title: "Pacote Bronze",
  price: 89,
  quantity: 1,
  image: "path/to/image.jpg",
  description: "Bar de drinks e espumantes"
}
```

#### Serviços Individuais (`chicasEventos_cart`)
```javascript
{
  services: [
    {
      name: "Fotografia",
      price: 600,
      type: "variable",
      priceKey: "2h"
    }
  ],
  total: 600,
  timestamp: "2025-01-27T10:30:00.000Z"
}
```

## Testando o Sistema

### 1. Teste de Redirecionamento
1. Acesse qualquer página de serviços
2. Clique em "Adicionar ao Evento"
3. Selecione serviços e clique em "Adicionar ao carrinho"
4. Verifique se foi redirecionado para o carrinho

### 2. Teste de Exibição
1. Adicione itens de diferentes tipos
2. Verifique se aparecem corretamente no carrinho
3. Teste a remoção de itens
4. Verifique o cálculo do total

### 3. Teste de Finalização
1. Adicione alguns itens ao carrinho
2. Clique em "Finalizar orçamento"
3. Verifique se o pedido é processado

## Melhorias Futuras

- [ ] Integração com backend para persistência
- [ ] Sistema de cupons de desconto
- [ ] Cálculo de frete
- [ ] Múltiplos eventos por usuário
- [ ] Histórico de pedidos
- [ ] Notificações por email/SMS

## Suporte

Para dúvidas ou problemas com o sistema de carrinho, verifique:
1. Console do navegador para erros JavaScript
2. localStorage para dados salvos
3. Caminhos relativos das páginas
4. Compatibilidade com navegadores
