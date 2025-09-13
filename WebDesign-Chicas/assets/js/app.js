const ENDPOINT = 'COLE_AQUI_A_URL_DO_SEU_WEBAPP_GAS';

// ====== SISTEMA DE ANIMAÇÕES INTERATIVAS ======

class AnimationController {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupHoverEffects();
    this.setupParallaxEffects();
    this.setupTextAnimations();
    this.setupImageAnimations();
    this.setupButtonAnimations();
    this.setupMenuAnimations();
    this.setupLoadingAnimations();
    this.setupIntersectionObserver();
  }

  // Animações baseadas em scroll
  setupScrollAnimations() {
    const scrollElements = document.querySelectorAll('.scroll-reveal');
    
    const revealOnScroll = () => {
      scrollElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('revealed');
        }
      });
    };

    window.addEventListener('scroll', this.throttle(revealOnScroll, 100));
    revealOnScroll(); // Executa uma vez no carregamento
  }

  // Efeitos de hover interativos
  setupHoverEffects() {
    // Cards com efeito de elevação
    const cards = document.querySelectorAll('.card-animate, article');
    cards.forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        this.addHoverEffect(e.target, 'lift');
      });
      
      card.addEventListener('mouseleave', (e) => {
        this.removeHoverEffect(e.target, 'lift');
      });
    });

    // Botões com efeito shimmer
    const buttons = document.querySelectorAll('.btn-animate, .nav-cta-modern, .pf-chip');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', (e) => {
        this.addShimmerEffect(e.target);
      });
    });

    // Imagens com zoom
    const images = document.querySelectorAll('.img-zoom img, .pf-item');
    images.forEach(img => {
      img.addEventListener('mouseenter', (e) => {
        this.addZoomEffect(e.target);
      });
      
      img.addEventListener('mouseleave', (e) => {
        this.removeZoomEffect(e.target);
      });
    });
  }

  // Efeitos de parallax
  setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    };

    window.addEventListener('scroll', this.throttle(updateParallax, 16));
  }

  // Animações de texto
  setupTextAnimations() {
    const textElements = document.querySelectorAll('.text-reveal');
    
    textElements.forEach(element => {
      const text = element.textContent;
      element.innerHTML = '';
      
      text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.animationDelay = `${index * 0.05}s`;
        element.appendChild(span);
      });
    });
  }

  // Animações de imagem
  setupImageAnimations() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      img.addEventListener('load', () => {
        img.classList.add('animate-fade-in-scale');
      });
    });
  }

  // Animações de botão
  setupButtonAnimations() {
    const buttons = document.querySelectorAll('button, .btn, .nav-cta-modern');
    
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        this.createRippleEffect(e);
      });
    });
  }

  // Animações de menu
  setupMenuAnimations() {
    const menuItems = document.querySelectorAll('.nav-link, .menu-item');
    
    menuItems.forEach(item => {
      item.addEventListener('mouseenter', (e) => {
        this.addMenuHoverEffect(e.target);
      });
      
      item.addEventListener('mouseleave', (e) => {
        this.removeMenuHoverEffect(e.target);
      });
    });
  }

  // Animações de loading
  setupLoadingAnimations() {
    // Simula carregamento de imagens
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('animate-fade-in-scale');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  // Intersection Observer para animações
  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          
          // Adiciona animação baseada no data-animation
          const animation = element.dataset.animation;
          if (animation) {
            element.classList.add(animation);
          }
          
          // Anima elementos filhos com stagger
          const children = element.querySelectorAll('[data-stagger]');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('animate-fade-in-up');
            }, index * 100);
          });
          
          observer.unobserve(element);
        }
      });
    }, observerOptions);

    // Observa elementos com data-animation
    document.querySelectorAll('[data-animation]').forEach(el => {
      observer.observe(el);
    });
  }

  // Métodos auxiliares
  addHoverEffect(element, effect) {
    element.classList.add(`hover-${effect}`);
  }

  removeHoverEffect(element, effect) {
    element.classList.remove(`hover-${effect}`);
  }

  addShimmerEffect(element) {
    element.classList.add('shimmer');
    setTimeout(() => {
      element.classList.remove('shimmer');
    }, 2000);
  }

  addZoomEffect(element) {
    element.style.transform = 'scale(1.1)';
  }

  removeZoomEffect(element) {
    element.style.transform = 'scale(1)';
  }

  addMenuHoverEffect(element) {
    element.classList.add('hover-pulse');
  }

  removeMenuHoverEffect(element) {
    element.classList.remove('hover-pulse');
  }

  createRippleEffect(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  throttle(func, limit) {
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
}

// ====== ANIMAÇÕES ESPECÍFICAS PARA ELEMENTOS ======

class ElementAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.animateHero();
    this.animateCards();
    this.animatePortfolio();
    this.animateCounters();
    this.animateProgressBars();
  }

  // Anima hero section
  animateHero() {
    const hero = document.querySelector('.hero-animate');
    if (hero) {
      const title = hero.querySelector('h1');
      const subtitle = hero.querySelector('p');
      const buttons = hero.querySelectorAll('.btn');
      
      if (title) title.classList.add('animate-fade-in-up');
      if (subtitle) subtitle.classList.add('animate-fade-in-up', 'animate-delay-200');
      buttons.forEach((btn, index) => {
        btn.classList.add('animate-fade-in-up', `animate-delay-${(index + 1) * 200}`);
      });
    }
  }

  // Anima cards de serviços
  animateCards() {
    const cards = document.querySelectorAll('article');
    cards.forEach((card, index) => {
      card.classList.add('card-animate', 'animate-fade-in-up');
      card.style.animationDelay = `${index * 0.1}s`;
    });
  }

  // Anima portfólio
  animatePortfolio() {
    const portfolioItems = document.querySelectorAll('.pf-item');
    portfolioItems.forEach((item, index) => {
      item.classList.add('img-zoom');
      item.style.animationDelay = `${index * 0.05}s`;
    });
  }

  // Anima contadores
  animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    const animateCounter = (counter) => {
      const target = parseInt(counter.dataset.count);
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = Math.floor(current);
      }, 16);
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  // Anima barras de progresso
  animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    const animateProgress = (bar) => {
      const width = bar.dataset.width || '100%';
      bar.style.width = '0%';
      setTimeout(() => {
        bar.style.width = width;
      }, 100);
    };

    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateProgress(entry.target);
          progressObserver.unobserve(entry.target);
        }
      });
    });

    progressBars.forEach(bar => progressObserver.observe(bar));
  }
}

