// Import the functions you need from the Firebase SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage'; // Keep the existing imports for storage


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3ZULRt9mb_Mm3zgN7fd-6ADlxRMTXieg",
  authDomain: "discord-demake-ae307.firebaseapp.com",
  databaseURL: "https://discord-demake-ae307-default-rtdb.firebaseio.com/",
  projectId: "discord-demake-ae307",
  storageBucket: "discord-demake-ae307.appspot.com",
  messagingSenderId: "945803825134",
  appId: "1:945803825134:web:807196abce2f51adb048ff",
  measurementId: "G-9HYH03RYHN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app); // Add auth initialization
const analytics = getAnalytics(app); // Add analytics initialization

export { db, storage, auth }; // Export auth