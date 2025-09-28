# Funcionalidade "Adicionar ao Evento"

## Visão Geral

Esta funcionalidade implementa um pop-up interativo que permite aos usuários selecionar serviços específicos de acordo com o tipo de página (RH, Cerimonial ou Audiovisual) e adicioná-los ao carrinho de compras.

## Arquivos Implementados

### 1. JavaScript (`js/add-to-event-popup.js`)
- **Classe `AddToEventPopup`**: Gerencia toda a lógica do pop-up
- **Serviços disponíveis**: Configuração completa dos serviços variáveis e fixos
- **Detecção automática**: Identifica o tipo de página (RH/Cerimonial/Audiovisual)
- **Cálculo de preços**: Atualização automática do resumo com valores

### 2. CSS (`css/add-to-event-popup.css`)
- **Design responsivo**: Adaptado para desktop e mobile
- **Animações suaves**: Transições e efeitos visuais
- **Layout flexível**: Baseado no design de referência fornecido

### 3. Integração nas Páginas
- **RH**: `pages/serviços/rh/rh.html`
- **Cerimonial**: `pages/serviços/cerimonial/cerimonial.html`
- **Audiovisual**: `pages/serviços/ad/ad.html`

## Funcionalidades Implementadas

### ✅ Seleção de Serviços
- **Serviços Variáveis**: Opções de 2h, 4h, 6h e "Acima de 6h"
- **Serviços Fixos**: Valores fechados conforme tabela
- **Interface intuitiva**: Checkboxes e dropdowns para seleção

### ✅ Cálculo Automático
- **Resumo em tempo real**: Atualização automática dos valores
- **Total dinâmico**: Soma dos serviços selecionados
- **Formatação brasileira**: Valores em R$ com separadores corretos

### ✅ Design Responsivo
- **Desktop**: Layout em duas colunas (serviços + resumo)
- **Mobile**: Layout em coluna única
- **Animações**: Transições suaves e feedback visual

### ✅ Integração com Carrinho
- **LocalStorage**: Salvamento dos itens selecionados
- **Persistência**: Dados mantidos entre sessões
- **Feedback**: Confirmação de adição ao carrinho

## Serviços Disponíveis por Categoria

### RH (Recursos Humanos)
- Garçom (por pessoa)
- Apoio de Operação (por pessoa)
- Recepção (por pessoa)
- Coordenação de Sala
- Limpeza da Área
- Segurança (por pessoa)
- RH (Gestão de equipe)

### Cerimonial
- Cerimonial (R$ 800,00)
- Produção (R$ 1.200,00)
- Planejamento (R$ 1.000,00)
- Consultoria (R$ 900,00)
- Coordenação do Dia (R$ 900,00)
- Roteiro de Timeline Pós-evento (R$ 700,00)
- Gestão de Fornecedores (R$ 800,00)

### Audiovisual
- Fotografia
- Social Media
- Filmagem
- Cobertura ao Vivo
- Pacote 360°
- Gravação com Drone

## Como Usar

### 1. Acessar uma Página de Serviços
- Navegue para RH, Cerimonial ou Audiovisual
- Clique no botão "Adicionar ao Evento"

### 2. Selecionar Serviços
- Clique nos serviços desejados
- Para serviços variáveis, escolha a duração
- Visualize o resumo atualizado automaticamente

### 3. Confirmar Seleção
- Revise os itens e valores no resumo
- Clique em "Adicionar ao carrinho"
- Os itens serão salvos no carrinho

## Estrutura de Dados

### Serviço Selecionado
```javascript
{
    name: "Nome do Serviço",
    price: 1200,
    type: "variable" | "fixed",
    priceKey: "4h" | null
}
```

### Carrinho (LocalStorage)
```javascript
{
    services: [...],
    total: 1200,
    timestamp: "2025-01-27T10:30:00.000Z"
}
```

## Personalização

### Adicionar Novos Serviços
1. Edite o objeto `services` em `add-to-event-popup.js`
2. Adicione o serviço na categoria apropriada (variables/fixed)
3. Configure os preços conforme necessário

### Modificar Preços
1. Atualize os valores no objeto `services`
2. Os preços são aplicados automaticamente
3. Formatação brasileira é mantida

### Alterar Design
1. Modifique `add-to-event-popup.css`
2. Cores, fontes e layout podem ser personalizados
3. Responsividade é mantida automaticamente

## Compatibilidade

- **Navegadores**: Chrome, Firefox, Safari, Edge
- **Dispositivos**: Desktop, Tablet, Mobile
- **JavaScript**: ES6+ (suportado por todos os navegadores modernos)

## Próximos Passos

1. **Integração com Backend**: Conectar com API real
2. **Validação de Login**: Verificar autenticação antes de adicionar
3. **Persistência Avançada**: Sincronização com servidor
4. **Relatórios**: Analytics de seleções mais populares
5. **Personalização**: Temas e cores customizáveis

## Suporte

Para dúvidas ou problemas:
- Verifique o console do navegador para erros
- Confirme que todos os arquivos estão carregados
- Teste em diferentes navegadores e dispositivos
