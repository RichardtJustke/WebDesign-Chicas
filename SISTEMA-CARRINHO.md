# Sistema de Carrinho - Chicas Eventos

## Visão Geral

O sistema de carrinho foi implementado para permitir que os usuários adicionem serviços de diferentes categorias ao carrinho e visualizem um resumo completo antes de finalizar o orçamento.

## Funcionalidades Implementadas

### ✅ Sistema Unificado
- **Arquivo principal**: `assets/js/carrinho.js`
- **Classe principal**: `CarrinhoManager`
- **Armazenamento**: localStorage com chave `carrinhoEvento`
- **Sincronização**: Entre todas as páginas do site

### ✅ Funcionalidades do Carrinho

1. **Adicionar Itens**
   - Suporte a múltiplas categorias (audiovisual, buffet, cerimonial, rh)
   - Diferentes opções de preço por serviço
   - Quantidade personalizável
   - Verificação de itens duplicados

2. **Gerenciar Itens**
   - Aumentar/diminuir quantidade
   - Remover itens individuais
   - Limpar carrinho completo
   - Cálculo automático de totais

3. **Interface Visual**
   - Contador de itens no header
   - Notificações de sucesso/info
   - Atualização em tempo real
   - Design responsivo

### ✅ Páginas Integradas

- **Página Principal** (`index.html`)
- **Página do Carrinho** (`pages/carrinho.html`)
- **Serviços de Audiovisual** (`pages/servicos/audiovisual.html`)
- **Serviços de Buffet** (`pages/servicos/buffet.html`)
- **Serviços de Cerimonial** (`pages/servicos/cerimonial.html`)
- **Serviços de RH** (`pages/servicos/rh.html`)

## Como Usar

### Para Desenvolvedores

1. **Incluir o script**:
   ```html
   <script src="assets/js/carrinho.js"></script>
   ```

2. **Usar a instância global**:
   ```javascript
   // Adicionar item
   carrinhoManager.adicionarItem({
     nome: 'Nome do Serviço',
     opcao: 'Opção selecionada',
     preco: 1500,
     categoria: 'audiovisual'
   });
   
   // Remover item
   carrinhoManager.removerItem('item_id');
   
   // Atualizar quantidade
   carrinhoManager.atualizarQuantidade('item_id', 2);
   
   // Limpar carrinho
   carrinhoManager.limparCarrinho();
   ```

### Para Usuários

1. **Navegar para uma página de serviços**
2. **Clicar em "Adicionar ao Evento"**
3. **Selecionar serviços desejados**
4. **Clicar em "Adicionar ao Carrinho"**
5. **Ser redirecionado para a página do carrinho**
6. **Revisar itens e finalizar orçamento**

## Estrutura de Dados

### Item do Carrinho
```javascript
{
  id: 'item_1234567890_abc123',
  nome: 'Nome do Serviço',
  categoria: 'audiovisual|buffet|cerimonial|rh',
  opcao: 'Opção selecionada pelo usuário',
  preco: 1500.00,
  quantidade: 1,
  imagem: 'caminho/para/imagem.jpg',
  timestamp: 1234567890
}
```

### localStorage
- **Chave**: `carrinhoEvento`
- **Formato**: JSON array de itens
- **Persistência**: Entre sessões do navegador

## Funcionalidades Especiais

### Contador no Header
- Aparece automaticamente quando há itens no carrinho
- Mostra total de itens (soma das quantidades)
- Link direto para a página do carrinho
- Atualização em tempo real

### Notificações
- **Sucesso**: Item adicionado ao carrinho
- **Info**: Item removido ou carrinho limpo
- **Posição**: Canto superior direito
- **Duração**: 3 segundos
- **Animação**: Slide in/out

### Página do Carrinho
- **Estado vazio**: Mensagem e botão para explorar serviços
- **Estado com itens**: Lista completa com opções de edição
- **Resumo**: Cálculo automático de totais
- **Responsivo**: Funciona em desktop e mobile

## Teste do Sistema

Um arquivo de teste foi criado em `teste-carrinho.html` que permite:
- Adicionar itens de teste de todas as categorias
- Visualizar status do carrinho em tempo real
- Limpar o carrinho
- Ver log de todas as ações
- Navegar para o carrinho completo

## Compatibilidade

- **Navegadores**: Chrome, Firefox, Safari, Edge (versões modernas)
- **Dispositivos**: Desktop, tablet, mobile
- **Armazenamento**: Requer suporte a localStorage
- **JavaScript**: ES6+ (arrow functions, template literals, etc.)

## Manutenção

### Adicionar Nova Categoria
1. Adicionar no método `getImagemPadrao()` em `carrinho.js`
2. Atualizar função `getCategoriaAtual()` se necessário
3. Criar página de serviços seguindo o padrão existente

### Modificar Preços
- Os preços são definidos nas páginas de serviços
- O sistema carrega automaticamente os valores selecionados
- Não é necessário modificar o código do carrinho

### Personalizar Notificações
- Modificar método `mostrarNotificacao()` em `carrinho.js`
- Ajustar estilos CSS no final do arquivo
- Alterar duração, posição ou animações

## Troubleshooting

### Carrinho não aparece
- Verificar se `carrinho.js` está sendo carregado
- Verificar console do navegador para erros
- Confirmar que localStorage está habilitado

### Itens não são salvos
- Verificar se localStorage tem espaço disponível
- Verificar se não há erros de JSON parsing
- Limpar localStorage se necessário: `localStorage.clear()`

### Contador não atualiza
- Verificar se o elemento `.nav-menu` existe
- Verificar se não há conflitos de CSS
- Recarregar a página

## Próximos Passos

1. **Integração com Backend**: Enviar dados do carrinho para servidor
2. **Persistência de Usuário**: Associar carrinho a conta de usuário
3. **Cupons de Desconto**: Implementar sistema de códigos promocionais
4. **Cálculo de Frete**: Adicionar opções de entrega/setup
5. **Histórico**: Manter histórico de orçamentos anteriores
