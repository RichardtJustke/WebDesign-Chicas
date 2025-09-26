// JavaScript específico para a página de Portfólio

document.addEventListener('DOMContentLoaded', function() {
    console.log('Página de Portfólio carregada');
    
    // Inicializar funcionalidades do portfólio
    initPortfolioFilters();
    initPortfolioGrid();
    initPortfolioModal();
    initLoadMore();
    loadPortfolioData();
});

// Dados do portfólio (normalmente viriam de uma API)
const portfolioData = [
    {
        id: 1,
        title: "Evento Corporativo ABC",
        category: "buffet",
        image: "../../images/portfolio/buffet-1.jpg",
        description: "Coffee break executivo para 200 pessoas com menu personalizado e serviço impecável.",
        details: {
            client: "ABC Corporation",
            date: "2024-11-15",
            participants: 200,
            duration: "4 horas",
            services: ["Buffet Premium", "Coffee Break", "Serviço de Mesa"]
        },
        gallery: [
            "../../images/portfolio/buffet-1-1.jpg",
            "../../images/portfolio/buffet-1-2.jpg",
            "../../images/portfolio/buffet-1-3.jpg"
        ]
    },
    {
        id: 2,
        title: "Lançamento de Produto Tech",
        category: "audiovisual",
        image: "../../images/portfolio/audiovisual-1.jpg",
        description: "Cobertura completa do evento de lançamento com fotografia, vídeo e drone.",
        details: {
            client: "Tech Innovation",
            date: "2024-10-22",
            participants: 150,
            duration: "6 horas",
            services: ["Fotografia", "Vídeo", "Drone", "Streaming"]
        },
        gallery: [
            "../../images/portfolio/audiovisual-1-1.jpg",
            "../../images/portfolio/audiovisual-1-2.jpg",
            "../../images/portfolio/audiovisual-1-3.jpg"
        ]
    },
    {
        id: 3,
        title: "Conferência Anual RH",
        category: "rh",
        image: "../../images/portfolio/rh-1.jpg",
        description: "Gestão completa de recursos humanos para conferência com 300 participantes.",
        details: {
            client: "HR Solutions",
            date: "2024-09-18",
            participants: 300,
            duration: "8 horas",
            services: ["Recepção", "Credenciamento", "Controle de Acesso", "Apoio Logístico"]
        },
        gallery: [
            "../../images/portfolio/rh-1-1.jpg",
            "../../images/portfolio/rh-1-2.jpg",
            "../../images/portfolio/rh-1-3.jpg"
        ]
    },
    {
        id: 4,
        title: "Workshop Executivo",
        category: "organizacao",
        image: "../../images/portfolio/organizacao-1.jpg",
        description: "Organização completa de workshop com planejamento e execução impecável.",
        details: {
            client: "Executive Training",
            date: "2024-08-25",
            participants: 50,
            duration: "12 horas",
            services: ["Planejamento", "Coordenação", "Material", "Logística"]
        },
        gallery: [
            "../../images/portfolio/organizacao-1-1.jpg",
            "../../images/portfolio/organizacao-1-2.jpg",
            "../../images/portfolio/organizacao-1-3.jpg"
        ]
    },
    {
        id: 5,
        title: "Evento de Networking",
        category: "buffet",
        image: "../../images/portfolio/buffet-2.jpg",
        description: "Coquetel de networking empresarial com menu sofisticado e ambiente acolhedor.",
        details: {
            client: "Business Network",
            date: "2024-07-30",
            participants: 120,
            duration: "3 horas",
            services: ["Coquetel", "Canapés", "Bebidas Premium", "Decoração"]
        },
        gallery: [
            "../../images/portfolio/buffet-2-1.jpg",
            "../../images/portfolio/buffet-2-2.jpg",
            "../../images/portfolio/buffet-2-3.jpg"
        ]
    },
    {
        id: 6,
        title: "Convenção de Vendas",
        category: "audiovisual",
        image: "../../images/portfolio/audiovisual-2.jpg",
        description: "Cobertura audiovisual completa da convenção com transmissão ao vivo.",
        details: {
            client: "Sales Corp",
            date: "2024-06-12",
            participants: 250,
            duration: "10 horas",
            services: ["Transmissão", "Fotografia", "Edição", "Redes Sociais"]
        },
        gallery: [
            "../../images/portfolio/audiovisual-2-1.jpg",
            "../../images/portfolio/audiovisual-2-2.jpg",
            "../../images/portfolio/audiovisual-2-3.jpg"
        ]
    }
];

