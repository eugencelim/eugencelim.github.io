import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

if ('serviceWorker' in navigator) {
	window.addEventListener('load', function() {
	  navigator.serviceWorker.register("/sw.js").then(function(registration) {
		// Registration was successful
		console.log('ServiceWorker registration successful with scope: ', registration.scope);
		registration.sync.register('formData')
		registration.pushManager.getSubscription().then(function(sub) {
			if (sub === null) {
			  // Update UI to ask user to register for Push
			  subscribeUser();
			  //displayNotification("Not subscribe");
			  console.log('Not subscribed to push service!');
			} else {
			  // We have a subscription, update the database
			  console.log('Subscription object: ', sub);
			}
		  });
	  }, function(err) {
		// registration failed :(
		console.log('ServiceWorker registration failed: ', err);
	  });
	});
  }

// Notification.requestPermission(function(status) {
//     console.log('Notification permission status:', status);
// });

function displayNotification(content) {
    if (Notification.permission == 'granted') {
      navigator.serviceWorker.getRegistration().then(function(reg) {
        reg.showNotification(content);
      });
    }
  }

  function subscribeUser() {
	if ('serviceWorker' in navigator) {
	  navigator.serviceWorker.ready.then(function(reg) {
  
		// reg.pushManager.subscribe({
		//   userVisibleOnly: true
		// }).then(function(sub) {
		//   console.log('Endpoint URL: ', sub.endpoint);
		// }).catch(function(e) {
		//   if (Notification.permission === 'denied') {
		// 	console.warn('Permission for notifications was denied');
		//   } else {
		// 	console.error('Unable to subscribe to push', e);
		//   }
		// });
	  })
	}
  }

export default app;