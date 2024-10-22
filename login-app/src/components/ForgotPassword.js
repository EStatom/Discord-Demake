// src/components/ForgotPassword.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { auth } from './firebase'; // Import the Firebase auth instance
import { sendPasswordResetEmail } from 'firebase/auth';
import './../styles/ForgotPassword.css'; // Import the CSS file for styling

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear any previous messages
    setError(''); // Clear any previous errors

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('A reset password link has been sent to your email address. Please check your email.');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setError('No user found with this email.');
      } else {
        setError(`Failed to send reset email: ${error.message}`);
      }
    }
  };

  // Handle OK button click to redirect to the login page
  const handleOkClick = () => {
    navigate('/'); // Redirect to login page
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      {!message ? (
        <form onSubmit={handleResetPassword}>
          <label htmlFor="email">Enter your email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit">Reset Password</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      ) : (
        <div className="message-container">
          <p className="success-message">{message}</p>
          <button onClick={handleOkClick} className="ok-button">OK</button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
