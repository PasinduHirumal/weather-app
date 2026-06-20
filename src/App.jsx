import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home/Home';

function App() {
  return (
    <Router>
      <Routes>
        {/* Set default page as Home page */}
        <Route path="/" element={<Home />} />
        
        {/* Fallback route - redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