let currentFilter = 'todas';
let currentPage = 1;
const itemsPerPage = 6;
let filteredData = [...portfolioData];

// Inicializar filtros do portfólio
function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe ativa de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe ativa ao botão clicado
            this.classList.add('active');
            
            // Obter categoria do filtro
            const category = this.textContent.trim().toLowerCase();
            currentFilter = category;
            currentPage = 1;
            
            // Filtrar e exibir itens
            filterPortfolioItems(category);
        });
    });
}

// Filtrar itens do portfólio
function filterPortfolioItems(category) {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    const items = portfolioGrid.querySelectorAll('.portfolio-item');
    
    // Animação de saída
    items.forEach(item => {
        item.classList.add('hidden');
    });
    
    setTimeout(() => {
        // Filtrar dados
        if (category === 'todas') {
            filteredData = [...portfolioData];
        } else {
            filteredData = portfolioData.filter(item => item.category === category);
        }
        
        // Renderizar itens filtrados
        renderPortfolioItems();
        
        // Atualizar botão "Carregar Mais"
        updateLoadMoreButton();
    }, 300);
}

// Renderizar itens do portfólio
function renderPortfolioItems(append = false) {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    
    if (!append) {
        portfolioGrid.innerHTML = '';
    }
    
    const startIndex = append ? (currentPage - 1) * itemsPerPage : 0;
    const endIndex = currentPage * itemsPerPage;
    const itemsToShow = filteredData.slice(startIndex, endIndex);
    
    if (itemsToShow.length === 0 && !append) {
        showEmptyState();
        return;
    }
    
    itemsToShow.forEach((item, index) => {
        const portfolioItem = createPortfolioItem(item);
        portfolioGrid.appendChild(portfolioItem);
        
        // Animação de entrada com delay
        setTimeout(() => {
            portfolioItem.classList.remove('hidden');
        }, index * 100);
    });
}

// Criar elemento do portfólio
function createPortfolioItem(data) {
    const item = document.createElement('div');
    item.className = 'portfolio-item hidden';
    item.dataset.id = data.id;
    item.dataset.category = data.category;
    
    item.innerHTML = `
        <div class="portfolio-image">
            <img src="${data.image}" alt="${data.title}" loading="lazy">
            <div class="portfolio-overlay">
                <button class="btn-view-details" data-id="${data.id}">
                    <i class="icon-eye"></i>
                    Ver Detalhes
                </button>
            </div>
        </div>
        <div class="portfolio-info">
            <h3>${data.title}</h3>
            <p>${data.description}</p>
            <span class="portfolio-category">${getCategoryName(data.category)}</span>
        </div>
    `;
    
    // Event listener para ver detalhes
    const viewButton = item.querySelector('.btn-view-details');
    viewButton.addEventListener('click', () => openPortfolioModal(data.id));
    
    return item;
}

// Obter nome da categoria
function getCategoryName(category) {
    const categoryNames = {
        'buffet': 'Buffet',
        'audiovisual': 'Audiovisual',
        'rh': 'RH',
        'organizacao': 'Organização'
    };
    
    return categoryNames[category] || category;
}

