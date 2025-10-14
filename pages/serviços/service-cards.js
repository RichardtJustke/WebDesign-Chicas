// JavaScript para Cards de Serviços - Chicas Eventos
// Funcionalidade para interação com os cards de serviços

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sistema de Cards de Serviços carregado');
    
    // Configurar event listeners para os cards
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        const serviceType = card.getAttribute('data-service');
        const button = card.querySelector('.service-card-button');
        
        // Event listener para o card inteiro
        card.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`📋 Card clicado: ${serviceType}`);
            openServiceDetails(serviceType);
        });
        
        // Event listener específico para o botão
        if (button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log(`🔘 Botão clicado: ${serviceType}`);
                openServiceDetails(serviceType);
            });
        }
        
        // Efeitos de hover
        card.addEventListener('mouseenter', function() {
            card.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // Função para abrir detalhes do serviço
    function openServiceDetails(serviceType) {
        console.log(`🔍 Abrindo detalhes para: ${serviceType}`);
        
        // Dados dos serviços
        const serviceData = {
            // Serviços de Buffet
            'coqueteis': {
                title: 'Coquetéis',
                description: 'Serviço volante com finger food',
                details: 'Nossos coquetéis são preparados com ingredientes frescos e selecionados, oferecendo uma experiência gastronômica única. Inclui finger foods variados e bebidas especiais.',
                features: [
                    'Bartender profissional',
                    'Coquetéis clássicos e autorais',
                    'Finger foods variados',
                    'Equipamentos de bar completos',
                    'Decoração temática'
                ],
                images: [
                    '../../../assets/img g/buffet/alexander-fae-uo9TCt61o30-unsplash.jpg',
                    '../../../assets/img g/buffet/chuttersnap-a5Cobl3QB5A-unsplash.jpg',
                    '../../../assets/img g/buffet/engin-akyurt-6dPXcMvniHU-unsplash.jpg'
                ]
            },
            'coffee-break': {
                title: 'Coffee Break',
                description: 'Perfeito para reuniões e conferências',
                details: 'Coffee break completo com café premium, chás, sucos naturais e lanches variados. Ideal para eventos corporativos e reuniões.',
                features: [
                    'Café premium e chás especiais',
                    'Lanches e salgados variados',
                    'Sucos naturais e água',
                    'Equipamentos profissionais',
                    'Atendimento especializado'
                ],
                images: [
                    '../../../assets/img g/buffet/chuttersnap-a5Cobl3QB5A-unsplash.jpg',
                    '../../../assets/img g/buffet/engin-akyurt-6dPXcMvniHU-unsplash.jpg',
                    '../../../assets/img g/buffet/dan-burton-5JtuW6PqGKE-unsplash.jpg'
                ]
            },
            'brunch': {
                title: 'Brunch',
                description: 'Mix café da manhã + almoço',
                details: 'Brunch completo combinando o melhor do café da manhã e almoço. Perfeito para eventos matinais e ocasiões especiais.',
                features: [
                    'Pratos quentes e frios',
                    'Frutas frescas da estação',
                    'Pães artesanais',
                    'Ovos preparados de várias formas',
                    'Bebidas variadas'
                ],
                images: [
                    '../../../assets/img g/buffet/engin-akyurt-6dPXcMvniHU-unsplash.jpg',
                    '../../../assets/img g/buffet/dan-burton-5JtuW6PqGKE-unsplash.jpg',
                    '../../../assets/img g/buffet/edwin-petrus-Ri2dPW_kP0k-unsplash.jpg'
                ]
            },
            'almoco-jantar': {
                title: 'Almoço/Jantar',
                description: 'Buffet quente completo',
                details: 'Refeições completas com pratos quentes, saladas, acompanhamentos e sobremesas. Cardápio variado para todos os gostos.',
                features: [
                    'Pratos quentes variados',
                    'Saladas frescas',
                    'Acompanhamentos especiais',
                    'Sobremesas caseiras',
                    'Bebidas inclusas'
                ],
                images: [
                    '../../../assets/img g/buffet/dan-burton-5JtuW6PqGKE-unsplash.jpg',
                    '../../../assets/img g/buffet/edwin-petrus-Ri2dPW_kP0k-unsplash.jpg',
                    '../../../assets/img g/buffet/alexander-fae-uo9TCt61o30-unsplash.jpg'
                ]
            },
            'sobremesas': {
                title: 'Sobremesas & Doces',
                description: 'Finalização doce com mesa temática',
                details: 'Mesa de sobremesas temática com doces variados, bolos, tortas e docinhos. Perfeito para finalizar seu evento com doçura.',
                features: [
                    'Bolos e tortas artesanais',
                    'Docinhos variados',
                    'Mesa temática decorada',
                    'Doces sem açúcar (opcional)',
                    'Decoração especial'
                ],
                images: [
                    '../../../assets/img g/buffet/edwin-petrus-Ri2dPW_kP0k-unsplash.jpg',
                    '../../../assets/img g/buffet/alexander-fae-uo9TCt61o30-unsplash.jpg',
                    '../../../assets/img g/buffet/chuttersnap-a5Cobl3QB5A-unsplash.jpg'
                ]
            },
            'bebidas': {
                title: 'Bebidas & Bar',
                description: 'Bar de drinks e espumantes',
                details: 'Bar completo com drinks especiais, espumantes, vinhos e bebidas não alcoólicas. Bartender profissional para seu evento.',
                features: [
                    'Bar completo montado',
                    'Bartender profissional',
                    'Drinks especiais e clássicos',
                    'Espumantes e vinhos',
                    'Bebidas não alcoólicas'
                ],
                images: [
                    '../../../assets/img g/buffet/alexander-fae-uo9TCt61o30-unsplash.jpg',
                    '../../../assets/img g/buffet/chuttersnap-a5Cobl3QB5A-unsplash.jpg',
                    '../../../assets/img g/buffet/engin-akyurt-6dPXcMvniHU-unsplash.jpg'
                ]
            },
            // Serviços de Audiovisual
            'fotografia': {
                title: 'Fotografia',
                description: 'Cobertura completa do evento',
                details: 'Cobertura fotográfica profissional com equipamentos de última geração. Capturamos os melhores momentos do seu evento com qualidade excepcional.',
                features: [
                    'Fotógrafo profissional experiente',
                    'Equipamentos de última geração',
                    'Cobertura completa do evento',
                    'Entrega rápida das fotos',
                    'Edição profissional incluída'
                ],
                images: [
                    '../../../assets/img g/ad/aarom-ore-iUCMLjQXD4o-unsplash.jpg',
                    '../../../assets/img g/ad/aarom-ore-xixE8fHqUk0-unsplash.jpg',
                    '../../../assets/img g/ad/asso-myron-rCElGEIgbjs-unsplash.jpg'
                ]
            },
            'video': {
                title: 'Vídeo',
                description: 'Filmagem e edição profissional',
                details: 'Filmagem profissional com equipamentos de alta qualidade e edição especializada. Criamos vídeos que contam a história do seu evento.',
                features: [
                    'Filmagem profissional HD/4K',
                    'Equipamentos de alta qualidade',
                    'Edição especializada',
                    'Múltiplas câmeras',
                    'Entrega em diferentes formatos'
                ],
                images: [
                    '../../../assets/img g/ad/aarom-ore-xixE8fHqUk0-unsplash.jpg',
                    '../../../assets/img g/ad/asso-myron-rCElGEIgbjs-unsplash.jpg',
                    '../../../assets/img g/ad/diana-macesanu-3ciHxbx9H0U-unsplash.jpg'
                ]
            },
            'drone': {
                title: 'Drone',
                description: 'Imagens aéreas espetaculares',
                details: 'Filmagem aérea com drone para capturar ângulos únicos e espetaculares do seu evento. Imagens que impressionam e destacam a grandiosidade do momento.',
                features: [
                    'Piloto de drone certificado',
                    'Equipamentos profissionais',
                    'Imagens aéreas espetaculares',
                    'Diferentes ângulos de filmagem',
                    'Edição especializada'
                ],
                images: [
                    '../../../assets/img g/ad/asso-myron-rCElGEIgbjs-unsplash.jpg',
                    '../../../assets/img g/ad/diana-macesanu-3ciHxbx9H0U-unsplash.jpg',
                    '../../../assets/img g/ad/diana-macesanu-fvPfMJL2wKw-unsplash.jpg'
                ]
            },
            'social-media': {
                title: 'Social Media',
                description: 'Conteúdo para redes sociais',
                details: 'Criação de conteúdo específico para redes sociais com linguagem de marca. Stories, posts e conteúdo interativo para engajar sua audiência.',
                features: [
                    'Conteúdo para Instagram/Facebook',
                    'Stories e posts interativos',
                    'Linguagem de marca personalizada',
                    'Entrega rápida do conteúdo',
                    'Estratégia de engajamento'
                ],
                images: [
                    '../../../assets/img g/ad/diana-macesanu-3ciHxbx9H0U-unsplash.jpg',
                    '../../../assets/img g/ad/diana-macesanu-fvPfMJL2wKw-unsplash.jpg',
                    '../../../assets/img g/ad/dose-media-DiTiYQx0mh4-unsplash.jpg'
                ]
            },
            'streaming': {
                title: 'Streaming',
                description: 'Transmissão ao vivo do evento',
                details: 'Transmissão ao vivo profissional do seu evento para plataformas como YouTube, Facebook e Instagram. Alcance uma audiência maior e preserve o momento.',
                features: [
                    'Transmissão ao vivo profissional',
                    'Múltiplas plataformas',
                    'Qualidade HD/4K',
                    'Interação com a audiência',
                    'Gravação para posterior visualização'
                ],
                images: [
                    '../../../assets/img g/ad/diana-macesanu-fvPfMJL2wKw-unsplash.jpg',
                    '../../../assets/img g/ad/dose-media-DiTiYQx0mh4-unsplash.jpg',
                    '../../../assets/img g/ad/marissa-lewis-47bVgRJ3bFI-unsplash.jpg'
                ]
            },
            'edicao': {
                title: 'Edição',
                description: 'Pós-produção e finalização',
                details: 'Serviços de pós-produção profissional com edição especializada, correção de cor, efeitos especiais e finalização em alta qualidade.',
                features: [
                    'Edição profissional especializada',
                    'Correção de cor',
                    'Efeitos especiais',
                    'Finalização em alta qualidade',
                    'Entrega em diferentes formatos'
                ],
                images: [
                    '../../../assets/img g/ad/dose-media-DiTiYQx0mh4-unsplash.jpg',
                    '../../../assets/img g/ad/marissa-lewis-47bVgRJ3bFI-unsplash.jpg',
                    '../../../assets/img g/ad/melyna-valle-dgeFqem7_zE-unsplash.jpg'
                ]
            },
            // Serviços de RH
            'garcons': {
                title: 'Garçons',
                description: 'Atendimento profissional e eficiente',
                details: 'Equipe de garçons treinados e experientes para garantir um atendimento de excelência durante todo o evento.',
                features: [
                    'Garçons profissionais treinados',
                    'Atendimento personalizado',
                    'Conhecimento dos produtos',
                    'Uniforme adequado',
                    'Disponibilidade total'
                ],
                images: [
                    '../../../assets/img g/rh/adem-ay-Tk9m_HP4rgQ-unsplash.jpg',
                    '../../../assets/img g/rh/anima-visual-XChQZf4q5-s-unsplash.jpg',
                    '../../../assets/img g/rh/austin-distel-tLZhFRLj6nY-unsplash.jpg'
                ]
            },
            'recepcao': {
                title: 'Recepção',
                description: 'Boas-vindas e orientação aos convidados',
                details: 'Equipe de recepção para dar as boas-vindas aos convidados, orientar sobre o evento e garantir uma experiência acolhedora.',
                features: [
                    'Recepcionistas treinadas',
                    'Boas-vindas personalizadas',
                    'Orientação sobre o evento',
                    'Controle de acesso',
                    'Atendimento cordial'
                ],
                images: [
                    '../../../assets/img g/rh/anima-visual-XChQZf4q5-s-unsplash.jpg',
                    '../../../assets/img g/rh/austin-distel-tLZhFRLj6nY-unsplash.jpg',
                    '../../../assets/img g/rh/berke-citak-0cpyFsSUiSc-unsplash.jpg'
                ]
            },
            'seguranca': {
                title: 'Segurança',
                description: 'Proteção e controle de acesso',
                details: 'Equipe de segurança especializada para garantir a proteção dos convidados e controle de acesso ao evento.',
                features: [
                    'Seguranças profissionais',
                    'Controle de acesso',
                    'Monitoramento do evento',
                    'Proteção dos convidados',
                    'Protocolos de segurança'
                ],
                images: [
                    '../../../assets/img g/rh/austin-distel-tLZhFRLj6nY-unsplash.jpg',
                    '../../../assets/img g/rh/berke-citak-0cpyFsSUiSc-unsplash.jpg',
                    '../../../assets/img g/rh/collin-8FxJi5wuwKc-unsplash.jpg'
                ]
            },
            'apoio': {
                title: 'Apoio Operacional',
                description: 'Suporte logístico completo',
                details: 'Equipe de apoio para todas as necessidades operacionais do evento, garantindo que tudo funcione perfeitamente.',
                features: [
                    'Suporte logístico completo',
                    'Resolução de problemas',
                    'Apoio aos fornecedores',
                    'Coordenação de atividades',
                    'Disponibilidade total'
                ],
                images: [
                    '../../../assets/img g/rh/berke-citak-0cpyFsSUiSc-unsplash.jpg',
                    '../../../assets/img g/rh/collin-8FxJi5wuwKc-unsplash.jpg',
                    '../../../assets/img g/rh/jessie-mccall-guXX_Wm-wnY-unsplash.jpg'
                ]
            },
            'coordenacao': {
                title: 'Coordenação',
                description: 'Gestão e supervisão da equipe',
                details: 'Coordenação geral da equipe operacional, garantindo que todos os serviços funcionem em harmonia.',
                features: [
                    'Coordenação da equipe',
                    'Supervisão dos serviços',
                    'Comunicação eficiente',
                    'Resolução de conflitos',
                    'Gestão de qualidade'
                ],
                images: [
                    '../../../assets/img g/rh/collin-8FxJi5wuwKc-unsplash.jpg',
                    '../../../assets/img g/rh/jessie-mccall-guXX_Wm-wnY-unsplash.jpg',
                    '../../../assets/img g/rh/krzysztof-hepner-_D6rTxw4HAI-unsplash.jpg'
                ]
            },
            'briefing': {
                title: 'Briefing',
                description: 'Orientação prévia da equipe',
                details: 'Sessão de orientação prévia com toda a equipe para alinhar expectativas e garantir execução perfeita.',
                features: [
                    'Orientação prévia completa',
                    'Alinhamento de expectativas',
                    'Treinamento específico',
                    'Comunicação de diretrizes',
                    'Preparação da equipe'
                ],
                images: [
                    '../../../assets/img g/rh/jessie-mccall-guXX_Wm-wnY-unsplash.jpg',
                    '../../../assets/img g/rh/krzysztof-hepner-_D6rTxw4HAI-unsplash.jpg',
                    '../../../assets/img g/rh/kyle-loftus-_jg3dKZs6sg-unsplash.jpg'
                ]
            },
            // Serviços de Cerimonial
            'planejamento': {
                title: 'Planejamento',
                description: 'Estratégia completa do evento',
                details: 'Desenvolvimento de estratégia completa para o evento, incluindo cronograma, orçamento e definição de objetivos.',
                features: [
                    'Estratégia completa do evento',
                    'Definição de objetivos',
                    'Cronograma detalhado',
                    'Orçamento planejado',
                    'Análise de viabilidade'
                ],
                images: [
                    'source/096c0ca8fab1703669ccb4f77706b912e79287a1.jpg',
                    'source/0b5a5109fcf4c46993ef6b192d5c75c5571e7b4b.jpg',
                    'source/3fbe98da819e3a3071c066c277948f1b998c5a50.jpg'
                ]
            },
            'cronograma': {
                title: 'Cronograma',
                description: 'Timeline detalhada e organizada',
                details: 'Desenvolvimento de cronograma detalhado com todas as etapas do evento, desde o planejamento até a execução.',
                features: [
                    'Timeline detalhada',
                    'Marcos importantes',
                    'Prazos definidos',
                    'Responsabilidades claras',
                    'Acompanhamento contínuo'
                ],
                images: [
                    'source/0b5a5109fcf4c46993ef6b192d5c75c5571e7b4b.jpg',
                    'source/3fbe98da819e3a3071c066c277948f1b998c5a50.jpg',
                    'source/4d021c1c4fe5279e1bfb81317723893c40a07d97.jpg'
                ]
            },
            'fornecedores': {
                title: 'Fornecedores',
                description: 'Rede de parceiros confiáveis',
                details: 'Gestão completa da rede de fornecedores, desde a seleção até a coordenação no dia do evento.',
                features: [
                    'Rede de fornecedores qualificados',
                    'Seleção criteriosa',
                    'Negociação de preços',
                    'Coordenação de entregas',
                    'Acompanhamento de qualidade'
                ],
                images: [
                    'source/3fbe98da819e3a3071c066c277948f1b998c5a50.jpg',
                    'source/4d021c1c4fe5279e1bfb81317723893c40a07d97.jpg',
                    'source/719164bff9d65f0c91aa2ac1cb8fdf5aba9434a1.jpg'
                ]
            },
            'execucao': {
                title: 'Execução',
                description: 'Coordenação no dia do evento',
                details: 'Coordenação completa no dia do evento, garantindo que tudo saia conforme planejado.',
                features: [
                    'Coordenação no dia do evento',
                    'Supervisão de todas as atividades',
                    'Resolução de problemas',
                    'Comunicação com fornecedores',
                    'Garantia de qualidade'
                ],
                images: [
                    'source/4d021c1c4fe5279e1bfb81317723893c40a07d97.jpg',
                    'source/719164bff9d65f0c91aa2ac1cb8fdf5aba9434a1.jpg',
                    'source/98f608e87d101120341bcafb9ce912fa8372aaa7.jpg'
                ]
            },
            'coordenacao': {
                title: 'Coordenação',
                description: 'Gestão completa do evento',
                details: 'Coordenação geral de todos os aspectos do evento, garantindo harmonia entre todos os serviços.',
                features: [
                    'Coordenação geral',
                    'Gestão de equipes',
                    'Comunicação eficiente',
                    'Resolução de conflitos',
                    'Garantia de qualidade'
                ],
                images: [
                    'source/719164bff9d65f0c91aa2ac1cb8fdf5aba9434a1.jpg',
                    'source/98f608e87d101120341bcafb9ce912fa8372aaa7.jpg',
                    'source/096c0ca8fab1703669ccb4f77706b912e79287a1.jpg'
                ]
            },
            'producao': {
                title: 'Produção',
                description: 'Criação e desenvolvimento do evento',
                details: 'Produção completa do evento, desde a concepção criativa até a execução final.',
                features: [
                    'Concepção criativa',
                    'Desenvolvimento do conceito',
                    'Produção de materiais',
                    'Coordenação artística',
                    'Execução final'
                ],
                images: [
                    'source/98f608e87d101120341bcafb9ce912fa8372aaa7.jpg',
                    'source/096c0ca8fab1703669ccb4f77706b912e79287a1.jpg',
                    'source/0b5a5109fcf4c46993ef6b192d5c75c5571e7b4b.jpg'
                ]
            }
        };
        
        const service = serviceData[serviceType];
        if (service) {
            showServicePopup(service);
        } else {
            console.error(`❌ Serviço não encontrado: ${serviceType}`);
        }
    }
    
    // Função para mostrar popup do serviço
    function showServicePopup(service) {
        // Criar popup se não existir
        let popup = document.getElementById('service-detail-popup');
        if (!popup) {
            popup = createServicePopup();
            document.body.appendChild(popup);
        }
        
        // Preencher dados do serviço
        const title = popup.querySelector('#service-detail-title');
        const description = popup.querySelector('#service-detail-description');
        const details = popup.querySelector('#service-detail-details');
        const features = popup.querySelector('#service-detail-features');
        const mainImage = popup.querySelector('#service-detail-main-image');
        const gallery = popup.querySelector('#service-detail-gallery');
        
        if (title) title.textContent = service.title;
        if (description) description.textContent = service.description;
        if (details) details.textContent = service.details;
        
        // Preencher lista de características
        if (features) {
            features.innerHTML = '';
            service.features.forEach(feature => {
                const li = document.createElement('li');
                li.textContent = feature;
                features.appendChild(li);
            });
        }
        
        // Preencher imagens
        if (mainImage && service.images[0]) {
            mainImage.src = service.images[0];
            mainImage.alt = service.title;
        }
        
        if (gallery) {
            gallery.innerHTML = '';
            service.images.forEach((image, index) => {
                const img = document.createElement('img');
                img.src = image;
                img.alt = `${service.title} ${index + 1}`;
                img.addEventListener('click', () => {
                    if (mainImage) {
                        mainImage.src = image;
                    }
                });
                gallery.appendChild(img);
            });
        }
        
        // Mostrar popup
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        console.log(`✅ Popup do serviço ${service.title} aberto`);
    }
    
    // Função para criar popup do serviço
    function createServicePopup() {
        const popup = document.createElement('div');
        popup.id = 'service-detail-popup';
        popup.className = 'service-detail-popup-overlay';
        popup.innerHTML = `
            <div class="service-detail-popup-content">
                <div class="service-detail-popup-header">
                    <h2 id="service-detail-title">Serviço</h2>
                    <button class="service-detail-close-btn">&times;</button>
                </div>
                <div class="service-detail-popup-body">
                    <div class="service-detail-left">
                        <div class="service-detail-description">
                            <h3 id="service-detail-description">Descrição</h3>
                            <p id="service-detail-details">Detalhes do serviço</p>
                        </div>
                        <div class="service-detail-features">
                            <h3>O que está incluso:</h3>
                            <ul id="service-detail-features">
                                <!-- Características serão preenchidas dinamicamente -->
                            </ul>
                        </div>
                        <button class="contact-service-btn">Falar com especialista</button>
                    </div>
                    <div class="service-detail-right">
                        <div class="service-detail-main-image">
                            <img id="service-detail-main-image" src="" alt="Imagem principal" />
                        </div>
                        <div class="service-detail-gallery" id="service-detail-gallery">
                            <!-- Galeria será preenchida dinamicamente -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Event listeners para o popup
        const closeBtn = popup.querySelector('.service-detail-close-btn');
        const contactBtn = popup.querySelector('.contact-service-btn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closeServicePopup);
        }
        
        if (contactBtn) {
            contactBtn.addEventListener('click', function() {
                const whatsappNumber = '55919191722306';
                const message = `Olá! Gostaria de saber mais sobre o serviço de ${popup.querySelector('#service-detail-title').textContent} da Chicas Eventos.`;
                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
            });
        }
        
        // Fechar ao clicar no overlay
        popup.addEventListener('click', function(e) {
            if (e.target === popup) {
                closeServicePopup();
            }
        });
        
        return popup;
    }
    
    // Função para fechar popup do serviço
    function closeServicePopup() {
        const popup = document.getElementById('service-detail-popup');
        if (popup) {
            popup.classList.remove('active');
            document.body.style.overflow = 'auto';
            console.log('❌ Popup do serviço fechado');
        }
    }
    
    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeServicePopup();
        }
    });
    
    console.log('✅ Sistema de Cards de Serviços configurado');
});