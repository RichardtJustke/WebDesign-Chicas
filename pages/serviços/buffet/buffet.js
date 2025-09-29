// JavaScript para página de buffet - Pop-ups de pacotes OTIMIZADO
document.addEventListener('DOMContentLoaded', function() {
    
    // Cache de elementos DOM para melhor performance
    const domCache = {
        verPacotesBtn: null,
        packagesPopup: null,
        packagesCloseBtn: null,
        packageDetailPopup: null,
        packageDetailCloseBtn: null,
        verDetalhesBtns: null,
        adicionarEventoBtn: null
    };
    
    // Inicializar cache de elementos
    function initDOMCache() {
        domCache.verPacotesBtn = document.getElementById('ver-pacotes-btn');
        domCache.packagesPopup = document.getElementById('packages-popup');
        domCache.packagesCloseBtn = document.querySelector('.packages-close-btn');
        domCache.packageDetailPopup = document.getElementById('package-detail-popup');
        domCache.packageDetailCloseBtn = document.querySelector('.package-detail-close-btn');
        domCache.verDetalhesBtns = document.querySelectorAll('.ver-detalhes-btn');
        domCache.adicionarEventoBtn = document.querySelector('.adicionar-evento-btn');
    }
    
    // Dados dos pacotes
    const packagesData = {
        bronze: {
            title: 'Pacote bronze',
            description: 'Perfeito para eventos corporativos e reuniões de negócios. Oferece um cardápio equilibrado com opções saudáveis e saborosas, ideal para coffee breaks e almoços executivos.',
            items: [
                'Bar de drinks completo',
                'Espumantes e champanhes',
                'Finger foods variados',
                'Bartender profissional',
                'Equipamentos de bar',
                'Decoração básica'
            ],
            mainImage: '../../../assets/img g/buffet/alexander-fae-uo9TCt61o30-unsplash.jpg',
            gallery: [
                '../../../assets/img g/buffet/chuttersnap-a5Cobl3QB5A-unsplash.jpg',
                '../../../assets/img g/buffet/dan-burton-5JtuW6PqGKE-unsplash.jpg',
                '../../../assets/img g/buffet/edwin-petrus-Ri2dPW_kP0k-unsplash.jpg'
            ],
            price: 'A partir de R$ 89/pessoa'
        },
        prata: {
            title: 'Pacote prata',
            description: 'Ideal para eventos de médio porte e celebrações especiais. Inclui uma seleção mais elaborada de pratos e bebidas, com maior variedade e qualidade premium.',
            items: [
                'Bar de drinks premium',
                'Espumantes e champanhes selecionados',
                'Menu executivo completo',
                'Bartender especializado',
                'Equipamentos profissionais',
                'Decoração temática',
                'Garçom dedicado'
            ],
            mainImage: '../../../assets/img g/buffet/chuttersnap-a5Cobl3QB5A-unsplash.jpg',
            gallery: [
                '../../../assets/img g/buffet/alexander-fae-uo9TCt61o30-unsplash.jpg',
                '../../../assets/img g/buffet/dan-burton-5JtuW6PqGKE-unsplash.jpg',
                '../../../assets/img g/buffet/edwin-petrus-Ri2dPW_kP0k-unsplash.jpg'
            ],
            price: 'A partir de R$ 149/pessoa'
        },
        ouro: {
            title: 'Pacote ouro',
            description: 'Nossa opção mais luxuosa e completa. Perfeito para eventos de gala, casamentos e celebrações especiais. Oferece uma experiência gastronômica de alto nível com serviço personalizado.',
            items: [
                'Bar de drinks exclusivo',
                'Champanhes e vinhos premium',
                'Menu gourmet completo',
                'Chef especializado',
                'Equipamentos de luxo',
                'Decoração personalizada',
                'Equipe completa de garçons',
                'Serviço de maitre',
                'Menu sob medida'
            ],
            mainImage: '../../../assets/img g/buffet/engin-akyurt-6dPXcMvniHU-unsplash.jpg',
            gallery: [
                '../../../assets/img g/buffet/alexander-fae-uo9TCt61o30-unsplash.jpg',
                '../../../assets/img g/buffet/chuttersnap-a5Cobl3QB5A-unsplash.jpg',
                '../../../assets/img g/buffet/dan-burton-5JtuW6PqGKE-unsplash.jpg'
            ],
            price: 'A partir de R$ 229/pessoa'
        }
    };

    // Inicializar cache
    initDOMCache();

    // Função otimizada para abrir pop-up de pacotes
    function openPackagesPopup() {
        if (domCache.packagesPopup) {
            // Usar requestAnimationFrame para melhor performance
            requestAnimationFrame(() => {
                domCache.packagesPopup.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
    }

    // Função otimizada para fechar pop-up de pacotes
    function closePackagesPopup() {
        if (domCache.packagesPopup) {
            requestAnimationFrame(() => {
                domCache.packagesPopup.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
    }

    // Função otimizada para abrir pop-up de detalhes do pacote
    function openPackageDetailPopup(packageType) {
        const packageData = packagesData[packageType];
        if (!packageData) return;
        
        // Usar DocumentFragment para melhor performance
        const fragment = document.createDocumentFragment();
        
        // Atualizar conteúdo do pop-up de detalhes
        const titleEl = document.getElementById('package-detail-title');
        const descEl = document.querySelector('.package-detail-description p');
        const mainImgEl = document.getElementById('package-detail-main-img');
        const itemsList = document.getElementById('package-detail-list');
        const gallery = document.querySelector('.package-detail-gallery');
        
        if (titleEl) titleEl.textContent = packageData.title;
        if (descEl) descEl.textContent = packageData.description;
        
        // Atualizar lista de itens de forma otimizada
        if (itemsList) {
            itemsList.innerHTML = '';
            packageData.items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                fragment.appendChild(li);
            });
            itemsList.appendChild(fragment);
        }
        
        // Lazy loading para imagem principal
        if (mainImgEl) {
            mainImgEl.style.opacity = '0.5';
            const img = new Image();
            img.onload = () => {
                mainImgEl.src = packageData.mainImage;
                mainImgEl.alt = packageData.title;
                mainImgEl.style.opacity = '1';
            };
            img.src = packageData.mainImage;
        }
        
        // Atualizar galeria com lazy loading
        if (gallery) {
            gallery.innerHTML = '';
            const galleryFragment = document.createDocumentFragment();
            
            packageData.gallery.forEach((imageSrc, index) => {
                const img = document.createElement('img');
                img.style.opacity = '0.5';
                img.alt = 'Galeria';
                img.loading = 'lazy';
                img.addEventListener('click', function() {
                    if (mainImgEl) {
                        mainImgEl.style.opacity = '0.5';
                        const newImg = new Image();
                        newImg.onload = () => {
                            mainImgEl.src = imageSrc;
                            mainImgEl.style.opacity = '1';
                        };
                        newImg.src = imageSrc;
                    }
                });
                
                // Lazy load das imagens da galeria
                const galleryImg = new Image();
                galleryImg.onload = () => {
                    img.src = imageSrc;
                    img.style.opacity = '1';
                };
                galleryImg.src = imageSrc;
                
                galleryFragment.appendChild(img);
            });
            gallery.appendChild(galleryFragment);
        }
        
        // Fechar pop-up de pacotes e abrir pop-up de detalhes
        closePackagesPopup();
        if (domCache.packageDetailPopup) {
            requestAnimationFrame(() => {
                domCache.packageDetailPopup.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
    }

    // Função otimizada para fechar pop-up de detalhes do pacote
    function closePackageDetailPopup() {
        if (domCache.packageDetailPopup) {
            requestAnimationFrame(() => {
                domCache.packageDetailPopup.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
    }

    // Função para voltar ao pop-up de pacotes
    function backToPackagesPopup() {
        closePackageDetailPopup();
        openPackagesPopup();
    }

    // Event listeners otimizados
    if (domCache.verPacotesBtn) {
        domCache.verPacotesBtn.addEventListener('click', openPackagesPopup);
    }
    
    if (domCache.packagesCloseBtn) {
        domCache.packagesCloseBtn.addEventListener('click', closePackagesPopup);
    }
    
    if (domCache.packageDetailCloseBtn) {
        domCache.packageDetailCloseBtn.addEventListener('click', closePackageDetailPopup);
    }

    // Event listeners para botões "Ver detalhes" com event delegation
    if (domCache.packagesPopup) {
        domCache.packagesPopup.addEventListener('click', function(e) {
            if (e.target.classList.contains('ver-detalhes-btn')) {
                const packageCard = e.target.closest('.package-card');
                const packageType = packageCard.getAttribute('data-package');
                openPackageDetailPopup(packageType);
            }
        });
    }

    // Event listener para botão "Adicionar ao evento"
    if (domCache.adicionarEventoBtn) {
        domCache.adicionarEventoBtn.addEventListener('click', function() {
            const currentPackage = getCurrentPackage();
            if (currentPackage) {
                addPackageToCart(currentPackage);
            }
        });
    }

    // Função para obter o pacote atual
    function getCurrentPackage() {
        const title = document.getElementById('package-detail-title').textContent;
        for (const [key, data] of Object.entries(packagesData)) {
            if (data.title === title) {
                return { type: key, ...data };
            }
        }
        return null;
    }

    // Função para adicionar pacote ao carrinho
    function addPackageToCart(packageData) {
        // Verificar se existe um sistema de carrinho
        if (typeof localStorage !== 'undefined') {
            let cart = JSON.parse(localStorage.getItem('eventCart') || '[]');
            
            // Verificar se o pacote já está no carrinho
            const existingItem = cart.find(item => item.type === 'package' && item.packageType === packageData.type);
            
            if (existingItem) {
                // Se já existe, incrementar quantidade
                existingItem.quantity += 1;
            } else {
                // Se não existe, adicionar novo item
                cart.push({
                    id: `package-${packageData.type}`,
                    type: 'package',
                    packageType: packageData.type,
                    title: packageData.title,
                    price: packageData.price,
                    quantity: 1,
                    image: packageData.mainImage,
                    description: packageData.description
                });
            }
            
            // Salvar no localStorage
            localStorage.setItem('eventCart', JSON.stringify(cart));
            
            // Mostrar feedback visual
            showAddToCartFeedback(packageData.title);
            
            // Redirecionar para o carrinho após um delay
            setTimeout(() => {
                redirectToCart();
            }, 2000); // 2 segundos para o usuário ver o feedback
        } else {
            // Fallback se localStorage não estiver disponível
            alert(`${packageData.title} adicionado ao evento!`);
        }
        
        closePackageDetailPopup();
    }

    // Função para redirecionar para o carrinho
    function redirectToCart() {
        // Usar caminho absoluto baseado na estrutura do projeto
        const currentPath = window.location.pathname;
        let cartPath = '';
        
        // Detectar se estamos em um servidor local ou produção
        const isLocalServer = window.location.protocol === 'file:' || 
                             window.location.hostname === 'localhost' || 
                             window.location.hostname === '127.0.0.1';
        
        if (isLocalServer) {
            // Para servidor local, usar caminho relativo
            if (currentPath.includes('/pages/serviços/')) {
                cartPath = '../../carrinho/carrinho.html';
            } else if (currentPath.includes('/pages/')) {
                cartPath = '../carrinho/carrinho.html';
            } else {
                cartPath = 'pages/carrinho/carrinho.html';
            }
        } else {
            // Para produção, usar caminho absoluto
            cartPath = '/pages/carrinho/carrinho.html';
        }
        
        console.log('Redirecionando para:', cartPath);
        console.log('Caminho atual:', currentPath);
        console.log('É servidor local:', isLocalServer);
        
        // Redirecionar para o carrinho
        try {
            // Usar window.location.assign para evitar problemas de autenticação
            window.location.assign(cartPath);
        } catch (error) {
            console.error('Erro ao redirecionar:', error);
            // Fallback: tentar caminho alternativo
            window.location.assign('../../carrinho/carrinho.html');
        }
    }

    // Função para mostrar feedback visual
    function showAddToCartFeedback(packageTitle) {
        // Criar elemento de feedback
        const feedback = document.createElement('div');
        feedback.className = 'add-to-cart-feedback';
        feedback.innerHTML = `
            <div class="feedback-content">
                <div class="feedback-icon">✓</div>
                <div class="feedback-text">
                    <strong>${packageTitle}</strong><br>
                    Adicionado ao evento!
                </div>
            </div>
        `;
        
        // Estilos para o feedback
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10002;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        const feedbackContent = feedback.querySelector('.feedback-content');
        feedbackContent.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        const feedbackIcon = feedback.querySelector('.feedback-icon');
        feedbackIcon.style.cssText = `
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 16px;
        `;
        
        const feedbackText = feedback.querySelector('.feedback-text');
        feedbackText.style.cssText = `
            font-size: 14px;
            line-height: 1.4;
        `;
        
        // Adicionar ao DOM
        document.body.appendChild(feedback);
        
        // Animar entrada
        setTimeout(() => {
            feedback.style.transform = 'translateX(0)';
        }, 100);
        
        // Remover após 3 segundos
        setTimeout(() => {
            feedback.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 300);
        }, 3000);
    }

    // Fechar pop-ups ao clicar no overlay (otimizado)
    if (domCache.packagesPopup) {
        domCache.packagesPopup.addEventListener('click', function(e) {
            if (e.target === domCache.packagesPopup) {
                closePackagesPopup();
            }
        });
    }

    if (domCache.packageDetailPopup) {
        domCache.packageDetailPopup.addEventListener('click', function(e) {
            if (e.target === domCache.packageDetailPopup) {
                closePackageDetailPopup();
            }
        });
    }

    // Fechar pop-ups com tecla ESC (otimizado)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (domCache.packageDetailPopup && domCache.packageDetailPopup.classList.contains('active')) {
                closePackageDetailPopup();
            } else if (domCache.packagesPopup && domCache.packagesPopup.classList.contains('active')) {
                closePackagesPopup();
            }
        }
    });

    // Adicionar botão de voltar no pop-up de detalhes
    const packageDetailHeader = document.querySelector('.package-detail-popup-header');
    const backButton = document.createElement('button');
    backButton.innerHTML = '← Voltar aos pacotes';
    backButton.className = 'back-to-packages-btn';
    backButton.style.cssText = `
        background: #f0f0f0;
        color: #666;
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        cursor: pointer;
        margin-right: 15px;
        transition: all 0.3s ease;
    `;
    
    backButton.addEventListener('mouseenter', function() {
        this.style.background = '#e0e0e0';
    });
    
    backButton.addEventListener('mouseleave', function() {
        this.style.background = '#f0f0f0';
    });
    
    backButton.addEventListener('click', backToPackagesPopup);
    
    // Inserir botão de voltar antes do título
    const title = packageDetailHeader.querySelector('h2');
    packageDetailHeader.insertBefore(backButton, title);

    // Animações suaves para os pop-ups
    const style = document.createElement('style');
    style.textContent = `
        .packages-popup-overlay,
        .package-detail-popup-overlay {
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        
        .packages-popup-content,
        .package-detail-popup-content {
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }
        
        .packages-popup-overlay.active .packages-popup-content,
        .package-detail-popup-overlay.active .package-detail-popup-content {
            transform: scale(1);
        }
        
        .package-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .package-card:hover {
            transform: translateY(-8px) scale(1.02);
        }
    `;
    document.head.appendChild(style);
});
