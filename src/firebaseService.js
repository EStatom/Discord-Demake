import { collection, getDoc, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase'; 

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
