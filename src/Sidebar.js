import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc ,arrayUnion, arrayRemove, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import sidebarStyles from './SidebarStyles';
import { getAuth, onAuthStateChanged } from "firebase/auth";



const Sidebar = ({ onSelectServer }) => {

const [servers, setServers] = useState([]);
const [contextMenu, setContextMenu] = useState({ visible: false, serverId: null, x: 0, y: 0 });
const [uid, setUid] = useState(null);

const auth = getAuth();


useEffect(() => {
  const auth = getAuth();
  const userId = onAuthStateChanged(auth, (user) => {
    if (user) {
      setUid(user.uid);
    }
  });

  return () => userId(); 
}, []);


useEffect(() => {
  if (uid) {  // Only fetch servers if uid is set
    fetchServers();
  }
}, [uid]);

  const fetchServers = async () => {
      const userDoc = await getDoc(doc(db, 'users', uid));
      const userServers = userDoc.data().Servers  || [];
      const serverList = await Promise.all(
        userServers.map(async (id) => {
          const serverDocRef = doc(db, 'servers', id);
          const serverDoc = await getDoc(serverDocRef);
          return { id: serverDoc.id, ...serverDoc.data()};
        })
      );
      setServers(serverList);
      };



  
  //variables for handling hover and active styles
  const [hoveredIndex, setHoveredIndex] = useState(null); 
  const [activeIndex, setActiveIndex] = useState(null);   

  const handleServerClick = (index, serverId) => {
    setActiveIndex(index); 
    onSelectServer(serverId); 
  };

// Right-click menu
  const handleContextMenu = (e, serverId) => {
    e.preventDefault(); // Prevent the default context menu
    setContextMenu({ visible: true, serverId, x: e.pageX, y: e.pageY });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };


  const handleLeaveServer = async () => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { Servers: arrayRemove(contextMenu.serverId) });
    fetchServers(); // Refresh the server list
    handleCloseContextMenu();
  };




 //Pop up boxes
    const [isMainPopupVisible, setIsMainPopupVisible] = useState(false); 
    const [isJoinServerPopupVisible, setIsJoinServerPopupVisible] = useState(false);
    const [isCreateServerPopupVisible, setIsCreateServerPopupVisible] = useState(false);    
    const [isServerNameUpdatePopupVisible, setIsServerNameUpdatePopupVisible] = useState(false);

    const [inputJoinServer, setInputJoinServer] = useState('');
    const [newServerName, setNewServerName] = useState('');
    const [newServerId, setNewServerId] = useState('');
    const [nameUpdate, setNameUpdate] = useState('');

    const [joinServerError, setJoinServerError] = useState('');  
    const [createServerError, setCreateServerError] = useState('');  

    const handleOpenMainPopup = () => setIsMainPopupVisible(true);
    const handleCloseMainPopup = () => setIsMainPopupVisible(false);

    const handleOpenJoinServerPopup = () => {
      setIsMainPopupVisible(false);
      setIsJoinServerPopupVisible(true);
    };

    const handleCloseJoinServerPopup = () => {
      setIsJoinServerPopupVisible(false);
      setInputJoinServer('');
    };

    const handleOpenCreateServerPopup = () => {
      setIsMainPopupVisible(false);
      setIsCreateServerPopupVisible(true);
    };

    const handleCloseCreateServerPopup = () => {
      setIsCreateServerPopupVisible(false);
      setNewServerName('');
      setNewServerId('');
      setCreateServerError('');
    };

    const handleOpenServerNameUpdatePopup = () => {
      setContextMenu({ ...contextMenu, visible: false });
      setIsServerNameUpdatePopupVisible(true);
    };
  
    const handleCloseServerNameUpdatePopup = () => {
      setIsServerNameUpdatePopupVisible(false);
      setNameUpdate('');
    };

    const handleInputJoinServerChange = (e) => setInputJoinServer(e.target.value);
    const handleNewServerNameChange = (e) => setNewServerName(e.target.value);
    const handleNewServerIdChange = (e) => setNewServerId(e.target.value);
    const handleNameUpdateChange = (e) => setNameUpdate(e.target.value);

    const checkIfServerExistsJoin = async () => {
      const checkIfServerExistsJoinRef = doc(db, 'servers', inputJoinServer);
      const checkIfServerExistsJoinSnap = await getDoc(checkIfServerExistsJoinRef);
      return checkIfServerExistsJoinSnap.exists();
    };

    const checkIfServerExistsCreate = async () => {
      const checkIfServerExistsCreateRef = doc(db, 'servers', newServerId);
      const checkIfServerExistsCreateSnap = await getDoc(checkIfServerExistsCreateRef);
      return checkIfServerExistsCreateSnap.exists();
    };

    const handleSubmitJoinServer = async(e) => {
      e.preventDefault();
      const joinRef = doc(db, 'users', uid);

      try {
        const serverExists = await checkIfServerExistsJoin();

        if (!serverExists) {
          setJoinServerError('Sever not found. Please enter a valid Server ID');
          return;
        }

        await updateDoc(joinRef, {Servers: arrayUnion(inputJoinServer)});
        setInputJoinServer('');
        setJoinServerError('');
        handleCloseJoinServerPopup();
        fetchServers();
      } catch(error) {
        console.error('Error joining server:', error);
      }
    };

    
    const handleSubmitCreateServer = async (e) => {
      e.preventDefault();

      const randomImageNumber = Math.floor(Math.random() * 50) + 1;

      try {
        const serverExists2 = await checkIfServerExistsCreate();

        if (serverExists2) {
          setCreateServerError('Server ID already exists.  Try a different ID.');
          return;
        } else {
          await setDoc(doc(db, 'servers', newServerId),
          {description:"Default", 
           image:`https://unsplash.it/600/400?image=${randomImageNumber}`,
           name: newServerName})

           await setDoc(doc(db, 'servers', newServerId, 'channels', 'Channel1'), {name: "Channel1"});
          
           const createRef = doc(db, 'users', uid);
           await updateDoc(createRef, {Servers: arrayUnion(newServerId)});
        }
      handleCloseCreateServerPopup();
      fetchServers();
      }catch(error) {
        console.error('Error joining server:', error);
        setCreateServerError('Failed to create the server. Please try again');
      }
    };

    const handleServerNameUpdate = async() => {
      await updateDoc(doc(db, 'servers', contextMenu.serverId), {name: nameUpdate})
    };




  return (
    <div style={sidebarStyles.sidebar}
    onContextMenu={(e) => {
      e.preventDefault(); //turns off standard right click menu
    }}
    >
      {servers.map((server, index) => (
        <div
          key={server.id}
          style={
            hoveredIndex === index
              ? sidebarStyles.iconContainerHover
              : activeIndex === index
              ? sidebarStyles.iconContainerActive
              : sidebarStyles.iconContainer
          }  //changes style based on the idex of the div container and hovered or active
          onClick={() => handleServerClick(index, server.id)}  //registers as clicked
          onMouseEnter={() => setHoveredIndex(index)}  //registers as hovered
          onMouseLeave={() => setHoveredIndex(null)}
          onContextMenu={(e) => handleContextMenu(e, server.id)}
        >
          <img
            src={server.image}
            style={
            hoveredIndex === index 
              ? sidebarStyles.serverIconHover
              : activeIndex === index
              ? sidebarStyles.serverIconHover
              : sidebarStyles.serverIcon}  //changes sytle of the icon to match the container.  We can do something similar with active if we want to match discord more closely
            alt={server.name}
          />
        </div>
      ))}


{contextMenu.visible && (
        <div
          style={{
            position: 'absolute',
            top: contextMenu.y,
            left: contextMenu.x,
            background: '#2F3136',
            zIndex: 1000,
            borderRadius: '5%'
          }}
          onMouseLeave={handleCloseContextMenu} // Close menu on mouse leave
        >
          <div onClick={handleOpenServerNameUpdatePopup} style={{ padding: '8px', cursor: 'pointer' }}>
            Change Name
          </div>
          <div onClick={handleLeaveServer} style={{ padding: '8px', cursor: 'pointer', color: 'red' }}>
            Leave Server
          </div>
        </div>
      )}

      <div
        style={hoveredIndex === 'joinServer' ? sidebarStyles.iconContainerHover : sidebarStyles.iconContainer}
        onMouseEnter={() => setHoveredIndex('joinServer')}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <button style={sidebarStyles.serverIcon} onClick={handleOpenMainPopup}>
          <span style={sidebarStyles.icon}>➕</span>  
        </button>
      </div>

      {isMainPopupVisible && (
        <div style={sidebarStyles.popup}>
          <div style={sidebarStyles.popupContent}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={handleOpenJoinServerPopup} style={sidebarStyles.submitButton}>
              Join Server
            </button>
            <button onClick={handleOpenCreateServerPopup} style={sidebarStyles.submitButton}>
              Create Server
            </button>
            <button onClick={handleCloseMainPopup} style={sidebarStyles.closeButton}>
              Close
            </button>
            </div>
          </div>
        </div>
      )}

      {isJoinServerPopupVisible && (
        <div style={sidebarStyles.popup}>
          <div style={sidebarStyles.popupContent}>
            <h2>Enter Server ID</h2>
            <form onSubmit={handleSubmitJoinServer}>
              <input
                type="text"

                value={inputJoinServer}
                onChange={handleInputJoinServerChange}
                style={sidebarStyles.input}
                placeholder="Server ID"
              />
              {joinServerError && <p style={{color: 'red'}}>{joinServerError}</p>}
              <div style={sidebarStyles.buttonContainer}>
                <button type="submit" style={sidebarStyles.submitButton}>
                  Submit
                </button>
                <button type="button" style={sidebarStyles.closeButton} onClick={handleCloseJoinServerPopup}>
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

{isCreateServerPopupVisible && (
        <div style={sidebarStyles.popup}>
          <div style={sidebarStyles.popupContent}>
            <h2>Create New Server</h2>
            <form onSubmit={handleSubmitCreateServer}>
              <input
                type="text"
                value={newServerName}
                onChange={handleNewServerNameChange}
                style={sidebarStyles.input}
                placeholder="Server Name"
              />
              <input
                type="text"
                value={newServerId}
                onChange={handleNewServerIdChange}
                style={sidebarStyles.input}
                placeholder="Server ID"
              />
              {createServerError && <p style={{ color: 'red' }}>{createServerError}</p>}
              <div style={sidebarStyles.buttonContainer}>
                <button type="submit" style={sidebarStyles.submitButton}>
                  Create
                </button>
                <button type="button" onClick={handleCloseCreateServerPopup} style={sidebarStyles.closeButton}>
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

{isServerNameUpdatePopupVisible && (
        <div style={sidebarStyles.popup}>
          <div style={sidebarStyles.popupContent}>
            <h2>New Server Name</h2>
            <form onSubmit={handleServerNameUpdate}>
              <input
                type="text"
                value={nameUpdate}
                onChange={handleNameUpdateChange}
                style={sidebarStyles.input}
                placeholder="New Name"
              />
              <div style={sidebarStyles.buttonContainer}>
                <button type="submit" style={sidebarStyles.submitButton}>
                  Update
                </button>
                <button type="button" onClick={handleCloseServerNameUpdatePopup} style={sidebarStyles.closeButton}>
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>

    
  );
};

export default Sidebar;