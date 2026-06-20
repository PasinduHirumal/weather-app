import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import WeatherCard from './components/WeatherCard';
import AirQualityCard from './components/AirQualityCard';
import TemperatureChartCard from './components/TemperatureChartCard';
import TomorrowCard from './components/TomorrowCard';
import RightPanel from './components/RightPanel';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-[100vh] w-full flex items-center justify-center p-2 sm:p-4 lg:p-8">
      {/* Main Mockup Desktop Window Frame */}
      <div className="bg-white rounded-[38px] shadow-[0_25px_60px_-15px_rgba(30,41,59,0.12)] border border-slate-100 flex flex-col lg:flex-row overflow-hidden w-full max-w-[1280px] min-h-[820px] transition-all duration-300">
        
        {/* Navigation Sidebar */}
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Dashboard Core Area */}
        <div className="flex-1 flex flex-col p-6 sm:p-8 lg:p-10 justify-between">
          <div>
            {/* Header Greeting and Search */}
            <Header />

            {/* Dashboard Cards Grid Layout */}
            <main className="grid grid-cols-1 gap-6">
              {/* Row 1: Weather Info & Air Quality */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <WeatherCard />
                <AirQualityCard />
              </div>

              {/* Row 2: Temperature Curve Chart & Tomorrow Forecast Card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <TemperatureChartCard />
                </div>
                <div className="lg:col-span-1">
                  <TomorrowCard />
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Right Info Panel (Sun Trajectory, UV Index, Predictions) */}
        <RightPanel />

      </div>
    </div>
  );
}

export default App;
