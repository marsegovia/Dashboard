const CACHE_NAME = "finanzas-v1";

const ARCHIVOS = [
    "./",
    "./index.html",
    "./transacciones.html",
    "./style.css",
    "./modal.css",
    "./funcion.js"
];


// ===============================
// INSTALAR SERVICE WORKER
// ===============================

self.addEventListener("install", event => {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(ARCHIVOS);
            })
    );

    self.skipWaiting();
});


// ===============================
// ACTIVAR SERVICE WORKER
// ===============================

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(

                keys.map(key => {

                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }

                })

            );

        })

    );

    self.clients.claim();
});


// ===============================
// INTERCEPTAR PETICIONES
// ===============================

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)
            .then(response => {

                // Si está en caché, usarlo
                if (response) {
                    return response;
                }

                // Si no, buscarlo en internet
                return fetch(event.request);

            })

    );

});