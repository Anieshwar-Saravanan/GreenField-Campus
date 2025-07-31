// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5B9F1hRaNOwgyhqabR-OhutJymdIRIvM",
  authDomain: "greenfiledcampus.firebaseapp.com",
  projectId: "greenfiledcampus",
  storageBucket: "greenfiledcampus.firebasestorage.app",
  messagingSenderId: "852913768417",
  appId: "1:852913768417:web:d6bde0e6756a73c8afb4a0",
  measurementId: "G-EMTL8PF2V8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);