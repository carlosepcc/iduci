import  importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js');
 if (workbox) {
   console.log('[ Hello ] from Maye');
const wkb = {
  ...workbox.core,
  ...workbox.routing,
  ...workbox.precaching,
  ...workbox.strategies,
  ...workbox.cacheableResponse,
  ...workbox.expiration
}
const {
  clientsClaim,
  cacheNames,
  setCacheNameDetails,
  setCatchHandler,
  NavigationRoute,
  registerRoute,
  precacheAndRoute,
  createHandlerBoundToURL,
  matchPrecache,
  NetworkFirst,
  NetworkOnly,
  CacheFirst,
  CacheOnly,
  StaleWhileRevalidate,
  CacheExpiration,
  ExpirationPlugin,
  CacheableResponsePlugin
  } = wkb;


     /* here is your workbox
          workspace */


   self.skipWaiting();
   clientsClaim();
 } else {
   console.log('Boo! Workbox failed to load 😬');
 }
 
 cache // Cache CSS, JS, and Web Worker requests...
 registerRoute(
 //  Check to see if the request's destination is style for css, script , or worker...
 ({ request }) => request.destination === 'style' ||
                  request.destination === 'script' ||
                  request.destination === 'worker',
 // Use a Stale While Revalidate caching strategy...
  new StaleWhileRevalidate({
    // Put all cached files in a cache named 'assets'...
    cacheName: 'assets',
    plugins: [
       // Ensure that only requests that result in a 200 status are cached...
       new CacheableResponsePlugin({
          statuses: [200]
       }),
       new ExpirationPlugin({
          maxEntries: 20,
          maxAgeSeconds: 1 * 24 * 60 * 60 // 1 Day
       }),
    ],
  })
 );
 
 
 // Basic service worker...
 self.addEventListener('fetch', (event) => {
  event.respondWith(caches.open('cache').then((cache) => {
   return cache.match(event.request).then((response) => {
    console.log("cache request: " + event.request.url);
    const fetchPromise = fetch(event.request).then((networkResponse) => {
    // If we got a response from the cache, update the cache...
    console.log("fetch completed: " + event.request.url, networkResponse);
    if (networkResponse) {
     console.debug("updated cached page: " + event.request.url, networkResponse);
     cache.put(event.request, networkResponse.clone());}
    return networkResponse;
   }, (event) => {
   // Rejected promise - just ignore it, we're offline...
   console.log("Error in fetch()", event);
   event.waitUntil(
    // Our 'cache' here is named *cache* in the caches.open()...
    caches.open('cache').then((cache) => {
     return cache.addAll
       ([
       // List : cache.addAll(), takes a list of URLs, then fetches them from...
       // The server and adds the response to the cache...
       './index.html', // cache your index page
       './assets/css/app.main.css', // cache app.main css
       './images/*', // cache all images
       './app.webmanifest',
       // External url fetch, twitter's as an example...
       'https://platform.twitter.com/widgets.js',
      ]);
     }) );
    });
    // Respond from the cache, or the network...
    return response || fetchPromise;
  });
  }));
 });
 
 // Always updating i.e latest version available...
 self.addEventListener('install', (event) => {
    self.skipWaiting();
    console.log("Latest version installed!");
 });
 