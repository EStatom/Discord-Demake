// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './../../firebase';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getDocs, collection, query, where, doc, getDoc } from 'firebase/firestore';
import './../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showResend, setShowResend] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const email = userDoc.data().email;

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await user.reload();  // Force reload of the user's auth state

        if (user.emailVerified) {
          navigate('/profile');  // Navigate to profile page if email is verified
        } else {
          setError('Please verify your email before logging in.');
          setShowResend(true);  // Show option to resend verification email
        }
      } else {
        setError('Username not found.');
      }
    } catch (error) {
      setError(`Login failed: ${error.message}`);
    }
  };

  const handleResendVerification = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        alert('Verification email sent! Please check your inbox.');
      } else {
        alert('No authenticated user found. Please log in again.');
        navigate('/login');  // Redirect to login if no user is authenticated
      }
    } catch (error) {
      alert(`Error resending verification email: ${error.message}`);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Welcome back!</h2>
        <p>We're so excited to see you again!</p>

        <form onSubmit={handleLogin}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
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

          <button type="submit">Sign In</button>
          {error && <p className="error-message">{error}</p>}
        </form>

        {showResend && (
          <div className="resend-verification">
            <p>
              Didn't receive the email?{' '}
              <button onClick={handleResendVerification}>Resend Verification Email</button>
            </p>
          </div>
        )}

        <div className="extra-options">
          <button onClick={() => navigate('/signup')}>Sign Up</button>
          <button onClick={() => navigate('/forgotpassword')}>Forgot Password?</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
