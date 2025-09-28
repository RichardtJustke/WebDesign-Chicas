// Service Worker para cache de imagens - Chicas Eventos
const CACHE_NAME = 'chicas-images-v1';
const IMAGE_CACHE = 'chicas-image-cache-v1';

// Lista de imagens críticas para cache
const CRITICAL_IMAGES = [
    'assets/img g/logo/CHICAS EVENTOS_LOGO_VERMELHO.png',
    'pages/index/selective-focus-point-catering-buffet-food 2.png',
    'assets/img g/buffet/alexander-fae-uo9TCt61o30-unsplash.jpg',
    'assets/img g/ad/dose-media-DiTiYQx0mh4-unsplash.jpg',
    'assets/img g/rh/austin-distel-tLZhFRLj6nY-unsplash.jpg'
];

// Instalar Service Worker
self.addEventListener('install', event => {
    console.log('SW Images: Installing...');
    event.waitUntil(
        caches.open(IMAGE_CACHE)
            .then(cache => {
                console.log('SW Images: Caching critical images');
                return cache.addAll(CRITICAL_IMAGES);
            })
            .then(() => self.skipWaiting())
    );
});

// Ativar Service Worker
self.addEventListener('activate', event => {
    console.log('SW Images: Activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== IMAGE_CACHE) {
                        console.log('SW Images: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Interceptar requisições de imagens
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Apenas para imagens
    if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    if (response) {
                        console.log('SW Images: Serving from cache:', url.pathname);
                        return response;
                    }
                    
                    return fetch(event.request)
                        .then(response => {
                            // Verificar se a resposta é válida
                            if (!response || response.status !== 200 || response.type !== 'basic') {
                                return response;
                            }
                            
                            // Clonar a resposta para cache
                            const responseToCache = response.clone();
                            
                            caches.open(IMAGE_CACHE)
                                .then(cache => {
                                    cache.put(event.request, responseToCache);
                                });
                            
                            return response;
                        })
                        .catch(error => {
                            console.log('SW Images: Fetch failed for:', url.pathname, error);
                            // Retornar uma imagem placeholder em caso de erro
                            return new Response(
                                '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#f0f0f0"/><text x="200" y="150" text-anchor="middle" fill="#999">Imagem não disponível</text></svg>',
                                { headers: { 'Content-Type': 'image/svg+xml' } }
                            );
                        });
                })
        );
    }
});

// Limpeza de cache antigo
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'CLEAN_CACHE') {
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName.startsWith('chicas-image-cache-') && cacheName !== IMAGE_CACHE) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        );
    }
});
