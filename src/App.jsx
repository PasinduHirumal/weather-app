import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/home/Home';
import Location from './pages/location/Location';
import Calendar from './pages/calendar/Calendar';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen w-full flex bg-white transition-all duration-300">
        {/* Main Full-Screen Wrapper */}
        <div className="flex flex-col lg:flex-row w-full min-h-screen lg:h-screen lg:overflow-hidden">

          {/* Global Navigation Sidebar */}
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

          <Routes>
            {/* Set default page as Home page */}
            <Route
              path="/"
              element={<Home sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
            />
            <Route 
              path="/location" 
              element={<Location sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />} 
            />
            <Route 
              path="/calendar" 
              element={<Calendar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />} 
            />

            {/* Fallback route - redirect to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

        </div>
      </div>
    </Router>
  );
}

export default App;
