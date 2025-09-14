// ====== DADOS DOS SERVIÇOS - CHICAS EVENTOS ======

// Configuração central do WhatsApp
const WHATSAPP_CONFIG = {
  phone: "5511999999999", // TODO: Substituir pelo número real
  defaultMessageTemplate: "Olá! Gostaria de saber mais sobre os serviços da Chicas Eventos."
};

// Dados estruturados por serviço
const SERVICES_DATA = {
  buffet: {
    serviceKey: "buffet",
    heroButtonLabel: "Ver Pacotes",
    items: [
      {
        id: "coqueteis",
        title: "Coquetéis",
        images: [
          "../../assets/public/img/buffet/coqueteis1.jpg",
          "../../assets/public/img/buffet/coqueteis2.jpg",
          "../../assets/public/img/buffet/coqueteis3.jpg",
          "../../assets/public/img/buffet/coqueteis1.jpg", // Adicionando mais imagens para thumbnails
          "../../assets/public/img/buffet/coqueteis2.jpg"
        ],
        description: "Preparamos coquetéis clássicos e autorais com frutas frescas, xaropes artesanais e apresentação caprichada. Nosso time monta a estação de drinks no local e ajusta a carta ao perfil do evento — do elegante ao descontraído.",
        offerings: [
          "Mojito",
          "Caipirinha (clássica e frutas)",
          "Cosmopolitan",
          "Aperol Spritz",
          "Gin Tônica (infusões)",
          "Moscow Mule",
          "Piña Colada"
        ],
        priceTable: {
          // TODO: Inserir tabela de preços quando fornecida
          hasTable: false,
          items: []
        }
      },
      {
        id: "coffee-break",
        title: "Coffee Break",
        images: [
          "../../assets/public/img/buffet/Coffeebreak.jpg",
          "../../assets/public/img/buffet/Coffeebreak1.jpg",
          "../../assets/public/img/buffet/brunch1.jpg",
          "../../assets/public/img/buffet/brunch2.jpg"
        ],
        description: "Pausas para café e lanches leves com qualidade premium. Seleção cuidadosa de bebidas quentes, sucos naturais e lanches equilibrados para manter a energia e concentração durante o evento.",
        offerings: [
          "Café expresso e cappuccino",
          "Chás variados e infusões",
          "Sucos naturais e água aromatizada",
          "Pães de queijo e salgados",
          "Bolos e tortas artesanais",
          "Frutas frescas e mix de castanhas",
          "Opções sem lactose e veganas"
        ],
        priceTable: {
          hasTable: false,
          items: []
        }
      },
      {
        id: "brunch",
        title: "Brunch",
        images: [
          "../../assets/public/img/buffet/brunch.jpg",
          "../../assets/public/img/buffet/brunch1.jpg",
          "../../assets/public/img/buffet/brunch2.jpg",
          "../../assets/public/img/buffet/brunch3.jpg",
          "../../assets/public/img/buffet/Coffeebreak1.jpg"
        ],
        description: "Café da manhã e brunch especializados com pratos frescos e saborosos. Opções variadas desde café da manhã continental até brunch completo com pratos quentes e frios, perfeito para eventos matinais.",
        offerings: [
          "Café da manhã continental",
          "Brunch completo",
          "Ovos benedict e omeletes",
          "Pancakes e waffles",
          "Salada de frutas frescas",
          "Pães artesanais e croissants",
          "Sucos naturais e smoothies"
        ],
        priceTable: {
          hasTable: false,
          items: []
        }
      },
      {
        id: "almoco-jantar",
        title: "Almoço/Jantar",
        images: [
          "../../assets/public/img/buffet/buffet.jpg",
          "../../assets/public/img/buffet/buffet1.jpg",
          "../../assets/public/img/buffet/buffet2.jpg",
          "../../assets/public/img/buffet/buffet3.jpg",
          "../../assets/public/img/buffet/buffet4.jpg"
        ],
        description: "Refeições completas e executivas com cardápios sofisticados. Opções de buffet ou serviço à mesa, com pratos elaborados e apresentação impecável para eventos corporativos de alto nível.",
        offerings: [
          "Buffet executivo",
          "Serviço à mesa",
          "Pratos quentes variados",
          "Saladas e acompanhamentos",
          "Carnes e peixes premium",
          "Opções vegetarianas",
          "Menu degustação"
        ],
        priceTable: {
          hasTable: false,
          items: []
        }
      },
      {
        id: "sobremesas",
        title: "Sobremesas & Doces",
        images: [
          "../../assets/public/img/buffet/buffet3.jpg",
          "../../assets/public/img/buffet/brunch3.jpg",
          "../../assets/public/img/buffet/Coffeebreak.jpg"
        ],
        description: "Doces finos e sobremesas artesanais preparados com ingredientes premium. Tortas, bolos, petit fours, brigadeiros gourmet e sobremesas especiais para finalizar seu evento com elegância e sabor.",
        offerings: [
          "Tortas artesanais",
          "Petit fours variados",
          "Brigadeiros gourmet",
          "Bolos decorados",
          "Sobremesas de frutas",
          "Chocolates artesanais",
          "Doces regionais"
        ],
        priceTable: {
          hasTable: false,
          items: []
        }
      },
      {
        id: "bebidas-bar",
        title: "Bebidas & Bar",
        images: [
          "../../assets/public/img/buffet/coqueteis2.jpg",
          "../../assets/public/img/buffet/coqueteis1.jpg",
          "../../assets/public/img/buffet/coqueteis3.jpg"
        ],
        description: "Serviço completo de bar e bebidas com bartender profissional. Água, refrigerantes, cervejas, vinhos e destilados de qualidade, com apresentação elegante e atendimento especializado.",
        offerings: [
          "Bar completo",
          "Águas e refrigerantes",
          "Cervejas premium",
          "Vinhos selecionados",
          "Destilados importados",
          "Bartender profissional",
          "Serviço de mesa"
        ],
        priceTable: {
          hasTable: false,
          items: []
        }
      }
    ],
    packages: [
      {
        id: "ouro",
        title: "Pacote Ouro",
        tierOrService: "Premium",
        description: "Solução completa de buffet premium para eventos corporativos de alto nível.",
        includes: [
          "Buffet completo com 3 pratos quentes",
          "2 pratos frios selecionados",
          "Bar completo com bebidas premium",
          "Sobremesas finas e petit fours",
          "Serviço de garçom dedicado",
          "Decoração básica da mesa"
        ],
        pricing: {
          type: "per_person",
          options: [
            { label: "Até 50 pessoas", price: 0, unit: "pessoa" }, // TODO: Inserir preços reais
            { label: "51-100 pessoas", price: 0, unit: "pessoa" },
            { label: "101-200 pessoas", price: 0, unit: "pessoa" },
            { label: "Mais de 200 pessoas", price: 0, unit: "pessoa" }
          ]
        }
      },
      {
        id: "prata",
        title: "Pacote Prata",
        tierOrService: "Intermediário",
        description: "Buffet equilibrado com qualidade e custo-benefício para eventos corporativos.",
        includes: [
          "Buffet com 2 pratos quentes",
          "1 prato frio",
          "Bar com bebidas padrão",
          "Sobremesas variadas",
          "Serviço de garçom",
          "Utensílios e toalhas"
        ],
        pricing: {
          type: "per_person",
          options: [
            { label: "Até 50 pessoas", price: 0, unit: "pessoa" },
            { label: "51-100 pessoas", price: 0, unit: "pessoa" },
            { label: "101-200 pessoas", price: 0, unit: "pessoa" },
            { label: "Mais de 200 pessoas", price: 0, unit: "pessoa" }
          ]
        }
      },
      {
        id: "bronze",
        title: "Pacote Bronze",
        tierOrService: "Básico",
        description: "Opção econômica sem comprometer a qualidade para eventos menores.",
        includes: [
          "1 prato quente",
          "1 prato frio",
          "Bebidas básicas (água, refrigerante, suco)",
          "Doces simples",
          "Self-service com apoio de garçom",
          "Utensílios básicos"
        ],
        pricing: {
          type: "per_person",
          options: [
            { label: "Até 50 pessoas", price: 0, unit: "pessoa" },
            { label: "51-100 pessoas", price: 0, unit: "pessoa" },
            { label: "101-200 pessoas", price: 0, unit: "pessoa" },
            { label: "Mais de 200 pessoas", price: 0, unit: "pessoa" }
          ]
        }
      }
    ],
    whatsapp: {
      phone: WHATSAPP_CONFIG.phone,
      defaultMessageTemplate: "Olá! Gostaria de saber mais sobre os pacotes de buffet da Chicas Eventos."
    }
  },

  audiovisual: {
    serviceKey: "audiovisual",
    heroButtonLabel: "Ver Pacotes",
    items: [
      {
        id: "fotografia",
        title: "Fotografia",
        images: [
          "../../assets/public/img/aud/fotografo.jpg",
          "../../assets/public/img/aud/fotografo1.jpg",
          "../../assets/public/img/aud/fotografo2.jpg",
          "../../assets/public/img/aud/fotografo3.jpg",
          "../../assets/public/img/aud/fotografo4.jpg",
          "../../assets/public/img/aud/fotografo5.jpg"
        ],
        description: "Cobertura fotográfica profissional com equipe experiente e equipamentos de alta qualidade. Entrega rápida e tratamento de imagens com foco em captar os melhores momentos do seu evento.",
        offerings: [
          "Fotógrafo profissional",
          "Equipamentos de alta qualidade",
          "Cobertura completa do evento",
          "Edição e tratamento de imagens",
          "Entrega em até 48h",
          "Galeria online",
          "Backup das imagens"
        ],
        priceTable: {
          hasTable: false,
          items: []
        }
      },
      {
        id: "filmagem",
        title: "Filmagem",
        images: [
          "../../assets/public/img/aud/cobertura.jpg",
          "../../assets/public/img/aud/cobertura1.jpg",
          "../../assets/public/img/aud/cobertura3.jpg",
          "../../assets/public/img/aud/fotografo2.jpg"
        ],
        description: "Produção de vídeos e filmagem profissional com captação em alta definição. Edição criativa e entrega no formato desejado, criando conteúdo envolvente do seu evento.",
        offerings: [
          "Cinegrafista profissional",
          "Equipamentos HD/4K",
          "Captação completa",
          "Edição e pós-produção",
          "Múltiplos formatos de entrega",
          "Trilha sonora",
          "Making of"
        ],
        priceTable: {
          hasTable: false,
          items: []
        }
      },
      {
        id: "drone",
        title: "Drone",
        images: [
          "../../assets/public/img/aud/fotografo3.jpg",
          "../../assets/public/img/aud/cobertura.jpg",
          "../../assets/public/img/aud/fotografo5.jpg"
        ],
        description: "Imagens aéreas e perspectiva única com equipamento de drone profissional. Captação de ângulos exclusivos do seu evento, criando conteúdo visual impactante e diferenciado.",
        offerings: [
          "Piloto certificado",
          "Drone profissional",
          "Fotos aéreas em alta resolução",
          "Vídeos aéreos",
          "Planos cinematográficos",
          "Edição especializada",
          "Entrega em até 48h"
        ],
        priceTable: {
          hasTable: false,
          items: []
        }
      },
      {
        id: "social-media",
        title: "Social Media",
        images: [
          "../../assets/public/img/aud/cobertura.jpg",
          "../../assets/public/img/aud/fotografo1.jpg",
          "../../assets/public/img/aud/fotografo4.jpg"
        ],
        description: "Conteúdo específico para redes sociais com linguagem de marca e formato otimizado para cada plataforma. Stories, posts e reels que engajam e conectam com sua audiência.",
        offerings: [
          "Conteúdo para Instagram",
          "Stories e reels",
          "Posts para LinkedIn",
          "Conteúdo para Facebook",
          "Edição para redes sociais",
          "Linguagem de marca",
          "Entrega em tempo real"
        ],
        priceTable: {
          hasTable: false,
          items: []
        }
      },
      {
        id: "cobertura-ao-vivo",
        title: "Cobertura ao Vivo",
        images: [
          "../../assets/public/img/aud/fotografo5.jpg",
          "../../assets/public/img/aud/cobertura1.jpg",
          "../../assets/public/img/aud/fotografo2.jpg"
        ],
        description: "Transmissão e cobertura em tempo real com equipamentos profissionais e técnicos especializados. Conecte sua audiência em tempo real, ampliando o alcance do seu evento.",
        offerings: [
          "Transmissão ao vivo",
          "Equipamentos profissionais",
          "Técnicos especializados",
          "Múltiplas plataformas",
          "Qualidade HD",
          "Interação em tempo real",
          "Gravação para reprise"
        ],
        priceTable: {
          hasTable: false,
          items: []
        }
      },
      {
        id: "pacotes-360",
        title: "Pacotes 360º",
        images: [
          "../../assets/public/img/aud/fotografo2.jpg",
          "../../assets/public/img/aud/cobertura3.jpg",
          "../../assets/public/img/aud/fotografo3.jpg"
        ],
        description: "Solução completa de audiovisual combinando fotografia, filmagem, drone e social media em um pacote integrado. Cobertura total do seu evento com máxima qualidade e eficiência.",
        offerings: [
          "Fotografia + Filmagem",
          "Cobertura com drone",
          "Conteúdo para redes sociais",
          "Transmissão ao vivo",
          "Edição completa",
          "Entrega unificada",
          "Desconto especial no pacote"
        ],
        priceTable: {
          hasTable: false,
          items: []
        }
      }
    ],
    packages: [
      {
        id: "fotografia-2h",
        title: "Fotografia 2h",
        tierOrService: "Básico",
        description: "Cobertura fotográfica básica para eventos de curta duração.",
        includes: [
          "1 fotógrafo profissional",
          "Equipamentos de alta qualidade",
          "Até 200 fotos tratadas",
          "Entrega em até 48h",
          "Galeria online"
        ],
        pricing: {
          type: "fixed",
          options: [
            { label: "Fotografia 2h", price: 0, unit: "evento" }
          ]
        }
      },
      {
        id: "fotografia-3h",
        title: "Fotografia 3h",
        tierOrService: "Intermediário",
        description: "Cobertura fotográfica intermediária com mais tempo de captação.",
        includes: [
          "1 fotógrafo profissional",
          "Equipamentos de alta qualidade",
          "Até 300 fotos tratadas",
          "Entrega em até 48h",
          "Galeria online",
          "Backup das imagens"
        ],
        pricing: {
          type: "fixed",
          options: [
            { label: "Fotografia 3h", price: 0, unit: "evento" }
          ]
        }
      },
      {
        id: "fotografia-8h",
        title: "Fotografia 8h",
        tierOrService: "Completo",
        description: "Cobertura fotográfica completa para eventos de longa duração.",
        includes: [
          "1 fotógrafo profissional",
          "Equipamentos de alta qualidade",
          "Até 500 fotos tratadas",
          "Entrega em até 48h",
          "Galeria online",
          "Backup das imagens",
          "Livro digital"
        ],
        pricing: {
          type: "fixed",
          options: [
            { label: "Fotografia 8h", price: 0, unit: "evento" }
          ]
        }
      },
      {
        id: "filmagem-2h",
        title: "Filmagem 2h",
        tierOrService: "Básico",
        description: "Filmagem básica para eventos de curta duração.",
        includes: [
          "1 cinegrafista",
          "Equipamentos HD",
          "Vídeo editado de até 5min",
          "Entrega em até 72h",
          "Múltiplos formatos"
        ],
        pricing: {
          type: "fixed",
          options: [
            { label: "Filmagem 2h", price: 0, unit: "evento" }
          ]
        }
      },
      {
        id: "filmagem-4h",
        title: "Filmagem 4h",
        tierOrService: "Intermediário",
        description: "Filmagem intermediária com mais tempo de captação.",
        includes: [
          "1 cinegrafista",
          "Equipamentos HD",
          "Vídeo editado de até 10min",
          "Entrega em até 72h",
          "Múltiplos formatos",
          "Trilha sonora"
        ],
        pricing: {
          type: "fixed",
          options: [
            { label: "Filmagem 4h", price: 0, unit: "evento" }
          ]
        }
      },
      {
        id: "filmagem-8h",
        title: "Filmagem 8h",
        tierOrService: "Completo",
        description: "Filmagem completa para eventos de longa duração.",
        includes: [
          "1 cinegrafista",
          "Equipamentos HD",
          "Vídeo editado de até 15min",
          "Entrega em até 72h",
          "Múltiplos formatos",
          "Trilha sonora",
          "Making of"
        ],
        pricing: {
          type: "fixed",
          options: [
            { label: "Filmagem 8h", price: 0, unit: "evento" }
          ]
        }
      },
      {
        id: "drone-1h",
        title: "Drone 1h",
        tierOrService: "Básico",
        description: "Captação aérea básica com drone profissional.",
        includes: [
          "Piloto certificado",
          "Drone profissional",
          "Até 20 fotos aéreas",
          "Vídeo de até 2min",
          "Entrega em até 48h"
        ],
        pricing: {
          type: "fixed",
          options: [
            { label: "Drone 1h", price: 0, unit: "evento" }
          ]
        }
      },
      {
        id: "drone-2h",
        title: "Drone 2h",
        tierOrService: "Completo",
        description: "Captação aérea completa com drone profissional.",
        includes: [
          "Piloto certificado",
          "Drone profissional",
          "Até 40 fotos aéreas",
          "Vídeo de até 5min",
          "Entrega em até 48h",
          "Edição avançada"
        ],
        pricing: {
          type: "fixed",
          options: [
            { label: "Drone 2h", price: 0, unit: "evento" }
          ]
        }
      }
    ],
    whatsapp: {
      phone: WHATSAPP_CONFIG.phone,
      defaultMessageTemplate: "Olá! Gostaria de saber mais sobre os serviços de audiovisual da Chicas Eventos."
    }
  },

  rh: {
    serviceKey: "rh",
    heroButtonLabel: "Ver Pacotes",
    items: [
      {
        id: "garcom-bar",
        title: "Garçom/Barman",
        images: [
          "../../assets/public/img/rh/operacional1.jpg",
          "../../assets/public/img/buffet/coqueteis1.jpg",
          "../../assets/public/img/rh/operacional2.jpg"
        ],
        description: "Serviço profissional de garçom e barman com equipe treinada e uniformizada para atender seu evento com excelência. Atendimento discreto e eficiente que eleva a experiência dos seus convidados.",
        offerings: [
          "Garçom profissional",
          "Barman especializado",
          "Atendimento discreto",
          "Uniforme elegante",
          "Serviço de mesa",
          "Conhecimento de vinhos",
          "Técnicas de coquetelaria"
        ],
        priceTable: {
          hasTable: false,
          items: []
        }
      },
      {
        id: "recepcao",
        title: "Recepção",
        images: [
          "../../assets/public/img/rh/operacional2.jpg",
          "../../assets/public/img/rh/operacional3.jpg",
          "../../assets/public/img/org/ale.jpg"
        ],
        description: "Atendimento e recepção de convidados com profissionais experientes em hospitalidade corporativa. Primeira impressão perfeita que marca o tom do seu evento.",
        offerings: [
          "Recepcionista profissional",
          "Atendimento personalizado",
          "Controle de acesso",
          "Informações do evento",
          "Direcionamento de convidados",
          "Protocolo de recepção",
          "Atendimento bilíngue"
        ],
        priceTable: {
          hasTable: false,
          items: []
        }
      },
      {
        id: "seguranca",
        title: "Segurança",
        images: [
          "../../assets/public/img/rh/operacional3.jpg",
          "../../assets/public/img/rh/operacional4.jpg",
          "../../assets/public/img/rh/operacional.jpg"
        ],
        description: "Controle de acesso e segurança com profissionais treinados para garantir a tranquilidade do seu evento. Presença discreta mas eficaz que protege seus convidados e patrimônio.",
        offerings: [
          "Segurança patrimonial",
          "Controle de acesso",
          "Vigilância discreta",
          "Proteção de convidados VIP",
          "Prevenção de incidentes",
          "Profissionais licenciados",
          "Plano de emergência"
        ],
        priceTable: {
          hasTable: false,
          items: []
        }
      },
      {
        id: "apoio-operacao",
        title: "Apoio de Operação",
        images: [
          "../../assets/public/img/rh/operacional4.jpg",
          "../../assets/public/img/rh/operacional1.jpg",
          "../../assets/public/img/buffet/buffet2.jpg"
        ],
        description: "Suporte operacional completo para todas as necessidades do seu evento com equipe versátil e eficiente. Garantimos que tudo funcione perfeitamente, permitindo que você se concentre no que realmente importa.",
        offerings: [
          "Suporte logístico",
          "Montagem e desmontagem",
          "Apoio técnico",
          "Controle de cronograma",
          "Solução de problemas",
          "Equipe versátil",
          "Supervisão contínua"
        ],
        priceTable: {
          hasTable: false,
          items: []
        }
      },
      {
        id: "coordenacao-sala",
        title: "Coordenação",
        images: [
          "../../assets/public/img/rh/operacional.jpg",
          "../../assets/public/img/rh/operacional2.jpg",
          "../../assets/public/img/aud/fotografo2.jpg"
        ],
        description: "Gestão e coordenação de espaços com profissionais especializados em organização de eventos. Orquestração perfeita de todos os elementos para um evento impecável.",
        offerings: [
          "Coordenação geral",
          "Gestão de espaços",
          "Controle de timing",
          "Sincronização de equipes",
          "Resolução de conflitos",
          "Comunicação unificada",
          "Relatórios de progresso"
        ],
        priceTable: {
          hasTable: false,
          items: []
        }
      },
      {
        id: "limpeza-area",
        title: "Limpeza diária",
        images: [
          "../../assets/public/img/buffet/buffet2.jpg",
          "../../assets/public/img/rh/operacional3.jpg",
          "../../assets/public/img/rh/operacional4.jpg"
        ],
        description: "Manutenção e limpeza dos espaços durante e após o evento para garantir um ambiente sempre impecável. Serviço discreto que mantém a elegância do seu evento do início ao fim.",
        offerings: [
          "Limpeza contínua",
          "Manutenção de banheiros",
          "Limpeza de mesas",
          "Controle de lixo",
          "Limpeza pós-evento",
          "Produtos de qualidade",
          "Equipe uniformizada"
        ],
        priceTable: {
          hasTable: false,
          items: []
        }
      }
    ],
    packages: [
      {
        id: "basico",
        title: "Pacote Básico",
        tierOrService: "Essencial",
        description: "Equipe essencial para eventos menores com suporte básico.",
        includes: [
          "1 garçom para até 50 pessoas",
          "Recepção básica",
          "Limpeza de área",
          "Uniforme padrão",
          "Briefing pré-evento"
        ],
        pricing: {
          type: "per_person",
          options: [
            { label: "Até 50 pessoas", price: 0, unit: "pessoa" },
            { label: "51-100 pessoas", price: 0, unit: "pessoa" },
            { label: "101-200 pessoas", price: 0, unit: "pessoa" }
          ]
        }
      },
      {
        id: "completo",
        title: "Pacote Completo",
        tierOrService: "Intermediário",
        description: "Equipe completa para eventos médios com suporte integral.",
        includes: [
          "2 garçons para até 100 pessoas",
          "Recepção especializada",
          "Coordenação de sala",
          "Limpeza de área",
          "Uniforme premium",
          "Briefing detalhado",
          "Supervisor de equipe"
        ],
        pricing: {
          type: "per_person",
          options: [
            { label: "Até 50 pessoas", price: 0, unit: "pessoa" },
            { label: "51-100 pessoas", price: 0, unit: "pessoa" },
            { label: "101-200 pessoas", price: 0, unit: "pessoa" },
            { label: "Mais de 200 pessoas", price: 0, unit: "pessoa" }
          ]
        }
      },
      {
        id: "premium",
        title: "Pacote Premium",
        tierOrService: "Premium",
        description: "Equipe premium para eventos de alto nível com suporte total.",
        includes: [
          "3+ garçons conforme necessidade",
          "Recepção VIP",
          "Segurança dedicada",
          "Coordenação de sala",
          "Apoio operacional completo",
          "Limpeza especializada",
          "Uniforme executivo",
          "Briefing completo",
          "Supervisor sênior",
          "Relatório pós-evento"
        ],
        pricing: {
          type: "per_person",
          options: [
            { label: "Até 50 pessoas", price: 0, unit: "pessoa" },
            { label: "51-100 pessoas", price: 0, unit: "pessoa" },
            { label: "101-200 pessoas", price: 0, unit: "pessoa" },
            { label: "Mais de 200 pessoas", price: 0, unit: "pessoa" }
          ]
        }
      }
    ],
    whatsapp: {
      phone: WHATSAPP_CONFIG.phone,
      defaultMessageTemplate: "Olá! Gostaria de saber mais sobre os serviços de equipe operacional (RH) da Chicas Eventos."
    }
  },

  cerimonial: {
    serviceKey: "cerimonial",
    heroButtonLabel: "Ver Pacotes",
    items: [
      {
        id: "planejamento",
        title: "Planejamento",
        images: [
          "../../assets/public/img/org/ale.jpg",
          "../../assets/public/img/buffet/brunch1.jpg",
          "../../assets/public/img/aud/fotografo2.jpg"
        ],
        description: "Estratégia completa para seu evento com planejamento detalhado, cronograma e definição de todos os aspectos organizacionais. Transformamos sua visão em realidade com precisão e criatividade.",
        offerings: [
          "Planejamento estratégico",
          "Cronograma detalhado",
          "Definição de objetivos",
          "Estruturação do evento",
          "Planejamento de contingências",
          "Consultoria especializada",
          "Acompanhamento completo"
        ],
        priceTable: {
          hasTable: false,
          items: []
        }
      },
      {
        id: "coordenacao-dia",
        title: "Coordenação no dia",
        images: [
          "../../assets/public/img/aud/fotografo2.jpg",
          "../../assets/public/img/rh/operacional.jpg",
          "../../assets/public/img/aud/fotografo5.jpg"
        ],
        description: "Execução perfeita no dia do evento com coordenação total de todas as atividades e fornecedores. Estamos ao seu lado garantindo que tudo aconteça conforme planejado.",
        offerings: [
          "Coordenação executiva",
          "Gestão de fornecedores",
          "Controle de timing",
          "Resolução de problemas",
          "Comunicação unificada",
          "Supervisão contínua",
          "Suporte total"
        ],
        priceTable: {
          hasTable: false,
          items: []
        }
      },
      {
        id: "gestao-fornecedores",
        title: "Gestão de fornecedores",
        images: [
          "../../assets/public/img/aud/fotografo5.jpg",
          "../../assets/public/img/buffet/buffet1.jpg",
          "../../assets/public/img/rh/operacional2.jpg"
        ],
        description: "Coordenação de todos os fornecedores com negociação, contratação e acompanhamento da execução. Rede confiável que entrega qualidade e pontualidade para o sucesso do seu evento.",
        offerings: [
          "Seleção de fornecedores",
          "Negociação de preços",
          "Contratação e contratos",
          "Acompanhamento de qualidade",
          "Coordenação de entregas",
          "Gestão de prazos",
          "Rede de parceiros confiáveis"
        ],
        priceTable: {
          hasTable: false,
          items: []
        }
      },
      {
        id: "consultoria",
        title: "Consultoria",
        images: [
          "../../assets/public/img/buffet/brunch1.jpg",
          "../../assets/public/img/org/ale.jpg",
          "../../assets/public/img/aud/fotografo3.jpg"
        ],
        description: "Orientação especializada em eventos com consultoria personalizada para otimizar seu investimento e resultados. Expertise acumulada em anos de experiência para maximizar o sucesso do seu evento.",
        offerings: [
          "Consultoria estratégica",
          "Análise de viabilidade",
          "Otimização de orçamento",
          "Planejamento de contingências",
          "Análise de riscos",
          "Recomendações especializadas",
          "Acompanhamento personalizado"
        ],
        priceTable: {
          hasTable: false,
          items: []
        }
      },
      {
        id: "roteiro-timeline",
        title: "Roteiro/Timeline",
        images: [
          "../../assets/public/img/aud/fotografo3.jpg",
          "../../assets/public/img/rh/operacional3.jpg",
          "../../assets/public/img/buffet/buffet3.jpg"
        ],
        description: "Cronograma detalhado do evento com roteiro completo, timing de atividades e responsabilidades definidas. Precisão e organização que garantem a fluidez perfeita do seu evento.",
        offerings: [
          "Cronograma detalhado",
          "Roteiro executivo",
          "Timing de atividades",
          "Responsabilidades definidas",
          "Marcos importantes",
          "Contingências planejadas",
          "Acompanhamento em tempo real"
        ],
        priceTable: {
          hasTable: false,
          items: []
        }
      },
      {
        id: "pos-evento",
        title: "Pós-evento",
        images: [
          "../../assets/public/img/buffet/buffet3.jpg",
          "../../assets/public/img/aud/fotografo1.jpg",
          "../../assets/public/img/rh/operacional4.jpg"
        ],
        description: "Acompanhamento e follow-up após o evento com relatórios, feedback e sugestões para próximos eventos. Fechamento completo que garante aprendizado e melhoria contínua.",
        offerings: [
          "Relatório pós-evento",
          "Análise de resultados",
          "Feedback dos participantes",
          "Sugestões de melhoria",
          "Follow-up com clientes",
          "Documentação completa",
          "Preparação para próximos eventos"
        ],
        priceTable: {
          hasTable: false,
          items: []
        }
      }
    ],
    packages: [
      {
        id: "basico",
        title: "Pacote Básico",
        tierOrService: "Essencial",
        description: "Planejamento básico para eventos menores com suporte essencial.",
        includes: [
          "Consultoria inicial (2h)",
          "Cronograma básico",
          "Lista de fornecedores recomendados",
          "Apoio no dia do evento (4h)",
          "Relatório pós-evento"
        ],
        pricing: {
          type: "fixed",
          options: [
            { label: "Pacote Básico", price: 0, unit: "evento" }
          ]
        }
      },
      {
        id: "completo",
        title: "Pacote Completo",
        tierOrService: "Intermediário",
        description: "Planejamento completo para eventos médios com coordenação integral.",
        includes: [
          "Consultoria completa (4h)",
          "Planejamento detalhado",
          "Cronograma executivo",
          "Gestão de fornecedores",
          "Coordenação no dia do evento (8h)",
          "Supervisor dedicado",
          "Relatório detalhado pós-evento",
          "Follow-up de 30 dias"
        ],
        pricing: {
          type: "fixed",
          options: [
            { label: "Pacote Completo", price: 0, unit: "evento" }
          ]
        }
      },
      {
        id: "premium",
        title: "Pacote Premium",
        tierOrService: "Premium",
        description: "Planejamento premium para eventos de alto nível com coordenação total.",
        includes: [
          "Consultoria premium (8h)",
          "Planejamento estratégico completo",
          "Cronograma detalhado com contingências",
          "Gestão total de fornecedores",
          "Coordenação completa no dia do evento",
          "Supervisor sênior dedicado",
          "Equipe de coordenação",
          "Relatório executivo pós-evento",
          "Follow-up de 90 dias",
          "Consultoria para próximos eventos"
        ],
        pricing: {
          type: "fixed",
          options: [
            { label: "Pacote Premium", price: 0, unit: "evento" }
          ]
        }
      }
    ],
    whatsapp: {
      phone: WHATSAPP_CONFIG.phone,
      defaultMessageTemplate: "Olá! Gostaria de saber mais sobre os serviços de cerimonial e produção da Chicas Eventos."
    }
  }
};

