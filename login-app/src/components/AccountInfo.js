import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase'; // Ensure Firebase is properly configured
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './../styles/account-info.css';

// Provide a default banner image
const defaultBannerImage = './../images/image-1.jpg'; // Update this with the correct path

const AccountInfo = () => {
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the profile data from Firebase
    const fetchProfileData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        }
      }
    };
    fetchProfileData();
  }, []);

  if (!profileData) {
    return <p>Loading...</p>;
  }

  // Navigate to profile edit page
  const handleEditProfileClick = () => {
    navigate('/profile-edit');
  };

  const handleMainPage = () => {
    navigate('/');
  };

  // Function to handle disabling the account
  const handleDisableAccount = () => {
    const confirmDisable = window.confirm(
      "Are you sure you want to disable your account? This will log you out."
    );
    if (confirmDisable) {
      alert("Account disabled. You will be logged out.");
      // Logic for disabling the account, e.g., send a request to the backend
    }
  };

  // Function to handle deleting the account
  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone."
    );
    if (confirmDelete) {
      alert("Account deleted.");
      // Logic for deleting the account, e.g., send a request to the backend
    }
  };

  // Function to handle changing the password
  const handleChangePassword = () => {
    const newPassword = prompt("Enter your new password:");
    if (newPassword) {
      alert("Password changed successfully.");
      // Logic to change the password, e.g., send a request to the backend
    }
  };

  const renderFriendStatus = (status) => {
    switch (status) {
      case 'online':
        return <span className="status-dot online"></span>;
      case 'offline':
        return <span className="status-dot offline"></span>;
      default:
        return <span className="status-dot custom"></span>;
    }
  };

  const renderUserStatus = (status) => {
    switch (status) {
      case 'online':
        return <span className="status-dot online user-status"></span>;
      case 'offline':
        return <span className="status-dot offline user-status"></span>;
      default:
        return <span className="status-dot custom user-status"></span>;
    }
  };

  return (
    <div className="account-info-page">
      <h2>My Account</h2>

      {/* Close Button */}
      <button className="close-btn" onClick={handleMainPage}>
        ✕ <span>Close</span>
      </button>

      {/* Banner and Profile Picture */}
      <div className="profile-banner">
        <div className="banner-image">
          <img
            src={profileData.banner || defaultBannerImage}
            alt="Account Banner"
            className="banner-img"
          />
        </div>
        <div className="profile-avatar">
          <img src={profileData.avatar || './images/default-avatar.png'} alt="Profile Avatar" />
          {renderUserStatus(profileData.status)} {/* Render user status */}
        </div>
        <div className="profile-details">
          <h3>{profileData.displayName}</h3>
          <button className="edit-profile-btn" onClick={handleEditProfileClick}>
            Edit User Profile
          </button>
        </div>
      </div>

      {/* Display other account information options */}
      <div className="user-info">
        <div className="info-section">
          <p><strong>Display Name</strong></p>
          <p>{profileData.displayName}</p>
          <button className="edit-btn" onClick={handleEditProfileClick}>Edit</button>
        </div>
        <div className="info-section">
          <p><strong>Username</strong></p>
          <p>{profileData.username}</p>
          <button className="edit-btn" onClick={handleEditProfileClick}>Edit</button>
        </div>
        <div className="info-section">
          <p><strong>Email</strong></p>
          <p>{profileData.email}</p>
          <button className="edit-btn" onClick={handleEditProfileClick}>Edit</button>
        </div>
        <div className="info-section">
          <p><strong>Phone Number</strong></p>
          <p>{profileData.phoneNumber}</p>
          <button className="edit-btn" onClick={handleEditProfileClick}>Edit</button>
        </div>
        <div className="info-section">
          <p><strong>Joined Date</strong></p>
          <p>{profileData.joinedDate}</p>
        </div>
      </div>

      {/* Friends List Section */}
      <div className="friends-list">
        <h2>Friends List</h2>
        <div className="friends-avatars">
          {profileData.friendsList && profileData.friendsList.length > 0 ? (
            profileData.friendsList.map((friend, index) => (
              <div key={index} className="friend">
                <img
                  src={friend.avatar || './images/default-avatar.png'}
                  alt={friend.name}
                  className="friend-avatar"
                />
                {renderFriendStatus(friend.status)}
                <p>{friend.name}</p>
              </div>
            ))
          ) : (
            <p>No friends found</p>
          )}
        </div>
      </div>

      {/* Password and Authentication Section */}
      <div className="password-auth-section">
        <h2>Password and Authentication</h2>
        <button className="auth-btn" onClick={handleChangePassword}>Change Password</button>
      </div>

      {/* Account Removal Section */}
      <div className="account-removal">
        <button className="disable-btn" onClick={handleDisableAccount}>
          Disable Account
        </button>
        <button className="delete-btn" onClick={handleDeleteAccount}>
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default AccountInfo;
