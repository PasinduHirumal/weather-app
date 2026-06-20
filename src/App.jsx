import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import WeatherCard from './components/WeatherCard';
import AirQualityCard from './components/AirQualityCard';
import TemperatureChartCard from './components/TemperatureChartCard';
import TomorrowCard from './components/TomorrowCard';
import RightPanel from './components/RightPanel';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location, setLocation] = useState({
    name: 'London',
    latitude: 51.5085,
    longitude: -0.1257,
    country: 'United Kingdom'
  });
  const [weatherData, setWeatherData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set initial sidebar state based on screen width on client side
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setSidebarOpen(true);
    }
  }, []);

  // Fetch weather and air quality data concurrently
  const fetchWeatherData = async (lat, lon, name, country) => {
    setLoading(true);
    setError(null);
    try {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,visibility&hourly=temperature_2m,precipitation_probability,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`;
      const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5`;

      const [weatherRes, aqRes] = await Promise.all([
        fetch(weatherUrl),
        fetch(aqUrl)
      ]);

      if (!weatherRes.ok || !aqRes.ok) {
        throw new Error('Failed to retrieve data from Open-Meteo');
      }

      const weatherJson = await weatherRes.json();
      const aqJson = await aqRes.json();

      setWeatherData(weatherJson);
      setAirQualityData(aqJson);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Could not retrieve weather data. Please search for a city or try again.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger data fetch whenever location changes
  useEffect(() => {
    fetchWeatherData(location.latitude, location.longitude, location.name, location.country);
  }, [location.latitude, location.longitude]);

  // Request browser geolocation on mount
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Reverse geocode to get a readable name
            const revGeoUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`;
            const res = await fetch(revGeoUrl, {
              headers: { 'User-Agent': 'NgijihWeatherApp/1.0' }
            });
            if (res.ok) {
              const data = await res.json();
              const cityName = data.address.city || data.address.town || data.address.village || data.address.suburb || 'Current Location';
              const countryName = data.address.country || '';
              setLocation({
                name: cityName,
                latitude,
                longitude,
                country: countryName
              });
            } else {
              setLocation({
                name: 'Current Location',
                latitude,
                longitude,
                country: ''
              });
            }
          } catch (e) {
            setLocation({
              name: 'Current Location',
              latitude,
              longitude,
              country: ''
            });
          }
        },
        (err) => {
          console.warn('Geolocation access denied/failed:', err);
          // If browser location fails, stick to current location (or default London)
          if (!weatherData) {
            setLocation({
              name: 'London',
              latitude: 51.5085,
              longitude: -0.1257,
              country: 'United Kingdom'
            });
          }
        }
      );
    } else {
      console.warn('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    handleUseCurrentLocation();
  }, []);

  const handleSelectLocation = (selected) => {
    setLocation({
      name: selected.name,
      latitude: selected.latitude,
      longitude: selected.longitude,
      country: selected.country || ''
    });
  };

  return (
    <div className="min-h-screen w-full flex bg-white transition-all duration-300">
      {/* Main Full-Screen Layout Wrapper */}
      <div className="flex flex-col lg:flex-row w-full min-h-screen lg:h-screen lg:overflow-hidden">
        
        {/* Navigation Sidebar */}
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Dashboard Core Area */}
        <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 justify-between overflow-y-auto lg:h-full lg:overflow-y-auto">
          <div>
            {/* Header Greeting and Search */}
            <Header 
              onSelectLocation={handleSelectLocation} 
              location={location} 
              onUseCurrentLocation={handleUseCurrentLocation}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />

            {error && (
              <div className="mb-6 p-4 bg-orange-50 border border-orange-200 text-orange-800 rounded-2xl text-sm font-medium flex items-center justify-between animate-fadeIn">
                <span>{error}</span>
                <button onClick={() => fetchWeatherData(location.latitude, location.longitude, location.name, location.country)} className="underline font-bold hover:text-orange-900 ml-2">Retry</button>
              </div>
            )}

            {/* Dashboard Cards Grid Layout */}
            <main className="grid grid-cols-1 gap-6">
              {/* Row 1: Weather Info & Air Quality */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <WeatherCard weather={weatherData} loading={loading} />
                <AirQualityCard airQuality={airQualityData} weather={weatherData} loading={loading} />
              </div>

              {/* Row 2: Temperature Curve Chart & Tomorrow Forecast Card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <TemperatureChartCard weather={weatherData} loading={loading} />
                </div>
                <div className="lg:col-span-1">
                  <TomorrowCard weather={weatherData} location={location} loading={loading} />
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Right Info Panel (Sun Trajectory, UV Index, Predictions) */}
        <RightPanel 
          weather={weatherData} 
          airQuality={airQualityData} 
          location={location} 
          loading={loading} 
        />

      </div>
    </div>
  );
}

export default App;