// Função para obter dados de um serviço específico
function getServiceData(serviceKey) {
  return SERVICES_DATA[serviceKey] || null;
}

// Função para obter todos os dados dos serviços
function getAllServicesData() {
  return SERVICES_DATA;
}

// Função para gerar link do WhatsApp
function generateWhatsAppLink(serviceKey, packageId = null, itemId = null, quantity = null) {
  const serviceData = getServiceData(serviceKey);
  if (!serviceData) return null;

  const phone = serviceData.whatsapp.phone;
  let message = serviceData.whatsapp.defaultMessageTemplate;

  // Personalizar mensagem baseada no contexto
  if (packageId) {
    const packageData = serviceData.packages.find(pkg => pkg.id === packageId);
    if (packageData) {
      message = `Olá! Gostaria de saber mais sobre o ${packageData.title} para ${serviceData.serviceKey}.`;
    }
  } else if (itemId) {
    const itemData = serviceData.items.find(item => item.id === itemId);
    if (itemData) {
      message = `Olá! Gostaria de saber mais sobre ${itemData.title} para ${serviceData.serviceKey}.`;
    }
  }

  // Adicionar informações adicionais se disponíveis
  if (quantity) {
    message += ` Quantidade: ${quantity}.`;
  }

  // Adicionar URL da página atual
  message += ` Página: ${window.location.href}`;

  // Codificar mensagem para URL
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}

// Exportar para uso global
window.SERVICES_DATA = SERVICES_DATA;
window.getServiceData = getServiceData;
window.getAllServicesData = getAllServicesData;
window.generateWhatsAppLink = generateWhatsAppLink;
