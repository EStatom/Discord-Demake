import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const Sidebar = ({ onSelectServer }) => {
  const [servers, setServers] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null); // Track hover state for each icon
  const [activeIndex, setActiveIndex] = useState(null);   // Track active state for the selected icon
// Styles in JSX format

const sidebarStyles = {
    minHeight: '100vh',
    width: '70px',
    backgroundColor: '#202225',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 0',
  };
  
  const iconContainerStyles = {
    marginBottom: '15px',
    width: '70px',
    height: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#202225',
    borderLeft: '3px solid transparent',
    transition: 'border-left 0.2s ease, border-radius 0.2s ease',
  };
  
  const iconContainerHoverStyles = {
    ...iconContainerStyles,
    borderLeft: '3px solid white',
  };
  
  const iconContainerActiveStyles = {
    ...iconContainerStyles,
    borderLeft: '3px solid #5865F2', 
    backgroundColor: '#2F3136',
  };
  
  const serverIconStyles = {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    transition: 'border-radius 0.2s ease',
  };
  
  const serverIconHoverStyles = {
    ...serverIconStyles,
    borderRadius: '30%', // Discord-like hover effect
  };
  
  const iconStyles = {
    fontSize: '24px',
    color: 'white',
  };
  
  const popupStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };
  
  const popupContentStyles = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    width: '300px',
  };
  
  const inputStyles = {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  };
  
  const buttonContainerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
  };
  
  const submitButtonStyles = {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };
  
  const closeButtonStyles = {
    padding: '10px 15px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };


  useEffect(() => {
    const fetchServers = async () => {
      const serverCollection = collection(db, 'servers');
      const serverSnapshot = await getDocs(serverCollection);
      const serverList = serverSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setServers(serverList);
    };

    fetchServers();
  }, []);

  const handleServerClick = (index, serverId) => {
    setActiveIndex(index); // Set the active index on click
    onSelectServer(serverId); // Call the parent's onSelectServer handler
  };

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [input, setInput] = useState('');

  const handleButtonClick = () => {
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setInput('');
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`You entered: ${input}`);
    handleClosePopup();
  };

  return (
    <div style={sidebarStyles}>
      {servers.map((server, index) => (
        <div
          key={server.id}
          style={
            hoveredIndex === index
              ? iconContainerHoverStyles
              : activeIndex === index
              ? iconContainerActiveStyles
              : iconContainerStyles
          }
          onClick={() => handleServerClick(index, server.id)}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <img
            src={server.image}
            style={hoveredIndex === index ? serverIconHoverStyles : serverIconStyles}
            alt={server.name}
          />
        </div>
      ))}

      <div
        style={hoveredIndex === 'add' ? iconContainerHoverStyles : iconContainerStyles}
        onMouseEnter={() => setHoveredIndex('add')}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <button style={serverIconStyles} onClick={handleButtonClick}>
          <span style={iconStyles}>➕</span>
        </button>
      </div>

      {isPopupVisible && (
        <div style={popupStyles}>
          <div style={popupContentStyles}>
            <h2>Enter Your Text</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                style={inputStyles}
                placeholder="Server ID"
              />
              <div style={buttonContainerStyles}>
                <button type="submit" style={submitButtonStyles}>
                  Submit
                </button>
                <button type="button" style={closeButtonStyles} onClick={handleClosePopup}>
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
