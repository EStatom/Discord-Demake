import React, { useEffect, useState } from 'react';
import { db } from './../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './../styles/UserList.css';

const UserList = ({ userIds }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const fetchedUsers = await Promise.all(
                userIds.map(async (userId) => {
                    const userRef = doc(db, "users", userId);
                    const userDoc = await getDoc(userRef);
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        return {
                            username: userData.username || "Unknown User",
                            profilePicture: userData.profilePicture || "default_profile_pic_url" // Replace with a default if needed
                        };
                    }
                    return { username: "Unknown User", profilePicture: "default_profile_pic_url" };
                })
            );
            setUsers(fetchedUsers);
        };

        if (userIds.length > 0) {
            fetchUsers();
        }
    }, [userIds]);

    return (
        <div className="user-list">
            <h3>Users</h3>
            {users.length > 0 ? (
                users.map((user, index) => (
                    <div key={index} className="user-item">
                        <img
                            src={user.profilePicture}
                            alt={`${user.username}'s profile`}
                            className="user-avatar"
                        />
                        <p className="username">{user.username}</p>
                    </div>
                ))
            ) : (
                <p>No users in this server</p>
            )}
        </div>
    );
};

export default UserList;
