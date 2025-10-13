/**
 * Sistema de Pop-up "Adicionar ao Evento"
 * Gerencia a seleção de serviços e cálculo de valores
 */

class AddToEventPopup {
    constructor() {
        this.services = {
            // Serviços Variáveis (por faixa de horas)
            variables: {
                'Fotografia': { 
                    name: 'Fotografia', 
                    description: 'Registro com direção leve e olhar documental',
                    prices: { '2h': 600, '4h': 1000, '6h': 1300, 'custom': 'A combinar' }
                },
                'Social Media': { 
                    name: 'Social Media', 
                    description: 'Conteúdo para redes sociais e marketing',
                    prices: { '2h': 400, '4h': 700, '6h': 950, 'custom': 'A combinar' }
                },
                'Filmagem': { 
                    name: 'Filmagem', 
                    description: 'Vídeos profissionais e cobertura completa',
                    prices: { '2h': 700, '4h': 1300, '6h': 1800, 'custom': 'A combinar' }
                },
                'Cobertura ao Vivo': { 
                    name: 'Cobertura ao Vivo', 
                    description: 'Transmissão em tempo real do evento',
                    prices: { '2h': 700, '4h': 1200, '6h': 1700, 'custom': 'A combinar' }
                },
                'Pacote 360': { 
                    name: 'Pacote 360°', 
                    description: 'Experiência imersiva completa',
                    prices: { '2h': 1000, '4h': 1900, '6h': 2600, 'custom': 'A combinar' }
                },
                'Gravação com Drone': { 
                    name: 'Gravação com Drone', 
                    description: 'Imagens aéreas e perspectivas únicas',
                    prices: { '2h': 700, '4h': 1250, '6h': 1600, 'custom': 'A combinar' }
                },
                'Garçom': { 
                    name: 'Garçom (por pessoa)', 
                    description: 'Atendimento profissional e especializado',
                    prices: { '2h': 70, '4h': 120, '6h': 160, 'custom': 'A combinar' }
                },
                'Apoio de Operação': { 
                    name: 'Apoio de Operação (por pessoa)', 
                    description: 'Suporte técnico e operacional completo',
                    prices: { '2h': 80, '4h': 140, '6h': 200, 'custom': 'A combinar' }
                },
                'Recepção': { 
                    name: 'Recepção (por pessoa)', 
                    description: 'Atendimento e boas-vindas aos convidados',
                    prices: { '2h': 90, '4h': 160, '6h': 220, 'custom': 'A combinar' }
                },
                'Coordenação de Sala': { 
                    name: 'Coordenação de Sala', 
                    description: 'Organização e controle do ambiente',
                    prices: { '2h': 120, '4h': 220, '6h': 320, 'custom': 'A combinar' }
                },
                'Limpeza da Área': { 
                    name: 'Limpeza da Área', 
                    description: 'Manutenção e higienização do espaço',
                    prices: { '2h': 60, '4h': 100, '6h': 140, 'custom': 'A combinar' }
                },
                'Segurança': { 
                    name: 'Segurança (por pessoa)', 
                    description: 'Proteção e controle de acesso',
                    prices: { '2h': 100, '4h': 180, '6h': 250, 'custom': 'A combinar' }
                },
                'RH': { 
                    name: 'RH (Gestão de equipe)', 
                    description: 'Gestão e coordenação de equipe',
                    prices: { '2h': 200, '4h': 350, '6h': 500, 'custom': 'A combinar' }
                }
            },
            // Serviços Fixos (valor fechado)
            fixed: {
                'Cerimonial': { 
                    name: 'Cerimonial', 
                    description: 'Coordenação completa do evento',
                    price: 800
                },
                'Produção': { 
                    name: 'Produção', 
                    description: 'Produção completa do evento',
                    price: 1200
                },
                'Planejamento': { 
                    name: 'Planejamento', 
                    description: 'Estruturação completa do evento',
                    price: 1000
                },
                'Consultoria': { 
                    name: 'Consultoria', 
                    description: 'Orientação especializada e personalizada',
                    price: 900
                },
                'Coordenação do Dia': { 
                    name: 'Coordenação do Dia', 
                    description: 'Execução e supervisão no dia do evento',
                    price: 900
                },
                'Roteiro de Timeline Pós-evento': { 
                    name: 'Roteiro de Timeline Pós-evento', 
                    description: 'Cronograma detalhado e organização temporal',
                    price: 700
                },
                'Gestão de Fornecedores': { 
                    name: 'Gestão de Fornecedores', 
                    description: 'Coordenação e supervisão de todos os fornecedores',
                    price: 800
                }
            }
        };

        this.selectedServices = [];
        this.serviceType = 'rh'; // rh, cerimonial, audiovisual
        this.init();
    }

