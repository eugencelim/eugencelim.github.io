
//Install
self.addEventListener('install',function(e){
    console.log(e);
    console.log("Service Worker Installed.");
    e.waitUntil(
        caches.open("static_res").then(function(cache){
            return cache.addAll(
                [
                  '/index.html'
                ]
              );
        })
    )
})

self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.open('static_res').then(function(cache) {
        return cache.match(event.request).then(function (response) {
          return response || fetch(event.request).then(function(response) {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  });

//Activate
self.addEventListener('activate',function(){
    console.log("service worker: activated.")
})

self.addEventListener('push',function(e){
    e.waitUntil(self.registration.showNotification("Push Event Triggered."))
})