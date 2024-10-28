// src/components/AccountInfo.js
import React, { useEffect, useState } from 'react';
import { auth, db, storage } from './../../firebase'; // Ensure Firebase is properly configured
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { updatePassword, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { getDownloadURL, ref } from 'firebase/storage'; // Import storage functions
import './../styles/account-info.css';
import defaultBannerImage from './../images/image-1.jpg'; // Import your default banner image
import defaultAvatarImage from './../images/image-default.jpg'; // Import your default avatar image

const AccountInfo = () => {
  const [profileData, setProfileData] = useState(null);
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the profile data from Firebase
    const fetchProfileData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const joinedDate = new Date(user.metadata.creationTime).toLocaleDateString();

          // Fetch profile picture and banner URLs from Firebase Storage
          const avatarUrl = await getImageUrl(`users/${user.uid}/avatar`, defaultAvatarImage);
          const bannerUrl = await getImageUrl(`users/${user.uid}/banner`, defaultBannerImage);

          setProfileData({
            ...docSnap.data(),
            joinedDate,
            avatar: avatarUrl,
            banner: bannerUrl,
          });
        }
      }
    };
    fetchProfileData();
  }, []);

  const getImageUrl = async (storagePath, defaultImage) => {
    try {
      const url = await getDownloadURL(ref(storage, storagePath));
      return url;
    } catch (error) {
      return defaultImage;
    }
  };

  if (!profileData) {
    return <p>Loading...</p>;
  }

  // Navigate to profile edit page
  const handleEditProfileClick = () => {
    navigate('/profileedit');
  };

  const handleMainPage = () => {
    navigate('/profile');
  };

  // Function to handle disabling the account
  const handleDisableAccount = async () => {
    const confirmDisable = window.confirm(
      "Are you sure you want to disable your account? This will log you out."
    );
    if (confirmDisable) {
      try {
        const user = auth.currentUser;
        if (user) {
          // Get the Firestore document reference for the current user
          const docRef = doc(db, 'users', user.uid);

          // Update the `isDisabled` field in the Firestore document to true
          await updateDoc(docRef, { isDisabled: true });

          alert("Account disabled. You will be logged out.");
          await auth.signOut(); // Log the user out after disabling the account
          navigate('/'); // Redirect to the login page after logging out
        }
      } catch (error) {
        alert(`Error disabling account: ${error.message}`);
      }
    }
  };

  // Function to handle deleting the account
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone."
    );
    if (confirmDelete) {
      try {
        const user = auth.currentUser;
        // Delete user data from Firestore
        await deleteDoc(doc(db, 'users', user.uid));
        // Delete user authentication record
        await deleteUser(user);
        alert("Account deleted.");
        navigate('/'); // Redirect to homepage or login page
      } catch (error) {
        alert("Error deleting account: " + error.message);
      }
    }
  };

  // Function to handle changing the password with re-authentication
  const handleChangePassword = async () => {
    if (currentPassword && newPassword) {
      try {
        const user = auth.currentUser;

        // Create a credential using the user's email and current password
        const credential = EmailAuthProvider.credential(user.email, currentPassword);

        // Reauthenticate the user
        await reauthenticateWithCredential(user, credential);

        // Update the user's password after successful re-authentication
        await updatePassword(user, newPassword);

        alert("Password changed successfully.");
        // Reset the state after successful password change
        setShowChangePassword(false);
        setCurrentPassword('');
        setNewPassword('');
      } catch (error) {
        // Handle errors such as incorrect current password, weak new password, etc.
        alert("Error changing password: " + error.message);
      }
    }
  };

  return (
    <div className="account-info-page">
      <h2>My Account</h2>

      {/* Floating Close Button */}
      <div className="close-btn-container" onClick={handleMainPage}>
        <div className="close-btn-circle">✕</div>
        <span className="close-btn-text">Close</span>
      </div>

      {!showChangePassword ? (
        <>
          {/* Banner and Profile Picture */}
          <div className="profile-banner">
          <div className="banner-image">
            <img
              src={profileData.banner || defaultBannerImage}
              alt="Account Banner"
              className="banner-img"
            />
          </div>
          <div className="profile-details-container">
            <h3>{profileData.displayName}</h3>
            <div className="profile-avatar">
              <img
                src={profileData.avatar || defaultAvatarImage}
                alt="Profile Avatar"
                className="avatar-img"
              />
            </div>
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
            </div>
            <div className="info-section">
              <p><strong>Username</strong></p>
              <p>{profileData.username}</p>
            </div>
            <div className="info-section">
              <p><strong>Email</strong></p>
              <p>{profileData.email}</p>
            </div>
            <div className="info-section">
              <p><strong>Phone Number</strong></p>
              <p>{profileData.phoneNumber}</p>
            </div>
            <div className="info-section">
              <p><strong>Joined Date</strong></p>
              <p>{profileData.joinedDate}</p>
            </div>
          </div>

          {/* Password and Authentication Section */}
          <div className="password-auth-section">
            <h2>Password and Authentication</h2>
            <button className="auth-btn" onClick={() => setShowChangePassword(true)}>
              Change Password
            </button>
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
        </>
      ) : (
        <div className="password-auth-section">
          <h2>Change Password</h2>
          <div className="password-inputs">
            <div>
              <label>Current Password:</label>
              <div className="password-field">
                <input
                  type={currentPasswordVisible ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <span
                  className="toggle-visibility"
                  onClick={() => setCurrentPasswordVisible(!currentPasswordVisible)}
                >
                  {currentPasswordVisible ? "🙈" : "👁️"}
                </span>
              </div>
            </div>
            <div>
              <label>New Password:</label>
              <div className="password-field">
                <input
                  type={newPasswordVisible ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <span
                  className="toggle-visibility"
                  onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                >
                  {newPasswordVisible ? "🙈" : "👁️"}
                </span>
              </div>
            </div>
          </div>
          <button className="auth-btn" onClick={handleChangePassword}>Confirm Change</button>
          <button className="cancel-btn" onClick={() => setShowChangePassword(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default AccountInfo;
