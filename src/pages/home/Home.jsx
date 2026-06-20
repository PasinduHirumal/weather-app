import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/Header';
import WeatherCard from './components/WeatherCard';
import AirQualityCard from './components/AirQualityCard';
import TemperatureChartCard from './components/TemperatureChartCard';
import TomorrowCard from './components/TomorrowCard';
import RightPanel from './components/RightPanel';

export default function Home({ sidebarOpen, setSidebarOpen }) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize location from URL parameters if available, otherwise default to Colombo, Sri Lanka
  const [location, setLocation] = useState(() => {
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const name = searchParams.get('name');
    const country = searchParams.get('country');

    if (lat && lon && name) {
      return {
        name,
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        country: country || ''
      };
    }
    return {
      name: 'Colombo',
      latitude: 6.9271,
      longitude: 79.8612,
      country: 'Sri Lanka'
    };
  });

  const [weatherData, setWeatherData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync state with URL search parameters if they change
  useEffect(() => {
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const name = searchParams.get('name');
    const country = searchParams.get('country');

    if (lat && lon && name) {
      const parsedLat = parseFloat(lat);
      const parsedLon = parseFloat(lon);
      if (parsedLat !== location.latitude || parsedLon !== location.longitude || name !== location.name) {
        setLocation({
          name,
          latitude: parsedLat,
          longitude: parsedLon,
          country: country || ''
        });
      }
    }
  }, [searchParams]);

  // Update URL search parameters when location state changes
  useEffect(() => {
    setSearchParams({
      lat: location.latitude.toString(),
      lon: location.longitude.toString(),
      name: location.name,
      country: location.country || ''
    }, { replace: true });
  }, [location.latitude, location.longitude, location.name, location.country, setSearchParams]);

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
            const revGeoUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`;
            const res = await fetch(revGeoUrl, {
              headers: { 'User-Agent': 'NgijihWeatherApp/1.0' }
            });
            if (res.ok) {
              const data = await res.json();
              const cityName = data.address.city || data.address.town || data.address.village || data.address.suburb || 'Current Location';
              const countryName = data.address.country || '';
              
              if (latitude === location.latitude && longitude === location.longitude) {
                fetchWeatherData(latitude, longitude, cityName, countryName);
              } else {
                setLocation({
                  name: cityName,
                  latitude,
                  longitude,
                  country: countryName
                });
              }
            } else {
              if (latitude === location.latitude && longitude === location.longitude) {
                fetchWeatherData(latitude, longitude, 'Current Location', '');
              } else {
                setLocation({
                  name: 'Current Location',
                  latitude,
                  longitude,
                  country: ''
                });
              }
            }
          } catch (e) {
            if (latitude === location.latitude && longitude === location.longitude) {
              fetchWeatherData(latitude, longitude, 'Current Location', '');
            } else {
              setLocation({
                name: 'Current Location',
                latitude,
                longitude,
                country: ''
              });
            }
          }
        },
        (err) => {
          console.warn('Geolocation access denied/failed:', err);
          if (!weatherData) {
            setLocation({
              name: 'Colombo',
              latitude: 6.9271,
              longitude: 79.8612,
              country: 'Sri Lanka'
            });
          } else {
            setLoading(false);
          }
        }
      );
    } else {
      console.warn('Geolocation is not supported by this browser.');
    }
  };

  const handleSelectLocation = (selected) => {
    if (selected.latitude === location.latitude && selected.longitude === location.longitude) {
      fetchWeatherData(selected.latitude, selected.longitude, selected.name, selected.country || '');
    } else {
      setLocation({
        name: selected.name,
        latitude: selected.latitude,
        longitude: selected.longitude,
        country: selected.country || ''
      });
    }
  };

  return (
    <>
      {/* Dashboard Core Area */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 justify-between overflow-y-auto lg:h-full lg:overflow-y-auto">
        <div>
          <Header 
            onSelectLocation={handleSelectLocation} 
            location={location} 
            weather={weatherData}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WeatherCard weather={weatherData} loading={loading} />
              <AirQualityCard airQuality={airQualityData} weather={weatherData} loading={loading} />
            </div>
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
    </>
  );
}
