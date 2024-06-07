/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);

//Setting up Firebase
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
self.importScripts('firebase/firebase-app-compat.js', 'firebase/firebase-firestore-compat.js')
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmDr0Md_-uk75-1VQ89wi6K7VhiCJ4R9I",
  authDomain: "mcgill-extension-database.firebaseapp.com",
  projectId: "mcgill-extension-database",
  storageBucket: "mcgill-extension-database.appspot.com",
  messagingSenderId: "401565708495",
  appId: "1:401565708495:web:e9a8dc3cd73b8d7b8447ba",
  measurementId: "G-3T2RJ80XTB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();

console.log("This is background");

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GREETINGS') {
    var docRef = db.collection("keywords").doc(request.payload.message);
    console.log(request.payload.message);
    docRef.get().then((doc) => {
      if (doc.exists) {
          const message = doc.data().info;
          console.log(message);
          sendResponse({
            message,
          });
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
          const message = "No such document!";
          sendResponse({
            message: message
          });
      }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
  }
  return true;
});

/******/ })()
;
//# sourceMappingURL=background.js.map