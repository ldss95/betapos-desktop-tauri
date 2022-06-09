// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.8.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.8.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config

var firebaseConfig = {
	apiKey: "AIzaSyDnt2d-Iwb9HECp9bENC1f1NpnLvtYjCiM",
	authDomain: "betapos-3a19a.firebaseapp.com",
	projectId: "betapos-3a19a",
	storageBucket: "betapos-3a19a.appspot.com",
	messagingSenderId: "1016025935284",
	appId: "1:1016025935284:web:c300e85dd9e9eea2be56e1"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
	// console.log('Received background message ', payload);

	const notificationTitle = payload.notification.title;
	const notificationOptions = {
		body: payload.notification.body,
	};

	self.registration.showNotification(notificationTitle, notificationOptions);
});