// Mostrar estado vazio
function showEmptyState() {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    portfolioGrid.innerHTML = `
        <div class="portfolio-empty">
            <div class="empty-icon">
                <i class="icon-search">🔍</i>
            </div>
            <h3>Nenhum projeto encontrado</h3>
            <p>Não encontramos projetos para esta categoria. Tente outro filtro.</p>
            <button class="btn-primary" onclick="filterPortfolioItems('todas')">
                Ver Todos os Projetos
            </button>
        </div>
    `;
}

// Inicializar grid do portfólio
function initPortfolioGrid() {
    // Adicionar efeitos de hover
    document.addEventListener('mouseenter', function(e) {
        if (e.target.closest('.portfolio-item')) {
            const item = e.target.closest('.portfolio-item');
            item.style.transform = 'translateY(-10px)';
        }
    }, true);
    
    document.addEventListener('mouseleave', function(e) {
        if (e.target.closest('.portfolio-item')) {
            const item = e.target.closest('.portfolio-item');
            item.style.transform = 'translateY(0)';
        }
    }, true);
}

// Inicializar modal do portfólio
function initPortfolioModal() {
    // Criar modal se não existir
    if (!document.querySelector('.portfolio-modal')) {
        createPortfolioModal();
    }
}

// Criar modal do portfólio
function createPortfolioModal() {
    const modal = document.createElement('div');
    modal.className = 'portfolio-modal';
    modal.id = 'portfolioModal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <img src="" alt="" id="modalImage">
                <button class="modal-close" aria-label="Fechar modal">&times;</button>
            </div>
            <div class="modal-body">
                <h2 class="modal-title" id="modalTitle"></h2>
                <p class="modal-description" id="modalDescription"></p>
                
                <div class="modal-details" id="modalDetails">
                    <!-- Detalhes serão preenchidos dinamicamente -->
                </div>
                
                <div class="modal-gallery" id="modalGallery">
                    <!-- Galeria será preenchida dinamicamente -->
                </div>
                
                <div class="modal-actions">
                    <button class="btn-primary" id="contactForProject">
                        <i class="icon-phone"></i>
                        Solicitar Orçamento Similar
                    </button>
                    <button class="btn-secondary" id="shareProject">
                        <i class="icon-share"></i>
                        Compartilhar
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners do modal
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('modal-close')) {
            closePortfolioModal();
        }
    });
    
    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closePortfolioModal();
        }
    });
}

// Abrir modal do portfólio
function openPortfolioModal(projectId) {
    const project = portfolioData.find(item => item.id == projectId);
    if (!project) return;
    
    const modal = document.querySelector('.portfolio-modal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalDetails = document.getElementById('modalDetails');
    const modalGallery = document.getElementById('modalGallery');
    
    // Preencher dados do modal
    modalImage.src = project.image;
    modalImage.alt = project.title;
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;
    
    // Preencher detalhes
    modalDetails.innerHTML = `
        <div class="detail-item">
            <div class="detail-label">Cliente:</div>
            <div class="detail-value">${project.details.client}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Data:</div>
            <div class="detail-value">${formatDate(project.details.date)}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Participantes:</div>
            <div class="detail-value">${project.details.participants}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Duração:</div>
            <div class="detail-value">${project.details.duration}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Serviços:</div>
            <div class="detail-value">${project.details.services.join(', ')}</div>
        </div>
    `;
    
    // Preencher galeria
    modalGallery.innerHTML = '';
    project.gallery.forEach(image => {
        const img = document.createElement('img');
        img.src = image;
        img.alt = project.title;
        img.addEventListener('click', () => openImageViewer(image));
        modalGallery.appendChild(img);
    });
    
    // Mostrar modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Fechar modal do portfólio
function closePortfolioModal() {
    const modal = document.querySelector('.portfolio-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Inicializar botão "Carregar Mais"
function initLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.classList.add('loading');
            this.textContent = 'Carregando...';
            
            // Simular carregamento
            setTimeout(() => {
                currentPage++;
                renderPortfolioItems(true);
                updateLoadMoreButton();
                
                this.classList.remove('loading');
                this.textContent = 'Carregar Mais Projetos';
            }, 1000);
        });
    }
}

