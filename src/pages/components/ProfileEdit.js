import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './../../firebase'; // Firebase import
import { doc, setDoc } from 'firebase/firestore';
import './../styles/profile-edit.css';

// Provide a default profile image and banner image
const defaultProfileImage = './images/default-avatar.png'; // Change this to the path of your default profile image
const editBannerImage = './images/default-banner.jpg'; // Change this to the path of your default banner image

const ProfileEdit = ({ profileData = {} }) => { // Provide a default value for profileData
  const [localProfileData, setLocalProfileData] = useState({
    displayName: profileData.displayName || '', // Provide default value if undefined
    username: profileData.username || '',
    email: profileData.email || '',
    phoneNumber: profileData.phoneNumber || '',
    pronouns: profileData.pronouns || '',
    avatar: profileData.avatar || defaultProfileImage,
    banner: profileData.banner || editBannerImage,
  });

  const navigate = useNavigate();

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

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, localProfileData, { merge: true }); // Save changes to Firestore
        alert('Changes saved!');
        navigate('/account-info');  // Go back to AccountInfo after saving
      }
    } catch (error) {
      alert('Error saving changes: ' + error.message);
    }
  };

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
          <img
            src={localProfileData.banner || editBannerImage} // Use default if banner is not available
            alt="Edit Profile Banner"
            className="banner-img"
          />
        </div>
        <div className="profile-avatar">
          <img
            src={localProfileData.avatar || defaultProfileImage} // Use default if avatar is not available
            alt="Profile Avatar"
          />
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
