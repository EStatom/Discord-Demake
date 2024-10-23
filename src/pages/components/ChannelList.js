import React, { useEffect, useState } from 'react';
import { Settings, Plus, Trash, User } from 'lucide-react';
import { fetchChannels, createChannelInServer, deleteChannelFromServer, fetchUserData } from './../../firebaseService'; 
import AddChannelModal from './AddChannelModal';
import ConfirmationModal from './ConfirmationModal';
import './../styles/ChannelList.css'; 

const ChannelList = ({ serverDetails, onSelectChannel, userId }) => {
    const [channels, setChannels] = useState([]);
    const [activeChannel, setActiveChannel] = useState(null);
    const [isAddChannelModalOpen, setIsAddChannelModalOpen] = useState(false); 
    const [isDeleteChannelModalOpen, setIsDeleteChannelModalOpen] = useState(false); 
    const [channelToDelete, setChannelToDelete] = useState(null);
    const [userData, setUserData] = useState(null);

    const hardcodedUserId = 'gsF4jZRJisRJixh7JX0lMOSsOmD3';

    useEffect(() => {
        if (serverDetails) {
            fetchChannels(serverDetails.id).then(fetchedChannels => {
                setChannels(fetchedChannels);

                if (fetchedChannels.length > 0) {
                    setActiveChannel(fetchedChannels[0].id);  // Set the first channel as active
                    onSelectChannel(serverDetails.id, fetchedChannels[0].id);  // Select the first channel
                }
            });
        }
        if (hardcodedUserId) {
            fetchUserData(hardcodedUserId).then((data) => {
                if (data) {
                    console.log("Full user document fetched from Firebase:", data);  // Log full user data
                    setUserData(data);  // Set the user data in the state
                } else {
                    console.log("No user data found for userId:", hardcodedUserId);
                }
            }).catch(error => {
                console.error("Error fetching user data:", error);
            });
        }
    }, [serverDetails, userId]);

    const handleSelectChannel = (channelId) => {
        setActiveChannel(channelId);  // Set the selected channel as active
        onSelectChannel(serverDetails.id, channelId);  
    };

    const handleAddChannel = async (channelName, clearInput) => {
        if (channelName.trim() !== '') {
            await createChannelInServer(serverDetails.id, channelName, channelName);  
            setIsAddChannelModalOpen(false);  
            // Refetch channels after adding
            fetchChannels(serverDetails.id).then(fetchedChannels => {
                setChannels(fetchedChannels);
            });
            clearInput();
        }
    };

    const handleDeleteChannel = async () => {
        if (channelToDelete) {
            await deleteChannelFromServer(serverDetails.id, channelToDelete);  
            setIsDeleteChannelModalOpen(false);
            setChannelToDelete(null);
            // Refetch channels after deletion
            fetchChannels(serverDetails.id).then(fetchedChannels => {
                setChannels(fetchedChannels);
            });
        }
    };

    const openDeleteModal = (channelId) => {
        setChannelToDelete(channelId);
        setIsDeleteChannelModalOpen(true);  
    };

    const abbreviateUserId = (id, length = 12) => {
        if (id.length > length) {
            return id.slice(0, length) + '...'; 
        }
        return id;  
    };

    return (
        <div className="channel-list-container">
            <div className="server-header">
                <h2>{serverDetails.name}</h2>
                <Settings className="settings-icon" />
            </div>
            <ul>
                {channels.map((channel) => (
                    <li 
                        key={channel.id} 
                        className={`channel-item ${activeChannel === channel.id ? 'active-channel' : ''}`}  
                        onClick={() => handleSelectChannel(channel.id)}  
                    >
                        <span>#{channel.name}</span>
                        <button onClick={() => openDeleteModal(channel.id)} className="delete-channel-button">
                            <Trash size={14} />
                        </button>
                    </li>
                ))}
                {/* Plus button for adding a new channel */}
                <li>
                    <button onClick={() => setIsAddChannelModalOpen(true)} className="add-channel-button">
                        <Plus /> Add Channel
                    </button>
                </li>
            </ul>

            {/* User Profile Section */}
            <div className="user-profile-section">
                <div className="user-info">
                    <img 
                        src={userData?.profilePicture || 'https://via.placeholder.com/40'}  // Use placeholder if no image
                        alt="User Avatar"
                        className="user-avatar"
                    />
                    <div className="user-details">
                        <span className="username">{userData?.displayName || 'Username'}</span>
                        <span className="user-id">#{abbreviateUserId(hardcodedUserId)}</span>
                    </div>
                </div>
                <Settings className="user-settings-icon" />  
            </div>

            {/* Add Channel Modal */}
            <AddChannelModal
                isOpen={isAddChannelModalOpen} 
                onConfirm={handleAddChannel} 
                onCancel={() => setIsAddChannelModalOpen(false)}  
            />

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isDeleteChannelModalOpen} 
                message="Are you sure you want to delete this channel?"
                onConfirm={handleDeleteChannel}
                onCancel={() => setIsDeleteChannelModalOpen(false)} 
            />
        </div>
    );
};

export default ChannelList;