// Atualizar botão "Carregar Mais"
function updateLoadMoreButton() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const loadMoreSection = document.querySelector('.load-more-section');
    
    if (!loadMoreBtn || !loadMoreSection) return;
    
    const totalItems = filteredData.length;
    const shownItems = currentPage * itemsPerPage;
    
    if (shownItems >= totalItems) {
        loadMoreSection.style.display = 'none';
    } else {
        loadMoreSection.style.display = 'block';
        const remainingItems = totalItems - shownItems;
        loadMoreBtn.textContent = `Carregar Mais (${remainingItems} restantes)`;
    }
}

// Carregar dados do portfólio
function loadPortfolioData() {
    // Mostrar loading
    showPortfolioLoading();
    
    // Simular carregamento de dados (normalmente seria uma chamada de API)
    setTimeout(() => {
        renderPortfolioItems();
        updateLoadMoreButton();
        hidePortfolioLoading();
    }, 1000);
}

// Mostrar loading do portfólio
function showPortfolioLoading() {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    portfolioGrid.innerHTML = '';
    
    // Criar skeleton loading
    for (let i = 0; i < 6; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'portfolio-skeleton';
        skeleton.innerHTML = `
            <div class="skeleton-image"></div>
            <div class="skeleton-content">
                <div class="skeleton-title"></div>
                <div class="skeleton-description"></div>
                <div class="skeleton-description" style="width: 60%;"></div>
                <div class="skeleton-category"></div>
            </div>
        `;
        portfolioGrid.appendChild(skeleton);
    }
}

// Esconder loading do portfólio
function hidePortfolioLoading() {
    const skeletons = document.querySelectorAll('.portfolio-skeleton');
    skeletons.forEach(skeleton => skeleton.remove());
}

// Abrir visualizador de imagem
function openImageViewer(imageSrc) {
    const viewer = document.createElement('div');
    viewer.className = 'image-viewer';
    viewer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: pointer;
    `;
    
    const img = document.createElement('img');
    img.src = imageSrc;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
    `;
    
    viewer.appendChild(img);
    document.body.appendChild(viewer);
    
    viewer.addEventListener('click', () => {
        viewer.remove();
    });
    
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            viewer.remove();
            document.removeEventListener('keydown', escHandler);
        }
    });
}

// Busca no portfólio
function searchPortfolio(query) {
    const searchTerm = query.toLowerCase();
    
    filteredData = portfolioData.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.details.client.toLowerCase().includes(searchTerm) ||
        item.details.services.some(service => service.toLowerCase().includes(searchTerm))
    );
    
    currentPage = 1;
    renderPortfolioItems();
    updateLoadMoreButton();
}

// Ordenar portfólio
function sortPortfolio(sortBy) {
    switch (sortBy) {
        case 'date-desc':
            filteredData.sort((a, b) => new Date(b.details.date) - new Date(a.details.date));
            break;
        case 'date-asc':
            filteredData.sort((a, b) => new Date(a.details.date) - new Date(b.details.date));
            break;
        case 'title':
            filteredData.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'participants':
            filteredData.sort((a, b) => b.details.participants - a.details.participants);
            break;
    }
    
    currentPage = 1;
    renderPortfolioItems();
    updateLoadMoreButton();
}

// Compartilhar projeto
function shareProject(projectId) {
    const project = portfolioData.find(item => item.id == projectId);
    if (!project) return;
    
    if (navigator.share) {
        navigator.share({
            title: project.title,
            text: project.description,
            url: window.location.href + '#projeto-' + projectId
        });
    } else {
        // Fallback para navegadores sem suporte
        const url = window.location.href + '#projeto-' + projectId;
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Link copiado para a área de transferência!', 'success');
        });
    }
}

// Exportar funções para uso global
window.PortfolioPage = {
    searchPortfolio,
    sortPortfolio,
    shareProject,
    openPortfolioModal,
    closePortfolioModal
};
