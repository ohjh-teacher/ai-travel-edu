(function exposeFirebaseConfiguration(global) {
  "use strict";
  const config = Object.freeze({
    apiKey: "AIzaSyDbto7vFUwkaPZc7l0kyGX2qi4HjZQvvOg",
    authDomain: "aitraveledu.firebaseapp.com",
    projectId: "aitraveledu",
    storageBucket: "aitraveledu.firebasestorage.app",
    messagingSenderId: "19262129760",
    appId: "1:19262129760:web:bfb1777ee404368294e505"
  });
  Object.defineProperty(global, "AI_TRAVEL_FIREBASE_CONFIG", {
    value: config,
    configurable: false,
    writable: false
  });
})(window);