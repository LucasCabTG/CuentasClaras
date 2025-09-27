import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// TODO: Replace with your own Firebase project's configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9-yAIgudDnQkIrYw1CCPKyx9vTwCa4lE",
  authDomain: "cuentasclarassftwr.firebaseapp.com",
  projectId: "cuentasclarassftwr",
  storageBucket: "cuentasclarassftwr.firebasestorage.app",
  messagingSenderId: "640839755847",
  appId: "1:640839755847:web:0695c0b71f4c52a2a16962"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