    init() {
        this.createPopupHTML();
        this.bindEvents();
    }

    createPopupHTML() {
        // Criar overlay do pop-up
        const popupOverlay = document.createElement('div');
        popupOverlay.className = 'add-to-event-overlay';
        popupOverlay.id = 'add-to-event-popup';
        
        popupOverlay.innerHTML = `
            <div class="add-to-event-popup">
                <div class="popup-header">
                    <h2>Adicionar ao evento</h2>
                    <button class="close-popup-btn">&times;</button>
                </div>
                <div class="popup-description">
                    <p>Cardápios sob medida para cada ocasião: coquetéis, coffee break, brunch e refeições completas. Clique nos cartões para ver os detalhes.</p>
                </div>
                <div class="popup-content">
                    <div class="services-section">
                        <div class="services-list" id="services-list">
                            <!-- Lista de serviços será preenchida dinamicamente -->
                        </div>
                    </div>
                    <div class="summary-section">
                        <h3>Resumo da Seleção</h3>
                        <div class="summary-content">
                            <div class="summary-item">
                                <span>Item</span>
                                <span id="total-items">0</span>
                            </div>
                            <div class="summary-total">
                                <!-- <span>Total</span> -->
                                <span id="total-price">R$ 0,00</span>
                            </div>
                        </div>
                        <div class="popup-actions">
                            <button class="btn-cancel">Cancelar</button>
                            <button class="btn-add-to-event">Adicionar ao carrinho</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(popupOverlay);
    }

    bindEvents() {
        // Event delegation para melhor performance
        document.addEventListener('click', (e) => {
            const target = e.target;

            // Abrir pop-up
            if (target.classList.contains('adicionar-evento-btn')) {
                e.preventDefault();
                this.openPopup();
                return;
            }

            // Fechar pop-up
            if (target.classList.contains('close-popup-btn') || target.classList.contains('btn-cancel')) {
                e.preventDefault();
                this.closePopup();
                return;
            }

            // Clicar no overlay
            if (target.classList.contains('add-to-event-overlay')) {
                this.closePopup();
                return;
            }

            // Selecionar serviço
            if (target.classList.contains('service-item') || target.classList.contains('checkbox') || target.classList.contains('service-checkbox')) {
                e.preventDefault();
                const serviceItem = target.closest('.service-item');
                if (serviceItem) {
                    const serviceName = serviceItem.getAttribute('data-service');
                    this.toggleService(serviceName);
                }
                return;
            }


            // Adicionar ao carrinho
            if (target.classList.contains('btn-add-to-event')) {
                e.preventDefault();
                this.addToCart();
                return;
            }
        });

        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.getElementById('add-to-event-popup').classList.contains('active')) {
                this.closePopup();
            }
        });

        // Event listener para mudança de preço
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('price-select')) {
                const serviceName = e.target.getAttribute('data-service');
                const priceKey = e.target.value;
                this.updateServicePrice(serviceName, priceKey);
            }
        });
    }

    openPopup() {
        const popup = document.getElementById('add-to-event-popup');
        if (popup) {
            this.detectServiceType();
            this.renderServices();
            this.updateSummary();
            
            requestAnimationFrame(() => {
                popup.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
    }

    closePopup() {
        const popup = document.getElementById('add-to-event-popup');
        if (popup) {
            requestAnimationFrame(() => {
                popup.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
    }

    detectServiceType() {
        const currentPath = window.location.pathname;
        if (currentPath.includes('rh')) {
            this.serviceType = 'rh';
        } else if (currentPath.includes('cerimonial')) {
            this.serviceType = 'cerimonial';
        } else if (currentPath.includes('ad')) {
            this.serviceType = 'audiovisual';
        }
    }

    renderServices() {
        const servicesList = document.getElementById('services-list');
        if (!servicesList) return;

        let servicesToShow = [];

        // Filtrar serviços baseado no tipo de página
        switch (this.serviceType) {
            case 'rh':
                servicesToShow = [
                    'Garçom', 'Apoio de Operação', 'Recepção', 'Coordenação de Sala', 
                    'Limpeza da Área', 'Segurança', 'RH'
                ];
                break;
            case 'cerimonial':
                servicesToShow = [
                    'Cerimonial', 'Produção', 'Planejamento', 'Consultoria', 
                    'Coordenação do Dia', 'Roteiro de Timeline Pós-evento', 'Gestão de Fornecedores'
                ];
                break;
            case 'audiovisual':
                servicesToShow = [
                    'Fotografia', 'Social Media', 'Filmagem', 'Cobertura ao Vivo', 
                    'Pacote 360', 'Gravação com Drone'
                ];
                break;
        }

        servicesList.innerHTML = '';

        servicesToShow.forEach(serviceName => {
            const service = this.services.variables[serviceName] || this.services.fixed[serviceName];
            if (!service) return;

            const isVariable = this.services.variables[serviceName];
            const isSelected = this.selectedServices.some(s => s.name === serviceName);

            const serviceItem = document.createElement('div');
            serviceItem.className = `service-item ${isSelected ? 'selected' : ''}`;
            serviceItem.setAttribute('data-service', serviceName);

            if (isVariable) {
                // Serviço variável com opções de preço
                const priceOptions = Object.keys(service.prices).map(priceKey => {
                    const price = service.prices[priceKey];
                    const displayPrice = price === 'A combinar' ? 'A combinar' : `R$ ${price.toLocaleString('pt-BR')}`;
                    return `<option value="${priceKey}">${priceKey === 'custom' ? 'Acima de 6h' : priceKey} - ${displayPrice}</option>`;
                }).join('');

                serviceItem.innerHTML = `
                    <div class="service-info">
                        <div class="service-checkbox">
                            <div class="checkbox ${isSelected ? 'checked' : ''}"></div>
                        </div>
                        <div class="service-details">
                            <h4>${service.name}</h4>
                            <p>${service.description}</p>
                            <select class="price-select" data-service="${serviceName}">
                                <option value="">Selecione a duração</option>
                                ${priceOptions}
                            </select>
                        </div>
                    </div>
                `;
            } else {
                // Serviço fixo
                serviceItem.innerHTML = `
                    <div class="service-info">
                        <div class="service-checkbox">
                            <div class="checkbox ${isSelected ? 'checked' : ''}"></div>
                        </div>
                        <div class="service-details">
                            <h4>${service.name}</h4>
                            <p>${service.description}</p>
                            <div class="fixed-price">R$ ${service.price.toLocaleString('pt-BR')}</div>
                        </div>
                    </div>
                `;
            }

            servicesList.appendChild(serviceItem);
        });
    }

    toggleService(serviceName) {
        const serviceItem = document.querySelector(`[data-service="${serviceName}"]`);
        const checkbox = serviceItem.querySelector('.checkbox');
        const isSelected = this.selectedServices.some(s => s.name === serviceName);

        if (isSelected) {
            // Remover serviço
            this.selectedServices = this.selectedServices.filter(s => s.name !== serviceName);
            serviceItem.classList.remove('selected');
            checkbox.classList.remove('checked');
        } else {
            // Adicionar serviço
            const service = this.services.variables[serviceName] || this.services.fixed[serviceName];
            if (service) {
                // Para serviços variáveis, permitir seleção direta de "a combinar"
                if (this.services.variables[serviceName]) {
                    const selectedService = {
                        name: serviceName,
                        price: 0, // Valor será definido quando selecionar duração
                        type: 'variable',
                        priceKey: null // Será definido quando selecionar duração
                    };
                    
                    this.selectedServices.push(selectedService);
                    serviceItem.classList.add('selected');
                    checkbox.classList.add('checked');
                } else {
                    // Serviço fixo
                    const selectedService = {
                        name: serviceName,
                        price: service.price,
                        type: 'fixed',
                        priceKey: null
                    };
                    
                    this.selectedServices.push(selectedService);
                    serviceItem.classList.add('selected');
                    checkbox.classList.add('checked');
                }
            }
        }

        this.updateSummary();
    }

    updateServicePrice(serviceName, priceKey) {
        const serviceIndex = this.selectedServices.findIndex(s => s.name === serviceName);
        if (serviceIndex !== -1) {
            const service = this.services.variables[serviceName];
            if (service) {
                if (priceKey === 'custom') {
                    // Seleção de "a combinar"
                    this.selectedServices[serviceIndex].price = 0;
                    this.selectedServices[serviceIndex].priceKey = 'custom';
                } else if (service.prices[priceKey]) {
                    // Seleção de duração específica
                    this.selectedServices[serviceIndex].price = service.prices[priceKey];
                    this.selectedServices[serviceIndex].priceKey = priceKey;
                }
                this.updateSummary();
            }
        }
    }

    updateSummary() {
        const totalItems = document.getElementById('total-items');
        const totalPrice = document.getElementById('total-price');

        if (totalItems && totalPrice) {
            const itemCount = this.selectedServices.length;

            // Atualizar contador de itens
            totalItems.textContent = itemCount;
            
            // Calcular total com lógica especial
            const totalData = this.calculateTotalDisplay();
            
            // Atualizar estrutura do total
            this.updateTotalDisplay(totalData);
            
            // Atualizar lista de itens selecionados
            this.updateSelectedItemsList();
        }
    }

    calculateTotalDisplay() {
        if (this.selectedServices.length === 0) {
            return { text: 'R$ 0,00', class: '', type: 'total' };
        }

        // Separar serviços por tipo
        const fixedServices = this.selectedServices.filter(service => 
            service.type === 'fixed' || (service.type === 'variable' && service.priceKey && service.priceKey !== 'custom')
        );
        const customServices = this.selectedServices.filter(service => 
            service.priceKey === 'custom'
        );
        const noSelectionServices = this.selectedServices.filter(service => 
            service.type === 'variable' && !service.priceKey
        );

        // Caso 1: Apenas um item personalizado
        if (this.selectedServices.length === 1 && customServices.length === 1) {
            return { text: 'a combinar', class: 'custom-total', type: 'total' };
        }

        // Caso 2: Apenas itens com valores fixos
        if (customServices.length === 0 && noSelectionServices.length === 0 && fixedServices.length > 0) {
            const total = fixedServices.reduce((sum, service) => sum + service.price, 0);
            return { text: `R$ ${total.toLocaleString('pt-BR')}`, class: '', type: 'total' };
        }

        // Caso 3: Itens fixos + pelo menos um personalizado
        if (fixedServices.length > 0 && (customServices.length > 0 || noSelectionServices.length > 0)) {
            const subtotal = fixedServices.reduce((sum, service) => sum + service.price, 0);
            return { text: `R$ ${subtotal.toLocaleString('pt-BR')} + valor personalizado a combinar`, class: 'subtotal-total', type: 'subtotal' };
        }

        // Caso 4: Apenas itens personalizados ou sem seleção
        if (customServices.length > 1 || (customServices.length === 0 && noSelectionServices.length > 0)) {
            return { text: 'a combinar', class: 'custom-total', type: 'total' };
        }

        // Fallback: cálculo normal
        const total = this.selectedServices.reduce((sum, service) => sum + service.price, 0);
        return { text: `R$ ${total.toLocaleString('pt-BR')}`, class: '', type: 'total' };
    }

    updateTotalDisplay(totalData) {
        const totalPrice = document.getElementById('total-price');
        if (!totalPrice) return;

        // Limpar conteúdo anterior
        totalPrice.innerHTML = '';

        // Verificar se há itens personalizados
        const hasCustomItems = this.selectedServices.some(service => 
            service.priceKey === 'custom' || (service.type === 'variable' && !service.priceKey)
        );

        // Layout com Total à esquerda e valor à direita
        const subtotalContainer = document.createElement('div');
        subtotalContainer.className = 'subtotal-container';

        // Linha do Total com valor
        const totalRow = document.createElement('div');
        totalRow.className = 'total-row';

        const totalLabel = document.createElement('div');
        totalLabel.className = 'total-label';
        totalLabel.textContent = 'Total';

        const totalValue = document.createElement('div');
        totalValue.className = `total-value ${totalData.class || ''}`;
        
        // Adicionar quebra de linha se houver "valor personalizado a combinar"
        if (totalData.text.includes('+ valor personalizado a combinar')) {
            const numericPart = totalData.text.split(' + valor personalizado a combinar')[0];
            totalValue.innerHTML = `${numericPart}<br><span class="custom-value">+ valor personalizado a combinar</span>`;
        } else {
            totalValue.textContent = totalData.text;
        }

        totalRow.appendChild(totalLabel);
        totalRow.appendChild(totalValue);

        subtotalContainer.appendChild(totalRow);
        totalPrice.appendChild(subtotalContainer);

        // Adicionar mensagem condicional
        this.addConditionalMessage(hasCustomItems);
    }

    addConditionalMessage(hasCustomItems) {
        // Remover mensagem anterior se existir
        const existingMessage = document.getElementById('conditional-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const summaryContent = document.querySelector('.summary-content');
        if (!summaryContent) return;

        const message = document.createElement('div');
        message.id = 'conditional-message';
        message.className = 'conditional-message';

        if (hasCustomItems) {
            message.innerHTML = `
                <div class="message-text">
                    * O valor final será confirmado após contato com nossa equipe para itens personalizados.
                </div>
            `;
        } else {
            message.innerHTML = `
                <div class="message-text">
                    * Todos os valores estão confirmados e serão enviados para sua análise.
                </div>
            `;
        }

        summaryContent.appendChild(message);
    }

    updateSelectedItemsList() {
        // Encontrar ou criar container para lista de itens
        let itemsList = document.getElementById('selected-items-list');
        if (!itemsList) {
            const summaryContent = document.querySelector('.summary-content');
            if (summaryContent) {
                itemsList = document.createElement('div');
                itemsList.id = 'selected-items-list';
                itemsList.className = 'selected-items-list';
                summaryContent.insertBefore(itemsList, summaryContent.querySelector('.summary-total'));
            }
        }

        if (itemsList) {
            if (this.selectedServices.length === 0) {
                itemsList.innerHTML = '<div class="no-items">Nenhum item selecionado</div>';
            } else {
                itemsList.innerHTML = this.selectedServices.map(service => {
                    const priceKey = service.priceKey ? ` (${service.priceKey === 'custom' ? 'Acima de 6h' : service.priceKey})` : '';
                    const isCustom = service.priceKey === 'custom';
                    const hasNoSelection = service.type === 'variable' && !service.priceKey;
                    
                    return `
                        <div class="selected-item">
                            <span class="item-name">${service.name}${priceKey}</span>
                            <span class="item-price ${isCustom ? 'custom-price' : ''} ${hasNoSelection ? 'no-selection' : ''}">
                                ${hasNoSelection ? 'Selecione duração' : (isCustom ? 'A combinar' : `R$ ${service.price.toLocaleString('pt-BR')}`)}
                            </span>
                        </div>
                    `;
                }).join('');
            }
        }
    }

    addToCart() {
        if (this.selectedServices.length === 0) {
            alert('Por favor, selecione pelo menos um serviço.');
            return;
        }

        // Aqui você pode implementar a lógica para adicionar ao carrinho
        // Por exemplo, salvar no localStorage ou enviar para um servidor
        console.log('Serviços selecionados:', this.selectedServices);
        
        // Simular adição ao carrinho
        const cartData = {
            services: this.selectedServices,
            total: this.selectedServices.reduce((sum, service) => sum + service.price, 0),
            timestamp: new Date().toISOString()
        };

        // Salvar no localStorage (simulação)
        const existingCart = JSON.parse(localStorage.getItem('chicasEventos_cart') || '[]');
        existingCart.push(cartData);
        localStorage.setItem('chicasEventos_cart', JSON.stringify(existingCart));

        // Fechar popup
        this.closePopup();
        this.selectedServices = [];

        // Mostrar feedback de sucesso
        this.showSuccessMessage();
    }

    showSuccessMessage() {
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
                <span>Serviços adicionados com sucesso!</span>
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
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    window.addToEventPopup = new AddToEventPopup();
});
