import React from 'react';
import { Route, Router, Routes } from 'react-router-dom';
import Ayman from './pages/Ayman';
import Landing from './pages/Landing';

function App() {
  return (
      <Routes>
        <Route path="/Ayman" element={<Ayman/>}/>
        <Route path="/" element={<Landing/>}/>
      </Routes>
  );
}

export default App;
