// src/components/SignUp.js
import React from 'react';
import './../styles/SignUp.css'; // Import the CSS file for styling

const SignUp = () => {
  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" required />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" required />

        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required />

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
