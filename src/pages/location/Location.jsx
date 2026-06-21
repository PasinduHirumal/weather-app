import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { MapPin, Wind, Droplets, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { getWeatherInfo } from '../../utils/weatherUtils';

const DEFAULT_CITIES = [
  { name: 'Colombo', country: 'Sri Lanka', lat: 6.9271, lon: 79.8612 },
  { name: 'London', country: 'United Kingdom', lat: 51.5085, lon: -0.1257 },
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
  { name: 'New York', country: 'United States', lat: 40.7128, lon: -74.0060 },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 90,
      damping: 14
    }
  }
};

export default function Location() {
  const navigate = useNavigate();
  const { loading: globalLoading } = useOutletContext();
  const [cityData, setCityData] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);

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
        setLoadingCities(false);
      }
    };

    fetchCityWeather();
  }, []);

  const handleJumpToCity = (city) => {
    navigate(`/?lat=${city.lat || city.latitude}&lon=${city.lon || city.longitude}&name=${city.name}&country=${city.country || ''}`);
  };

  return (
    <div>
      {/* Page Section Title */}
      <div className="flex items-center gap-2 mb-6 mt-2">
        <MapPin className="text-orange-500 stroke-[2.2]" size={20} />
        <h3 className="text-slate-800 dark:text-slate-100 text-sm font-extrabold tracking-tight uppercase">
          Location Explorer
        </h3>
        {globalLoading && (
          <div className="ml-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping"></span>
            <span className="text-[10px] text-orange-500 font-extrabold uppercase tracking-wider animate-pulse">Loading...</span>
          </div>
        )}
      </div>

      {loadingCities ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEFAULT_CITIES.map((_, idx) => (
            <div key={idx} className="h-44 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] animate-pulse"></div>
          ))}
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {cityData.map((city, idx) => {
            const { text: desc, icon: Icon } = getWeatherInfo(city.weatherCode);
            return (
              <motion.div key={idx} variants={itemVariants}>
                <div
                  onClick={() => handleJumpToCity(city)}
                  className="bg-white dark:bg-slate-900 border border-slate-100/70 dark:border-slate-800/80 p-5 rounded-[28px] shadow-sm flex flex-col justify-between h-44 hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-slate-800 dark:text-slate-100 text-lg font-black truncate max-w-[150px]">{city.name}</h4>
                      <span className="text-slate-400 dark:text-slate-550 text-xs font-bold block mt-0.5">{city.country}</span>
                    </div>
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-orange-50 dark:bg-slate-800 text-orange-500 dark:text-orange-400 group-hover:scale-110 transition-transform">
                      <Icon className="stroke-[2.2]" size={20} />
                    </div>
                  </div>

                  <div className="flex items-end justify-between mt-4">
                    <div>
                      <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">{city.temp}°C</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5 leading-none">{desc}</p>
                    </div>

                    <div className="flex flex-col gap-1 text-[10px] text-slate-400 dark:text-slate-500 font-bold text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Droplets size={10} className="text-blue-400" />
                        <span>{city.humidity}%</span>
                      </div>
                      <div className="flex items-center gap-1 justify-end">
                        <Wind size={10} className="text-slate-400 dark:text-slate-550" />
                        <span>{city.windSpeed} km/h</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-50 dark:border-slate-800/80 pt-2.5 mt-2 flex items-center justify-between text-xs font-bold text-orange-500 group-hover:text-orange-600 transition-colors">
                    <span>View Weather details</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
