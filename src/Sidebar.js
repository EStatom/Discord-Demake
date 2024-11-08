import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc ,arrayUnion, arrayRemove, setDoc, deleteDoc, getDocs, collection} from 'firebase/firestore';
import { db } from './firebase';
import sidebarStyles from './SidebarStyles';
import { getAuth, onAuthStateChanged } from "firebase/auth";



const Sidebar = ({ onSelectServer }) => {

const [servers, setServers] = useState([]);
const [contextMenu, setContextMenu] = useState({ visible: false, serverId: null, x: 0, y: 0 });
const [uid, setUid] = useState(null);


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

//clicks on Geoserver when page initially renders
useEffect(() => {
  handleServerClick('a', 'GeoServer');
}, []); 

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
  const handleContextMenu = (e, index, serverId) => {
    e.preventDefault(); // Prevent the default context menu
    setContextMenu({ visible: true, serverId, index, x: e.pageX, y: e.pageY });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };




 //Pop up boxes
    const [isMainPopupVisible, setIsMainPopupVisible] = useState(false); 
    const [isJoinServerPopupVisible, setIsJoinServerPopupVisible] = useState(false);
    const [isCreateServerPopupVisible, setIsCreateServerPopupVisible] = useState(false);    
    const [isServerRenamePopupVisible, setIsServerRenamePopupVisible] = useState(false);

    const [inputJoinServer, setInputJoinServer] = useState('');
    const [newServerName, setNewServerName] = useState('');
    const [newServerId, setNewServerId] = useState('');
    const [Rename, setRename] = useState('');

    const [joinServerError, setJoinServerError] = useState('');  
    const [createServerError, setCreateServerError] = useState('');  
    const [renameError, setRenameError] = useState('');

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

    const handleOpenServerRenamePopup = async() => {
      setContextMenu({ ...contextMenu, visible: false });
      // Fetch the server document to check if the user is an admin
      const serverDocRef = doc(db, 'servers', contextMenu.serverId);
      const serverDoc = await getDoc(serverDocRef);
      const serverData = serverDoc.data();
      if (serverData.Admin && serverData.Admin.includes(uid)) {
        // User is an admin, proceed with renaming
        setIsServerRenamePopupVisible(true);
      } else {
        alert("You do not have permission to rename this server.");
      }
    };
  
    const handleCloseServerRenamePopup = () => {
      setIsServerRenamePopupVisible(false);
      setRename('');
      setRenameError('');
    };

    const handleInputJoinServerChange = (e) => setInputJoinServer(e.target.value);
    const handleNewServerNameChange = (e) => setNewServerName(e.target.value);
    const handleNewServerIdChange = (e) => setNewServerId(e.target.value);
    const handleRenameChange = (e) => setRename(e.target.value);

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

  //Functions tied to pop up boxes  
    const handleSubmitJoinServer = async(e) => {
      e.preventDefault();
      const joinRef = doc(db, 'users', uid);

      try {
        const serverExists = await checkIfServerExistsJoin();

        if (!serverExists) {
          setJoinServerError('Sever not found. Please enter a valid Server ID');
          return;
        }
        //Register Server to the user's profile
        await updateDoc(joinRef, {Servers: arrayUnion(inputJoinServer)});

        //Register User to the Server's member list.
        await updateDoc(doc(db, 'servers', inputJoinServer), { Users: arrayUnion(uid) });

        setInputJoinServer('');
        setJoinServerError('');
        handleCloseJoinServerPopup();
        fetchServers();

      // Clicking the new server by assuming the new server is added to the end of the servers list
      const newIndex = servers.length;
      handleServerClick(newIndex, inputJoinServer);

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
          try {
            // Create the server document with initial fields
            await setDoc(doc(db, 'servers', newServerId), {
              description: "Default",
              image: `https://unsplash.it/600/400?image=${randomImageNumber}`,
              name: newServerName
            });
          
            // Default Channel on Server Creation
            await setDoc(doc(db, 'servers', newServerId, 'channels', 'Channel1'), { name: "Channel1" });
          
            // Add the Server to the user's profile in the database
            const userRef = doc(db, 'users', uid);
            await updateDoc(userRef, { Servers: arrayUnion(newServerId) });
          
            // Add the creator as an admin to the server
            await updateDoc(doc(db, 'servers', newServerId), { Admin: arrayUnion(uid) });
          
            // Add the creator as a user to the server
            await updateDoc(doc(db, 'servers', newServerId), { Users: arrayUnion(uid) });
          
          } catch (error) {
            console.error("Error creating server:", error);
          }};
      handleCloseCreateServerPopup();
      fetchServers();

    // Clicking the new server by assuming the new server is added to the end of the servers list
    const newIndex = servers.length;
    handleServerClick(newIndex, newServerId);

      }catch(error) {
        setCreateServerError('Failed to create the server. Please try again');
      }
    };

  //Right-click menu functions
        const handleDisplayServerId = async() => {
          alert("Server Id =" + ' ' + contextMenu.serverId);
        }

        const handleServerRename = async(e) => {
          e.preventDefault();
          if (!Rename) {
            setRenameError('Server name cannot be empty');
            return;
          }
          try {
              const serverDocRef = doc(db, 'servers', contextMenu.serverId);
              await updateDoc(serverDocRef, { name: Rename });
              handleCloseServerRenamePopup(); // Close the rename popup
    
              handleServerClick(contextMenu.index, contextMenu.serverId);
              } 
            catch (error) {
            console.error("Error renaming server:", error);
       }};

       const handleLeaveServer = async () => {
    
        try {
          // Fetch the server document to check if the user is an admin
          const serverDocRef = doc(db, 'servers', contextMenu.serverId);
          const serverDoc = await getDoc(serverDocRef);  
          const serverData = serverDoc.data();
      
          // Check if the user ID is in the Admin array
          if (serverData.Admin && serverData.Admin.includes(uid)) {
            alert("The admin cannot leave the server, only delete.");
            return; // Exit the function if the user is an admin
          }

          const confirmLeave = window.confirm("Are you sure you want to leave this server?");
      
          if (!confirmLeave) {
            return; // Exit the function if cancelled
          }
      
          // Proceed to remove the user from the server
          const userRef = doc(db, 'users', uid);
          await updateDoc(userRef, { Servers: arrayRemove(contextMenu.serverId) });
          fetchServers(); // Refresh the server list
          handleCloseContextMenu();
          handleServerClick('a', 'GeoServer');
      
        } catch (error) {
          console.error("Error leaving server:", error);
          alert("An error occurred while trying to leave the server. Please try again.");
        }
      };
  
      const handleDeleteServer = async () => {

        try {
          // Fetch the server document to check if the user is an admin
          const serverDocRef = doc(db, 'servers', contextMenu.serverId);
          const serverDoc = await getDoc(serverDocRef);
          const serverData = serverDoc.data();
  
            // Check if the user ID is in the Admin array
            if (serverData.Admin && serverData.Admin.includes(uid)) {
              // User is an admin, prompt for confirmation

              const confirmDelete = window.confirm("Are you sure you want to delete this server? This action cannot be undone.");
  
              if (!confirmDelete) {
                return; // Exit the function if cancelled
              }

              // Fetch all user IDs associated with this server
              const userIDs = serverData.Users || [];

              // Remove the server ID from each user's Servers array
              const removePromises = userIDs.map(async (userId) => {
              const userRef = doc(db, 'users', userId);
              return updateDoc(userRef, { Servers: arrayRemove(contextMenu.serverId) });
              });

              // Wait for the server id to be removed from all registered users.
              await Promise.all(removePromises);

              // Fetch all channels in the server
              const channelsCollectionRef = collection(serverDocRef, 'channels');
              const channelsSnapshot = await getDocs(channelsCollectionRef);

              // Prepare to delete messages in each channel
              const deletePromises = channelsSnapshot.docs.map(async (channelDoc) => {
              const messagesCollectionRef = collection(channelDoc.ref, 'messages'); 
              const messagesSnapshot = await getDocs(messagesCollectionRef);

              // Delete all messages in the channel
              const messageDeletePromises = messagesSnapshot.docs.map(messageDoc => {
              return deleteDoc(doc(messagesCollectionRef, messageDoc.id));
              });

              // Wait for all message delete operations in the current channel to complete
              await Promise.all(messageDeletePromises);

              // Delete the current channcel
              await deleteDoc(channelDoc.ref);
              });

              // Wait for all channel delete operations to complete
              await Promise.all(deletePromises);

              // And finally delete the server
              await updateDoc(doc(db, 'users', uid), { Servers: arrayRemove(contextMenu.serverId) });
              await deleteDoc(doc(db, 'servers', contextMenu.serverId));
              fetchServers(); // Refresh the server list
              handleCloseContextMenu();
              handleServerClick('a', 'GeoServer')
            } else {
              alert("You do not have permission to delete this server.");
            }
        } catch (error) {
          console.error("Error deleting server:", error);
     }};

 //Main return
  
  return (
    <div style={sidebarStyles.sidebar}
    onContextMenu={(e) => {
      e.preventDefault(); //turns off standard right click menu
    }}
    >
     <div
      style={
        hoveredIndex === 'a'
        ? sidebarStyles.iconContainerHover
        : activeIndex === 'a'
        ? sidebarStyles.iconContainerActive
        : sidebarStyles.iconContainer
        }  
        onClick={() => handleServerClick('a', 'GeoServer')}  //registers as clicked
        onMouseEnter={() => setHoveredIndex('a')}  //registers as hovered
        onMouseLeave={() => setHoveredIndex(null)}
    >
      <img
        src='https://unsplash.it/600/400?image=47'
        style={
          hoveredIndex === 'a' 
          ? sidebarStyles.serverIconHover
          : activeIndex === 'a'
          ? sidebarStyles.serverIconHover
          : sidebarStyles.serverIcon}  //changes sytle of the icon to match the container.  We can do something similar with active if we want to match discord more closely
          alt={'Geo'}
          />
    </div> 

      <div   style={{width: '50%',height: '1px',backgroundColor: '#404142',marginBottom: '15px'}}></div>

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
          onContextMenu={(e) => handleContextMenu(e, index, server.id)}
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
          <div onClick={handleDisplayServerId} style={{ padding: '8px', cursor: 'pointer' }}>
            Display Server Id
          </div>
          <div onClick={handleOpenServerRenamePopup} style={{ padding: '8px', cursor: 'pointer' }}>
            Change Name
          </div>
          <div onClick={handleLeaveServer} style={{ padding: '8px', cursor: 'pointer', color: 'red' }}>
            Leave Server
          </div>
          <div onClick={handleDeleteServer} style={{ padding: '8px', cursor: 'pointer', color: 'red' }}>
            Delete Server
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

{isServerRenamePopupVisible && (
        <div style={sidebarStyles.popup}>
          <div style={sidebarStyles.popupContent}>
            <h2>New Server Name</h2>
            <form onSubmit={handleServerRename}>
              <input
                type="text"
                value={Rename}
                onChange={handleRenameChange}
                style={sidebarStyles.input}
                placeholder="New Name"
              />
              {renameError && <p style={{ color: 'red' }}>{renameError}</p>}
              <div style={sidebarStyles.buttonContainer}>
                <button type="submit" style={sidebarStyles.submitButton}>
                  Update
                </button>
                <button type="button" onClick={handleCloseServerRenamePopup} style={sidebarStyles.closeButton}>
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