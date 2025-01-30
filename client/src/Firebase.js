// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "financely-c1c36.firebaseapp.com",
  projectId: "financely-c1c36",
  storageBucket: "financely-c1c36.firebasestorage.app",
  messagingSenderId: "334184346162",
  appId: "1:334184346162:web:ee41c8266942366af6022b",
  measurementId: "G-228K97KTR3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
