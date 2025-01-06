// Scripts for firebase and firebase messaging
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
//  keys
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

export default messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  console.log(
    "Notifications Title message=>",
    notificationTitle,
    "Notifications Body message=>",
    notificationOptions.body
  );

  self.registration.showNotification(notificationTitle, notificationOptions);
});
