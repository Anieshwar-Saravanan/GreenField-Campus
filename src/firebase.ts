// firebase-config.ts (you can extract this later)
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA5B9F1hRaNOwgyhqabR-OhutJymdIRIvM",
  authDomain: "greenfiledcampus.firebaseapp.com",
  projectId: "greenfiledcampus",
  storageBucket: "greenfiledcampus.appspot.com",
  messagingSenderId: "852913768417",
  appId: "1:852913768417:web:d6bde0e6756a73c8afb4a0",
  measurementId: "G-EMTL8PF2V8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
auth.languageCode = 'it';
auth.useDeviceLanguage();

