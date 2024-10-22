import React, {useState, useEffect} from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Landing from './pages/components/Landing';
import Sidebar from './Sidebar';
import ChannelList from './pages/components/ChannelList';
import Login from './pages/components/Login';
import SignUp from './pages/components/SignUp';
import ForgotPassword from './pages/components/ForgotPassword';
import ChatApp from './pages/components/ChatApp';
import AccountInfo from './pages/components/AccountInfo';
import ProfileEdit from './pages/components/ProfileEdit';
import {doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

import bannerImage from './pages/images/image-1.jpg';
import profileImage from './pages/images/profile-1.jpeg';

function App() {
    const [serverDetails, setServerDetails] = useState(null);
    const [selectedChannel, setSelectedChannel] = useState('general');

    const [profileData, setProfileData] = useState({
        displayName: 'Khan Mahmud',
        username: 'khan_latech',
        email: '******@email.latech.edu',
        phoneNumber: '******5630',
        pronouns: '',
        avatar: profileImage,
        banner: bannerImage,
        joinedDate: 'January 1, 2020',
        friendsList: [
          {
            name: 'Friend 1',
            avatar: './images/friend1.jpg',
            status: 'online',
          },
          {
            name: 'Friend 2',
            avatar: './images/friend2.jpg',
            status: 'offline',
          },
        ],
      });

    const handleProfileChange = (updatedData) => {
        setProfileData({
            ...profileData,
            ...updatedData,
        });
    };

    // Use this to help or url processing, its an extension of our Routing System
    const navigate = useNavigate();

    const fetchServerDetails = async (serverId) => {
        // First lets make sure the serverId is not null or undefined
        if(serverId) {
            const serverDoc = doc(db, 'servers', serverId);
            // Getting a Snapshot of the data
            const serverSnapshot = await getDoc(serverDoc);
            // Let's make sure it actually pulled information
            if (serverSnapshot.exists()) {
                setServerDetails({
                    id: serverId,  // Ensure serverId is set properly
                    ...serverSnapshot.data()  // Spread the server data
                });
            } else {
                // No info, that means something is wrong
                console.error('NO SUCH SERVER!');
                setServerDetails(null); // Clear the server details if the server does not exist
                setSelectedChannel(null);
            }
        }
    };

    // Handler to set the serverID and update the URL
    const handleSelectedServer = (serverId) => {
        navigate(`server/${serverId}`);
        fetchServerDetails(serverId);
    };

    const handleSelectedChannel = (serverId, channelId) => {
        setSelectedChannel(channelId); 
        navigate(`/server/${serverId}/channel/${channelId}`);
    }

    

    return (
        <div style={{ display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh' }}>
            {/* Sidebar on the left */}
            <Sidebar onSelectServer={handleSelectedServer} />

            {/* Channel list in the middle */}
            {serverDetails && (
                <ChannelList serverDetails={serverDetails} onSelectChannel={handleSelectedChannel} />
            )}

            {/* Chat on the right */}
            {selectedChannel && serverDetails && (
                <ChatApp serverDetails={serverDetails} selectedChannel={selectedChannel} />
            )}

            {/* Routes for other pages */}
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Signup" element={<SignUp />} />
                <Route path="/ForgotPassword" element={<ForgotPassword />} />
                <Route path="/AccountInfo" element={<AccountInfo />} />
                <Route path="/ProfileEdit" element={<ProfileEdit />} />
            </Routes>
        </div>
    );
}


export default App;
