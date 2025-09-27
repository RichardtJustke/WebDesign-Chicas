// Browser Compatibility - Chicas Eventos
// Sistema aprimorado de compatibilidade entre navegadores e servidores

(function() {
    'use strict';
    
    // Detectar recursos suportados
    var supports = {
        flexbox: false,
        grid: false,
        customProperties: false,
        intersectionObserver: false,
        fetch: false,
        promises: false,
        transform: false,
        transition: false,
        borderRadius: false,
        boxShadow: false,
        backdropFilter: false,
        webkit: false,
        moz: false,
        ms: false
    };
    
    // Detectar tipo de servidor
    var serverInfo = {
        isLocal: window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1' || 
                window.location.hostname.includes('192.168') ||
                window.location.protocol === 'file:',
        isProduction: window.location.hostname.includes('chicas') || 
                     window.location.hostname.includes('vercel') ||
                     window.location.hostname.includes('netlify'),
        port: window.location.port,
        serverType: detectServerType(),
        userAgent: navigator.userAgent,
        browser: detectBrowser()
    };
    
    // Detectar tipo específico de servidor
    function detectServerType() {
        var port = window.location.port;
        var hostname = window.location.hostname;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            if (port === '8000') return 'python-server';
            if (port === '5500') return 'live-server';
            if (port === '3000') return 'node-server';
            if (port === '8080') return 'apache-server';
            return 'local-server';
        }
        
        if (window.location.protocol === 'file:') return 'file-protocol';
        
        return 'production';
    }
    
    // Detectar navegador
    function detectBrowser() {
        var ua = navigator.userAgent;
        
        // Detectar Opera (deve vir antes do Chrome)
        if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) return 'opera';
        
        // Detectar Zen Browser (baseado no Chromium)
        if (ua.indexOf('Zen') > -1 || ua.indexOf('ZenBrowser') > -1) return 'zen';
        
        // Detectar outros navegadores
        if (ua.indexOf('Chrome') > -1) return 'chrome';
        if (ua.indexOf('Firefox') > -1) return 'firefox';
        if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) return 'safari';
        if (ua.indexOf('Edge') > -1) return 'edge';
        if (ua.indexOf('Trident') > -1 || ua.indexOf('MSIE') > -1) return 'ie';
        
        return 'unknown';
    }
    
    // Testar suporte a Flexbox
    function testFlexbox() {
        var testEl = document.createElement('div');
        testEl.style.display = 'flex';
        return testEl.style.display === 'flex';
    }
    
    // Testar suporte a CSS Grid
    function testGrid() {
        var testEl = document.createElement('div');
        testEl.style.display = 'grid';
        return testEl.style.display === 'grid';
    }
    
    // Testar suporte a CSS Custom Properties
    function testCustomProperties() {
        var testEl = document.createElement('div');
        testEl.style.setProperty('--test', '1px');
        return testEl.style.getPropertyValue('--test') === '1px';
    }
    
    // Testar suporte a IntersectionObserver
    function testIntersectionObserver() {
        return 'IntersectionObserver' in window;
    }
    
    // Testar suporte a Fetch
    function testFetch() {
        return 'fetch' in window;
    }
    
    // Testar suporte a Promises
    function testPromises() {
        return 'Promise' in window;
    }
    
    // Testar suporte a Transform
    function testTransform() {
        var testEl = document.createElement('div');
        testEl.style.transform = 'translateX(1px)';
        return testEl.style.transform !== '';
    }
    
    // Testar suporte a Transition
    function testTransition() {
        var testEl = document.createElement('div');
        testEl.style.transition = 'opacity 0.3s';
        return testEl.style.transition !== '';
    }
    
    // Testar suporte a Border Radius
    function testBorderRadius() {
        var testEl = document.createElement('div');
        testEl.style.borderRadius = '5px';
        return testEl.style.borderRadius !== '';
    }
    
    // Testar suporte a Box Shadow
    function testBoxShadow() {
        var testEl = document.createElement('div');
        testEl.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';
        return testEl.style.boxShadow !== '';
    }
    
    // Testar suporte a Backdrop Filter
    function testBackdropFilter() {
        var testEl = document.createElement('div');
        testEl.style.backdropFilter = 'blur(10px)';
        return testEl.style.backdropFilter !== '';
    }
    
    // Testar prefixos de navegadores
    function testPrefixes() {
        var testEl = document.createElement('div');
        var style = testEl.style;
        
        supports.webkit = !!(style.webkitTransform || style.webkitTransition);
        supports.moz = !!(style.mozTransform || style.mozTransition);
        supports.ms = !!(style.msTransform || style.msTransition);
    }
    
    // Executar todos os testes
    function runAllTests() {
        supports.flexbox = testFlexbox();
        supports.grid = testGrid();
        supports.customProperties = testCustomProperties();
        supports.intersectionObserver = testIntersectionObserver();
        supports.fetch = testFetch();
        supports.promises = testPromises();
        supports.transform = testTransform();
        supports.transition = testTransition();
        supports.borderRadius = testBorderRadius();
        supports.boxShadow = testBoxShadow();
        supports.backdropFilter = testBackdropFilter();
        testPrefixes();
    }
    
    // Executar testes
    runAllTests();
    
    // Aplicar fallbacks baseados no suporte detectado
    function applyFallbacks() {
        console.log('=== APLICANDO FALLBACKS DE COMPATIBILIDADE ===');
        console.log('Servidor:', serverInfo.isLocal ? 'LOCAL' : 'PRODUÇÃO');
        console.log('Navegador:', serverInfo.browser);
        console.log('Recursos suportados:', supports);
        
        // Aplicar estilos específicos para servidor local vs produção
        applyServerSpecificStyles();
        
        // Fallback para CSS Custom Properties
        if (!supports.customProperties) {
            console.log('CSS Custom Properties não suportado - aplicando fallbacks');
            applyCustomPropertiesFallback();
        }
        
        // Fallback para Flexbox
        if (!supports.flexbox) {
            console.log('Flexbox não suportado - aplicando fallbacks');
            applyFlexboxFallback();
        }
        
        // Fallback para CSS Grid
        if (!supports.grid) {
            console.log('CSS Grid não suportado - aplicando fallbacks');
            applyGridFallback();
        }
        
        // Fallback para Transform
        if (!supports.transform) {
            console.log('Transform não suportado - aplicando fallbacks');
            applyTransformFallback();
        }
        
        // Fallback para Transition
        if (!supports.transition) {
            console.log('Transition não suportado - aplicando fallbacks');
            applyTransitionFallback();
        }
        
        // Fallback para Border Radius
        if (!supports.borderRadius) {
            console.log('Border Radius não suportado - aplicando fallbacks');
            applyBorderRadiusFallback();
        }
        
        // Fallback para Box Shadow
        if (!supports.boxShadow) {
            console.log('Box Shadow não suportado - aplicando fallbacks');
            applyBoxShadowFallback();
        }
        
        // Fallback para Backdrop Filter
        if (!supports.backdropFilter) {
            console.log('Backdrop Filter não suportado - aplicando fallbacks');
            applyBackdropFilterFallback();
        }
        
        // Fallback para IntersectionObserver
        if (!supports.intersectionObserver) {
            console.log('IntersectionObserver não suportado - aplicando fallbacks');
            applyIntersectionObserverFallback();
        }
        
        // Fallback para Fetch
        if (!supports.fetch) {
            console.log('Fetch não suportado - aplicando fallbacks');
            applyFetchFallback();
        }
        
        // Aplicar normalização de estilos
        applyStyleNormalization();
        
        console.log('=== FALLBACKS APLICADOS COM SUCESSO ===');
    }
    
    // Aplicar estilos específicos para servidor
    function applyServerSpecificStyles() {
        var style = document.createElement('style');
        style.id = 'server-specific-styles';
        
        var serverIndicator = '';
        var serverColor = '#ff6b6b';
        
        // Indicadores específicos por servidor
        if (serverInfo.isLocal) {
            switch(serverInfo.serverType) {
                case 'python-server':
                    serverIndicator = 'PYTHON SERVER (8000)';
                    serverColor = '#4CAF50';
                    break;
                case 'live-server':
                    serverIndicator = 'LIVE SERVER (5500)';
                    serverColor = '#2196F3';
                    break;
                case 'node-server':
                    serverIndicator = 'NODE SERVER (3000)';
                    serverColor = '#FF9800';
                    break;
                case 'apache-server':
                    serverIndicator = 'APACHE SERVER (8080)';
                    serverColor = '#9C27B0';
                    break;
                default:
                    serverIndicator = 'MODO DESENVOLVIMENTO';
                    serverColor = '#ff6b6b';
            }
            
            // Estilos para desenvolvimento local
            style.textContent = `
                body::before {
                    content: "${serverIndicator}";
                    position: fixed;
                    top: 0;
                    right: 0;
                    background: ${serverColor};
                    color: white;
                    padding: 5px 10px;
                    font-size: 12px;
                    z-index: 9999;
                    border-radius: 0 0 0 5px;
                    font-family: monospace;
                    font-weight: bold;
                }
                
                .debug-info {
                    position: fixed;
                    bottom: 10px;
                    left: 10px;
                    background: rgba(0,0,0,0.9);
                    color: white;
                    padding: 15px;
                    border-radius: 8px;
                    font-size: 12px;
                    z-index: 9998;
                    font-family: monospace;
                    border: 2px solid ${serverColor};
                    max-width: 300px;
                }
                
                .debug-info strong {
                    color: ${serverColor};
                }
            `;
        } else {
            // Estilos para produção
            style.textContent = `
                /* Otimizações para produção */
                * {
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
            `;
        }
        
        document.head.appendChild(style);
    }
    
    // Fallback para CSS Custom Properties
    function applyCustomPropertiesFallback() {
        var style = document.createElement('style');
        style.textContent = `
            .primary-color { color: #8e1b00 !important; }
            .secondary-color { color: #0f4d3a !important; }
            .accent-color { color: #c97e2b !important; }
            .text-color { color: #1e1e1e !important; }
            .background-color { background-color: #ffffff !important; }
            .light-bg { background-color: #f8f9fa !important; }
            
            .btn-login, .btn-user {
                background: transparent !important;
                color: #b95929 !important;
                border: 2px solid #b95929 !important;
            }
            
            .nav-link {
                color: #333 !important;
            }
            
            .nav-link:hover {
                color: #b95929 !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Fallback para Flexbox
    function applyFlexboxFallback() {
        var style = document.createElement('style');
        style.textContent = `
            .nav-container {
                display: table !important;
                width: 100% !important;
            }
            
            .nav-container > * {
                display: table-cell !important;
                vertical-align: middle !important;
            }
            
            .menu {
                display: inline-block !important;
                text-align: center !important;
                position: static !important;
                left: auto !important;
                transform: none !important;
            }
            
            .menu a {
                display: inline-block !important;
                margin: 0 10px !important;
            }
            
            .hero-container {
                display: block !important;
            }
            
            .hero-content {
                display: block !important;
                width: 100% !important;
                max-width: none !important;
                padding-right: 0 !important;
            }
            
            .hero-image {
                display: block !important;
                width: 100% !important;
                position: static !important;
                right: auto !important;
                top: auto !important;
            }
            
            .services-grid {
                display: block !important;
            }
            
            .service-card {
                display: block !important;
                width: 100% !important;
                margin-bottom: 20px !important;
                float: left !important;
            }
            
            .footer-content {
                display: block !important;
            }
            
            .footer-columns {
                display: block !important;
            }
            
            .footer-col {
                display: block !important;
                margin-bottom: 20px !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Fallback para CSS Grid
    function applyGridFallback() {
        var style = document.createElement('style');
        style.textContent = `
            .services-grid {
                display: block !important;
            }
            
            .service-card {
                display: inline-block !important;
                width: 48% !important;
                margin: 1% !important;
                vertical-align: top !important;
            }
            
            .portfolio-gallery {
                display: block !important;
            }
            
            .portfolio-item {
                display: inline-block !important;
                width: 30% !important;
                margin: 1% !important;
                vertical-align: top !important;
            }
            
            .differentials-grid {
                display: block !important;
            }
            
            .differential-card {
                display: inline-block !important;
                width: 30% !important;
                margin: 1% !important;
                vertical-align: top !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Fallback para Transform
    function applyTransformFallback() {
        var style = document.createElement('style');
        style.textContent = `
            .btn-primary:hover,
            .btn-secondary:hover {
                position: relative !important;
                top: -2px !important;
                transform: none !important;
            }
            
            .hero-content {
                position: static !important;
                transform: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Fallback para Transition
    function applyTransitionFallback() {
        var style = document.createElement('style');
        style.textContent = `
            .menu a,
            .btn-primary,
            .btn-secondary,
            .service-card,
            .portfolio-item {
                transition: none !important;
                -webkit-transition: none !important;
                -moz-transition: none !important;
                -o-transition: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Fallback para Border Radius
    function applyBorderRadiusFallback() {
        var style = document.createElement('style');
        style.textContent = `
            .btn-primary,
            .btn-secondary,
            .service-card,
            .portfolio-item {
                border-radius: 0 !important;
                -webkit-border-radius: 0 !important;
                -moz-border-radius: 0 !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Fallback para Box Shadow
    function applyBoxShadowFallback() {
        var style = document.createElement('style');
        style.textContent = `
            .service-card,
            .portfolio-item,
            .differential-card {
                box-shadow: none !important;
                -webkit-box-shadow: none !important;
                -moz-box-shadow: none !important;
                border: 1px solid #ddd !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Fallback para Backdrop Filter
    function applyBackdropFilterFallback() {
        var style = document.createElement('style');
        style.textContent = `
            .header {
                background: rgba(255, 255, 255, 0.95) !important;
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Normalização de estilos entre navegadores
    function applyStyleNormalization() {
        var style = document.createElement('style');
        style.textContent = `
            /* Normalização para todos os navegadores */
            * {
                -webkit-box-sizing: border-box !important;
                -moz-box-sizing: border-box !important;
                box-sizing: border-box !important;
            }
            
            /* Reset de margens e paddings */
            body, h1, h2, h3, h4, h5, h6, p, ul, ol, li {
                margin: 0 !important;
                padding: 0 !important;
            }
            
            /* Normalização de fontes */
            body {
                font-family: Arial, sans-serif !important;
                -webkit-font-smoothing: antialiased !important;
                -moz-osx-font-smoothing: grayscale !important;
            }
            
            /* Normalização de imagens */
            img {
                max-width: 100% !important;
                height: auto !important;
                border: 0 !important;
            }
            
            /* Normalização de links */
            a {
                text-decoration: none !important;
                color: inherit !important;
            }
            
            /* Normalização de botões */
            button {
                border: none !important;
                background: none !important;
                cursor: pointer !important;
            }
            
            /* Normalização de inputs */
            input, textarea, select {
                font-family: inherit !important;
                font-size: inherit !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Fallback para IntersectionObserver
    function applyIntersectionObserverFallback() {
        // Implementar lazy loading sem IntersectionObserver
        var images = document.querySelectorAll('img[data-src]');
        images.forEach(function(img) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
        
        // Implementar animações sem IntersectionObserver
        var animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .slide-in-up');
        animatedElements.forEach(function(el) {
            el.classList.add('animated');
        });
    }
    
    // Fallback para Fetch
    function applyFetchFallback() {
        if (!window.fetch) {
            // Polyfill básico para fetch usando XMLHttpRequest
            window.fetch = function(url, options) {
                return new Promise(function(resolve, reject) {
                    var xhr = new XMLHttpRequest();
                    xhr.open(options.method || 'GET', url);
                    
                    if (options.headers) {
                        for (var header in options.headers) {
                            xhr.setRequestHeader(header, options.headers[header]);
                        }
                    }
                    
                    xhr.onload = function() {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            resolve({
                                ok: true,
                                status: xhr.status,
                                json: function() {
                                    return Promise.resolve(JSON.parse(xhr.responseText));
                                },
                                text: function() {
                                    return Promise.resolve(xhr.responseText);
                                }
                            });
                        } else {
                            reject(new Error('HTTP error! status: ' + xhr.status));
                        }
                    };
                    
                    xhr.onerror = function() {
                        reject(new Error('Network error'));
                    };
                    
                    xhr.send(options.body || null);
                });
            };
        }
    }
    
    // Polyfill para Array.from (IE)
    if (!Array.from) {
        Array.from = function(arrayLike) {
            return Array.prototype.slice.call(arrayLike);
        };
    }
    
    // Polyfill para Object.assign (IE)
    if (!Object.assign) {
        Object.assign = function(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                    if (source.hasOwnProperty(key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };
    }
    
    // Polyfill para String.includes (IE)
    if (!String.prototype.includes) {
        String.prototype.includes = function(search, start) {
            if (typeof start !== 'number') {
                start = 0;
            }
            if (start + search.length > this.length) {
                return false;
            } else {
                return this.indexOf(search, start) !== -1;
            }
        };
    }
    
    // Polyfill para Element.closest (IE)
    if (!Element.prototype.closest) {
        Element.prototype.closest = function(selector) {
            var element = this;
            while (element && element.nodeType === 1) {
                if (element.matches(selector)) {
                    return element;
                }
                element = element.parentElement;
            }
            return null;
        };
    }
    
    // Polyfill para Element.matches (IE)
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || 
                                   Element.prototype.webkitMatchesSelector;
    }
    
    // Aplicar classes específicas do navegador
    function applyBrowserClasses() {
        // Adicionar classe do navegador ao body
        document.body.classList.add(serverInfo.browser + '-browser');
        
        // Adicionar classe do servidor ao body
        document.body.classList.add(serverInfo.serverType);
        
        // Adicionar classes baseadas no suporte
        if (!supports.flexbox) document.body.classList.add('no-flexbox');
        if (!supports.grid) document.body.classList.add('no-grid');
        if (!supports.customProperties) document.body.classList.add('no-custom-properties');
        if (!supports.transform) document.body.classList.add('no-transform');
        if (!supports.transition) document.body.classList.add('no-transition');
        if (!supports.borderRadius) document.body.classList.add('no-border-radius');
        if (!supports.boxShadow) document.body.classList.add('no-box-shadow');
        if (!supports.backdropFilter) document.body.classList.add('no-backdrop-filter');
        
        console.log('Classes aplicadas ao body:', document.body.className);
    }
    
    // Inicializar quando o DOM estiver pronto
    function init() {
        applyBrowserClasses();
        applyFallbacks();
        addDebugInfo();
        console.log('Browser compatibility fallbacks aplicados:', supports);
        console.log('Informações do servidor:', serverInfo);
    }
    
    // Executar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Adicionar informações de debug para servidor local
    function addDebugInfo() {
        if (serverInfo.isLocal) {
            var debugDiv = document.createElement('div');
            debugDiv.className = 'debug-info';
            
            var browserName = serverInfo.browser;
            var browserIcon = '';
            
            // Ícones específicos para cada navegador
            switch(serverInfo.browser) {
                case 'opera':
                    browserName = 'Opera';
                    browserIcon = '🎭';
                    break;
                case 'zen':
                    browserName = 'Zen Browser';
                    browserIcon = '🧘';
                    break;
                case 'chrome':
                    browserName = 'Chrome';
                    browserIcon = '🌐';
                    break;
                case 'firefox':
                    browserName = 'Firefox';
                    browserIcon = '🦊';
                    break;
                case 'safari':
                    browserName = 'Safari';
                    browserIcon = '🧭';
                    break;
                case 'edge':
                    browserName = 'Edge';
                    browserIcon = '⚡';
                    break;
                default:
                    browserIcon = '❓';
            }
            
            debugDiv.innerHTML = `
                <strong>🔧 Debug Info:</strong><br>
                ${browserIcon} Navegador: ${browserName}<br>
                🖥️ Servidor: ${serverInfo.serverType} (${serverInfo.port})<br>
                📍 URL: ${window.location.href}<br>
                <br>
                <strong>🎨 Recursos CSS:</strong><br>
                Flexbox: ${supports.flexbox ? '✅' : '❌'}<br>
                Grid: ${supports.grid ? '✅' : '❌'}<br>
                Custom Props: ${supports.customProperties ? '✅' : '❌'}<br>
                Transform: ${supports.transform ? '✅' : '❌'}<br>
                Transition: ${supports.transition ? '✅' : '❌'}<br>
                Border Radius: ${supports.borderRadius ? '✅' : '❌'}<br>
                Box Shadow: ${supports.boxShadow ? '✅' : '❌'}<br>
                <br>
                <strong>🔧 Fallbacks:</strong><br>
                ${!supports.flexbox ? '• Flexbox fallback aplicado<br>' : ''}
                ${!supports.grid ? '• Grid fallback aplicado<br>' : ''}
                ${!supports.customProperties ? '• Custom Properties fallback aplicado<br>' : ''}
                ${!supports.transform ? '• Transform fallback aplicado<br>' : ''}
                ${!supports.transition ? '• Transition fallback aplicado<br>' : ''}
            `;
            document.body.appendChild(debugDiv);
        }
    }
    
    // Exportar para uso global
    window.BrowserCompatibility = {
        supports: supports,
        serverInfo: serverInfo,
        applyFallbacks: applyFallbacks,
        addDebugInfo: addDebugInfo
    };
    
})();
