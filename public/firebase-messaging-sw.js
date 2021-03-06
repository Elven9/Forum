// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  'messagingSenderId': '530399913400'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // json load
  let data = JSON.parse(payload.data)

  // Customize notification here
  var notificationTitle = `${data.author} 發佈了 ${data.title}！`;
  var notificationOptions = {
    body: data.subTitle,
    icon: '/social-media.png'
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});