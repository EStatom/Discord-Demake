// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/components/Login';
import SignUp from './pages/components/SignUp';
import ForgotPassword from './pages/components/ForgotPassword';
import AccountInfo from './pages/components/AccountInfo';
import ProfileEdit from './pages/components/ProfileEdit';
import Profile from './pages/components/Profile'; // New Profile Page
import './pages/styles/Login.css';
import './pages/styles/SignUp.css';
import './pages/styles/ForgotPassword.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} /> {/* New Profile Route */}
        <Route path="/account-info" element={<AccountInfo />} />
        <Route path="/profile-edit" element={<ProfileEdit />} />
      </Routes>
    </Router>
  );
}

export default App;
