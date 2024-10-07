// Sidebar.js
import React, {useState, useEffect} from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import './Sidebar.css'; // Create a separate CSS file to include the styles

const Sidebar = ({onSelectServer}) => {
    const [servers, setServers] = useState([]);

    // UseEffect is basically like a "Call this and wait for everything to come back and save before moving forward"
    useEffect(() => {
        //Fetching the server Data from the firebase website, currently collects every server
        const fetchServers = async () => {
            //Getting the collection
            const serverCollection = collection(db, 'servers');
            //Getting a snapshot of the database (the information in it at this point in time)
            const serverSnapshot = await getDocs(serverCollection);
            //Getting a list of servers from the snapshot
            const serverList = serverSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
            //Now we need to set out frontend variables to this data
            setServers(serverList);
        }

        fetchServers();
    }, []); 

  return (
    <div className="sidebar">
        {servers.map((server) => (
            <div key={server.id} className="icon-container" onClick={() => onSelectServer(server.id)}>
                <img src={server.image} className="server-icon" alt={server.name} />
            </div>
        ))}

    </div>
  );
};

export default Sidebar;
