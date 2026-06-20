import React from 'react';
import weatherBg from '../../../assets/weather_bg.png';
import { getWeatherInfo } from '../../../utils/weatherUtils';

export default function WeatherCard({ weather, loading }) {
  if (loading || !weather) {
    return (
      <div className="bg-white rounded-[32px] p-5 sm:p-6 shadow-sm border border-slate-100/50 flex flex-col h-[320px] justify-between relative overflow-hidden animate-pulse">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-slate-200"></div>
            <div className="h-6 w-24 bg-slate-200 rounded-lg"></div>
          </div>
          <div className="h-4 w-36 bg-slate-200 rounded-lg mt-1"></div>
          <div className="h-14 w-28 bg-slate-200 rounded-2xl mt-5"></div>
          <div className="h-5 w-24 bg-slate-200 rounded-lg mt-2"></div>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5 mt-auto">
          <div className="h-14 bg-slate-150 rounded-2xl"></div>
          <div className="h-14 bg-slate-150 rounded-2xl"></div>
          <div className="h-14 bg-slate-150 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const currentTemp = Math.round(weather.current.temperature_2m);
  const minTemp = Math.round(weather.daily.temperature_2m_min[0]);
  const weatherCode = weather.current.weather_code;
  const { text: weatherDesc, icon: WeatherIcon } = getWeatherInfo(weatherCode);

  const pressure = Math.round(weather.current.surface_pressure);
  const visibilityVal = weather.current.visibility; 
  // Convert meters to km
  const visibility = visibilityVal ? (visibilityVal / 1000).toFixed(1) : 'N/A';
  const humidity = weather.current.relative_humidity_2m;

  return (
    <div className="bg-white rounded-[32px] p-5 sm:p-6 shadow-sm border border-slate-100/50 flex flex-col h-[320px] justify-between relative overflow-hidden group hover:shadow-md transition-all duration-300">
      {/* Background illustration */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-90 mix-blend-multiply group-hover:scale-105 transition-transform duration-[600ms] pointer-events-none" 
        style={{ backgroundImage: `url(${weatherBg})` }}
      >
        {/* Gradients to keep text readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-black/5"></div>
      </div>

      {/* Top Details (Foreground) */}
      <div className="relative z-10 flex flex-col gap-1 text-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <WeatherIcon className="text-orange-500 stroke-[2.2]" size={20} />
              Weather
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">What's the weather.</p>
          </div>
        </div>

        <div className="mt-5 flex items-baseline gap-2">
          <span className="text-5xl font-extrabold tracking-tight">{currentTemp}°C</span>
          <span className="text-xs font-bold text-slate-600 bg-white/80 px-2 py-0.5 rounded-full shadow-sm border border-slate-100">{minTemp}°C</span>
        </div>
        <p className="text-sm font-bold text-slate-700 mt-1">{weatherDesc}</p>
      </div>

      {/* Bottom Metrics Details (Foreground) */}
      <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-2.5 mt-auto">
        <div className="bg-[#1E293B] text-white rounded-2xl p-2 sm:p-3 flex flex-col items-center justify-center shadow-sm">
          <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pressure</span>
          <span className="text-xs sm:text-sm font-extrabold mt-1 text-white">{pressure}mb</span>
        </div>

        <div className="bg-[#EBF7E3] text-[#558B2F] rounded-2xl p-2 sm:p-3 flex flex-col items-center justify-center shadow-sm">
          <span className="text-[9px] sm:text-[10px] text-[#7CB342] font-bold uppercase tracking-wider">Visibility</span>
          <span className="text-xs sm:text-sm font-extrabold mt-1">{visibility} km</span>
        </div>

        <div className="bg-white text-slate-800 border border-slate-100 rounded-2xl p-2 sm:p-3 flex flex-col items-center justify-center shadow-sm">
          <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider">Humidity</span>
          <span className="text-xs sm:text-sm font-extrabold mt-1">{humidity}%</span>
        </div>
      </div>
    </div>
  );
}