// ====== EFEITOS ESPECIAIS ======

class SpecialEffects {
  constructor() {
    this.init();
  }

  init() {
    // this.setupParticleEffect(); // Removido - efeito de neve
    // this.setupCursorEffect(); // Desabilitado - bola que acompanha o mouse
    this.setupTypingEffect();
  }

  // Efeito de partículas - REMOVIDO (efeito de neve)
  /*
  setupParticleEffect() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = () => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      };
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(5, 150, 105, ${particle.opacity})`;
        ctx.fill();
      });
      
      requestAnimationFrame(animateParticles);
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < 50; i++) {
        particles.push(createParticle());
      }
      animateParticles();
    };

    resizeCanvas();
    initParticles();
    window.addEventListener('resize', resizeCanvas);
  }
  */

  // Efeito de cursor personalizado
  setupCursorEffect() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      background: rgba(5, 150, 105, 0.8);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transition: transform 0.1s ease;
      mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX - 10 + 'px';
      cursor.style.top = e.clientY - 10 + 'px';
    });

    document.addEventListener('mousedown', () => {
      cursor.style.transform = 'scale(0.8)';
    });

    document.addEventListener('mouseup', () => {
      cursor.style.transform = 'scale(1)';
    });
  }

  // Efeito de digitação
  setupTypingEffect() {
    const typingElements = document.querySelectorAll('[data-typing]');
    
    typingElements.forEach(element => {
      const text = element.textContent;
      element.textContent = '';
      element.style.borderRight = '2px solid #059669';
      
      let i = 0;
      const typeWriter = () => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, 100);
        } else {
          element.style.borderRight = 'none';
        }
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            typeWriter();
            observer.unobserve(entry.target);
          }
        });
      });
      
      observer.observe(element);
    });
  }
}

// ====== BOTÃO WHATSAPP FLUTUANTE ======

class WhatsAppButton {
  constructor() {
    this.init();
  }

