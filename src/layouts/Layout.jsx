import React, { useState, useEffect } from 'react';
import { Outlet, useSearchParams, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import RightPanel from '../pages/home/components/RightPanel';

export default function Layout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const routerLocation = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const lat = searchParams.get('lat') || '6.9271';
  const lon = searchParams.get('lon') || '79.8612';
  const cityName = searchParams.get('name') || 'Colombo';
  const countryName = searchParams.get('country') || 'Sri Lanka';

  const locationProp = {
    name: cityName,
    latitude: parseFloat(lat),
    longitude: parseFloat(lon),
    country: countryName
  };

  const isHomePage = routerLocation.pathname === '/';

  // Fetch weather and air quality data concurrently
  const fetchWeatherData = async (latVal, lonVal, nameVal, countryVal) => {
    setLoading(true);
    setError(null);
    try {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latVal}&longitude=${lonVal}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,visibility&hourly=temperature_2m,precipitation_probability,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`;
      const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latVal}&longitude=${lonVal}&current=us_aqi,pm2_5`;

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

  // Trigger data fetch whenever coordinates update in search parameters
  useEffect(() => {
    fetchWeatherData(locationProp.latitude, locationProp.longitude, locationProp.name, locationProp.country);
  }, [locationProp.latitude, locationProp.longitude]);

  const handleSelectLocation = (selected) => {
    if (selected.latitude === locationProp.latitude && selected.longitude === locationProp.longitude) {
      fetchWeatherData(selected.latitude, selected.longitude, selected.name, selected.country || '');
    } else {
      setSearchParams({
        lat: selected.latitude.toString(),
        lon: selected.longitude.toString(),
        name: selected.name,
        country: selected.country || ''
      });
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const revGeoUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`;
            const res = await fetch(revGeoUrl, {
              headers: { 'User-Agent': 'NgijihWeatherApp/1.0' }
            });
            if (res.ok) {
              const data = await res.json();
              const cityName = data.address.city || data.address.town || data.address.village || data.address.suburb || 'Current Location';
              const countryName = data.address.country || '';

              if (latitude === locationProp.latitude && longitude === locationProp.longitude) {
                fetchWeatherData(latitude, longitude, cityName, countryName);
              } else {
                setSearchParams({
                  lat: latitude.toString(),
                  lon: longitude.toString(),
                  name: cityName,
                  country: countryName
                });
              }
            } else {
              if (latitude === locationProp.latitude && longitude === locationProp.longitude) {
                fetchWeatherData(latitude, longitude, 'Current Location', '');
              } else {
                setSearchParams({
                  lat: latitude.toString(),
                  lon: longitude.toString(),
                  name: 'Current Location',
                  country: ''
                });
              }
            }
          } catch (e) {
            if (latitude === locationProp.latitude && longitude === locationProp.longitude) {
              fetchWeatherData(latitude, longitude, 'Current Location', '');
            } else {
              setSearchParams({
                lat: latitude.toString(),
                lon: longitude.toString(),
                name: 'Current Location',
                country: ''
              });
            }
          }
        },
        (err) => {
          console.warn('Geolocation access denied/failed:', err);
          if (!weatherData) {
            setSearchParams({
              lat: '6.9271',
              lon: '79.8612',
              name: 'Colombo',
              country: 'Sri Lanka'
            });
          } else {
            setLoading(false);
          }
        }
      );
    }
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
              location={locationProp}
              weather={weatherData}
              onUseCurrentLocation={handleUseCurrentLocation}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />

            {error && (
              <div className="mb-6 p-4 bg-orange-50 border border-orange-200 text-orange-800 rounded-2xl text-sm font-medium flex items-center justify-between animate-fadeIn">
                <span>{error}</span>
                <button onClick={() => fetchWeatherData(locationProp.latitude, locationProp.longitude, locationProp.name, locationProp.country)} className="underline font-bold hover:text-orange-900 ml-2">Retry</button>
              </div>
            )}

            {/* Outlets for pages body */}
            <Outlet context={{
              location: locationProp,
              weather: weatherData,
              airQuality: airQualityData,
              loading,
              error
            }} />
          </div>
        </div>

        {/* Right Info Panel (Sun Trajectory, UV Index, Predictions) - Rendered only on Home view */}
        {isHomePage && (
          <RightPanel
            weather={weatherData}
            airQuality={airQualityData}
            location={locationProp}
            loading={loading}
          />
        )}

      </div>
    </div>
  );
}
