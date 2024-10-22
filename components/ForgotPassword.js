// src/components/ForgotPassword.js
import React from 'react';
import './../styles/ForgotPassword.css'; // Import the CSS file for styling

const ForgotPassword = () => {
  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form>
        <label htmlFor="email">Enter your email</label>
        <input type="email" id="email" name="email" required />

        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
