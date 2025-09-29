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

    // Dados dinâmicos dos serviços de buffet
    const buffetServicesData = {
        'coquetéis': {
            title: 'Coquetéis',
            description: 'Elegante serviço volante com finger foods sofisticados, perfeito para eventos corporativos e celebrações especiais.',
            items: [
                'Canapés variados',
                'Petiscos gourmet',
                'Bebidas não alcoólicas',
                'Equipe de garçons',
                'Decoração da mesa'
            ],
            mainImage: '../../../assets/img g/buffet/alexander-fae-uo9TCt61o30-unsplash.jpg',
            gallery: [
                '../../../assets/img g/buffet/chuttersnap-a5Cobl3QB5A-unsplash.jpg',
                '../../../assets/img g/buffet/city-church-christchurch-ynF4v8W7MIw-unsplash.jpg',
                '../../../assets/img g/buffet/dan-burton-5JtuW6PqGKE-unsplash.jpg',
                '../../../assets/img g/buffet/edwin-petrus-Ri2dPW_kP0k-unsplash.jpg'
            ]
        },
        'coffee-break': {
            title: 'Coffee Break',
            description: 'Perfeito para reuniões e conferências. Montagem rápida, quente/frio e reposição.',
            items: [
                'Café expresso e americano',
                'Chás variados',
                'Croissants e pães',
                'Biscoitos e bolos',
                'Água e sucos',
                'Equipamentos de café'
            ],
            mainImage: '../../../assets/img g/buffet/engin-akyurt-6dPXcMvniHU-unsplash.jpg',
            gallery: [
                '../../../assets/img g/buffet/engin-akyurt-eqMHmoe550Y-unsplash.jpg',
                '../../../assets/img g/buffet/engin-akyurt-gaLpc1k6AXo-unsplash.jpg',
                '../../../assets/img g/buffet/jill-sauve-stHOZOzZOEQ-unsplash.jpg',
                '../../../assets/img g/buffet/mudassir-zaheer-RbUI-Hc9Hy0-unsplash.jpg'
            ]
        },
        'brunch': {
            title: 'Brunch',
            description: 'Mix perfeito entre café da manhã e almoço, ideal para eventos matinais e celebrações especiais.',
            items: [
                'Ovos e omeletes',
                'Pães e torradas',
                'Frutas frescas',
                'Saladas variadas',
                'Sucos naturais',
                'Café e chás'
            ],
            mainImage: '../../../assets/img g/buffet/saile-ilyas-SiwrpBnxDww-unsplash.jpg',
            gallery: [
                '../../../assets/img g/buffet/tim-pack-_sH9ifV2yjY-unsplash.jpg',
                '../../../assets/img g/buffet/alexander-fae-uo9TCt61o30-unsplash.jpg',
                '../../../assets/img g/buffet/chuttersnap-a5Cobl3QB5A-unsplash.jpg',
                '../../../assets/img g/buffet/city-church-christchurch-ynF4v8W7MIw-unsplash.jpg'
            ]
        },
        'almoço-jantar': {
            title: 'Almoço/Jantar',
            description: 'Buffet quente completo com pratos principais, acompanhamentos e sobremesas para eventos formais.',
            items: [
                'Pratos principais variados',
                'Arroz e feijão',
                'Saladas frescas',
                'Vegetais grelhados',
                'Sobremesas',
                'Bebidas'
            ],
            mainImage: '../../../assets/img g/buffet/dan-burton-5JtuW6PqGKE-unsplash.jpg',
            gallery: [
                '../../../assets/img g/buffet/edwin-petrus-Ri2dPW_kP0k-unsplash.jpg',
                '../../../assets/img g/buffet/engin-akyurt-6dPXcMvniHU-unsplash.jpg',
                '../../../assets/img g/buffet/engin-akyurt-eqMHmoe550Y-unsplash.jpg',
                '../../../assets/img g/buffet/engin-akyurt-gaLpc1k6AXo-unsplash.jpg'
            ]
        },
        'sobremesas': {
            title: 'Sobremesas & Doces',
            description: 'Finalização doce com mesa temática decorada, perfeita para encerrar qualquer evento com chave de ouro.',
            items: [
                'Tortas variadas',
                'Doces tradicionais',
                'Petit fours',
                'Frutas cristalizadas',
                'Decoração temática',
                'Utensílios especiais'
            ],
            mainImage: '../../../assets/img g/buffet/jill-sauve-stHOZOzZOEQ-unsplash.jpg',
            gallery: [
                '../../../assets/img g/buffet/mudassir-zaheer-RbUI-Hc9Hy0-unsplash.jpg',
                '../../../assets/img g/buffet/saile-ilyas-SiwrpBnxDww-unsplash.jpg',
                '../../../assets/img g/buffet/tim-pack-_sH9ifV2yjY-unsplash.jpg',
                '../../../assets/img g/buffet/alexander-fae-uo9TCt61o30-unsplash.jpg'
            ]
        },
        'bebidas': {
            title: 'Bebidas & Bar',
            description: 'Serviço completo de bebidas com bartender profissional, ideal para qualquer tipo de evento.',
            items: [
                'Bebidas alcoólicas variadas',
                'Bebidas não alcoólicas',
                'Bartender profissional',
                'Equipamentos de bar',
                'Decoração do bar',
                'Garçom especializado'
            ],
            mainImage: '../../../assets/img g/buffet/alexander-fae-uo9TCt61o30-unsplash.jpg',
            gallery: [
                '../../../assets/img g/buffet/chuttersnap-a5Cobl3QB5A-unsplash.jpg',
                '../../../assets/img g/buffet/dan-burton-5JtuW6PqGKE-unsplash.jpg',
                '../../../assets/img g/buffet/edwin-petrus-Ri2dPW_kP0k-unsplash.jpg',
                '../../../assets/img g/buffet/engin-akyurt-6dPXcMvniHU-unsplash.jpg'
            ]
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

    // Função para abrir pop-up dinâmico de serviços de buffet
    function openBuffetServicePopup(serviceType) {
        const serviceData = buffetServicesData[serviceType];
        if (!serviceData) return;

        // Criar pop-up dinâmico se não existir
        let dynamicPopup = document.getElementById('dynamic-buffet-popup');
        if (!dynamicPopup) {
            dynamicPopup = createDynamicBuffetPopup();
        }

        // Atualizar conteúdo do pop-up
        updateDynamicPopupContent(serviceData, dynamicPopup);

        // Mostrar pop-up
        requestAnimationFrame(() => {
            dynamicPopup.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Função para fechar pop-up dinâmico de serviços de buffet
    function closeBuffetServicePopup() {
        const dynamicPopup = document.getElementById('dynamic-buffet-popup');
        if (dynamicPopup) {
            requestAnimationFrame(() => {
                dynamicPopup.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
    }

    // Função para criar pop-up dinâmico
    function createDynamicBuffetPopup() {
        const popup = document.createElement('div');
        popup.id = 'dynamic-buffet-popup';
        popup.className = 'popup-overlay';
        popup.innerHTML = `
            <div class="popup-content">
                <div class="popup-header">
                    <h2 id="dynamic-popup-title"></h2>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="popup-body">
                    <div class="popup-left">
                        <div class="popup-image">
                            <img id="dynamic-popup-main-img" alt="" loading="lazy" decoding="async" />
                        </div>
                        <div class="popup-gallery" id="dynamic-popup-gallery"></div>
                    </div>
                    <div class="popup-right">
                        <div class="info-panel">
                            <h3>Descrição</h3>
                            <p id="dynamic-popup-description"></p>
                        </div>
                        <div class="info-panel">
                            <h3>O que está incluso:</h3>
                            <ul id="dynamic-popup-items"></ul>
                        </div>
                        <button class="contact-btn">Falar com o atendente</button>
                    </div>
                </div>
            </div>
        `;

        // Adicionar event listeners
        const closeBtn = popup.querySelector('.close-btn');
        closeBtn.addEventListener('click', closeBuffetServicePopup);

        // Fechar ao clicar no overlay
        popup.addEventListener('click', function(e) {
            if (e.target === popup) {
                closeBuffetServicePopup();
            }
        });

        // Adicionar ao DOM
        document.body.appendChild(popup);
        return popup;
    }

    // Função para atualizar conteúdo do pop-up dinâmico
    function updateDynamicPopupContent(serviceData, popup) {
        // Atualizar título
        const titleEl = popup.querySelector('#dynamic-popup-title');
        if (titleEl) titleEl.textContent = serviceData.title;

        // Atualizar descrição
        const descEl = popup.querySelector('#dynamic-popup-description');
        if (descEl) descEl.textContent = serviceData.description;

        // Atualizar imagem principal
        const mainImgEl = popup.querySelector('#dynamic-popup-main-img');
        if (mainImgEl) {
            mainImgEl.style.opacity = '0.5';
            const img = new Image();
            img.onload = () => {
                mainImgEl.src = serviceData.mainImage;
                mainImgEl.alt = serviceData.title;
                mainImgEl.style.opacity = '1';
            };
            img.src = serviceData.mainImage;
        }

        // Atualizar lista de itens
        const itemsList = popup.querySelector('#dynamic-popup-items');
        if (itemsList) {
            itemsList.innerHTML = '';
            serviceData.items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                itemsList.appendChild(li);
            });
        }

        // Atualizar galeria
        const gallery = popup.querySelector('#dynamic-popup-gallery');
        if (gallery) {
            gallery.innerHTML = '';
            serviceData.gallery.forEach((imageSrc, index) => {
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
                
                gallery.appendChild(img);
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
            
            // Mostrar mensagem de sucesso sem redirecionamento
            showSuccessMessage();
        } else {
            // Fallback se localStorage não estiver disponível
            alert(`${packageData.title} adicionado ao evento!`);
        }
        
        closePackageDetailPopup();
    }

    // Função para mostrar mensagem de sucesso
    function showSuccessMessage() {
        // Criar elemento de feedback
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
        `;
        
        feedback.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span>✅</span>
                <span>Pacote adicionado com sucesso!</span>
            </div>
        `;
        
        // Adicionar animação CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(feedback);
        
        // Remover feedback após 3 segundos
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 3000);
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

    // Event listeners para botões de serviços de buffet
    document.addEventListener('click', function(e) {
        // Verificar se é um botão de serviço de buffet
        if (e.target.classList.contains('service-btn') || e.target.closest('.service-btn')) {
            const button = e.target.classList.contains('service-btn') ? e.target : e.target.closest('.service-btn');
            const serviceType = button.getAttribute('data-service');
            if (serviceType && buffetServicesData[serviceType]) {
                openBuffetServicePopup(serviceType);
            }
        }
    });

    // Fechar pop-ups com tecla ESC (otimizado)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const dynamicPopup = document.getElementById('dynamic-buffet-popup');
            if (dynamicPopup && dynamicPopup.classList.contains('active')) {
                closeBuffetServicePopup();
            } else if (domCache.packageDetailPopup && domCache.packageDetailPopup.classList.contains('active')) {
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

        /* Estilos específicos para o popup dinâmico de buffet */
        #dynamic-buffet-popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        #dynamic-buffet-popup.active {
            opacity: 1;
            visibility: visible;
        }

        #dynamic-buffet-popup .popup-content {
            background: white;
            border-radius: 20px;
            max-width: 90%;
            max-height: 90%;
            width: 1000px;
            overflow: hidden;
            position: relative;
            transform: scale(0.9);
            transition: transform 0.3s ease;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        #dynamic-buffet-popup.active .popup-content {
            transform: scale(1);
        }

        #dynamic-buffet-popup .popup-header {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 25px 30px;
            border-bottom: 1px solid #f0f0f0;
            background: #fafafa;
            position: relative;
        }

        #dynamic-buffet-popup .popup-header h2 {
            margin: 0;
            color: #333;
            font-size: 28px;
            font-weight: 700;
            font-family: 'Outfit-SemiBold', sans-serif;
        }

        #dynamic-buffet-popup .close-btn {
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: #666;
            padding: 5px;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            position: absolute;
            right: 30px;
            top: 50%;
            transform: translateY(-50%);
        }

        #dynamic-buffet-popup .close-btn:hover {
            background: #f0f0f0;
            color: #b95929;
        }

        #dynamic-buffet-popup .popup-body {
            display: flex;
            padding: 0;
            min-height: 500px;
        }

        #dynamic-buffet-popup .popup-left {
            flex: 1;
            padding: 30px;
            display: flex;
            flex-direction: column;
        }

        #dynamic-buffet-popup .popup-right {
            flex: 1;
            padding: 30px;
            background: #fafafa;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        #dynamic-buffet-popup .popup-image {
            flex: 1;
            margin-bottom: 20px;
        }

        #dynamic-buffet-popup .popup-image img {
            width: 100%;
            height: 350px;
            object-fit: cover;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        #dynamic-buffet-popup .popup-gallery {
            display: flex;
            gap: 10px;
            overflow-x: auto;
            padding: 5px 0;
        }

        #dynamic-buffet-popup .popup-gallery img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            flex-shrink: 0;
            border: 2px solid transparent;
        }

        #dynamic-buffet-popup .popup-gallery img:hover {
            transform: scale(1.05);
            border-color: #b95929;
        }

        #dynamic-buffet-popup .info-panel {
            margin-bottom: 25px;
        }

        #dynamic-buffet-popup .info-panel h3 {
            color: #b95929;
            margin-bottom: 12px;
            font-size: 18px;
            font-weight: 600;
            font-family: 'Outfit-SemiBold', sans-serif;
        }

        #dynamic-buffet-popup .info-panel p {
            color: #666;
            line-height: 1.6;
            margin: 0;
            font-size: 15px;
        }

        #dynamic-buffet-popup .info-panel ul {
            margin: 10px 0;
            padding: 0;
            list-style: none;
        }

        #dynamic-buffet-popup .info-panel li {
            color: #666;
            margin: 8px 0;
            padding-left: 25px;
            position: relative;
            font-size: 15px;
        }

        #dynamic-buffet-popup .info-panel li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #4CAF50;
            font-weight: bold;
            font-size: 16px;
        }

        #dynamic-buffet-popup .contact-btn {
            background: #b95929;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s ease;
            width: 100%;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        #dynamic-buffet-popup .contact-btn:hover {
            background: #a04a1f;
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(185, 89, 41, 0.3);
        }

        /* Responsividade */
        @media (max-width: 768px) {
            #dynamic-buffet-popup .popup-content {
                width: 95%;
                max-height: 95%;
            }

            #dynamic-buffet-popup .popup-body {
                flex-direction: column;
            }

            #dynamic-buffet-popup .popup-left,
            #dynamic-buffet-popup .popup-right {
                padding: 20px;
            }

            #dynamic-buffet-popup .popup-image img {
                height: 250px;
            }

            #dynamic-buffet-popup .popup-gallery {
                justify-content: center;
            }
        }
    `;
    document.head.appendChild(style);
});
