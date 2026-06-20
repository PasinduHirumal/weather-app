import React from 'react';
import { useOutletContext } from 'react-router-dom';
import WeatherCard from './components/WeatherCard';
import AirQualityCard from './components/AirQualityCard';
import TemperatureChartCard from './components/TemperatureChartCard';
import TomorrowCard from './components/TomorrowCard';

export default function Home() {
  const { weather, airQuality, location, loading } = useOutletContext();

  return (
    <main className="grid grid-cols-1 gap-6">
      {/* Row 1: Weather Info & Air Quality */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WeatherCard weather={weather} loading={loading} />
        <AirQualityCard airQuality={airQuality} weather={weather} loading={loading} />
      </div>

      {/* Row 2: Temperature Curve Chart & Tomorrow Forecast Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TemperatureChartCard weather={weather} loading={loading} />
        </div>
        <div className="lg:col-span-1">
          <TomorrowCard weather={weather} location={location} loading={loading} />
        </div>
      </div>
    </main>
  );
}
