// ====== SISTEMA DE MODAIS - CHICAS EVENTOS ======

class ModalManager {
  constructor() {
    this.activeModal = null;
    this.modalStack = [];
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.createModalContainer();
  }

  setupEventListeners() {
    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.closeModal();
      }
    });

    // Prevenir scroll do body quando modal está aberto
    document.addEventListener('wheel', (e) => {
      if (this.activeModal) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  createModalContainer() {
    // Criar container para modais se não existir
    if (!document.getElementById('modal-container')) {
      const container = document.createElement('div');
      container.id = 'modal-container';
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1200;
        pointer-events: none;
      `;
      document.body.appendChild(container);
    }
  }

  openModal(modalElement) {
    // Fechar modal anterior se existir
    if (this.activeModal) {
      this.closeModal();
    }

    // Adicionar ao stack
    this.modalStack.push(modalElement);
    this.activeModal = modalElement;

    // Bloquear scroll do body
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = this.getScrollbarWidth() + 'px';

    // Adicionar modal ao container
    const container = document.getElementById('modal-container');
    container.appendChild(modalElement);
    container.style.pointerEvents = 'auto';

    // Animar entrada
    requestAnimationFrame(() => {
      modalElement.classList.add('modal-show');
    });

    // Focar no modal para acessibilidade
    const focusableElement = modalElement.querySelector('[tabindex="0"], button, input, select, textarea, a[href]');
    if (focusableElement) {
      focusableElement.focus();
    }
  }

  closeModal() {
    if (!this.activeModal) return;

    const modal = this.activeModal;
    
    // Remover do stack
    this.modalStack.pop();
    this.activeModal = this.modalStack.length > 0 ? this.modalStack[this.modalStack.length - 1] : null;

    // Animar saída
    modal.classList.remove('modal-show');
    
    setTimeout(() => {
      // Remover modal do DOM
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }

      // Restaurar scroll do body se não há mais modais
      if (!this.activeModal) {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        
        const container = document.getElementById('modal-container');
        container.style.pointerEvents = 'none';
      }
    }, 200);
  }

  getScrollbarWidth() {
    // Calcular largura da scrollbar para compensar
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    outer.style.msOverflowStyle = 'scrollbar';
    document.body.appendChild(outer);

    const inner = document.createElement('div');
    outer.appendChild(inner);

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode.removeChild(outer);

    return scrollbarWidth;
  }
}

// Instância global do gerenciador de modais
const modalManager = new ModalManager();

// ====== MODAL DE PACOTES ======

function openPackagesModal() {
  const serviceKey = getCurrentServiceKey();
  const serviceData = getServiceData(serviceKey);
  
  if (!serviceData || !serviceData.packages) {
    console.error('Dados de pacotes não encontrados para:', serviceKey);
    return;
  }

  const modal = createPackagesModal(serviceData);
  setupModalEventListeners(modal);
  modalManager.openModal(modal);
}

function createPackagesModal(serviceData) {
  const modal = document.createElement('div');
  modal.className = 'modal packages-modal';
  modal.innerHTML = `
    <div class="modal-overlay" onclick="modalManager.closeModal()"></div>
    <div class="modal-content packages-modal-content">
      <div class="modal-header">
        <h2 class="modal-title">Pacotes - ${serviceData.serviceKey.charAt(0).toUpperCase() + serviceData.serviceKey.slice(1)}</h2>
        <button class="modal-close" onclick="modalManager.closeModal()" aria-label="Fechar modal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="packages-grid">
          ${serviceData.packages.map(pkg => createPackageCard(pkg, serviceData)).join('')}
        </div>
      </div>
    </div>
  `;

  return modal;
}

function createPackageCard(pkg, serviceData) {
  const pricingOptions = pkg.pricing.options.map(option => {
    const price = option.price === 0 ? 'Consulte' : `R$ ${option.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    return `
      <div class="pricing-option">
        <span class="option-label">${option.label}</span>
        <span class="option-price">${price}</span>
      </div>
    `;
  }).join('');

  const includesList = pkg.includes.map(item => `
    <li class="package-include">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20,6 9,17 4,12"></polyline>
      </svg>
      ${item}
    </li>
  `).join('');

  return `
    <div class="package-card" data-package-id="${pkg.id}">
      <div class="package-header">
        <h3 class="package-title">${pkg.title}</h3>
        <span class="package-tier">${pkg.tierOrService}</span>
      </div>
      
      <div class="package-description">
        <p>${pkg.description}</p>
      </div>
      
      <div class="package-includes">
        <h4>Inclui:</h4>
        <ul class="includes-list">
          ${includesList}
        </ul>
      </div>
      
      <div class="package-pricing">
        <h4>Preços:</h4>
        <div class="pricing-options">
          ${pricingOptions}
        </div>
      </div>
      
      <div class="package-quantity">
        <label for="quantity-${pkg.id}">Quantidade:</label>
        <div class="quantity-selector">
          <button type="button" onclick="decreaseQuantity('${pkg.id}')" class="quantity-btn">-</button>
          <input type="number" id="quantity-${pkg.id}" value="1" min="1" class="quantity-input">
          <button type="button" onclick="increaseQuantity('${pkg.id}')" class="quantity-btn">+</button>
        </div>
      </div>
      
      <div class="package-actions">
        <button class="js-add-to-cart btn-add-cart" 
                data-item-type="package"
                data-item-id="${pkg.id}"
                data-variant-id="${pkg.tierOrService.toLowerCase()}"
                data-qty="1"
                data-meta='{"serviceKey": "${serviceData.serviceKey}", "title": "${pkg.title}", "tier": "${pkg.tierOrService}"}'>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          Adicionar ao Carrinho
        </button>
        
        <a href="${generateWhatsAppLink(serviceData.serviceKey, pkg.id)}" 
           target="_blank" 
           class="btn-whatsapp"
           onclick="trackWhatsAppClick('${serviceData.serviceKey}', 'package', '${pkg.id}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
          Falar com Atendente
        </a>
      </div>
    </div>
  `;
}

// ====== MODAL DE ITEM ======

function openItemModal(itemId) {
  const serviceKey = getCurrentServiceKey();
  const serviceData = getServiceData(serviceKey);
  
  if (!serviceData || !serviceData.items) {
    console.error('Dados de itens não encontrados para:', serviceKey);
    return;
  }

  const item = serviceData.items.find(i => i.id === itemId);
  if (!item) {
    console.error('Item não encontrado:', itemId);
    return;
  }

  const modal = createItemModal(item, serviceData);
  setupModalEventListeners(modal);
  modalManager.openModal(modal);
}

function createItemModal(item, serviceData) {
  // Galeria principal com thumbnails
  const mainImage = item.images[0] || '../../assets/public/img/org/ale.jpg';
  
  const thumbnails = item.images.slice(0, 6).map((image, index) => `
    <button class="thumbnail-item ${index === 0 ? 'active' : ''}" 
            data-image="${image}"
            onclick="changeMainImage('${image}', this)"
            aria-label="Ver imagem ${index + 1}"
            aria-pressed="${index === 0 ? 'true' : 'false'}">
      <img src="${image}" alt="Thumbnail ${index + 1}" 
           onerror="this.src='../../assets/public/img/org/ale.jpg'">
    </button>
  `).join('');

  // Lista de ofertas
  const offeringsList = item.offerings ? item.offerings.map(offering => `
    <li class="offering-item">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20,6 9,17 4,12"></polyline>
      </svg>
      ${offering}
    </li>
  `).join('') : '';

  const modal = document.createElement('div');
  modal.className = 'modal item-modal';
  modal.innerHTML = `
    <div class="modal-overlay" onclick="modalManager.closeModal()"></div>
    <div class="modal-content item-modal-content">
      <div class="modal-header">
        <h2 class="modal-title">${item.title}</h2>
        <button class="modal-close" onclick="modalManager.closeModal()" aria-label="Fechar modal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="item-content-grid">
          <!-- Galeria à esquerda -->
          <div class="item-gallery-section">
            <div class="main-image-container">
              <img id="main-image" src="${mainImage}" alt="${item.title}" 
                   onerror="this.src='../../assets/public/img/org/ale.jpg'"
                   aria-live="polite">
            </div>
            
            ${item.images.length > 1 ? `
              <div class="thumbnails-container">
                <div class="thumbnails-grid">
                  ${thumbnails}
                </div>
              </div>
            ` : ''}
          </div>
          
          <!-- Detalhes à direita -->
          <div class="item-details-section">
            <!-- Descrição (bloco roxo maior) -->
            <div class="item-description-block">
              <h3>Descrição</h3>
              <p>${item.description}</p>
            </div>
            
            <!-- Ofertas/Variações (bloco roxo menor) -->
            ${item.offerings && item.offerings.length > 0 ? `
              <div class="item-offerings-block">
                <h3>Ofertas/Variações</h3>
                <ul class="offerings-list">
                  ${offeringsList}
                </ul>
              </div>
            ` : ''}
            
            <!-- Seleção de Variante -->
            <div class="item-variant-selection">
              <label for="variant-${item.id}">Selecione a opção:</label>
              <select id="variant-${item.id}" class="variant-select">
                ${generateVariantOptions(serviceData.serviceKey, item.id)}
              </select>
            </div>

            <!-- Ações -->
            <div class="item-actions">
              <button class="js-add-to-cart btn-add-cart" 
                      data-item-type="service"
                      data-item-id="${item.id}"
                      data-variant-id=""
                      data-qty="1"
                      data-meta='{"serviceKey": "${serviceData.serviceKey}", "title": "${item.title}"}'>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Adicionar ao Carrinho
              </button>
              
              <a href="${generateWhatsAppLink(serviceData.serviceKey, null, item.id)}" 
                 target="_blank" 
                 class="btn-whatsapp"
                 onclick="trackWhatsAppClick('${serviceData.serviceKey}', 'item', '${item.id}')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                Falar com atendente (WhatsApp)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  return modal;
}

// ====== FUNÇÕES AUXILIARES ======

function getCurrentServiceKey() {
  const path = window.location.pathname;
  if (path.includes('/buffet.html')) return 'buffet';
  if (path.includes('/audiovisual.html')) return 'audiovisual';
  if (path.includes('/rh.html')) return 'rh';
  if (path.includes('/cerimonial.html')) return 'cerimonial';
  return 'buffet'; // fallback
}

/**
 * Gera opções de variantes para serviços baseado no tipo de serviço
 */
function generateVariantOptions(serviceKey, itemId) {
  const variants = getServiceVariants(serviceKey, itemId);
  return variants.map(variant => 
    `<option value="${variant.id}">${variant.label}</option>`
  ).join('');
}

/**
 * Obtém variantes disponíveis para um serviço específico
 */
function getServiceVariants(serviceKey, itemId) {
  const serviceData = getServiceData(serviceKey);
  if (!serviceData) return [];

  // Variantes específicas por serviço
  switch (serviceKey) {
    case 'audiovisual':
      return getAudiovisualVariants(itemId);
    case 'rh':
      return getRHVariants(itemId);
    case 'buffet':
      return getBuffetVariants(itemId);
    case 'cerimonial':
      return getCerimonialVariants(itemId);
    default:
      return [
        { id: 'basico', label: 'Básico' },
        { id: 'completo', label: 'Completo' },
        { id: 'premium', label: 'Premium' }
      ];
  }
}

/**
 * Variantes para serviços audiovisuais
 */
function getAudiovisualVariants(itemId) {
  switch (itemId) {
    case 'fotografia':
      return [
        { id: '2h', label: '2 horas' },
        { id: '3h', label: '3 horas' },
        { id: '8h', label: '8 horas' }
      ];
    case 'filmagem':
      return [
        { id: '2h', label: '2 horas' },
        { id: '4h', label: '4 horas' },
        { id: '8h', label: '8 horas' }
      ];
    case 'drone':
      return [
        { id: '1h', label: '1 hora' },
        { id: '2h', label: '2 horas' }
      ];
    default:
      return [
        { id: 'basico', label: 'Básico' },
        { id: 'completo', label: 'Completo' }
      ];
  }
}

/**
 * Variantes para serviços de RH
 */
function getRHVariants(itemId) {
  return [
    { id: '4h', label: '4 horas' },
    { id: '6h', label: '6 horas' },
    { id: '8h', label: '8 horas' }
  ];
}

/**
 * Variantes para serviços de buffet
 */
function getBuffetVariants(itemId) {
  return [
    { id: '50pessoas', label: 'Até 50 pessoas' },
    { id: '100pessoas', label: '51-100 pessoas' },
    { id: '200pessoas', label: '101-200 pessoas' },
    { id: '200+pessoas', label: 'Mais de 200 pessoas' }
  ];
}

/**
 * Variantes para serviços de cerimonial
 */
function getCerimonialVariants(itemId) {
  return [
    { id: 'basico', label: 'Pacote Básico' },
    { id: 'completo', label: 'Pacote Completo' },
    { id: 'premium', label: 'Pacote Premium' }
  ];
}

function increaseQuantity(packageId) {
  const input = document.getElementById(`quantity-${packageId}`);
  if (input) {
    input.value = parseInt(input.value) + 1;
  }
}

function decreaseQuantity(packageId) {
  const input = document.getElementById(`quantity-${packageId}`);
  if (input && parseInt(input.value) > 1) {
    input.value = parseInt(input.value) - 1;
  }
}

function addPackageToCart(packageId, serviceKey) {
  const serviceData = getServiceData(serviceKey);
  const packageData = serviceData.packages.find(pkg => pkg.id === packageId);
  
  if (!packageData) {
    console.error('Pacote não encontrado:', packageId);
    return;
  }

  const quantityInput = document.getElementById(`quantity-${packageId}`);
  const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

  // Criar item para o carrinho
  const cartItem = {
    id: `${serviceKey}-${packageId}-${Date.now()}`,
    nome: packageData.title,
    categoria: serviceKey,
    opcao: `${packageData.tierOrService} - Quantidade: ${quantity}`,
    preco: 0, // Preço será definido no orçamento
    quantidade: quantity,
    imagem: getDefaultServiceImage(serviceKey)
  };

  // Adicionar ao carrinho usando o sistema existente
  if (window.carrinhoManager) {
    carrinhoManager.adicionarItem(cartItem);
    modalManager.closeModal();
  } else {
    console.error('Sistema de carrinho não disponível');
  }
}

function getDefaultServiceImage(serviceKey) {
  const defaultImages = {
    'buffet': '../../assets/public/img/buffet/buffet.jpg',
    'audiovisual': '../../assets/public/img/aud/fotografo.jpg',
    'rh': '../../assets/public/img/rh/operacional.jpg',
    'cerimonial': '../../assets/public/img/org/ale.jpg'
  };
  return defaultImages[serviceKey] || defaultImages['cerimonial'];
}

// ====== FUNÇÕES DA GALERIA ======

function changeMainImage(imageSrc, thumbnailButton) {
  const mainImage = document.getElementById('main-image');
  if (!mainImage) return;

  // Atualizar imagem principal
  mainImage.src = imageSrc;
  
  // Atualizar estado dos thumbnails
  const allThumbnails = document.querySelectorAll('.thumbnail-item');
  allThumbnails.forEach(thumb => {
    thumb.classList.remove('active');
    thumb.setAttribute('aria-pressed', 'false');
  });
  
  // Ativar thumbnail clicado
  thumbnailButton.classList.add('active');
  thumbnailButton.setAttribute('aria-pressed', 'true');
  
  // Anunciar mudança para leitores de tela
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  announcement.textContent = 'Imagem alterada';
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// ====== FUNÇÕES DO CARROSSEL (mantidas para compatibilidade) ======

let currentSlide = 0;
let totalSlides = 0;

function initializeCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  totalSlides = slides.length;
  currentSlide = 0;
  updateCarousel();
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateCarousel();
}

function previousSlide() {
  currentSlide = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
  updateCarousel();
}

function goToSlide(slideIndex) {
  currentSlide = slideIndex;
  updateCarousel();
}

function updateCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const indicators = document.querySelectorAll('.carousel-indicator');
  
  slides.forEach((slide, index) => {
    slide.classList.toggle('active', index === currentSlide);
  });
  
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle('active', index === currentSlide);
  });
}

// ====== TRACKING DE WHATSAPP ======

function trackWhatsAppClick(serviceKey, type, itemId) {
  // TODO: Implementar tracking de analytics se necessário
  console.log('WhatsApp click tracked:', { serviceKey, type, itemId });
}

// ====== EVENT LISTENERS PARA MODAIS ======

/**
 * Configura event listeners para modais após serem criados
 */
function setupModalEventListeners(modal) {
  // Event listener para seleção de variantes em modais de item
  const variantSelects = modal.querySelectorAll('.variant-select');
  variantSelects.forEach(select => {
    select.addEventListener('change', function() {
      const button = modal.querySelector('.js-add-to-cart');
      if (button) {
        button.dataset.variantId = this.value;
      }
    });
  });

  // Event listener para seleção de quantidade em modais de pacote
  const quantityInputs = modal.querySelectorAll('.quantity-input');
  quantityInputs.forEach(input => {
    input.addEventListener('change', function() {
      const packageId = this.id.replace('quantity-', '');
      const button = modal.querySelector('.js-add-to-cart');
      if (button) {
        button.dataset.qty = this.value;
      }
    });
  });
}

// ====== EXPORTAR FUNÇÕES GLOBAIS ======

window.openPackagesModal = openPackagesModal;
window.openItemModal = openItemModal;
window.modalManager = modalManager;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.addPackageToCart = addPackageToCart;
window.changeMainImage = changeMainImage;
window.nextSlide = nextSlide;
window.previousSlide = previousSlide;
window.goToSlide = goToSlide;
window.initializeCarousel = initializeCarousel;
window.trackWhatsAppClick = trackWhatsAppClick;
window.setupModalEventListeners = setupModalEventListeners;
