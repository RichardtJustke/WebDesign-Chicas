// JavaScript Global - Chicas Eventos
// Funcionalidades compartilhadas entre todas as páginas

// Configuração inicial
document.addEventListener('DOMContentLoaded', function() {
    console.log('Chicas Eventos - Sistema carregado com sucesso!');
    
    // Inicializar funcionalidades globais
    initGlobalFeatures();
    initMobileMenu();
    initScrollEffects();
    initModals();
    initTooltips();
    initNotifications();
    loadUserPreferences();
});

// Inicializar funcionalidades globais
function initGlobalFeatures() {
    // Smooth scrolling para links internos
    initSmoothScrolling();
    
    // Botão de scroll para o topo
    initScrollToTop();
    
    // Lazy loading para imagens
    initLazyLoading();
    
    // Animações de entrada
    initScrollAnimations();
    
    // Formulários
    initFormValidation();
    
    // Botões de login
    initLoginButtons();
    
    // Verificar páginas protegidas
    checkProtectedPages();
}

// Inicializar botões de login
function initLoginButtons() {
    // Detectar todos os tipos de botões de login
    const loginButtons = document.querySelectorAll('.btn-login, .log-in');
    
    loginButtons.forEach(button => {
        // Adicionar cursor pointer se não tiver
        if (!button.style.cursor) {
            button.style.cursor = 'pointer';
        }
        
        // Adicionar evento de clique
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Verificar se já estamos na página de login
            const currentPath = window.location.pathname;
            const loginPath = '/pages/login/login.html';
            
            // Se não estivermos na página de login, redirecionar
            if (!currentPath.includes('login.html')) {
                // Determinar o caminho relativo correto baseado na página atual
                let relativePath = '../login/login.html';
                
                // Ajustar caminho baseado na profundidade da página atual
                if (currentPath.includes('/pages/')) {
                    // Se estamos em uma subpágina dentro de pages/
                    const pathDepth = currentPath.split('/').length - 3; // -3 para pages/, pasta da página, e arquivo
                    relativePath = '../'.repeat(pathDepth) + 'login/login.html';
                } else if (currentPath.includes('/index/')) {
                    // Se estamos na página index
                    relativePath = '../login/login.html';
                } else {
                    // Para outras páginas na raiz
                    relativePath = 'pages/login/login.html';
                }
                
                // Redirecionar para a página de login
                window.location.href = relativePath;
            }
        });
        
        // Adicionar efeito hover visual
        button.addEventListener('mouseenter', function() {
            this.style.opacity = '0.8';
            this.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        });
    });
}

// Menu mobile responsivo
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const menu = document.querySelector('.menu');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    // Toggle do menu mobile (navegação principal)
    if (mobileToggle && menu) {
        mobileToggle.addEventListener('click', function() {
            menu.classList.toggle('mobile-active');
            this.classList.toggle('active');
        });
    }
    
    // Toggle da sidebar (dashboard)
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
            if (overlay) {
                overlay.classList.toggle('active');
            }
        });
    }
    
    // Fechar sidebar ao clicar no overlay
    if (overlay) {
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('open');
            this.classList.remove('active');
        });
    }
    
    // Fechar menu ao redimensionar a tela
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            if (menu) menu.classList.remove('mobile-active');
            if (mobileToggle) mobileToggle.classList.remove('active');
            if (sidebar) sidebar.classList.remove('open');
            if (overlay) overlay.classList.remove('active');
        }
    });
}

// Scroll suave para links internos
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignorar links vazios ou apenas com #
            if (href === '#' || href === '') {
                e.preventDefault();
                return;
            }
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.nav')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Botão de scroll para o topo
function initScrollToTop() {
    // Criar botão se não existir
    let scrollBtn = document.querySelector('.scroll-to-top');
    
    if (!scrollBtn) {
        scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '<i class="icon-arrow-up">↑</i>';
        scrollBtn.setAttribute('aria-label', 'Voltar ao topo');
        
        // Estilos inline para garantir funcionamento
        scrollBtn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--primary-color, #b95929);
            color: white;
            border: none;
            font-size: 18px;
            cursor: pointer;
            display: none;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(scrollBtn);
    }
    
    // Mostrar/esconder botão baseado no scroll
    function toggleScrollButton() {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'flex';
            scrollBtn.style.alignItems = 'center';
            scrollBtn.style.justifyContent = 'center';
        } else {
            scrollBtn.style.display = 'none';
        }
    }
    
    // Event listeners
    window.addEventListener('scroll', debounce(toggleScrollButton, 100));
    
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    scrollBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
    });
    
    scrollBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    });
}

// Lazy loading para imagens
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback para navegadores sem suporte
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// Animações de scroll
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .slide-in-up');
    
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(el => {
            animationObserver.observe(el);
        });
    }
}

// Efeitos de scroll
function initScrollEffects() {
    const nav = document.querySelector('.nav');
    
    if (nav) {
        window.addEventListener('scroll', debounce(() => {
            if (window.scrollY > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }, 10));
    }
}

// Sistema de modais
function initModals() {
    // Abrir modais
    document.addEventListener('click', function(e) {
        const modalTrigger = e.target.closest('[data-modal]');
        if (modalTrigger) {
            e.preventDefault();
            const modalId = modalTrigger.dataset.modal;
            openModal(modalId);
        }
    });
    
    // Fechar modais
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal') || e.target.classList.contains('modal-close')) {
            closeModal();
        }
    });
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Abrir modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focar no primeiro elemento focável
        const focusableElement = modal.querySelector('input, button, textarea, select');
        if (focusableElement) {
            setTimeout(() => focusableElement.focus(), 100);
        }
    }
}

