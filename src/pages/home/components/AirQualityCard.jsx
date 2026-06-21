import React from 'react';
import airQualityBg from '../../../assets/air_quality_bg.png';
import { Wind } from 'lucide-react';
import { getAqiCategory, getWindDirection } from '../../../utils/weatherUtils';

export default function AirQualityCard({ airQuality, weather, loading }) {
  if (loading || !airQuality || !weather) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-[32px] p-5 sm:p-6 shadow-sm border border-slate-100/50 dark:border-slate-800/80 flex flex-col h-[320px] justify-between relative overflow-hidden animate-pulse">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800"></div>
            <div className="h-6 w-28 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          </div>
          <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded-lg mt-1"></div>
          <div className="h-14 w-24 bg-slate-200 dark:bg-slate-800 rounded-2xl mt-5"></div>
          <div className="h-5 w-28 bg-slate-200 dark:bg-slate-800 rounded-lg mt-2"></div>
        </div>
        <div className="h-16 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl mt-auto"></div>
      </div>
    );
  }

  const aqiVal = Math.round(airQuality.current.us_aqi);
  const pm2_5 = airQuality.current.pm2_5.toFixed(1);
  const { text: aqiCategory, colorClass, standardLevel } = getAqiCategory(aqiVal);
  const windDir = getWindDirection(weather.current.wind_direction_10m);

  // Map AQI (0 to 500 scale) to percentage for the slider slider (cap between 5% and 95%)
  const percentage = Math.min(Math.max((aqiVal / 500) * 100, 5), 95);

  return (
    <div className="bg-white rounded-[32px] p-5 sm:p-6 shadow-sm border border-slate-100/50 flex flex-col h-[320px] justify-between relative overflow-hidden group hover:shadow-md transition-all duration-300">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-90 mix-blend-multiply group-hover:scale-105 transition-transform duration-[600ms] pointer-events-none" 
        style={{ backgroundImage: `url(${airQualityBg})` }}
      >
      </div>

      {/* Top Details (Foreground) */}
      <div className="relative z-10 flex flex-col gap-1 text-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Wind className="text-blue-500 stroke-[2.2]" size={20} />
              Air Quality
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Main pollutant : PM 2.5 ({pm2_5} µg/m³)</p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2.5">
          <span className="text-5xl font-extrabold tracking-tight">{aqiVal}</span>
          <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border ${colorClass}`}>
            AQI - {aqiCategory}
          </span>
        </div>
        <p className="text-sm font-bold text-slate-700 mt-1">{windDir}</p>
      </div>

      {/* Bottom Range Slider (Foreground) */}
      <div className="relative z-10 bg-white/80 backdrop-blur-md border border-white/50 rounded-2xl p-4 mt-auto shadow-sm">
        {/* Slider Indicator Card */}
        <div className="relative w-full h-2 bg-slate-200/80 rounded-full mb-5">
          {/* Active path */}
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 via-amber-400 to-red-500 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          ></div>
          
          {/* Active indicator bubble */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 -mt-5 transition-all duration-500"
            style={{ left: `${percentage}%`, transform: 'translate(-50%, -55%)' }}
          >
            <div className="bg-[#1E293B] text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg relative shadow-md whitespace-nowrap">
              {standardLevel}
              {/* Little downward triangle tail */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[#1E293B]"></div>
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
          <span>Good</span>
          <span className="text-slate-500 font-black">Standard</span>
          <span>Hazardous</span>
        </div>
      </div>
    </div>
  );
}
