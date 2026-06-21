import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/home/Home';
import Location from './pages/location/Location';
import Calendar from './pages/calendar/Calendar';
import Monitor from './pages/monitor/Monitor';
import ScrollToTop from './common/ScrollToTop';
import ScrollToTopButton from './common/ScrollToTopButton';
import { ThemeProvider } from './common/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <ScrollToTopButton />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/location" element={<Location />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/monitor" element={<Monitor />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
