// src/components/ProfileEdit.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use for navigation
import './../styles/profile-edit.css';

// Import local images for ProfileEdit
import editBannerImage from './../images/image-3.jpg';
const defaultProfileImage = "https://via.placeholder.com/100"; // Placeholder or default image

const ProfileEdit = ({ profileData, onProfileChange }) => {
  const [localProfileData, setLocalProfileData] = useState(profileData);
  const navigate = useNavigate(); // For navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalProfileData({
      ...localProfileData,
      [name]: value,
    });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setLocalProfileData({
        ...localProfileData,
        avatar: imageUrl,  // Update the avatar with the new image
      });
    }
  };

  const handleRemoveProfilePic = () => {
    setLocalProfileData({
      ...localProfileData,
      avatar: defaultProfileImage,  // Revert to default if removed
    });
  };

  const handleSave = () => {
    onProfileChange(localProfileData);  // Save changes to parent
    alert('Changes saved!');
    navigate('/account-info');  // Go back to AccountInfo after saving
  };

  // Handle cancel and go back without saving
  const handleCancel = () => {
    const confirmCancel = window.confirm('Are you sure you want to cancel your changes?');
    if (confirmCancel) {
      navigate('/account-info'); // Go back to AccountInfo without saving
    }
  };

  return (
    <div className="profile-edit-page">
      <h2>Edit Profile</h2>
      <div className="profile-banner">
        <div className="banner-image">
          <img src={editBannerImage} alt="Edit Profile Banner" className="banner-img" />
        </div>
        <div className="profile-avatar">
          <img src={localProfileData.avatar} alt="Profile Avatar" />
        </div>
        <div className="profile-details">
          <h3>{localProfileData.displayName}</h3>
          <input
            type="file"
            id="profilePicUpload"
            style={{ display: 'none' }}
            onChange={handleProfilePicChange}
          />
          <button
            className="edit-profile-btn"
            onClick={() => document.getElementById('profilePicUpload').click()}
          >
            Change Picture
          </button>
          <button className="edit-profile-btn" onClick={handleRemoveProfilePic}>
            Remove Picture
          </button>
        </div>
      </div>

      <div className="profile-edit-section">
        <label>Display Name</label>
        <input
          type="text"
          name="displayName"
          value={localProfileData.displayName}
          onChange={handleChange}
        />
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={localProfileData.username}
          onChange={handleChange}
        />
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={localProfileData.email}
          onChange={handleChange}
        />
        <label>Phone Number</label>
        <input
          type="text"
          name="phoneNumber"
          value={localProfileData.phoneNumber}
          onChange={handleChange}
        />
        <label>Pronouns</label>
        <input
          type="text"
          name="pronouns"
          value={localProfileData.pronouns}
          onChange={handleChange}
          placeholder="Add your pronouns"
        />

        <div className="profile-actions">
          <button className="save-btn" onClick={handleSave}>Save Changes</button>
          <button className="cancel-btn" onClick={handleCancel}>Cancel</button> {/* Cancel Button */}
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
