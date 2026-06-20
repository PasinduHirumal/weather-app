import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/home/Home';
import Location from './pages/location/Location';
import Calendar from './pages/calendar/Calendar';

function App() {
  return (
    <Router>
      <Routes>
        {/* Layout wraps all pages, rendering the active component inside its <Outlet /> */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/location" element={<Location />} />
          <Route path="/calendar" element={<Calendar />} />
        </Route>
        
        {/* Fallback route - redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
