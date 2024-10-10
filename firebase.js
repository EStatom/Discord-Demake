// Firebase.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC3ZULRt9mb_Mm3zgN7fd-6ADlxRMTXieg",
  authDomain: "discord-demake-ae307.firebaseapp.com",
  databaseURL: "https://discord-demake-ae307-default-rtdb.firebaseio.com",
  projectId: "discord-demake-ae307",
  storageBucket: "discord-demake-ae307.appspot.com",
  messagingSenderId: "945803825134",
  appId: "1:945803825134:web:807196abce2f51adb048ff",
  measurementId: "G-9HYH03RYHN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Add a message to Firestore
export const sendMessageToFirebase = async (message) => {
  try {
    const docRef = await addDoc(collection(db, 'messages'), {
      sender: 'User1',  // Replace with actual sender
      content: message,
      timestamp: new Date().toISOString(),
    });
    console.log('Message sent to Firebase:', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

// Listen for new messages in real-time
export const listenForMessages = (callback) => {
  const q = query(collection(db, 'messages'), orderBy('timestamp'));
  return onSnapshot(q, (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push(doc.data());
    });
    callback(messages);
  });
};
