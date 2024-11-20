importScripts('https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.21.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyBKc2drS_d19WbMncoYJe8Bf9dwx-d-gQw",
    authDomain: "date-mate-v1.firebaseapp.com",
    projectId: "date-mate-v1",
    storageBucket: "date-mate-v1.firebasestorage.app",
    messagingSenderId: "549450549008",
    appId: "1:549450549008:web:cd8cb2051bee4202398795",
    measurementId: "G-Y6Y3B0LKYL"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);

  const notificationTitle = payload.notification.title || 'Notification';
  const notificationOptions = {
    body: payload.notification.body || '',
    icon: payload.notification.icon || '/icon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
