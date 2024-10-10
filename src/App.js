// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AccountInfo from './components/AccountInfo';
import ProfileEdit from './components/ProfileEdit';
import './styles/account-info.css';
import './styles/profile-edit.css';

// Import local images
import bannerImage from './images/image-1.jpg';
import profileImage from './images/profile-1.jpeg';

function App() {
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

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/account-info"
            element={<AccountInfo profileData={profileData} />}
          />
          <Route
            path="/profile-edit"
            element={<ProfileEdit profileData={profileData} onProfileChange={handleProfileChange} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
