import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
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
