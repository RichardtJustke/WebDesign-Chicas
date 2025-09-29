// Sistema de Popup Dinâmico Compartilhado para Todas as Páginas de Serviços
document.addEventListener('DOMContentLoaded', function() {
    
    // Dados dinâmicos dos serviços - RH
    const rhServicesData = {
        'garçom': {
            title: 'Garçom',
            description: 'Atendimento profissional e especializado com garçons treinados para garantir o melhor serviço durante seu evento. Nossa equipe é experiente e dedicada.',
            items: [
                'Garçons profissionais treinados',
                'Atendimento personalizado',
                'Serviço de bebidas e comidas',
                'Limpeza e organização contínua',
                'Uniforme padrão da empresa',
                'Supervisão durante todo o evento'
            ],
            mainImage: '../../../assets/img g/rh/adem-ay-Tk9m_HP4rgQ-unsplash.jpg',
            gallery: [
                '../../../assets/img g/rh/anima-visual-XChQZf4q5-s-unsplash.jpg',
                '../../../assets/img g/rh/austin-distel-tLZhFRLj6nY-unsplash.jpg',
                '../../../assets/img g/rh/berke-citak-0cpyFsSUiSc-unsplash.jpg',
                '../../../assets/img g/rh/collin-8FxJi5wuwKc-unsplash.jpg'
            ]
        },
        'apoio': {
            title: 'Apoio/Operação',
            description: 'Suporte técnico e operacional completo para garantir que todos os aspectos do seu evento funcionem perfeitamente. Nossa equipe está preparada para qualquer situação.',
            items: [
                'Suporte técnico especializado',
                'Montagem e desmontagem',
                'Controle de equipamentos',
                'Resolução de problemas técnicos',
                'Coordenação operacional',
                'Backup de equipamentos'
            ],
            mainImage: '../../../assets/img g/rh/anima-visual-XChQZf4q5-s-unsplash.jpg',
            gallery: [
                '../../../assets/img g/rh/austin-distel-tLZhFRLj6nY-unsplash.jpg',
                '../../../assets/img g/rh/berke-citak-0cpyFsSUiSc-unsplash.jpg',
                '../../../assets/img g/rh/collin-8FxJi5wuwKc-unsplash.jpg',
                '../../../assets/img g/rh/jessie-mccall-guXX_Wm-wnY-unsplash.jpg'
            ]
        },
        'recepção': {
            title: 'Recepção',
            description: 'Atendimento e boas-vindas aos convidados com recepcionistas treinadas para criar uma primeira impressão memorável e acolhedora para todos os participantes.',
            items: [
                'Recepcionistas profissionais',
                'Boas-vindas personalizadas',
                'Orientação aos convidados',
                'Controle de acesso',
                'Informações sobre o evento',
                'Atendimento bilíngue (se necessário)'
            ],
            mainImage: '../../../assets/img g/rh/austin-distel-tLZhFRLj6nY-unsplash.jpg',
            gallery: [
                '../../../assets/img g/rh/berke-citak-0cpyFsSUiSc-unsplash.jpg',
                '../../../assets/img g/rh/collin-8FxJi5wuwKc-unsplash.jpg',
                '../../../assets/img g/rh/jessie-mccall-guXX_Wm-wnY-unsplash.jpg',
                '../../../assets/img g/rh/krzysztof-hepner-_D6rTxw4HAI-unsplash.jpg'
            ]
        },
        'coordenação': {
            title: 'Coordenação de Sala',
            description: 'Organização e controle do ambiente para garantir que o espaço esteja sempre organizado e funcional durante todo o evento. Coordenamos todos os aspectos da sala.',
            items: [
                'Organização do layout da sala',
                'Controle de temperatura e iluminação',
                'Gerenciamento de equipamentos',
                'Coordenação de movimentação',
                'Manutenção da ordem',
                'Comunicação com a equipe'
            ],
            mainImage: '../../../assets/img g/rh/berke-citak-0cpyFsSUiSc-unsplash.jpg',
            gallery: [
                '../../../assets/img g/rh/collin-8FxJi5wuwKc-unsplash.jpg',
                '../../../assets/img g/rh/jessie-mccall-guXX_Wm-wnY-unsplash.jpg',
                '../../../assets/img g/rh/krzysztof-hepner-_D6rTxw4HAI-unsplash.jpg',
                '../../../assets/img g/rh/kyle-loftus-_jg3dKZs6sg-unsplash.jpg'
            ]
        },
        'limpeza': {
            title: 'Limpeza de Área',
            description: 'Manutenção e higienização do espaço para garantir um ambiente sempre limpo e organizado durante todo o evento. Nossa equipe mantém os mais altos padrões de limpeza.',
            items: [
                'Limpeza contínua durante o evento',
                'Higienização de mesas e cadeiras',
                'Coleta de lixo e reciclagem',
                'Limpeza de banheiros',
                'Manutenção da área externa',
                'Limpeza pós-evento'
            ],
            mainImage: '../../../assets/img g/rh/collin-8FxJi5wuwKc-unsplash.jpg',
            gallery: [
                '../../../assets/img g/rh/jessie-mccall-guXX_Wm-wnY-unsplash.jpg',
                '../../../assets/img g/rh/krzysztof-hepner-_D6rTxw4HAI-unsplash.jpg',
                '../../../assets/img g/rh/kyle-loftus-_jg3dKZs6sg-unsplash.jpg',
                '../../../assets/img g/rh/negley-stockman-3e_i3-KLhe4-unsplash.jpg'
            ]
        },
        'segurança': {
            title: 'Segurança',
            description: 'Proteção e controle de acesso para garantir a segurança de todos os participantes e bens durante o evento. Nossa equipe de segurança é treinada e experiente.',
            items: [
                'Segurança profissional 24h',
                'Controle de acesso ao evento',
                'Monitoramento de câmeras',
                'Proteção de equipamentos',
                'Segurança dos convidados',
                'Plano de emergência'
            ],
            mainImage: '../../../assets/img g/rh/jessie-mccall-guXX_Wm-wnY-unsplash.jpg',
            gallery: [
                '../../../assets/img g/rh/krzysztof-hepner-_D6rTxw4HAI-unsplash.jpg',
                '../../../assets/img g/rh/kyle-loftus-_jg3dKZs6sg-unsplash.jpg',
                '../../../assets/img g/rh/negley-stockman-3e_i3-KLhe4-unsplash.jpg',
                '../../../assets/img g/rh/nik-ZmY7AG1l0Eo-unsplash.jpg'
            ]
        }
    };

    // Dados dinâmicos dos serviços - Audiovisual
    const audiovisualServicesData = {
        'fotografia': {
            title: 'Fotografia',
            description: 'Captura de momentos únicos e especiais com fotógrafos profissionais especializados em eventos. Registramos cada detalhe importante do seu evento.',
            items: [
                'Fotógrafos profissionais especializados',
                'Equipamentos de alta qualidade',
                'Edição e pós-produção',
                'Entrega digital rápida',
                'Cobertura completa do evento',
                'Backup de segurança das imagens'
            ],
            mainImage: '../../../assets/img g/ad/aarom-ore-iUCMLjQXD4o-unsplash.jpg',
            gallery: [
                '../../../assets/img g/ad/aarom-ore-xixE8fHqUk0-unsplash.jpg',
                '../../../assets/img g/ad/asso-myron-rCElGEIgbjs-unsplash.jpg',
                '../../../assets/img g/ad/diana-macesanu-3ciHxbx9H0U-unsplash.jpg',
                '../../../assets/img g/ad/diana-macesanu-fvPfMJL2wKw-unsplash.jpg'
            ]
        },
        'social-media': {
            title: 'Social Media',
            description: 'Conteúdo para redes sociais e marketing digital com linguagem de marca personalizada. Criamos conteúdo envolvente para suas plataformas.',
            items: [
                'Conteúdo para redes sociais',
                'Linguagem de marca personalizada',
                'Posts e stories dinâmicos',
                'Hashtags estratégicas',
                'Engajamento em tempo real',
                'Relatórios de performance'
            ],
            mainImage: '../../../assets/img g/ad/aarom-ore-xixE8fHqUk0-unsplash.jpg',
            gallery: [
                '../../../assets/img g/ad/aarom-ore-iUCMLjQXD4o-unsplash.jpg',
                '../../../assets/img g/ad/asso-myron-rCElGEIgbjs-unsplash.jpg',
                '../../../assets/img g/ad/diana-macesanu-3ciHxbx9H0U-unsplash.jpg',
                '../../../assets/img g/ad/diana-macesanu-fvPfMJL2wKw-unsplash.jpg'
            ]
        },
        'filmagem': {
            title: 'Filmagem',
            description: 'Vídeos profissionais e cobertura completa do evento com equipamentos de última geração. Capturamos cada momento em alta definição.',
            items: [
                'Filmagem profissional HD/4K',
                'Múltiplas câmeras simultâneas',
                'Equipamentos de última geração',
                'Edição e pós-produção',
                'Entrega em diferentes formatos',
                'Cobertura completa do evento'
            ],
            mainImage: '../../../assets/img g/ad/asso-myron-rCElGEIgbjs-unsplash.jpg',
            gallery: [
                '../../../assets/img g/ad/aarom-ore-iUCMLjQXD4o-unsplash.jpg',
                '../../../assets/img g/ad/aarom-ore-xixE8fHqUk0-unsplash.jpg',
                '../../../assets/img g/ad/diana-macesanu-3ciHxbx9H0U-unsplash.jpg',
                '../../../assets/img g/ad/diana-macesanu-fvPfMJL2wKw-unsplash.jpg'
            ]
        },
        'cobertura-vivo': {
            title: 'Cobertura ao Vivo',
            description: 'Transmissão em tempo real do evento para redes sociais e plataformas de streaming. Leve seu evento para o mundo digital.',
            items: [
                'Transmissão ao vivo HD',
                'Streaming em múltiplas plataformas',
                'Interação com o público online',
                'Equipamentos profissionais',
                'Técnico especializado',
                'Monitoramento da qualidade'
            ],
            mainImage: '../../../assets/img g/ad/diana-macesanu-3ciHxbx9H0U-unsplash.jpg',
            gallery: [
                '../../../assets/img g/ad/aarom-ore-iUCMLjQXD4o-unsplash.jpg',
                '../../../assets/img g/ad/aarom-ore-xixE8fHqUk0-unsplash.jpg',
                '../../../assets/img g/ad/asso-myron-rCElGEIgbjs-unsplash.jpg',
                '../../../assets/img g/ad/diana-macesanu-fvPfMJL2wKw-unsplash.jpg'
            ]
        },
        'pacotes-360': {
            title: 'Pacotes 360°',
            description: 'Experiência imersiva completa com tecnologia 360° para criar conteúdo único e envolvente do seu evento.',
            items: [
                'Filmagem 360° profissional',
                'Equipamentos especializados',
                'Experiência imersiva',
                'Conteúdo interativo',
                'Entrega em múltiplos formatos',
                'Suporte técnico especializado'
            ],
            mainImage: '../../../assets/img g/ad/diana-macesanu-fvPfMJL2wKw-unsplash.jpg',
            gallery: [
                '../../../assets/img g/ad/aarom-ore-iUCMLjQXD4o-unsplash.jpg',
                '../../../assets/img g/ad/aarom-ore-xixE8fHqUk0-unsplash.jpg',
                '../../../assets/img g/ad/asso-myron-rCElGEIgbjs-unsplash.jpg',
                '../../../assets/img g/ad/diana-macesanu-3ciHxbx9H0U-unsplash.jpg'
            ]
        },
        'drone': {
            title: 'Drone',
            description: 'Imagens aéreas e perspectivas únicas do seu evento com drones profissionais. Capturamos ângulos impossíveis de obter no chão.',
            items: [
                'Filmagem aérea profissional',
                'Drones de alta qualidade',
                'Pilotos certificados',
                'Imagens em alta resolução',
                'Perspectivas únicas',
                'Cobertura completa do espaço'
            ],
            mainImage: '../../../assets/img g/ad/dose-media-DiTiYQx0mh4-unsplash.jpg',
            gallery: [
                '../../../assets/img g/ad/aarom-ore-iUCMLjQXD4o-unsplash.jpg',
                '../../../assets/img g/ad/aarom-ore-xixE8fHqUk0-unsplash.jpg',
                '../../../assets/img g/ad/asso-myron-rCElGEIgbjs-unsplash.jpg',
                '../../../assets/img g/ad/diana-macesanu-3ciHxbx9H0U-unsplash.jpg'
            ]
        }
    };

    // Dados dinâmicos dos serviços - Cerimonial
    const cerimonialServicesData = {
        'planejamento': {
            title: 'Planejamento',
            description: 'Estruturação completa do evento com cronograma detalhado, coordenação de fornecedores e gestão de todos os aspectos logísticos.',
            items: [
                'Cronograma detalhado do evento',
                'Coordenação de fornecedores',
                'Gestão logística completa',
                'Planejamento de contingência',
                'Reuniões de alinhamento',
                'Relatórios de progresso'
            ],
            mainImage: '../../../assets/img g/buffet/alexander-fae-uo9TCt61o30-unsplash.jpg',
            gallery: [
                '../../../assets/img g/buffet/chuttersnap-a5Cobl3QB5A-unsplash.jpg',
                '../../../assets/img g/buffet/city-church-christchurch-ynF4v8W7MIw-unsplash.jpg',
                '../../../assets/img g/buffet/dan-burton-5JtuW6PqGKE-unsplash.jpg',
                '../../../assets/img g/buffet/edwin-petrus-Ri2dPW_kP0k-unsplash.jpg'
            ]
        },
        'consultoria': {
            title: 'Consultoria',
            description: 'Orientação especializada e personalizada para cada tipo de evento, oferecendo expertise em cerimonial e protocolo.',
            items: [
                'Consultoria especializada',
                'Orientações personalizadas',
                'Assessoria em protocolo',
                'Dicas e recomendações',
                'Suporte contínuo',
                'Relatórios de consultoria'
            ],
            mainImage: '../../../assets/img g/buffet/chuttersnap-a5Cobl3QB5A-unsplash.jpg',
            gallery: [
                '../../../assets/img g/buffet/alexander-fae-uo9TCt61o30-unsplash.jpg',
                '../../../assets/img g/buffet/city-church-christchurch-ynF4v8W7MIw-unsplash.jpg',
                '../../../assets/img g/buffet/dan-burton-5JtuW6PqGKE-unsplash.jpg',
                '../../../assets/img g/buffet/edwin-petrus-Ri2dPW_kP0k-unsplash.jpg'
            ]
        },
        'coordenação': {
            title: 'Coordenação do Dia',
            description: 'Execução e supervisão no dia do evento, garantindo que tudo aconteça conforme planejado e com excelência.',
            items: [
                'Coordenação no dia do evento',
                'Supervisão de todas as atividades',
                'Gestão de imprevistos',
                'Comunicação com fornecedores',
                'Acompanhamento do cronograma',
                'Relatório pós-evento'
            ],
            mainImage: '../../../assets/img g/buffet/city-church-christchurch-ynF4v8W7MIw-unsplash.jpg',
            gallery: [
                '../../../assets/img g/buffet/alexander-fae-uo9TCt61o30-unsplash.jpg',
                '../../../assets/img g/buffet/chuttersnap-a5Cobl3QB5A-unsplash.jpg',
                '../../../assets/img g/buffet/dan-burton-5JtuW6PqGKE-unsplash.jpg',
                '../../../assets/img g/buffet/edwin-petrus-Ri2dPW_kP0k-unsplash.jpg'
            ]
        },
        'roteiro': {
            title: 'Roteiro & Timeline',
            description: 'Cronograma detalhado e organização temporal do evento, garantindo que cada momento seja planejado e executado perfeitamente.',
            items: [
                'Cronograma detalhado',
                'Timeline do evento',
                'Organização temporal',
                'Marcos importantes',
                'Checklist de atividades',
                'Ajustes em tempo real'
            ],
            mainImage: '../../../assets/img g/buffet/dan-burton-5JtuW6PqGKE-unsplash.jpg',
            gallery: [
                '../../../assets/img g/buffet/alexander-fae-uo9TCt61o30-unsplash.jpg',
                '../../../assets/img g/buffet/chuttersnap-a5Cobl3QB5A-unsplash.jpg',
                '../../../assets/img g/buffet/city-church-christchurch-ynF4v8W7MIw-unsplash.jpg',
                '../../../assets/img g/buffet/edwin-petrus-Ri2dPW_kP0k-unsplash.jpg'
            ]
        },
        'pós-evento': {
            title: 'Pós-Evento',
            description: 'Finalização e acompanhamento pós-evento, incluindo relatórios, feedback e suporte para próximos eventos.',
            items: [
                'Relatório completo do evento',
                'Feedback dos participantes',
                'Análise de performance',
                'Documentação final',
                'Suporte pós-evento',
                'Preparação para próximos eventos'
            ],
            mainImage: '../../../assets/img g/buffet/edwin-petrus-Ri2dPW_kP0k-unsplash.jpg',
            gallery: [
                '../../../assets/img g/buffet/alexander-fae-uo9TCt61o30-unsplash.jpg',
                '../../../assets/img g/buffet/chuttersnap-a5Cobl3QB5A-unsplash.jpg',
                '../../../assets/img g/buffet/city-church-christchurch-ynF4v8W7MIw-unsplash.jpg',
                '../../../assets/img g/buffet/dan-burton-5JtuW6PqGKE-unsplash.jpg'
            ]
        },
        'fornecedores': {
            title: 'Gestão de Fornecedores',
            description: 'Coordenação e supervisão de todos os fornecedores envolvidos no evento, garantindo qualidade e pontualidade.',
            items: [
                'Coordenação de fornecedores',
                'Supervisão de qualidade',
                'Gestão de contratos',
                'Comunicação centralizada',
                'Controle de prazos',
                'Relatórios de fornecedores'
            ],
            mainImage: '../../../assets/img g/buffet/engin-akyurt-6dPXcMvniHU-unsplash.jpg',
            gallery: [
                '../../../assets/img g/buffet/alexander-fae-uo9TCt61o30-unsplash.jpg',
                '../../../assets/img g/buffet/chuttersnap-a5Cobl3QB5A-unsplash.jpg',
                '../../../assets/img g/buffet/city-church-christchurch-ynF4v8W7MIw-unsplash.jpg',
                '../../../assets/img g/buffet/dan-burton-5JtuW6PqGKE-unsplash.jpg'
            ]
        }
    };

    // Função para obter dados baseado na página atual
    function getServicesData() {
        const currentPage = window.location.pathname;
        
        if (currentPage.includes('/rh/')) {
            return rhServicesData;
        } else if (currentPage.includes('/ad/')) {
            return audiovisualServicesData;
        } else if (currentPage.includes('/cerimonial/')) {
            return cerimonialServicesData;
        }
        
        return {};
    }

    // Função para abrir pop-up dinâmico de serviços
    function openServicePopup(serviceType) {
        const servicesData = getServicesData();
        const serviceData = servicesData[serviceType];
        if (!serviceData) return;

        // Criar pop-up dinâmico se não existir
        let dynamicPopup = document.getElementById('dynamic-service-popup');
        if (!dynamicPopup) {
            dynamicPopup = createDynamicServicePopup();
        }

        // Atualizar conteúdo do pop-up
        updateDynamicPopupContent(serviceData, dynamicPopup);

        // Mostrar pop-up
        requestAnimationFrame(() => {
            dynamicPopup.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Função para fechar pop-up dinâmico de serviços
    function closeServicePopup() {
        const dynamicPopup = document.getElementById('dynamic-service-popup');
        if (dynamicPopup) {
            requestAnimationFrame(() => {
                dynamicPopup.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
    }

    // Função para criar pop-up dinâmico
    function createDynamicServicePopup() {
        const popup = document.createElement('div');
        popup.id = 'dynamic-service-popup';
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
        closeBtn.addEventListener('click', closeServicePopup);

        // Fechar ao clicar no overlay
        popup.addEventListener('click', function(e) {
            if (e.target === popup) {
                closeServicePopup();
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

    // Event listeners para botões de serviços
    document.addEventListener('click', function(e) {
        // Verificar se é um botão de serviço
        if (e.target.classList.contains('service-btn') || e.target.closest('.service-btn')) {
            const button = e.target.classList.contains('service-btn') ? e.target : e.target.closest('.service-btn');
            const serviceType = button.getAttribute('data-service');
            if (serviceType) {
                openServicePopup(serviceType);
            }
        }
    });

    // Fechar pop-ups com tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const dynamicPopup = document.getElementById('dynamic-service-popup');
            if (dynamicPopup && dynamicPopup.classList.contains('active')) {
                closeServicePopup();
            }
        }
    });

    // Adicionar estilos CSS para o popup dinâmico
    const style = document.createElement('style');
    style.textContent = `
        /* Estilos específicos para o popup dinâmico de serviços */
        #dynamic-service-popup {
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

        #dynamic-service-popup.active {
            opacity: 1;
            visibility: visible;
        }

        #dynamic-service-popup .popup-content {
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

        #dynamic-service-popup.active .popup-content {
            transform: scale(1);
        }

        #dynamic-service-popup .popup-header {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 25px 30px;
            border-bottom: 1px solid #f0f0f0;
            background: #fafafa;
            position: relative;
        }

        #dynamic-service-popup .popup-header h2 {
            margin: 0;
            color: #333;
            font-size: 28px;
            font-weight: 700;
            font-family: 'Outfit-SemiBold', sans-serif;
            text-align: left;
        }

        #dynamic-service-popup .close-btn {
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

        #dynamic-service-popup .close-btn:hover {
            background: #f0f0f0;
            color: #b95929;
        }

        #dynamic-service-popup .popup-body {
            display: flex;
            padding: 0;
            min-height: 500px;
        }

        #dynamic-service-popup .popup-left {
            flex: 1;
            padding: 30px;
            display: flex;
            flex-direction: column;
        }

        #dynamic-service-popup .popup-right {
            flex: 1;
            padding: 30px;
            background: #fafafa;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        #dynamic-service-popup .popup-image {
            flex: 1;
            margin-bottom: 20px;
        }

        #dynamic-service-popup .popup-image img {
            width: 100%;
            height: 350px;
            object-fit: cover;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        #dynamic-service-popup .popup-gallery {
            display: flex;
            gap: 10px;
            overflow-x: auto;
            padding: 5px 0;
        }

        #dynamic-service-popup .popup-gallery img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            flex-shrink: 0;
            border: 2px solid transparent;
        }

        #dynamic-service-popup .popup-gallery img:hover {
            transform: scale(1.05);
            border-color: #b95929;
        }

        #dynamic-service-popup .info-panel {
            margin-bottom: 25px;
        }

        #dynamic-service-popup .info-panel h3 {
            color: #b95929;
            margin-bottom: 12px;
            font-size: 18px;
            font-weight: 600;
            font-family: 'Outfit-SemiBold', sans-serif;
        }

        #dynamic-service-popup .info-panel p {
            color: #666;
            line-height: 1.6;
            margin: 0;
            font-size: 15px;
        }

        #dynamic-service-popup .info-panel ul {
            margin: 10px 0;
            padding: 0;
            list-style: none;
        }

        #dynamic-service-popup .info-panel li {
            color: #666;
            margin: 8px 0;
            padding-left: 25px;
            position: relative;
            font-size: 15px;
        }

        #dynamic-service-popup .info-panel li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #4CAF50;
            font-weight: bold;
            font-size: 16px;
        }

        #dynamic-service-popup .contact-btn {
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

        #dynamic-service-popup .contact-btn:hover {
            background: #a04a1f;
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(185, 89, 41, 0.3);
        }

        /* Responsividade */
        @media (max-width: 768px) {
            #dynamic-service-popup .popup-content {
                width: 95%;
                max-height: 95%;
            }

            #dynamic-service-popup .popup-body {
                flex-direction: column;
            }

            #dynamic-service-popup .popup-left,
            #dynamic-service-popup .popup-right {
                padding: 20px;
            }

            #dynamic-service-popup .popup-image img {
                height: 250px;
            }

            #dynamic-service-popup .popup-gallery {
                justify-content: center;
            }
        }
    `;
    document.head.appendChild(style);
});
