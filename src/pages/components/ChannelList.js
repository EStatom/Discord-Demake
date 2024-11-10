import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Plus, Trash } from 'lucide-react';
import { fetchChannels, createChannelInServer, deleteChannelFromServer, fetchUserData } from './../../firebaseService'; 
import { signOut } from "firebase/auth";
import { auth } from './../../firebase';
import AddChannelModal from './AddChannelModal';
import ConfirmationModal from './ConfirmationModal';
import './../styles/ChannelList.css'; 

const ChannelList = ({ serverDetails, onSelectChannel, userId, userData }) => {
    const [channels, setChannels] = useState([]);
    const [activeChannel, setActiveChannel] = useState(null);
    const [isAddChannelModalOpen, setIsAddChannelModalOpen] = useState(false); 
    const [isDeleteChannelModalOpen, setIsDeleteChannelModalOpen] = useState(false); 
    const [channelToDelete, setChannelToDelete] = useState(null);
    const [isLogoutMenuOpen, setIsLogoutMenuOpen] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        if (serverDetails) {
            fetchChannels(serverDetails.id).then(fetchedChannels => {
                setChannels(fetchedChannels);

                if (!activeChannel && fetchedChannels.length > 0) {
                    const firstChannelId = fetchedChannels[0].id;
                    setActiveChannel(firstChannelId);  // Set the first channel as active
                    onSelectChannel(serverDetails.id, fetchedChannels[0].id);  // Select the first channel
                }
            });
        }
    }, [serverDetails, onSelectChannel]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log("User has logged out");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const handleEditProfile = () => {
        setIsLogoutMenuOpen(false); 
        navigate("/accountinfo"); 
    };

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

    console.log("User data in ChannelList:", userData);

    return (
        <div className="channel-list-container">
            <div className="server-header">
                <h2>{serverDetails.name}</h2>
            </div>
            <ul>
                {channels.map((channel) => (
                    <li 
                        key={channel.id} 
                        className={`channel-item ${activeChannel === channel.id ? 'active-channel' : ''}`}  
                        onClick={() => handleSelectChannel(channel.id)}  
                    >
                        <span>#{channel.name}</span>
                        {Array.isArray(serverDetails.Admin) && serverDetails.Admin.includes(userId) ? 
                        <button onClick={() => openDeleteModal(channel.id)} className="delete-channel-button">
                            <Trash size={14} />
                        </button>
                        : null }
                    </li>
                ))}
                {/* Plus button for adding a new channel */}
                {Array.isArray(serverDetails.Admin) && serverDetails.Admin.includes(userId) ? 
                <li>
                    <button onClick={() => setIsAddChannelModalOpen(true)} className="add-channel-button">
                        <Plus /> Add Channel
                    </button>
                </li> 
                : null}
                
            </ul>

            {/* User Profile Section */}
            <div className="user-profile-section">
                <div className="user-info">
                    <img 
                        // src={userData?.profilePicture || 'https://via.placeholder.com/40'}  // Use placeholder if no image
                        src={userData?.profilePicture || 'https://via.placeholder.com/40'}  // Use placeholder if no image
                        alt="User Avatar"
                        className="user-avatar"
                    />
                    <div className="user-details">
                        <span className="username">{userData?.username || 'Username'}</span>
                    </div>
                </div>
                <Settings className="user-settings-icon"  
                onClick={() => setIsLogoutMenuOpen(!isLogoutMenuOpen)}/> 
            

            {/* Logout Menu */}
            {isLogoutMenuOpen && (
                    <div className="logout-menu">
                        {/* <button onClick={handleEditProfile} className="edit-profile-button">Edit Profile</button> */}
                        <button onClick={handleEditProfile} className="edit-profile-button">Account Info</button>
                        <button onClick={handleLogout} className="logout-button">Log Out</button>
                    </div>
                )}
            </div>

             {/* Add Channel Modal */}
             <AddChannelModal
                isOpen={isAddChannelModalOpen} 
                onConfirm={async (channelName, clearInput) => {
                    if (channelName.trim() !== '') {
                        await createChannelInServer(serverDetails.id, channelName, channelName);  
                        setIsAddChannelModalOpen(false);
                        fetchChannels(serverDetails.id).then(setChannels);
                        clearInput();
                    }
                }}
                onCancel={() => setIsAddChannelModalOpen(false)}  
            />

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


