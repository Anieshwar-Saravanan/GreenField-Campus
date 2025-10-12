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

// // DEV DEBUG: print masked runtime firebase values and optionally disable
// // app verification for local testing. Remove before production.
// if (import.meta.env.DEV) {
//   const mask = (s: string | undefined) => (s ? `${s.slice(0, 8)}...` : '');
//   // eslint-disable-next-line no-console
//   console.log('Firebase runtime:', {
//     projectId: mask(firebaseConfig.projectId),
//     apiKey: mask(firebaseConfig.apiKey),
//     authDomain: firebaseConfig.authDomain ? 'present' : 'missing',
//   });
//   try {
//     // Disable app verification for local testing only. Do NOT enable in prod.
//     // This helps bypass reCAPTCHA during development when using test phone numbers.
//     // @ts-ignore
//     if (auth.settings) auth.settings.appVerificationDisabledForTesting = true;
//     // eslint-disable-next-line no-console
//     console.log('DEV: appVerificationDisabledForTesting = true');
//   } catch (err) {
//     // eslint-disable-next-line no-console
//     console.warn('Could not set appVerificationDisabledForTesting', err);
//   }
// }

