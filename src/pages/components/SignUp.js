// src/components/SignUp.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './../../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import styles from './../styles/SignUp.module.css'; // Import CSS Module

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  const [isEmailAvailable, setIsEmailAvailable] = useState(true);
  const [isSignUpSuccessful, setIsSignUpSuccessful] = useState(false);

  const navigate = useNavigate();

  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  useEffect(() => {
    const checkUsernameAvailability = debounce(async (username) => {
      if (username.trim() === '') {
        setIsUsernameAvailable(null);
        return;
      }
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);

        setIsUsernameAvailable(querySnapshot.empty);
      } catch (error) {
        console.error("Error checking username availability:", error);
      }
    }, 500);

    checkUsernameAvailability(username);
  }, [username]);

  useEffect(() => {
    const checkEmailAvailability = debounce(async (email) => {
      if (email.trim() === '') {
        setIsEmailAvailable(null);
        return;
      }
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);

        setIsEmailAvailable(querySnapshot.empty);
      } catch (error) {
        console.error("Error checking email availability:", error);
      }
    }, 500);

    checkEmailAvailability(email);
  }, [email]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (isUsernameAvailable === false) {
      setError('Username is already taken. Please choose another one.');
      return;
    }
    if (isEmailAvailable === false) {
      setError('Email is already in use. Please use another email.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        middleName,
        lastName,
        username,
        email,
        phoneNumber,
      });

      await sendEmailVerification(user);
      await signOut(auth);  // Ensure the user is signed out after registration
      setIsSignUpSuccessful(true);
    } catch (error) {
      setError('Failed to sign up: ' + error.message);
    }
  };

  const handleOkClick = () => {
    navigate('/login');
  };

  return (
    <div className={styles.signupPage}>
      <div className={styles.signupContainer}>
        <h2>Sign Up</h2>
        {isSignUpSuccessful ? (
          <div className={styles.messageContainer}>
            <p className={styles.successMessage}>Signup is successful. Please check your email to verify your account!</p>
            <button onClick={handleOkClick} className={styles.okButton}>OK</button>
          </div>
        ) : (
          <form onSubmit={handleSignUp}>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />

            <label htmlFor="middleName">Middle Name</label>
            <input
              type="text"
              id="middleName"
              name="middleName"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
            />

            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />

            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {isUsernameAvailable === false && (
              <p className={styles.errorMessage}>Username is already taken. Please choose another one.</p>
            )}
            {isUsernameAvailable && (
              <p className={styles.successMessage}>Username is available.</p>
            )}

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {isEmailAvailable === false && (
              <p className={styles.errorMessage}>Email is already in use. Please use another email.</p>
            )}
            {isEmailAvailable && email.trim() !== '' && (
              <p className={styles.successMessage}>Email is available.</p>
            )}

            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className={styles.signupButton}>Sign Up</button>
            {error && <p className={styles.errorMessage}>{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;