  init() {
    this.setupWhatsAppButton();
    this.setupScrollBehavior();
    this.setupClickTracking();
  }

  setupWhatsAppButton() {
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    if (!whatsappBtn) return;

    // Adiciona animação de pulsação periódica
    this.addPulseAnimation();
    
    // Adiciona efeito de hover personalizado
    whatsappBtn.addEventListener('mouseenter', () => {
      this.addHoverAnimation();
    });

    whatsappBtn.addEventListener('mouseleave', () => {
      this.removeHoverAnimation();
    });

    // Adiciona efeito de clique
    whatsappBtn.addEventListener('click', (e) => {
      this.addClickAnimation(e);
    });
  }

  addPulseAnimation() {
    const whatsappFloat = document.querySelector('.whatsapp-float');
    if (!whatsappFloat) return;

    // Adiciona pulsação a cada 5 segundos
    setInterval(() => {
      whatsappFloat.style.animation = 'whatsappPulse 1s ease-in-out';
      setTimeout(() => {
        whatsappFloat.style.animation = 'whatsappFloat 3s ease-in-out infinite';
      }, 1000);
    }, 5000);
  }

  addHoverAnimation() {
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    const whatsappIcon = document.querySelector('.whatsapp-icon');
    
    if (whatsappBtn && whatsappIcon) {
      whatsappBtn.style.transform = 'scale(1.1)';
      whatsappIcon.style.transform = 'scale(1.1) rotate(5deg)';
    }
  }

  removeHoverAnimation() {
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    const whatsappIcon = document.querySelector('.whatsapp-icon');
    
    if (whatsappBtn && whatsappIcon) {
      whatsappBtn.style.transform = 'scale(1)';
      whatsappIcon.style.transform = 'scale(1) rotate(0deg)';
    }
  }

  addClickAnimation(event) {
    const whatsappBtn = event.currentTarget;
    
    // Cria efeito de ripple
    const ripple = document.createElement('span');
    const rect = whatsappBtn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 50%;
      transform: scale(0);
      animation: whatsappRipple 0.6s linear;
      pointer-events: none;
    `;
    
    whatsappBtn.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  setupScrollBehavior() {
    let lastScrollY = window.scrollY;
    const whatsappFloat = document.querySelector('.whatsapp-float');
    
    if (!whatsappFloat) return;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      // Esconde o botão quando rola para baixo rapidamente
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        whatsappFloat.style.transform = 'translateY(100px)';
        whatsappFloat.style.opacity = '0.7';
      } else {
        whatsappFloat.style.transform = 'translateY(0)';
        whatsappFloat.style.opacity = '1';
      }
      
      lastScrollY = currentScrollY;
    });
  }

  setupClickTracking() {
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    if (!whatsappBtn) return;

    whatsappBtn.addEventListener('click', () => {
      // Rastreia cliques no WhatsApp (pode ser integrado com Google Analytics)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
          event_category: 'WhatsApp',
          event_label: 'Floating Button',
          value: 1
        });
      }
      
      // Log local para debug
      console.log('WhatsApp button clicked');
    });
  }
}

// ====== INICIALIZAÇÃO ======

document.addEventListener('DOMContentLoaded', () => {
  // Inicializa sistema de animações
  new AnimationController();
  new ElementAnimations();
  new SpecialEffects();
  new WhatsAppButton();
  
  // Menu mobile (código melhorado)
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (menuToggle && mobileMenu) {
    // Toggle do menu
    menuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const isActive = menuToggle.classList.contains('active');
      
      if (isActive) {
        // Fechar menu
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      } else {
        // Abrir menu
        menuToggle.classList.add('active');
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
    
    // Fechar menu ao clicar nos links
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
    
    // Fechar menu ao clicar fora dele
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    
    // Fechar menu ao redimensionar a tela
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
});

// ====== ESTILOS ADICIONAIS PARA EFEITOS ======

const additionalStyles = `
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  @keyframes whatsappRipple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  .progress-bar {
    height: 4px;
    background: linear-gradient(135deg, #059669, #0ea5e9);
    border-radius: 2px;
    transition: width 1s ease-in-out;
  }
  
  .custom-cursor {
    display: none;
  }
  
  @media (min-width: 768px) {
    .custom-cursor {
      display: block;
    }
  }
`;

// Adiciona estilos ao head
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
