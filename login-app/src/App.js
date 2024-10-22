// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import AccountInfo from './components/AccountInfo';
import ProfileEdit from './components/ProfileEdit';
import Profile from './components/Profile'; // New Profile Page
import './styles/Login.css';
import './styles/SignUp.css';
import './styles/ForgotPassword.css';

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
