importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging.js');

// Firebase configuration (same as your HTML file)
const firebaseConfig = {
    apiKey: "AIzaSyBKc2drS_d19WbMncoYJe8Bf9dwx-d-gQw",
    authDomain: "date-mate-v1.firebaseapp.com",
    projectId: "date-mate-v1",
    storageBucket: "date-mate-v1.firebasestorage.app",
    messagingSenderId: "549450549008",
    appId: "1:549450549008:web:cd8cb2051bee4202398795",
    measurementId: "G-Y6Y3B0LKYL"
};

// Initialize Firebase in the service worker
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage(function(payload) {
    console.log("Background notification received", payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon
    };

    // Show the notification
    self.registration.showNotification(notificationTitle, notificationOptions);
});
