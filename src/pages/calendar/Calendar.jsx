import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Sun, Sunrise, Sunset, MapPin } from 'lucide-react';
import Header from '../../components/Header';
import { getWeatherInfo, getUviCategory, formatTime } from '../../utils/weatherUtils';

export default function Calendar({ sidebarOpen, setSidebarOpen }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
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

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,visibility&hourly=temperature_2m,precipitation_probability,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to retrieve forecast data');
        const json = await res.json();
        setWeatherData(json);
      } catch (err) {
        console.error('Error fetching calendar forecast:', err);
        setError('Failed to load forecast data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [lat, lon]);

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

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const getFormattedDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 justify-between overflow-y-auto lg:h-full lg:overflow-y-auto">
      <div>
        {/* Shared Header Component */}
        <Header 
          onSelectLocation={handleSelectLocation}
          location={locationProp}
          weather={weatherData}
          onUseCurrentLocation={handleUseCurrentLocation}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Page Section Title */}
        <div className="flex items-center gap-2 mb-6 mt-2">
          <CalendarIcon className="text-orange-500 stroke-[2.2]" size={20} />
          <h3 className="text-slate-800 text-sm font-extrabold tracking-tight uppercase">
            7-Day Calendar Forecast
          </h3>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 text-orange-800 rounded-2xl text-sm font-medium flex items-center justify-between">
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(7)].map((_, idx) => (
              <div key={idx} className="h-64 bg-slate-50 border border-slate-100 rounded-[28px] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {weatherData?.daily.time.map((dayTime, idx) => {
              const codeVal = weatherData.daily.weather_code[idx];
              const { text: desc, icon: IconComponent } = getWeatherInfo(codeVal);
              const maxT = Math.round(weatherData.daily.temperature_2m_max[idx]);
              const minT = Math.round(weatherData.daily.temperature_2m_min[idx]);
              const uvi = weatherData.daily.uv_index_max[idx] || 0;
              const { text: uviText, badgeClass } = getUviCategory(uvi);
              const sunriseStr = formatTime(weatherData.daily.sunrise[idx]) || '06:00 AM';
              const sunsetStr = formatTime(weatherData.daily.sunset[idx]) || '06:00 PM';

              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-100/70 p-5 rounded-[28px] shadow-sm flex flex-col justify-between h-72 hover:shadow-md hover:border-slate-200 transition-all duration-300 group"
                >
                  {/* Day Info */}
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                        {getFormattedDateLabel(dayTime)}
                      </span>
                      <h4 className="text-slate-800 text-base font-extrabold mt-0.5">{getDayName(dayTime)}</h4>
                    </div>

                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                      <IconComponent className="stroke-[2.2]" size={20} />
                    </div>
                  </div>

                  {/* Temp and Description */}
                  <div className="my-3">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-slate-850 tracking-tight">{maxT}°C</span>
                      <span className="text-slate-400 text-xs font-bold">/ {minT}°C</span>
                    </div>
                    <p className="text-xs text-slate-500 font-bold mt-0.5">{desc}</p>
                  </div>

                  {/* UV Index metrics */}
                  <div className="bg-slate-50/80 rounded-xl p-2.5 flex items-center justify-between text-[11px] font-bold text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Sun size={12} className="text-amber-500" />
                      UV Index
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider ${badgeClass}`}>
                      {Math.round(uvi)} {uviText}
                    </span>
                  </div>

                  {/* Sunrise/Sunset */}
                  <div className="border-t border-slate-50 pt-3 mt-3 grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-bold">
                    <div className="flex items-center gap-1.5">
                      <Sunrise size={12} className="text-orange-400" />
                      <div>
                        <span className="text-[9px] text-slate-300 block leading-none">Sunrise</span>
                        <span className="text-slate-600 block mt-0.5">{sunriseStr}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 justify-end text-right">
                      <Sunset size={12} className="text-amber-500" />
                      <div>
                        <span className="text-[9px] text-slate-300 block leading-none">Sunset</span>
                        <span className="text-slate-600 block mt-0.5">{sunsetStr}</span>
                      </div>
                    </div>
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
