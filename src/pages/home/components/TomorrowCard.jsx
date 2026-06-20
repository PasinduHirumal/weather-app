import React from 'react';
import tomorrowBg from '../../../assets/tomorrow_rainy_bg.png';
import { getWeatherInfo } from '../../../utils/weatherUtils';

export default function TomorrowCard({ weather, location, loading }) {
  if (loading || !weather) {
    return (
      <div className="bg-slate-50 rounded-[32px] p-5 sm:p-6 shadow-sm flex flex-col h-[360px] justify-between relative overflow-hidden animate-pulse border border-slate-100">
        <div className="flex flex-col gap-2">
          <div className="h-4 w-20 bg-slate-200 rounded-lg"></div>
          <div className="h-8 w-44 bg-slate-200 rounded-xl mt-2"></div>
        </div>
        <div className="flex flex-col gap-2 mt-auto">
          <div className="h-10 w-24 bg-slate-200 rounded-xl"></div>
          <div className="h-5 w-20 bg-slate-200 rounded-lg mt-1"></div>
        </div>
      </div>
    );
  }

  const weatherCode = weather.daily.weather_code[1];
  const { text: weatherDesc, icon: WeatherIcon } = getWeatherInfo(weatherCode);
  const tomorrowTemp = Math.round(weather.daily.temperature_2m_max[1]);

  // Adjust card base background color dynamically based on weather code for premium look
  let cardBg = 'bg-[#D2E984]'; // Default rainy (lime green)
  
  if (weatherCode === 0 || weatherCode === 1) {
    // Clear/Sunny
    cardBg = 'bg-[#FFE28A]'; 
  } else if (weatherCode === 2 || weatherCode === 3) {
    // Cloudy
    cardBg = 'bg-[#CBE5F5]';
  } else if (weatherCode >= 71 && weatherCode <= 77) {
    // Snowy
    cardBg = 'bg-[#E3F2FD]';
  }

  return (
    <div className={`${cardBg} rounded-[32px] p-5 sm:p-6 shadow-sm flex flex-col h-[360px] justify-between relative overflow-hidden group hover:shadow-md transition-all duration-300`}>
      {/* Background illustration */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-90 group-hover:scale-105 transition-transform duration-[600ms] pointer-events-none mix-blend-multiply" 
        style={{ backgroundImage: `url(${tomorrowBg})` }}
      >
        {/* Soft gradient to protect text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/5"></div>
      </div>

      {/* Top Details (Foreground) */}
      <div className="relative z-10 flex flex-col gap-0.5 text-slate-800">
        <span className="text-xs font-bold text-slate-750 uppercase tracking-widest flex items-center gap-1.5">
          <WeatherIcon size={14} className="text-slate-850" />
          Tomorrow
        </span>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1 truncate">
          {location.name}
        </h3>
      </div>

      {/* Bottom Temperature Details (Foreground) */}
      <div className="relative z-10 mt-auto text-slate-955">
        <span className="text-4xl font-extrabold tracking-tight">{tomorrowTemp}°C</span>
        <p className="text-sm font-extrabold mt-0.5">{weatherDesc}</p>
      </div>
    </div>
  );
}
