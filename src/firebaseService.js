import { collection, getDoc, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { addDoc, query, orderBy, onSnapshot, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

const fetchChannels = async (serverId) => {
    try {
        const channelsRef = collection(db, 'servers', serverId, 'channels');

        const channelSnapshot = await getDocs(channelsRef);

        const channels = channelSnapshot.docs.map(doc => ({
            id: doc.id,  
            ...doc.data(),  
        }));
        
        return channels;
    } catch (error) {
        console.error("Error fetching channels: ", error);
        return [];
    }
};

export { fetchChannels };

const fetchUserData = async (userId) => {
    try {
        console.log("Fetching user data for userId:", userId);
        const userRef = doc(db, 'users', userId);  // Adjust 'users' to your collection
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            console.log("Full user document:", userSnap.data());  // Log the entire document
            const userData = userSnap.data().userData;  // Access the userData map
            return userData;
        } else {
            console.log('No such user in Firestore!');
            return null;
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
};


export { fetchUserData };


const createChannelInServer = async (serverId, channelId, channelName) => {
    try {
        const channelRef = doc(db, 'servers', serverId, 'channels', channelId);
        await setDoc(channelRef, {
            name: channelName,
        });
        console.log(`Channel "${channelName}" added to server "${serverId}"`);
    } catch (error) {
        console.error("Error creating channel:", error);
    }
};

export { createChannelInServer };

const deleteChannelFromServer = async (serverId, channelId) => {
    try {
        // Reference to the channel document in the channels subcollection
        const channelRef = doc(db, 'servers', serverId, 'channels', channelId);
        
        await deleteDoc(channelRef);
        
        console.log(`Channel "${channelId}" deleted from server "${serverId}"`);
    } catch (error) {
        console.error("Error deleting channel: ", error);
    }
};

export { deleteChannelFromServer };

// Function to send a message to Firestore (handles text messages and files)
export const sendMessageToFirebase = async (message, fileURL, serverId, channelId, userId) => {
    if (!message && !fileURL) {
      console.error("Message or file must be provided.");
      return;
    }
  
    try {
        const messagesRef = collection(db, `servers/${serverId}/channels/${channelId}/messages`);
        // Save message and optional file URL to Firestore
        const docRef = await addDoc(messagesRef, {
            sender: userId,  // Replace with actual sender information if available
            content: message || "", // Save empty string if no message but there is a file
            fileURL: fileURL || null, // Save file URL if any
            timestamp: new Date().toISOString(), // Save current timestamp
        });
        console.log('Message sent to Firebase with ID:', docRef.id);
    } catch (error) {
      console.error('Error sending message to Firebase:', error);
    }
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




