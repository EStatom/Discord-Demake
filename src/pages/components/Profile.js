// src/components/Profile.js
import React, { useEffect, useState } from 'react';
import { auth, db } from './../../firebase'; // Firebase config
import { doc, getDoc, collection, query, where, getDocs, setDoc } from 'firebase/firestore'; // Ensure setDoc is imported
import { useNavigate } from 'react-router-dom';
import './../styles/profile.css';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [friendsList, setFriendsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [friendSearchResults, setFriendSearchResults] = useState([]);
  const navigate = useNavigate();

  // Fetch the user's profile data and friends from Firebase
  useEffect(() => {
    const fetchProfileData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
          setFriendsList(docSnap.data().friendsList || []);
        }
      }
    };
    fetchProfileData();
  }, []);

  // Handle searching friends, channels, or servers
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm) {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', searchTerm));
      const querySnapshot = await getDocs(q);

      const searchResults = querySnapshot.docs.map(doc => doc.data());
      setFriendSearchResults(searchResults);
    }
  };

  // Handle adding a new friend
  const handleAddFriend = async (friendUsername) => {
    try {
      const friendRef = collection(db, 'users');
      const q = query(friendRef, where('username', '==', friendUsername));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const friendDoc = querySnapshot.docs[0];
        const friendData = friendDoc.data();

        // Update the current user's friends list
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const updatedFriendsList = [...friendsList, friendData];
        await setDoc(userRef, { friendsList: updatedFriendsList }, { merge: true });

        setFriendsList(updatedFriendsList);
        alert('Friend added successfully!');
      } else {
        alert('Friend not found!');
      }
    } catch (error) {
      alert('Error adding friend: ' + error.message);
    }
  };

  // Navigate to account info page
  const handleAccountInfoClick = () => {
    navigate('/accountinfo');
  };

  return (
    <div className="profile-page">
      <h2>Welcome, {profileData?.firstName} {profileData?.lastName}</h2>
      <p>Username: @{profileData?.username}</p>
      {/* Removed the line displaying the user ID */}

      <div className="search-bar">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search friends, channels, or servers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {/* Display search results and add friend option */}
      {friendSearchResults.length > 0 && (
        <div className="search-results">
          <h3>Search Results:</h3>
          {friendSearchResults.map((result, index) => (
            <div key={index} className="friend">
              <p>{result.username}</p>
              <button onClick={() => handleAddFriend(result.username)}>Add Friend</button>
            </div>
          ))}
        </div>
      )}

      <h3>Your Friends:</h3>
      <div className="friend-list">
        {friendsList.length > 0 ? (
          friendsList.map((friend, index) => (
            <div key={index} className="friend">
              <p>{friend.username}</p>
              <span className="friend-status">{friend.status || 'Offline'}</span>
            </div>
          ))
        ) : (
          <p>You have no friends yet!</p>
        )}
      </div>

      <button onClick={handleAccountInfoClick}>View Account Info</button>
    </div>
  );
};

export default Profile;
