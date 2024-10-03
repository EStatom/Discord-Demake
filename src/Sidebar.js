// Sidebar.js
import React from 'react';
import './Sidebar.css'; // Create a separate CSS file to include the styles

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="icon-container">
        <img src="https://unsplash.it/600/400?image=11" alt="Server Icon" className="server-icon" />
      </div>
      <div className="icon-container">
        <img src="https://unsplash.it/600/400?image=54" alt="Server Icon" className="server-icon" />
      </div>
      <div className="icon-container">
        <img src="https://unsplash.it/600/400?image=147" alt="Server Icon" className="server-icon" />
      </div>
      <div className="icon-container">
        <img src="https://unsplash.it/600/400?image=163" alt="Server Icon" className="server-icon" />
      </div>
      {/* Add more icons as needed */}
    </div>
  );
};

export default Sidebar;
