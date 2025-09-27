// JavaScript específico para a página inicial
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página inicial carregada');
    
    // Inicializar funcionalidades do portfólio na página inicial
    initPortfolioFilters();
});

// Dados do portfólio organizados por categoria
const portfolioImages = {
    'todas': [
        'pages/index/Rectangle 20.png',
        'pages/index/Rectangle 21.png',
        'pages/index/Rectangle 22.png',
        'pages/index/Rectangle 23.png',
        'pages/index/Rectangle 24.png',
        'pages/index/Rectangle 26.png'
    ],
    'buffet': [
        'assets/img g/buffet/alexander-fae-uo9TCt61o30-unsplash.jpg',
        'assets/img g/buffet/chuttersnap-a5Cobl3QB5A-unsplash.jpg',
        'assets/img g/buffet/city-church-christchurch-ynF4v8W7MIw-unsplash.jpg',
        'assets/img g/buffet/dan-burton-5JtuW6PqGKE-unsplash.jpg',
        'assets/img g/buffet/edwin-petrus-Ri2dPW_kP0k-unsplash.jpg',
        'assets/img g/buffet/engin-akyurt-6dPXcMvniHU-unsplash.jpg'
    ],
    'audiovisual': [
        'assets/img g/ad/dose-media-DiTiYQx0mh4-unsplash.jpg',
        'assets/img g/ad/aarom-ore-iUCMLjQXD4o-unsplash.jpg',
        'assets/img g/ad/aarom-ore-xixE8fHqUk0-unsplash.jpg',
        'assets/img g/ad/asso-myron-rCElGEIgbjs-unsplash.jpg',
        'assets/img g/ad/diana-macesanu-3ciHxbx9H0U-unsplash.jpg',
        'assets/img g/ad/diana-macesanu-fvPfMJL2wKw-unsplash.jpg'
    ],
    'rh': [
        'assets/img g/rh/austin-distel-tLZhFRLj6nY-unsplash.jpg',
        'assets/img g/rh/berke-citak-0cpyFsSUiSc-unsplash.jpg',
        'assets/img g/rh/christina-wocintechchat-com-0Zx1bDv5BNY-unsplash.jpg',
        'assets/img g/rh/colton-sturgeon-3Uj2YjN3jU0-unsplash.jpg',
        'assets/img g/rh/cytonn-photography-n95VMLxqM2I-unsplash.jpg',
        'assets/img g/rh/dylan-gillis-KdeqA3aTnBY-unsplash.jpg'
    ],
    'organização': [
        'pages/index/Rectangle 20.png',
        'pages/index/Rectangle 21.png',
        'pages/index/Rectangle 22.png',
        'pages/index/Rectangle 23.png',
        'pages/index/Rectangle 24.png',
        'pages/index/Rectangle 26.png'
    ]
};

// Inicializar filtros do portfólio
function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.portfolio-filters .filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe ativa de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe ativa ao botão clicado
            this.classList.add('active');
            
            // Obter categoria do filtro
            const category = this.textContent.trim().toLowerCase();
            
            // Verificar se é o botão "Ver portifólio"
            if (category === 'ver portifólio') {
                // Redirecionar para a página de portfólio
                window.location.href = 'pages/portifolio/portifolio.html';
                return;
            }
            
            // Filtrar e exibir imagens
            filterPortfolioImages(category);
        });
    });
}

// Filtrar imagens do portfólio
function filterPortfolioImages(category) {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    const images = portfolioGrid.querySelectorAll('img');
    
    // Obter imagens da categoria selecionada
    const categoryImages = portfolioImages[category] || portfolioImages['todas'];
    
    // Adicionar efeito de fade out
    portfolioGrid.style.opacity = '0.5';
    portfolioGrid.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        // Atualizar as imagens
        images.forEach((img, index) => {
            if (categoryImages[index]) {
                img.src = categoryImages[index];
                img.alt = `Portfolio ${index + 1} - ${category}`;
            }
        });
        
        // Fade in
        portfolioGrid.style.opacity = '1';
    }, 300);
}

// Função para adicionar efeitos visuais aos botões
function addButtonEffects() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 5px 15px rgba(185, 89, 41, 0.3)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
}

// Inicializar efeitos dos botões
addButtonEffects();
