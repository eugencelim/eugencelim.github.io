
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
    if(event.request.method == "GET"){
        event.respondWith(
            caches.open('static_res').then(function(cache) {
                return cache.match(event.request).then(function (response) {
                    console.log(response)
                    return response || fetch(event.request).then(function(response) {
                        cache.put(event.request, response.clone());
                        return response;
                    })
                }).catch(err => {
                    console.log('Offline')
                })
            })
        )
    }
    else{
        console.log("POST request detected")
        event.respondWith(fetch(event.request.clone()).catch(function(error){
              savePostRequests(event.request.clone().url,"{}")
        }))
    }
    // event.respondWith(
    //   caches.open('static_res').then(function(cache) {
    //       if(event.request.method == "GET"){
    //         console.log(event.request)
    //         return cache.match(event.request).then(function (response) {
    //             console.log(response)
    //             return response || fetch(event.request).then(function(response) {
    //                 cache.put(event.request, response.clone());
    //                 return response;
    //             })
    //         }).catch(err => {
    //             console.log('Offline')
    //         })
    //       }
    //       else{
    //           console.log("POST request detected")
    //           event.respondWith(fetch(event.request.clone()).catch(function(error){
    //                 savePostRequests(event.request.clone().url,"{}")
    //           }))
    //         //   console.log("request")
    //         // return fetch(event.request).catch(e => {
    //         //     console.log("Offline Mode")
    //         //     ans = window.confirm("Seems like you are offline, Do you wish to retry this request after you online?")
    //         //     if(ans){

    //         //     }
    //         // }); 
    //       }
    //   })
    // );
  });

  function savePostRequests(url,payload,method){
      var request = {
          "url":url,
          "payload":payload,
          "method":method
      }
      if (typeof window !== 'undefined') {
        console.log('You are on the browser')
        localStorage.setItem('post_req',JSON.stringify(request))
      } else {
        console.log('You are on the server')
        // 👉️ can't use localStorage
      }
   
  }

//Activate
self.addEventListener('activate',function(event){
    event.waitUntil(
        //Delete All Caches
        caches.keys().then(function(cacheNames) {
          return Promise.all(
            cacheNames.filter(function(cacheName) {
            }).map(function(cacheName) {
              return caches.delete(cacheName);
            })
          );
        })
      );
})

self.addEventListener('sync',function(event){
    console.log("Event Sync")
    if (event.tag === 'formData') { // event.tag name checked
        // here must be the same as the one used while registering
        // sync
        event.waitUntil(
          // Send our POST request to the server, now that the user is
          // online
          sendPostToServer()
          )
      }
})

self.addEventListener('message',function(event){
    console.log(event.data)
})

function sendPostToServer () {
    var savedRequests = []
    var req = localStorage.getItem('post_req');
    request = JSON.parse(req);

    var url = request.url
    var payload = JSON.stringify(request.payload)
    var method = request.method
    var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    } 

    fetch(requestUrl, {
        headers: headers,
        method: method,
        body: payload
      }).then(function (response) {
        console.log('server response', response)
        if (response.status < 400) {
            localStorage.removeItem('post_req')
        } 
     }).catch(function (error) {
      console.error('Send to Server failed:', error)
       throw error
     })
  }

self.addEventListener('push',function(e){
    e.waitUntil(self.registration.showNotification("Push Event Triggered."))
})