import React, {useState, useEffect} from 'react';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
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
import { fetchUserData } from './firebaseService';

function App() {
    const [serverDetails, setServerDetails] = useState(null);
    const [selectedChannel, setSelectedChannel] = useState('general');
    const [user, setUser] = useState(null);  
    const [userData, setUserData] = useState(null);

    const hardcodedUserId = 'wgb7YJv1bGQUVn6z48tIzjGyHBF2';


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                fetchUserData(currentUser.uid).then((data) => {
                    console.log("Fetched user data:", data);  // Debugging log
                    setUserData(data);  // Ensures userData is set properly
                });
            } else {
                setUserData(null);  // Reset userData if no currentUser
            }
        });
        return unsubscribe;
    }, []);

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
            {!user ? (
                <Routes>
                    <Route path="/login" element={<Login setUser={setUser} />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/forgotpassword" element={<ForgotPassword />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />  {/* Redirect to /login by default */}
                </Routes>
            ) : (
                <>
                    <Sidebar onSelectServer={handleSelectedServer} />
                    {serverDetails && (
                        <ChannelList 
                            serverDetails={serverDetails} 
                            onSelectChannel={handleSelectedChannel} 
                            userId={user?.uid}
                            userData={userData}
                        />
                    )}
                    {selectedChannel && serverDetails && (
                        <ChatApp 
                            serverDetails={serverDetails} 
                            selectedChannelId={selectedChannel} 
                            userData={userData}
                        />
                    )}
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/accountinfo" element={<AccountInfo />} />
                        <Route path="/profileedit" element={<ProfileEdit />} />
                    </Routes>
                </>
            )}
        </div>
    );
}


export default App;
