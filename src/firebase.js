 // Import the functions you need from the Firebase SDKs
 import { initializeApp } from "firebase/app";
 import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore';
 import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
 
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
 
 // Function to send a message to Firestore (handles text messages and files)
 export const sendMessageToFirebase = async (message, fileURL = null) => {
   if (!message && !fileURL) {
     console.error("Message or file must be provided.");
     return;
   }
 
   try {
     // Save message and optional file URL to Firestore
     const docRef = await addDoc(collection(db, 'messages'), {
       sender: 'User1',  // Replace with actual sender information if available
       content: message || "", // Save empty string if no message but there is a file
       fileURL: fileURL || null, // Save file URL if any
       timestamp: new Date().toISOString(), // Save current timestamp
     });
     console.log('Message sent to Firebase with ID:', docRef.id);
   } catch (error) {
     console.error('Error sending message to Firebase:', error);
   }
 };
 
 // Function to listen for incoming messages
 export const listenForMessages = (callback) => {
   const q = query(collection(db, 'messages'), orderBy('timestamp'));
   return onSnapshot(q, (querySnapshot) => {
     const messages = [];
     querySnapshot.forEach((doc) => {
       messages.push({ id: doc.id, ...doc.data() });
     });
     console.log('Received messages:', messages); // Debug log to ensure messages are being received
     callback(messages);
   });
 };
 
 // Function to upload a file (image/PDF) to Firebase Storage
 export const uploadFileToFirebase = async (file) => {
   try {
    const fileRef = ref(storage, `files/${file.name}`);
    await uploadBytes(fileRef, file);
     const fileURL = await getDownloadURL(fileRef);
     console.log('File uploaded, URL:', fileURL); // Debug log to check if the file is uploaded
     return fileURL;
   } catch (error) {
     console.error('Error uploading file to Firebase:', error);
     throw error;
   }
 };
 
 // Function to edit a message in Firestore
 export const editMessageInFirebase = async (messageId, newContent) => {
   try {
     const messageRef = doc(db, 'messages', messageId);
 
     // Update the message content
     await updateDoc(messageRef, {
       content: newContent,
     });
   } catch (error) {
     console.error('Error editing message:', error);
   }
 };
 
 // Function to delete a message from Firestore
 export const deleteMessageFromFirebase = async (messageId) => {
   try {
     const messageRef = doc(db, 'messages', messageId);
 
     // Delete the message from Firestore
     await deleteDoc(messageRef);
   } catch (error) {
     console.error('Error deleting message:', error);
   }
 };
 
 export { db, storage };