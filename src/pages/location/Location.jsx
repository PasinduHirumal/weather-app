import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, Wind, Droplets, ArrowRight } from 'lucide-react';
import Header from '../../components/Header';
import { getWeatherInfo } from '../../utils/weatherUtils';

const DEFAULT_CITIES = [
  { name: 'Colombo', country: 'Sri Lanka', lat: 6.9271, lon: 79.8612 },
  { name: 'London', country: 'United Kingdom', lat: 51.5085, lon: -0.1257 },
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
  { name: 'New York', country: 'United States', lat: 40.7128, lon: -74.0060 },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 }
];

export default function Location({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [cityData, setCityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeWeather, setActiveWeather] = useState(null);

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

  // Fetch weather for the active city in the URL to keep the header clock updated
  useEffect(() => {
    const fetchActiveWeather = async () => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&timezone=auto`;
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          setActiveWeather(json);
        }
      } catch (e) {
        console.error('Error fetching active weather:', e);
      }
    };
    fetchActiveWeather();
  }, [lat, lon]);

  // Fetch weather for all default cities on mount
  useEffect(() => {
    const fetchCityWeather = async () => {
      try {
        const promises = DEFAULT_CITIES.map(async (city) => {
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m`;
          const res = await fetch(url);
          if (!res.ok) throw new Error();
          const json = await res.json();
          return {
            ...city,
            temp: Math.round(json.current.temperature_2m),
            weatherCode: json.current.weather_code,
            humidity: json.current.relative_humidity_2m,
            windSpeed: Math.round(json.current.wind_speed_10m)
          };
        });

        const results = await Promise.all(promises);
        setCityData(results);
      } catch (err) {
        console.error('Error fetching global weather data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCityWeather();
  }, []);

  const handleSelectLocation = (selected) => {
    setSearchParams({
      lat: selected.latitude.toString(),
      lon: selected.longitude.toString(),
      name: selected.name,
      country: selected.country || ''
    });
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
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
              setSearchParams({
                lat: latitude.toString(),
                lon: longitude.toString(),
                name: cityName,
                country: countryName
              });
            } else {
              setSearchParams({
                lat: latitude.toString(),
                lon: longitude.toString(),
                name: 'Current Location',
                country: ''
              });
            }
          } catch (e) {
            setSearchParams({
              lat: latitude.toString(),
              lon: longitude.toString(),
              name: 'Current Location',
              country: ''
            });
          }
        }
      );
    }
  };

  const handleJumpToCity = (city) => {
    navigate(`/?lat=${city.lat || city.latitude}&lon=${city.lon || city.longitude}&name=${city.name}&country=${city.country || ''}`);
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 justify-between overflow-y-auto lg:h-full lg:overflow-y-auto">
      <div>
        {/* Shared Header Component */}
        <Header 
          onSelectLocation={handleSelectLocation}
          location={locationProp}
          weather={activeWeather}
          onUseCurrentLocation={handleUseCurrentLocation}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Page Section Title */}
        <div className="flex items-center gap-2 mb-6 mt-2">
          <MapPin className="text-orange-500 stroke-[2.2]" size={20} />
          <h3 className="text-slate-800 text-sm font-extrabold tracking-tight uppercase">
            Location Explorer
          </h3>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEFAULT_CITIES.map((_, idx) => (
              <div key={idx} className="h-44 bg-slate-50 border border-slate-100 rounded-[28px] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cityData.map((city, idx) => {
              const { text: desc, icon: Icon } = getWeatherInfo(city.weatherCode);
              return (
                <div
                  key={idx}
                  onClick={() => handleJumpToCity(city)}
                  className="bg-white border border-slate-100/70 p-5 rounded-[28px] shadow-sm flex flex-col justify-between h-44 hover:shadow-md hover:border-slate-200 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-slate-800 text-lg font-black truncate max-w-[150px]">{city.name}</h4>
                      <span className="text-slate-400 text-xs font-bold block mt-0.5">{city.country}</span>
                    </div>
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-orange-50 text-orange-500 group-hover:scale-110 transition-transform">
                      <Icon className="stroke-[2.2]" size={20} />
                    </div>
                  </div>

                  <div className="flex items-end justify-between mt-4">
                    <div>
                      <span className="text-3xl font-extrabold text-slate-850 tracking-tight">{city.temp}°C</span>
                      <p className="text-xs text-slate-500 font-bold mt-0.5 leading-none">{desc}</p>
                    </div>

                    <div className="flex flex-col gap-1 text-[10px] text-slate-400 font-bold text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Droplets size={10} className="text-blue-400" />
                        <span>{city.humidity}%</span>
                      </div>
                      <div className="flex items-center gap-1 justify-end">
                        <Wind size={10} className="text-slate-400" />
                        <span>{city.windSpeed} km/h</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-50 pt-2.5 mt-2 flex items-center justify-between text-xs font-bold text-orange-500 group-hover:text-orange-600 transition-colors">
                    <span>View Weather details</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