// Fechar modal
function closeModal() {
    const activeModal = document.querySelector('.modal.active');
    if (activeModal) {
        activeModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Sistema de tooltips
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
        element.addEventListener('focus', showTooltip);
        element.addEventListener('blur', hideTooltip);
    });
}

function showTooltip(e) {
    const element = e.target;
    const tooltipText = element.dataset.tooltip;
    
    if (!tooltipText) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipText;
    tooltip.style.cssText = `
        position: absolute;
        background: #333;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 10000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(tooltip);
    
    // Posicionar tooltip
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    tooltip.style.left = rect.left + (rect.width - tooltipRect.width) / 2 + 'px';
    tooltip.style.top = rect.top - tooltipRect.height - 8 + 'px';
    
    // Mostrar tooltip
    setTimeout(() => tooltip.style.opacity = '1', 10);
    
    element._tooltip = tooltip;
}

function hideTooltip(e) {
    const element = e.target;
    if (element._tooltip) {
        element._tooltip.remove();
        delete element._tooltip;
    }
}

// Sistema de notificações
function initNotifications() {
    // Criar container de notificações se não existir
    if (!document.querySelector('.notifications-container')) {
        const container = document.createElement('div');
        container.className = 'notifications-container';
        container.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(container);
    }
}

// Mostrar notificação
function showNotification(message, type = 'info', duration = 5000) {
    const container = document.querySelector('.notifications-container');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const colors = {
        success: '#059669',
        error: '#dc2626',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    notification.style.cssText = `
        background: ${colors[type] || colors.info};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        max-width: 350px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        cursor: pointer;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span>${message}</span>
            <button style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; padding: 0; margin-left: auto;">&times;</button>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remover automaticamente
    const autoRemove = setTimeout(() => {
        removeNotification(notification);
    }, duration);
    
    // Remover ao clicar
    notification.addEventListener('click', () => {
        clearTimeout(autoRemove);
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => notification.remove(), 300);
}

// Validação de formulários
function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
        
        // Validação em tempo real
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const isValid = validateForm(form);
    
    if (isValid) {
        // Aqui você pode adicionar a lógica de envio do formulário
        showNotification('Formulário enviado com sucesso!', 'success');
    } else {
        showNotification('Por favor, corrija os erros no formulário.', 'error');
    }
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldGroup = field.closest('.form-group');
    let isValid = true;
    let errorMessage = '';
    
    // Validação de campo obrigatório
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Este campo é obrigatório.';
    }
    
    // Validação de email
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Digite um email válido.';
        }
    }
    
    // Validação de telefone
    if (field.type === 'tel' && value) {
        const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Digite um telefone válido: (XX) XXXXX-XXXX';
        }
    }
    
    // Validação de senha
    if (field.type === 'password' && value) {
        if (value.length < 6) {
            isValid = false;
            errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
        }
    }
    
    // Mostrar/esconder erro
    if (fieldGroup) {
        if (isValid) {
            fieldGroup.classList.remove('error');
            fieldGroup.classList.add('success');
        } else {
            fieldGroup.classList.remove('success');
            fieldGroup.classList.add('error');
            showFieldError(fieldGroup, errorMessage);
        }
    }
    
    return isValid;
}

function showFieldError(fieldGroup, message) {
    let errorElement = fieldGroup.querySelector('.error-message');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.cssText = `
            color: #dc2626;
            font-size: 12px;
            margin-top: 5px;
        `;
        fieldGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

function clearFieldError(field) {
    const fieldGroup = field.closest('.form-group');
    if (fieldGroup) {
        fieldGroup.classList.remove('error');
        const errorElement = fieldGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
}

// Carregar preferências do usuário
function loadUserPreferences() {
    // Tema
    const savedTheme = localStorage.getItem('chicasEventos_theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    // Idioma
    const savedLanguage = localStorage.getItem('chicasEventos_language');
    if (savedLanguage) {
        document.documentElement.setAttribute('lang', savedLanguage);
    }
}

// Salvar preferências do usuário
function saveUserPreference(key, value) {
    localStorage.setItem(`chicasEventos_${key}`, value);
}

// Utilitários
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Formatação de dados
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}

function formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
}

// API helpers
async function apiRequest(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    const config = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        showNotification('Erro na comunicação com o servidor.', 'error');
        throw error;
    }
}

// Verificar páginas protegidas
function checkProtectedPages() {
    // Aguardar um pouco para garantir que o sistema de auth foi carregado
    setTimeout(() => {
        if (window.authSystem) {
            window.authSystem.protectRoutes();
        }
    }, 100);
}

// Exportar funções para uso global
window.ChicasEventos = {
    showNotification,
    openModal,
    closeModal,
    formatCurrency,
    formatDate,
    formatPhone,
    apiRequest,
    saveUserPreference,
    debounce,
    throttle,
    checkProtectedPages
};

// Service Worker para cache (se disponível)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
