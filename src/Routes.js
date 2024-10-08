import React, {useState, useEffect} from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Ayman from './pages/Ayman';
import Landing from './pages/Landing';
import Sidebar from './Sidebar';
import Login from './pages/components/Login';
import {doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

function App() {
    const [serverDetails, setServerDetails] = useState(null);

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
                //Setting of State
                setServerDetails(serverSnapshot.data());
            } else {
                // No info, that means something is wrong
                console.error('NO SUCH SERVER!');
                setServerDetails(null); // Clear the server details if the server does not exist
            }
        }
    };

    // Handler to set the serverID and update the URL
    const handleSelectedServer = (serverId) => {
        navigate(`server/${serverId}`);
        fetchServerDetails(serverId);
    };

  return (
        <div style={{display: 'flex'}}>
            <Sidebar onSelectServer={handleSelectedServer} />
            <div className="server-content">
                <Routes>
                    {/* Route for displaying server details; ':serverId' tells the server this is a variable */}
                    <Route path="/server/:serverId" element={<Ayman serverDetails={serverDetails} />}/>
                    {/* Default Route */}
                    <Route path="/" element={<Landing/>}/>
                    {/* Khans pages */}
                    <Route path='/Login' element={<Login />}/>
                </Routes>
            </div>
        </div>
    );
}


export default App;
