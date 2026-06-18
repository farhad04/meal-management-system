importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "তোমার apiKey",
  authDomain: "ali-meal.firebaseapp.com",
  projectId: "ali-meal",
  storageBucket: "ali-meal.firebasestorage.app",
  messagingSenderId: "353126248385",
  appId: "তোমার appId"
});

const messaging = firebase.messaging();