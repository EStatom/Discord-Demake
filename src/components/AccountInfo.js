// src/components/AccountInfo.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './../styles/account-info.css';

// Import local banner image for AccountInfo
import accountBannerImage from './../images/image-1.jpg'; // Banner image for AccountInfo

const AccountInfo = ({ profileData }) => {
  const navigate = useNavigate();

  const handleEditProfileClick = () => {
    navigate('/profile-edit');
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

  // Function to handle enabling the authenticator app
  const handleEnableAuthenticatorApp = () => {
    alert("Authenticator app enabled.");
    // Logic to enable 2FA using an authenticator app
  };

  // Function to handle registering a security key
  const handleRegisterSecurityKey = () => {
    alert("Security key registered.");
    // Logic to register a security key, e.g., WebAuthn or similar method
  };

  const handleMainPage = () => {
    navigate('/'); // Redirect to the main page or any other page
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
          <img src={accountBannerImage} alt="Account Banner" className="banner-img" />
        </div>
        <div className="profile-avatar">
          <img src={profileData.avatar} alt="Profile Avatar" />
          {renderUserStatus(profileData.status)} {/* Render user status */}
        </div>
        <div className="profile-details">
          <h3>{profileData.displayName}</h3>
          <button className="edit-profile-btn" onClick={handleEditProfileClick}>
            Edit User Profile
          </button>
        </div>
      </div>

      {/* Display other account information options with Edit Buttons */}
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
          {profileData.friendsList.map((friend, index) => (
            <div key={index} className="friend">
              <img src={friend.avatar} alt={friend.name} className="friend-avatar" />
              {renderFriendStatus(friend.status)}
              <p>{friend.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Password and Authentication Section */}
      <div className="password-auth-section">
        <h2>Password and Authentication</h2>
        <button className="auth-btn" onClick={handleChangePassword}>Change Password</button>
        <button className="auth-btn" onClick={handleEnableAuthenticatorApp}>Enable Authenticator App</button>
        <button className="auth-btn" onClick={handleRegisterSecurityKey}>Register a Security Key</button>

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
    </div>
  );
};

export default AccountInfo;
