const version = 'v1';

const addResourcesToCache = async (resources) => {
    const cache = await caches.open(version);
    await cache.addAll(resources);
};

self.addEventListener('install', (event) => {
    console.log(`${version} installing...`);

    event.waitUntil(
        addResourcesToCache([
            //
        ])
    );
});

self.addEventListener('fetch', (event) => {
    console.log(event.request);
    //event.respondWith(fetch('/echotunnel-internal/echotunnel-loaddoc.js?request='+event.request));
    event.respondWith("<h1>Hello world</h1>");

});