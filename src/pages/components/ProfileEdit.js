// src/components/ProfileEdit.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, db, storage } from './../../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import styles from './../styles/ProfileEdit.module.css'; // Import CSS Module
import defaultProfileImage from './../images/image-default.jpg';
const editBannerImage = './images/default-banner.jpg';

const ProfileEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Receive the profile data passed from AccountInfo
  const initialProfileData = location.state?.profileData || {}; 

  const [localProfileData, setLocalProfileData] = useState({
    displayName: initialProfileData.displayName || '',
    username: initialProfileData.username || '',
    email: initialProfileData.email || '',
    phoneNumber: initialProfileData.phoneNumber || '',
    pronouns: initialProfileData.pronouns || '',
    avatar: initialProfileData.avatar || defaultProfileImage,
    banner: initialProfileData.banner || editBannerImage,
  });

  useEffect(() => {
    // Fetch latest data from Firestore to ensure the data is up-to-date
    const fetchProfileData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const profileData = docSnap.data();
          const avatarUrl = await getImageUrl(`users/${user.uid}/avatar`, defaultProfileImage);
          const bannerUrl = await getImageUrl(`users/${user.uid}/banner`, editBannerImage);

          setLocalProfileData({
            displayName: profileData.displayName || '',
            username: profileData.username || '',
            email: profileData.email || '',
            phoneNumber: profileData.phoneNumber || '',
            pronouns: profileData.pronouns || '',
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalProfileData({
      ...localProfileData,
      [name]: value,
    });
  };

  const uploadImageToStorage = async (file, type) => {
    try {
      const storageRef = ref(storage, `users/${auth.currentUser.uid}/${type}`);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Error uploading image: ", error);
      return null;
    }
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = await uploadImageToStorage(file, 'avatar');
      if (imageUrl) {
        setLocalProfileData({
          ...localProfileData,
          avatar: imageUrl,
        });
      }
    }
  };

  const handleBannerChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const bannerUrl = await uploadImageToStorage(file, 'banner');
      if (bannerUrl) {
        setLocalProfileData({
          ...localProfileData,
          banner: bannerUrl,
        });
      }
    }
  };

  const handleRemoveProfilePic = async () => {
    try {
      const storageRef = ref(storage, `users/${auth.currentUser.uid}/avatar`);
      await deleteObject(storageRef);
      setLocalProfileData({
        ...localProfileData,
        avatar: defaultProfileImage,
      });
    } catch (error) {
      console.error("Error removing profile picture: ", error);
    }
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, localProfileData, { merge: true });
        alert('Changes saved!');
        navigate('/accountinfo');
      }
    } catch (error) {
      alert('Error saving changes: ' + error.message);
    }
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm('Are you sure you want to cancel your changes?');
    if (confirmCancel) {
      navigate('/accountinfo');
    }
  };

  return (
    <div className={styles.profileEditPage}>
      <h2>Edit Profile</h2>
      <div className={styles.profileBanner}>
        <div className={styles.bannerImage}>
          <img
            src={localProfileData.banner || editBannerImage}
            alt="Edit Profile Banner"
            className={styles.bannerImg}
          />
        </div>
        <div className={styles.profileAvatar}>
          <img
            src={localProfileData.avatar || defaultProfileImage}
            alt="Profile Avatar"
          />
        </div>
        <div className={styles.profileDetails}>
          <h3>{localProfileData.displayName}</h3>
          <input
            type="file"
            id="profilePicUpload"
            style={{ display: 'none' }}
            onChange={handleProfilePicChange}
          />
          <input
            type="file"
            id="bannerUpload"
            style={{ display: 'none' }}
            onChange={handleBannerChange}
          />
          <button className={styles.editProfileBtn} onClick={() => document.getElementById('profilePicUpload').click()}>
            Change Picture
          </button>
          <button className={styles.editProfileBtn} onClick={handleRemoveProfilePic}>
            Remove Picture
          </button>
          <button className={styles.editProfileBtn} onClick={() => document.getElementById('bannerUpload').click()}>
            Change Banner
          </button>
        </div>
      </div>

      <div className={styles.profileEditSection}>
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

        <div className={styles.profileActions}>
          <button className={styles.saveBtn} onClick={handleSave}>Save Changes</button>
          <button className={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
