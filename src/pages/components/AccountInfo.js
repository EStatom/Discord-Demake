// src/components/AccountInfo.js
import React, { useEffect, useState } from 'react';
import { auth, db, storage } from './../../firebase'; // Ensure Firebase is properly configured
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { updatePassword, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { getDownloadURL, ref } from 'firebase/storage'; // Import storage functions
import styles from './../styles/AccountInfo.module.css'; // Import CSS Module
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
    const fetchProfileData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const joinedDate = new Date(user.metadata.creationTime).toLocaleDateString();
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

  const handleEditProfileClick = () => {
    navigate('/profileedit');
  };

  const handleMainPage = () => {
    navigate('/profile');
  };

  const handleDisableAccount = async () => {
    const confirmDisable = window.confirm(
      "Are you sure you want to disable your account? This will log you out."
    );
    if (confirmDisable) {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, 'users', user.uid);
          await updateDoc(docRef, { isDisabled: true });
          alert("Account disabled. You will be logged out.");
          await auth.signOut();
          navigate('/');
        }
      } catch (error) {
        alert(`Error disabling account: ${error.message}`);
      }
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone."
    );
    if (confirmDelete) {
      try {
        const user = auth.currentUser;
        await deleteDoc(doc(db, 'users', user.uid));
        await deleteUser(user);
        alert("Account deleted.");
        navigate('/');
      } catch (error) {
        alert("Error deleting account: " + error.message);
      }
    }
  };

  const handleChangePassword = async () => {
    if (currentPassword && newPassword) {
      try {
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        alert("Password changed successfully.");
        setShowChangePassword(false);
        setCurrentPassword('');
        setNewPassword('');
      } catch (error) {
        alert("Error changing password: " + error.message);
      }
    }
  };

  return (
    <div className={styles.accountInfoPage}>
      <h2>My Account</h2>

      <div className={styles.closeBtnContainer} onClick={handleMainPage}>
        <div className={styles.closeBtnCircle}>✕</div>
        <span className={styles.closeBtnText}>Close</span>
      </div>

      {!showChangePassword ? (
        <>
          <div className={styles.profileBanner}>
            <div className={styles.bannerImage}>
              <img
                src={profileData.banner || defaultBannerImage}
                alt="Account Banner"
                className={styles.bannerImg}
              />
            </div>
            <div className={styles.profileDetailsContainer}>
              <h3>{profileData.displayName}</h3>
              <div className={styles.profileAvatar}>
                <img
                  src={profileData.avatar || defaultAvatarImage}
                  alt="Profile Avatar"
                  className={styles.avatarImg}
                />
              </div>
              <button className={styles.editProfileBtn} onClick={handleEditProfileClick}>
                Edit User Profile
              </button>
            </div>
          </div>

          <div className={styles.userInfo}>
            <div className={styles.infoSection}>
              <p><strong>Display Name</strong></p>
              <p>{profileData.displayName}</p>
            </div>
            <div className={styles.infoSection}>
              <p><strong>Username</strong></p>
              <p>{profileData.username}</p>
            </div>
            <div className={styles.infoSection}>
              <p><strong>Email</strong></p>
              <p>{profileData.email}</p>
            </div>
            <div className={styles.infoSection}>
              <p><strong>Phone Number</strong></p>
              <p>{profileData.phoneNumber}</p>
            </div>
            <div className={styles.infoSection}>
              <p><strong>Joined Date</strong></p>
              <p>{profileData.joinedDate}</p>
            </div>
          </div>

          <div className={styles.passwordAuthSection}>
            <h2>Password and Authentication</h2>
            <button className={styles.authBtn} onClick={() => setShowChangePassword(true)}>
              Change Password
            </button>
          </div>

          <div className={styles.accountRemoval}>
            <button className={styles.disableBtn} onClick={handleDisableAccount}>
              Disable Account
            </button>
            <button className={styles.deleteBtn} onClick={handleDeleteAccount}>
              Delete Account
            </button>
          </div>
        </>
      ) : (
        <div className={styles.passwordAuthSection}>
          <h2>Change Password</h2>
          <div className={styles.passwordInputs}>
            <div>
              <label>Current Password:</label>
              <div className={styles.passwordField}>
                <input
                  type={currentPasswordVisible ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <span
                  className={styles.toggleVisibility}
                  onClick={() => setCurrentPasswordVisible(!currentPasswordVisible)}
                >
                  {currentPasswordVisible ? "🙈" : "👁️"}
                </span>
              </div>
            </div>
            <div>
              <label>New Password:</label>
              <div className={styles.passwordField}>
                <input
                  type={newPasswordVisible ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <span
                  className={styles.toggleVisibility}
                  onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                >
                  {newPasswordVisible ? "🙈" : "👁️"}
                </span>
              </div>
            </div>
          </div>
          <button className={styles.authBtn} onClick={handleChangePassword}>Confirm Change</button>
          <button className={styles.cancelBtn} onClick={() => setShowChangePassword(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default AccountInfo;
