// src/components/Login.js
import React from 'react';
import './../styles/Login.css';

const Login = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Welcome back!</h2>
        <p>We're so excited to see you again!</p>
        <form>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" required />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />

          <button type="submit">Sign In</button>
        </form>
        <div className="extra-options">
          <button onClick={() => window.location.href = '/signup'}>Sign Up</button>
          <button onClick={() => window.location.href = '/forgot-password'}>Forgot Password?</button>
        </div>
      </div>
    </div>
  );
};

export default Login;

