import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Calendar as CalendarIcon, Sun, Sunrise, Sunset } from 'lucide-react';
import { motion } from 'framer-motion';
import { getWeatherInfo, getUviCategory, formatTime } from '../../utils/weatherUtils';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
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

export default function Calendar() {
  const { weather, loading, error } = useOutletContext();

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const getFormattedDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div>
      {/* Page Section Title */}
      <div className="flex items-center gap-2 mb-6 mt-2">
        <CalendarIcon className="text-orange-500 stroke-[2.2]" size={20} />
        <h3 className="text-slate-800 text-sm font-extrabold tracking-tight uppercase">
          7-Day Calendar Forecast
        </h3>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 text-orange-800 rounded-2xl text-sm font-medium flex items-center justify-between animate-fadeIn">
          <span>{error}</span>
        </div>
      )}

      {loading || !weather ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(7)].map((_, idx) => (
            <div key={idx} className="h-64 bg-slate-50 border border-slate-100 rounded-[28px] animate-pulse"></div>
          ))}
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {weather.daily.time.map((dayTime, idx) => {
            const codeVal = weather.daily.weather_code[idx];
            const { text: desc, icon: IconComponent } = getWeatherInfo(codeVal);
            const maxT = Math.round(weather.daily.temperature_2m_max[idx]);
            const minT = Math.round(weather.daily.temperature_2m_min[idx]);
            const uvi = weather.daily.uv_index_max[idx] || 0;
            const { text: uviText, badgeClass } = getUviCategory(uvi);
            const sunriseStr = formatTime(weather.daily.sunrise[idx]) || '06:00 AM';
            const sunsetStr = formatTime(weather.daily.sunset[idx]) || '06:00 PM';

            return (
              <motion.div key={idx} variants={itemVariants}>
                <div
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
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
