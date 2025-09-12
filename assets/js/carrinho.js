// ====== SISTEMA DE CARRINHO UNIFICADO ======

class CarrinhoManager {
  constructor() {
    this.carrinho = this.carregarCarrinho();
    this.init();
  }

  init() {
    this.atualizarContadorCarrinho();
    this.setupEventListeners();
  }

  // Carrega carrinho do localStorage
  carregarCarrinho() {
    try {
      const carrinhoSalvo = localStorage.getItem('carrinhoEvento');
      return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      return [];
    }
  }

  // Salva carrinho no localStorage
  salvarCarrinho() {
    try {
      localStorage.setItem('carrinhoEvento', JSON.stringify(this.carrinho));
      this.atualizarContadorCarrinho();
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error);
    }
  }

  // Adiciona item ao carrinho
  adicionarItem(item) {
    // Verifica se o item já existe no carrinho
    const itemExistente = this.carrinho.find(carrinhoItem => 
      carrinhoItem.id === item.id && 
      carrinhoItem.opcao === item.opcao
    );

    if (itemExistente) {
      // Se já existe, aumenta a quantidade
      itemExistente.quantidade += item.quantidade || 1;
    } else {
      // Se não existe, adiciona novo item
      const novoItem = {
        id: item.id || this.gerarId(),
        nome: item.nome,
        categoria: item.categoria,
        opcao: item.opcao || '',
        preco: item.preco,
        quantidade: item.quantidade || 1,
        imagem: item.imagem || this.getImagemPadrao(item.categoria),
        timestamp: Date.now()
      };
      this.carrinho.push(novoItem);
    }

    this.salvarCarrinho();
    this.mostrarNotificacao(`${item.nome} adicionado ao carrinho!`, 'success');
  }

  // Remove item do carrinho
  removerItem(itemId) {
    this.carrinho = this.carrinho.filter(item => item.id !== itemId);
    this.salvarCarrinho();
    this.mostrarNotificacao('Item removido do carrinho', 'info');
  }

  // Atualiza quantidade de um item
  atualizarQuantidade(itemId, novaQuantidade) {
    const item = this.carrinho.find(item => item.id === itemId);
    if (item) {
      if (novaQuantidade <= 0) {
        this.removerItem(itemId);
      } else {
        item.quantidade = novaQuantidade;
        this.salvarCarrinho();
      }
    }
  }

  // Limpa o carrinho
  limparCarrinho() {
    this.carrinho = [];
    this.salvarCarrinho();
    this.mostrarNotificacao('Carrinho limpo', 'info');
  }

  // Calcula total do carrinho
  calcularTotal() {
    return this.carrinho.reduce((total, item) => {
      return total + (item.preco * item.quantidade);
    }, 0);
  }

  // Conta total de itens no carrinho
  contarItens() {
    return this.carrinho.reduce((total, item) => total + item.quantidade, 0);
  }

  // Atualiza contador no header
  atualizarContadorCarrinho() {
    const totalItens = this.contarItens();
    
    // Procura por contador existente no header
    let contador = document.querySelector('.carrinho-contador');
    
    if (totalItens > 0) {
      if (!contador) {
        // Cria contador se não existir
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
          contador = document.createElement('div');
          contador.className = 'carrinho-contador';
          contador.innerHTML = `
            <a href="${this.getCarrinhoPath()}" class="carrinho-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"/>
              </svg>
              <span class="carrinho-badge">${totalItens}</span>
            </a>
          `;
          navMenu.appendChild(contador);
        }
      } else {
        // Atualiza contador existente
        const badge = contador.querySelector('.carrinho-badge');
        if (badge) {
          badge.textContent = totalItens;
        }
      }
    } else if (contador) {
      // Remove contador se carrinho estiver vazio
      contador.remove();
    }
  }

  // Determina o caminho correto para a página do carrinho
  getCarrinhoPath() {
    const currentPath = window.location.pathname;
    
    // Se estiver na página principal (index.html)
    if (currentPath.endsWith('/') || currentPath.endsWith('/index.html') || currentPath.endsWith('/WebDesign-Chicas/')) {
      return 'pages/carrinho.html';
    }
    
    // Se estiver em uma página de serviço (pages/servicos/)
    if (currentPath.includes('/servicos/')) {
      return '../carrinho.html';
    }
    
    // Se estiver em outras páginas dentro de pages/
    if (currentPath.includes('/pages/')) {
      return 'carrinho.html';
    }
    
    // Fallback para página principal
    return 'pages/carrinho.html';
  }

  // Mostra notificação
  mostrarNotificacao(mensagem, tipo = 'success') {
    // Remove notificação existente se houver
    const notificacaoExistente = document.querySelector('.notificacao-carrinho');
    if (notificacaoExistente) {
      notificacaoExistente.remove();
    }

    // Cria nova notificação
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao-carrinho notificacao-${tipo}`;
    notificacao.innerHTML = `
      <div class="notificacao-conteudo">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="notificacao-icone">
          ${tipo === 'success' ? 
            '<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>' : 
            '<path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>'
          }
        </svg>
        <span>${mensagem}</span>
      </div>
    `;
    
    // Adiciona ao body
    document.body.appendChild(notificacao);
    
    // Mostra notificação
    setTimeout(() => {
      notificacao.classList.add('mostrar');
    }, 100);
    
    // Remove após 3 segundos
    setTimeout(() => {
      notificacao.classList.remove('mostrar');
      setTimeout(() => {
        if (notificacao.parentNode) {
          notificacao.parentNode.removeChild(notificacao);
        }
      }, 300);
    }, 3000);
  }

  // Gera ID único para itens
  gerarId() {
    return 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Retorna imagem padrão baseada na categoria
  getImagemPadrao(categoria) {
    const imagensPadrao = {
      'audiovisual': '../assets/public/img/aud/fotografo.jpg',
      'buffet': '../assets/public/img/buffet/buffet.jpg',
      'cerimonial': '../assets/public/img/org/ale.jpg',
      'rh': '../assets/public/img/rh/operacional.jpg'
    };
    return imagensPadrao[categoria] || '../assets/public/img/org/ale.jpg';
  }

  // Configura event listeners
  setupEventListeners() {
    // Escuta mudanças no localStorage de outras abas
    window.addEventListener('storage', (e) => {
      if (e.key === 'carrinhoEvento') {
        this.carrinho = this.carregarCarrinho();
        this.atualizarContadorCarrinho();
      }
    });
  }

  // Renderiza carrinho na página do carrinho
  renderizarCarrinho() {
    const carrinhoVazio = document.getElementById('carrinhoVazio');
    const carrinhoComItens = document.getElementById('carrinhoComItens');
    
    if (!carrinhoVazio || !carrinhoComItens) return;

    if (this.carrinho.length === 0) {
      carrinhoVazio.classList.remove('tw-hidden');
      carrinhoComItens.classList.add('tw-hidden');
    } else {
      carrinhoVazio.classList.add('tw-hidden');
      carrinhoComItens.classList.remove('tw-hidden');
      
      this.renderizarListaItens();
      this.renderizarResumo();
    }
  }

  // Renderiza lista de itens
  renderizarListaItens() {
    const container = document.querySelector('#carrinhoComItens .lg\\:tw-col-span-2 .tw-bg-white');
    if (!container) return;

    const listaItens = container.querySelector('.tw-space-y-6') || this.criarListaItens(container);
    listaItens.innerHTML = '';

    this.carrinho.forEach(item => {
      const itemElement = this.criarElementoItem(item);
      listaItens.appendChild(itemElement);
    });
  }

  // Cria container da lista de itens
  criarListaItens(container) {
    const listaItens = document.createElement('div');
    listaItens.className = 'tw-space-y-6';
    
    // Remove itens estáticos existentes
    const itensExistentes = container.querySelectorAll('.carrinho-item');
    itensExistentes.forEach(item => item.remove());
    
    container.appendChild(listaItens);
    return listaItens;
  }

  // Cria elemento de item do carrinho
  criarElementoItem(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'carrinho-item tw-border-b tw-border-slate-200 tw-pb-6 tw-mb-6 last:tw-border-b-0 last:tw-mb-0';
    itemDiv.innerHTML = `
      <div class="tw-flex tw-gap-4">
        <!-- Imagem do serviço -->
        <div class="tw-w-20 tw-h-20 tw-rounded-xl tw-overflow-hidden tw-flex-shrink-0">
          <img src="${item.imagem}" alt="${item.nome}" class="tw-w-full tw-h-full tw-object-cover">
        </div>
        
        <!-- Detalhes do item -->
        <div class="tw-flex-1">
          <h3 class="tw-font-bold tw-text-lg tw-text-slate-900 tw-mb-2">${item.nome}</h3>
          <p class="tw-text-slate-600 tw-text-sm tw-mb-3">${item.opcao}</p>
          
          <!-- Preço e quantidade -->
          <div class="tw-flex tw-items-center tw-justify-between">
            <div class="tw-flex tw-items-center tw-gap-3">
              <span class="tw-text-sm tw-text-slate-600">Quantidade:</span>
              <div class="tw-flex tw-items-center tw-border tw-border-slate-300 tw-rounded-lg">
                <button class="tw-px-3 tw-py-1 tw-text-slate-600 hover:tw-bg-slate-100" onclick="carrinhoManager.atualizarQuantidade('${item.id}', ${item.quantidade - 1})">-</button>
                <span class="tw-px-4 tw-py-1 tw-font-semibold">${item.quantidade}</span>
                <button class="tw-px-3 tw-py-1 tw-text-slate-600 hover:tw-bg-slate-100" onclick="carrinhoManager.atualizarQuantidade('${item.id}', ${item.quantidade + 1})">+</button>
              </div>
            </div>
            
            <div class="tw-text-right">
              <div class="tw-text-2xl tw-font-bold tw-text-emerald-600">R$ ${(item.preco * item.quantidade).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
              <button class="tw-text-sm tw-text-red-600 hover:tw-text-red-700 tw-mt-1" onclick="carrinhoManager.removerItem('${item.id}')">
                Remover item
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    return itemDiv;
  }

  // Renderiza resumo do pedido
  renderizarResumo() {
    const resumoContainer = document.querySelector('#carrinhoComItens .lg\\:tw-col-span-1 .tw-bg-white');
    if (!resumoContainer) return;

    const total = this.calcularTotal();
    
    // Atualiza itens no resumo
    const itensResumo = resumoContainer.querySelector('.tw-space-y-4');
    if (itensResumo) {
      itensResumo.innerHTML = '';
      this.carrinho.forEach(item => {
        const itemResumo = document.createElement('div');
        itemResumo.className = 'tw-flex tw-justify-between tw-text-sm';
        itemResumo.innerHTML = `
          <span class="tw-text-slate-600">${item.nome}</span>
          <span class="tw-font-semibold">R$ ${(item.preco * item.quantidade).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
        `;
        itensResumo.appendChild(itemResumo);
      });
    }

    // Atualiza total
    const totalElement = resumoContainer.querySelector('.tw-text-emerald-600:last-of-type');
    if (totalElement) {
      totalElement.textContent = `R$ ${total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    }

    // Atualiza subtotal
    const subtotalElement = resumoContainer.querySelector('.tw-flex.tw-justify-between.tw-text-sm:first-of-type span:last-child');
    if (subtotalElement) {
      subtotalElement.textContent = `R$ ${total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    }
  }
}

// ====== FUNÇÕES GLOBAIS PARA COMPATIBILIDADE ======

// Instância global do carrinho
let carrinhoManager;

// Função para adicionar ao carrinho (usada pelas páginas de serviços)
function adicionarAoCarrinho() {
  const itensSelecionados = [];
  
  // Coleta itens selecionados do popup
  const checkboxes = document.querySelectorAll('#popupAdicionar input[type="checkbox"]:checked');
  
  checkboxes.forEach(checkbox => {
    const opcoes = document.getElementById(`opcoes-${checkbox.id}`);
    if (!opcoes) return;
    
    let preco = 0;
    let opcaoTexto = '';
    
    if (checkbox.id === 'garcom') {
      // Caso especial para garçom (baseado em número de pessoas)
      const input = opcoes.querySelector('input[type="number"]');
      const pessoas = parseInt(input.value) || 50;
      preco = pessoas * 150;
      opcaoTexto = `${pessoas} pessoas`;
    } else {
      // Caso padrão com select
      const select = opcoes.querySelector('select');
      if (select) {
        const opcaoSelecionada = select.options[select.selectedIndex];
        preco = parseFloat(opcaoSelecionada.textContent.match(/R\$\s*([\d.,]+)/)[1].replace('.', '').replace(',', '.'));
        opcaoTexto = opcaoSelecionada.textContent;
      }
    }
    
    itensSelecionados.push({
      id: checkbox.id,
      nome: checkbox.nextElementSibling.textContent,
      opcao: opcaoTexto,
      preco: preco,
      categoria: getCategoriaAtual()
    });
  });
  
  if (itensSelecionados.length === 0) {
    alert('Selecione pelo menos um serviço!');
    return;
  }
  
  // Adiciona itens ao carrinho
  itensSelecionados.forEach(item => {
    carrinhoManager.adicionarItem(item);
  });
  
  // Fecha popup e redireciona
  fecharPopupAdicionar();
  window.location.href = carrinhoManager.getCarrinhoPath();
}

// Função para adicionar pacote ao evento (usada pela página de buffet)
function adicionarPacoteAoEvento() {
  const packageTitle = document.getElementById('packageDetailsTitle').textContent;
  const packageDescription = document.getElementById('packageDetailsDescription').textContent;
  const packageImage = document.getElementById('packageDetailsMainImage').src;
  
  const pacote = {
    id: 'buffet-' + Date.now(),
    nome: packageTitle,
    opcao: packageDescription,
    preco: 0, // Preço será definido no orçamento
    categoria: 'buffet',
    imagem: packageImage
  };

  carrinhoManager.adicionarItem(pacote);
  closePackageDetails();
}

// Função para obter categoria atual baseada na URL
function getCategoriaAtual() {
  const path = window.location.pathname;
  if (path.includes('audiovisual')) return 'audiovisual';
  if (path.includes('buffet')) return 'buffet';
  if (path.includes('cerimonial')) return 'cerimonial';
  if (path.includes('rh')) return 'rh';
  return 'outros';
}

// ====== INICIALIZAÇÃO ======

document.addEventListener('DOMContentLoaded', function() {
  // Inicializa o gerenciador de carrinho
  carrinhoManager = new CarrinhoManager();
  
  // Se estiver na página do carrinho, renderiza o carrinho
  if (window.location.pathname.includes('carrinho.html')) {
    carrinhoManager.renderizarCarrinho();
  }
});

// ====== ESTILOS PARA NOTIFICAÇÕES ======

const carrinhoStyles = `
  .notificacao-carrinho {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    padding: 16px 20px;
    min-width: 300px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  }

  .notificacao-carrinho.mostrar {
    transform: translateX(0);
  }

  .notificacao-conteudo {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .notificacao-icone {
    flex-shrink: 0;
  }

  .notificacao-success .notificacao-icone {
    color: #059669;
  }

  .notificacao-info .notificacao-icone {
    color: #1c7cc7;
  }

  .notificacao-carrinho span {
    font-weight: 500;
    color: #0f172a;
  }

  .carrinho-contador {
    position: relative;
  }

  .carrinho-link {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #64748b;
    text-decoration: none;
    padding: 8px 12px;
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .carrinho-link:hover {
    background: #f1f5f9;
    color: #0f172a;
  }

  .carrinho-badge {
    background: #059669;
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 10px;
    min-width: 18px;
    text-align: center;
  }
`;

// Adiciona estilos ao head
const carrinhoStyleSheet = document.createElement('style');
carrinhoStyleSheet.textContent = carrinhoStyles;
document.head.appendChild(carrinhoStyleSheet);
