import React, {useState, useEffect} from 'react';
import { Route, Routes, useNavigate, Navigate, useLocation } from 'react-router-dom';
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
import UserList from './pages/components/UserList';
import {doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { fetchUserData } from './firebaseService';
import { updateUserLocation } from './firebaseService';

function App() {
    const [serverDetails, setServerDetails] = useState(null);
    const [selectedChannel, setSelectedChannel] = useState('general');
    const [user, setUser] = useState(null);  
    const [userData, setUserData] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const isAuthOrProfileRoute = ['/login', '/signup', '/forgotpassword', '/profileedit'].includes(location.pathname);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser || null);
            if (currentUser) {
                // Fetch user data
                const data = await fetchUserData(currentUser.uid);
                setUserData(data);

                // Update user location only once upon login
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        updateUserLocation(currentUser.uid, latitude, longitude);
                    },
                    (error) => {
                        console.error("Geolocation error:", error);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0,
                    }
                );
            } else {
                setUser(null);
                setUserData(null);
            }
        });
        return unsubscribe;
    }, []);
    
    const fetchServerDetails = async (serverId) => {
        // First lets make sure the serverId is not null or undefined
        if(serverId) {
            const serverDoc = doc(db, 'servers', serverId);
            // Getting a Snapshot of the data
            const serverSnapshot = await getDoc(serverDoc);
            // Let's make sure it actually pulled information
            const serverData = serverSnapshot.data();
            if (serverSnapshot.exists()) {
                setServerDetails({
                    id: serverId,  // Ensure serverId is set properly
                    ...serverData,  // Spread the server data
                    users: serverData.Users || [],
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
            {/* Conditionally Render Sidebar and Main Components */}
            {user && !isAuthOrProfileRoute && <Sidebar onSelectServer={handleSelectedServer} />}
            {user && !isAuthOrProfileRoute && serverDetails && (
                <ChannelList 
                    serverDetails={serverDetails} 
                    onSelectChannel={handleSelectedChannel} 
                    userId={user?.uid}
                    userData={userData}
                />
            )}
            {user && !isAuthOrProfileRoute && selectedChannel && serverDetails && (
                <ChatApp 
                    serverDetails={serverDetails} 
                    selectedChannelId={selectedChannel} 
                    userData={userData}
                />
            )}
            {user && !isAuthOrProfileRoute && serverDetails && (
                <UserList userIds={serverDetails.users} /> 
            )}

            {/* Route Definitions */}
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
                <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/" replace />} />
                <Route path="/forgotpassword" element={!user ? <ForgotPassword /> : <Navigate to="/" replace />} />

                {/* Authenticated Routes */}
                {user ? (
                    <>
                        <Route path="/" element={<Landing />} />
                        <Route path="/accountinfo" element={<AccountInfo />} />
                        <Route path="/profileedit" element={<ProfileEdit />} />
                    </>
                ) : (
                    // Redirect to login if not authenticated
                    <Route path="*" element={<Navigate to="/login" replace />} />
                )}
            </Routes>
        </div>
    );
}


export default App;
