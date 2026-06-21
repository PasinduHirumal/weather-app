import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Calendar } from 'lucide-react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { getWeatherInfo, getUviCategory, formatTime, formatDate } from '../../../utils/weatherUtils';
import { showMonitor } from '../../../lib/webStatus';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
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
      stiffness: 100,
      damping: 15
    }
  }
};

export default function RightPanel({ weather, airQuality, location, loading }) {
  const isLoaded = !loading && !!weather;

  const progressSpring = useSpring(0, { stiffness: 60, damping: 15 });
  const shouldJumpRef = useRef(true);

  const getMinutesFromIso = (isoStr) => {
    if (!isoStr) return 0;
    try {
      const timePart = isoStr.split('T')[1];
      if (!timePart) return 0;
      const [h, m] = timePart.split(':').map(Number);
      return h * 60 + m;
    } catch (e) {
      return 0;
    }
  };

  // State for current minutes in the target location
  const [lastWeatherTime, setLastWeatherTime] = useState(weather?.current?.time);
  const [currentMinutes, setCurrentMinutes] = useState(() => 
    weather?.current?.time ? getMinutesFromIso(weather.current.time) : 0
  );

  // Sync state if props change (React render-phase adjustments)
  if (weather?.current?.time !== lastWeatherTime) {
    setLastWeatherTime(weather?.current?.time);
    setCurrentMinutes(weather?.current?.time ? getMinutesFromIso(weather.current.time) : 0);
    shouldJumpRef.current = true;
  }

  // Ticking local clock matching selected location timezone
  useEffect(() => {
    if (!isLoaded || typeof weather?.utc_offset_seconds === 'undefined') return;

    const updateClock = () => {
      const utcDate = new Date();
      const utcTime = utcDate.getTime() + utcDate.getTimezoneOffset() * 60000;
      const targetTime = new Date(utcTime + (weather.utc_offset_seconds * 1000));
      
      const minutes = targetTime.getHours() * 60 + targetTime.getMinutes();
      setCurrentMinutes(minutes);
    };

    updateClock();
    const interval = setInterval(updateClock, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [isLoaded, weather?.utc_offset_seconds]);

  // Calculate target progress using minutes from midnight
  const sunriseMinutes = getMinutesFromIso(weather?.daily?.sunrise?.[0]);
  const sunsetMinutes = getMinutesFromIso(weather?.daily?.sunset?.[0]);

  let targetProgress = 0.4;
  if (isLoaded && sunriseMinutes && sunsetMinutes && currentMinutes) {
    if (currentMinutes <= sunriseMinutes) {
      targetProgress = 0;
    } else if (currentMinutes >= sunsetMinutes) {
      targetProgress = 1;
    } else {
      targetProgress = (currentMinutes - sunriseMinutes) / (sunsetMinutes - sunriseMinutes);
    }
  }

  // Sync the spring to target progress
  useEffect(() => {
    if (isLoaded) {
      if (shouldJumpRef.current) {
        if (typeof progressSpring.jump === 'function') {
          progressSpring.jump(targetProgress);
        } else {
          progressSpring.set(targetProgress);
        }
        shouldJumpRef.current = false;
      } else {
        progressSpring.set(targetProgress);
      }
    } else {
      if (typeof progressSpring.jump === 'function') {
        progressSpring.jump(0);
      } else {
        progressSpring.set(0);
      }
      shouldJumpRef.current = true;
    }
  }, [isLoaded, targetProgress, progressSpring]);

  // Derived coordinates for the sun icon
  const sunX = useTransform(progressSpring, (p) => {
    const angleRad = Math.PI - p * Math.PI;
    return 100 + 85 * Math.cos(angleRad);
  });

  const sunY = useTransform(progressSpring, (p) => {
    const angleRad = Math.PI - p * Math.PI;
    return 90 - 85 * Math.sin(angleRad);
  });

  // Safe evaluations for weather fields
  const currentTemp = isLoaded ? Math.round(weather.current.temperature_2m) : 0;
  const sunriseStr = isLoaded ? formatTime(weather.daily.sunrise[0]) || '06:00 AM' : '06:00 AM';
  const sunsetStr = isLoaded ? formatTime(weather.daily.sunset[0]) || '06:00 PM' : '06:00 PM';
  const uviVal = isLoaded ? (weather.daily.uv_index_max[0] || 0) : 0;
  const { text: uviText, badgeClass } = getUviCategory(uviVal);

  const predictions = [];
  if (isLoaded) {
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
  }

  const locationText = isLoaded
    ? (location.country ? `${location.name}, ${location.country}` : location.name)
    : '';

  return (
    <div className="bg-slate-50/50 dark:bg-slate-950/40 w-full lg:w-[350px] flex flex-col p-6 lg:p-8 justify-between gap-8 lg:h-full lg:overflow-y-auto">
      <AnimatePresence mode="wait">
        {!isLoaded ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col justify-between gap-8 min-h-full w-full animate-pulse"
          >
            <div className="flex flex-col gap-4">
              <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
              <div className="h-28 bg-slate-100 dark:bg-slate-800/60 rounded-[28px] mt-2"></div>
            </div>
            <div className="h-24 bg-slate-100 dark:bg-slate-800/40 rounded-[28px]"></div>
            <div className="flex flex-col gap-4 flex-1 justify-end mt-4">
              <div className="h-5 w-36 bg-slate-200 dark:bg-slate-800 rounded-lg mb-2"></div>
              <div className="h-16 bg-slate-100 dark:bg-slate-800/40 rounded-2xl"></div>
              <div className="h-16 bg-slate-100 dark:bg-slate-800/40 rounded-2xl"></div>
              <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl mt-4"></div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="flex flex-col justify-between gap-8 min-h-full w-full"
          >
            {/* Sun & Location Temperature section */}
            <motion.div variants={itemVariants} className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="max-w-[70%]">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Sun</span>
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold text-sm mt-1">
                    <span className="truncate" title={locationText}>{locationText}</span>
                  </div>
                </div>
                <span className="text-3xl font-black text-slate-800 dark:text-slate-100">{currentTemp}°C</span>
              </div>

              {/* Sun Trajectory Path (Custom SVG) */}
              <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-900 border border-slate-100/50 dark:border-slate-800/80 rounded-[28px] p-5 shadow-sm mt-2 relative overflow-hidden group">
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
                      className="stroke-[#E2E8F0] dark:stroke-slate-700"
                      strokeWidth="2.5"
                      strokeDasharray="4 4"
                    />

                    {/* Filled Semicircle Trajectory for elapsed day */}
                    <motion.path
                      d="M 15,90 A 85,85 0 0,1 185,90"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="stroke-amber-500"
                      style={{ pathLength: progressSpring }}
                    />

                    {/* Sunrise / Sunset labels inside SVG */}
                    <circle cx="15" cy="90" r="3.5" fill="#EF4444" />
                    <circle cx="185" cy="90" r="3.5" fill="#F59E0B" />

                    {/* Sun Position Icon */}
                    <motion.g style={{ x: sunX, y: sunY }} className="animate-pulse">
                      <circle cx="0" cy="0" r="8" fill="#F59E0B" filter="url(#glow)" />
                      <motion.circle 
                        cx="0" 
                        cy="0" 
                        r="12" 
                        fill="none" 
                        stroke="#F59E0B" 
                        strokeWidth="1" 
                        strokeDasharray="2 2" 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                      />
                    </motion.g>
                  </svg>
                </div>

                {/* Time text markers */}
                <div className="flex items-center justify-between w-full mt-3 border-t border-slate-50 dark:border-slate-800/80 pt-3 text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider">
                  <div className="text-left">
                    <span className="block text-slate-300 dark:text-slate-600">Sunrise</span>
                    <span className="text-slate-600 dark:text-slate-300 mt-0.5 block">{sunriseStr}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-slate-300 dark:text-slate-600">Sunset</span>
                    <span className="text-slate-600 dark:text-slate-300 mt-0.5 block">{sunsetStr}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* UV Index card */}
            <motion.div variants={itemVariants} className="bg-[#1E293B] dark:bg-slate-900 text-white rounded-[28px] p-5 shadow-md border dark:border-slate-800/80 flex items-center justify-between group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-white dark:text-slate-100">{Math.round(uviVal)} UVI</span>
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${badgeClass}`}>
                    {uviText}
                  </span>
                </div>
                <p className="text-xs text-slate-300 dark:text-slate-400 mt-1 font-medium leading-relaxed max-w-[170px]">
                  {uviVal <= 2 ? 'Low risk from UV rays.' : uviVal <= 5 ? 'Moderate risk of skin damage.' : 'High risk. Take sun protection.'}
                </p>
              </div>
              
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                <Sun className="stroke-[2.2] animate-spin" style={{ animationDuration: '15s' }} size={24} />
              </div>
            </motion.div>

            {/* Weather Prediction section */}
            <div className="flex flex-col gap-4 flex-1 justify-end">
              <motion.h4 variants={itemVariants} className="text-slate-800 dark:text-slate-200 text-sm font-extrabold tracking-tight uppercase">
                Weather Prediction
              </motion.h4>

              {/* Prediction list */}
              <div className="flex flex-col gap-3">
                {predictions.map((day, idx) => {
                  const Icon = day.icon;
                  return (
                    <motion.div
                      variants={itemVariants}
                      key={idx}
                      className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-100/50 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm group hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 dark:bg-slate-950/50 text-blue-500 dark:text-orange-400 group-hover:scale-105 transition-transform">
                          <Icon className="stroke-[2.2] text-orange-500" size={20} />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{day.date}</span>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold block mt-0.5">{day.desc}</span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-100/50 dark:border-slate-800/80">{day.tempRange}</span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Action / Branding Display */}
              {showMonitor && (
                <motion.div variants={itemVariants}>
                  <Link
                    to={`/monitor${window.location.search || ''}`}
                    className="w-full py-3.5 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-md shadow-orange-500/25 mt-2 select-none hover:shadow-lg hover:shadow-orange-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                  >
                    <Calendar size={14} className="stroke-[2.5]" />
                    Forecast Monitor
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
