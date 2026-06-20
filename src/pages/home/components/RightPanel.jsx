import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Calendar, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { getWeatherInfo, getUviCategory, formatTime, formatDate } from '../../../utils/weatherUtils';
import { showMonitor } from '../../../lib/webStatus';

export default function RightPanel({ weather, airQuality, location, loading }) {
  if (loading || !weather) {
    return (
      <div className="bg-slate-50/50 w-full lg:w-[350px] flex flex-col p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-slate-100/70 justify-between gap-8 lg:h-full lg:overflow-y-auto animate-pulse">
        <div className="flex flex-col gap-4">
          <div className="h-6 w-32 bg-slate-200 rounded-lg"></div>
          <div className="h-28 bg-slate-100 rounded-[28px] mt-2"></div>
        </div>
        <div className="h-24 bg-slate-150 rounded-[28px]"></div>
        <div className="flex flex-col gap-4 flex-1 justify-end mt-4">
          <div className="h-5 w-36 bg-slate-200 rounded-lg mb-2"></div>
          <div className="h-16 bg-slate-100 rounded-2xl"></div>
          <div className="h-16 bg-slate-100 rounded-2xl"></div>
          <div className="h-12 bg-slate-200 rounded-2xl mt-4"></div>
        </div>
      </div>
    );
  }

  const currentTemp = Math.round(weather.current.temperature_2m);
  
  // Format sunrise / sunset
  const sunriseStr = formatTime(weather.daily.sunrise[0]) || '06:00 AM';
  const sunsetStr = formatTime(weather.daily.sunset[0]) || '06:00 PM';

  // Calculate sun position along the arc dynamically
  // Semicircle arc: starts at 15,90 (Sunrise), ends at 185,90 (Sunset)
  const calculateSunPosition = () => {
    try {
      const sunriseTime = new Date(weather.daily.sunrise[0]).getTime();
      const sunsetTime = new Date(weather.daily.sunset[0]).getTime();
      const currentTime = new Date(weather.current.time).getTime();

      if (currentTime <= sunriseTime) {
        return { x: 15, y: 90, elapsedPath: 'M 15,90 A 85,85 0 0,1 15,90' };
      }
      if (currentTime >= sunsetTime) {
        return { x: 185, y: 90, elapsedPath: 'M 15,90 A 85,85 0 0,1 185,90' };
      }

      // Progress fraction between sunrise and sunset
      const progress = (currentTime - sunriseTime) / (sunsetTime - sunriseTime);
      
      // Center (100, 90), Radius 85
      // Angle: 180 degrees (sunrise, left) to 0 degrees (sunset, right)
      const angleRad = Math.PI - progress * Math.PI;
      const x = 100 + 85 * Math.cos(angleRad);
      const y = 90 - 85 * Math.sin(angleRad);

      return {
        x: Math.round(x),
        y: Math.round(y),
        elapsedPath: `M 15,90 A 85,85 0 0,1 ${Math.round(x)},${Math.round(y)}`
      };
    } catch (e) {
      // Fallback to 40% progress if calculations fail
      return { x: 86, y: 32, elapsedPath: 'M 15,90 A 85,85 0 0,1 86,32' };
    }
  };

  const { x: sunX, y: sunY, elapsedPath } = calculateSunPosition();

  // UV Index processing
  const uviVal = weather.daily.uv_index_max[0] || 0;
  const { text: uviText, badgeClass } = getUviCategory(uviVal);

  // Predictions: Days 2 to 6 (5 days total, excluding today and tomorrow)
  const predictions = [];
  for (let i = 2; i < 7; i++) {
    if (weather.daily.time[i]) {
      const timeVal = weather.daily.time[i];
      const codeVal = weather.daily.weather_code[i];
      const { text: desc, icon: IconComponent } = getWeatherInfo(codeVal);
      const maxT = Math.round(weather.daily.temperature_2m_max[i]);
      const minT = Math.round(weather.daily.temperature_2m_min[i]);

      predictions.push({
        date: formatDate(timeVal),
        desc,
        tempRange: `${maxT}° / ${minT}°`,
        icon: IconComponent
      });
    }
  }

  // Location display text
  const locationText = location.country 
    ? `${location.name}, ${location.country}`
    : location.name;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 90, damping: 15 }}
      className="bg-slate-50/50 w-full lg:w-[350px] flex flex-col p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-slate-100/70 justify-between gap-8 lg:h-full lg:overflow-y-auto"
    >
      
      {/* Sun & Location Temperature section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="max-w-[70%]">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Sun</span>
            <div className="flex items-center gap-1.5 text-slate-700 font-bold text-sm mt-1">
              <span className="truncate" title={locationText}>{locationText}</span>
            </div>
          </div>
          <span className="text-3xl font-black text-slate-800">{currentTemp}°C</span>
        </div>

        {/* Sun Trajectory Path (Custom SVG) */}
        <div className="flex flex-col items-center justify-center bg-white border border-slate-100/50 rounded-[28px] p-5 shadow-sm mt-2 relative overflow-hidden group">
          <div className="w-full h-[110px] relative mt-2">
            <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Dotted Semicircle Track */}
              <path
                d="M 15,90 A 85,85 0 0,1 185,90"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />

              {/* Filled Semicircle Trajectory for elapsed day */}
              <path
                d={elapsedPath}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="stroke-amber-500 transition-all duration-[1000ms]"
              />

              {/* Sunrise / Sunset labels inside SVG */}
              <circle cx="15" cy="90" r="3.5" fill="#EF4444" />
              <circle cx="185" cy="90" r="3.5" fill="#F59E0B" />

              {/* Sun Position Icon */}
              <g transform={`translate(${sunX}, ${sunY})`} className="animate-pulse">
                <circle cx="0" cy="0" r="8" fill="#F59E0B" filter="url(#glow)" />
                <circle cx="0" cy="0" r="12" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 2" className="animate-spin" style={{ transformOrigin: 'center', animationDuration: '10s' }} />
              </g>
            </svg>
          </div>

          {/* Time text markers */}
          <div className="flex items-center justify-between w-full mt-3 border-t border-slate-50 pt-3 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
            <div className="text-left">
              <span className="block text-slate-300">Sunrise</span>
              <span className="text-slate-600 mt-0.5 block">{sunriseStr}</span>
            </div>
            <div className="text-right">
              <span className="block text-slate-300">Sunset</span>
              <span className="text-slate-600 mt-0.5 block">{sunsetStr}</span>
            </div>
          </div>
        </div>
      </div>

      {/* UV Index card */}
      <div className="bg-[#1E293B] text-white rounded-[28px] p-5 shadow-md flex items-center justify-between group hover:-translate-y-1 transition-all duration-300">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-white">{Math.round(uviVal)} UVI</span>
            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${badgeClass}`}>
              {uviText}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 font-medium leading-relaxed max-w-[170px]">
            {uviVal <= 2 ? 'Low risk from UV rays.' : uviVal <= 5 ? 'Moderate risk of skin damage.' : 'High risk. Take sun protection.'}
          </p>
        </div>
        
        <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform duration-300">
          <Sun className="stroke-[2.2] animate-spin" style={{ animationDuration: '15s' }} size={24} />
        </div>
      </div>

      {/* Weather Prediction section */}
      <div className="flex flex-col gap-4 flex-1 justify-end">
        <h4 className="text-slate-800 text-sm font-extrabold tracking-tight uppercase">
          Weather Prediction
        </h4>

        {/* Prediction list */}
        <div className="flex flex-col gap-3">
          {predictions.map((day, idx) => {
            const Icon = day.icon;
            return (
              <div key={idx} className="flex items-center justify-between bg-white border border-slate-100/50 rounded-2xl p-4 shadow-sm group hover:border-slate-200 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-500 group-hover:scale-105 transition-transform">
                    <Icon className="stroke-[2.2] text-orange-500" size={20} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-700">{day.date}</span>
                    <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">{day.desc}</span>
                  </div>
                </div>
                <span className="text-xs font-black text-slate-800 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100/50">{day.tempRange}</span>
              </div>
            );
          })}
        </div>

        {/* Action / Branding Display */}
        {showMonitor && (
          <Link
            to={`/monitor${window.location.search || ''}`}
            className="w-full py-3.5 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-md shadow-orange-500/25 mt-2 select-none hover:shadow-lg hover:shadow-orange-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            <Calendar size={14} className="stroke-[2.5]" />
            Forecast Monitor
          </Link>
        )}
      </div>

    </motion.div>
  );
}
