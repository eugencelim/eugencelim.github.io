
//Install
self.addEventListener('install',function(e){
    console.log(e);
    console.log("Service Worker Installed.");
})

//Activate
self.addEventListener('activate',function(){
    console.log("service worker: activated.")
})

self.addEventListener('push',function(e){
    e.waitUntil(self.registration.showNotification("Push Event Triggered."))
})