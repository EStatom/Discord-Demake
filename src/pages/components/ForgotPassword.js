// src/components/ForgotPassword.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './../../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import './../styles/ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

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

  const handleOkClick = () => {
    navigate('/');
  };

  return (
    <div className="forgot-password-page">
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
    </div>
  );
};

export default ForgotPassword;
