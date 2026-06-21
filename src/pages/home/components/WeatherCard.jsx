import React from 'react';
import { getWeatherInfo } from '../../../utils/weatherUtils';
import useImageColors from '../../../utils/useImageColors';

// Import weather assets
import bgSunny from '../../../assets/weather/weather_sunny.png';
import bgCloudy from '../../../assets/weather/weather_cloudy.png';
import bgRainy from '../../../assets/weather/weather_rainy.png';
import bgSnowy from '../../../assets/weather/weather_snowy.png';
import bgThunderstorm from '../../../assets/weather/weather_thunderstorm.png';
import bgFoggy from '../../../assets/weather/weather_foggy.png';

export default function WeatherCard({ weather, loading }) {
  if (loading || !weather) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-[32px] p-5 sm:p-6 shadow-sm border border-slate-100/50 dark:border-slate-800/80 flex flex-col h-[320px] justify-between relative overflow-hidden animate-pulse">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800"></div>
            <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          </div>
          <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded-lg mt-1"></div>
          <div className="h-14 w-28 bg-slate-200 dark:bg-slate-800 rounded-2xl mt-5"></div>
          <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg mt-2"></div>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5 mt-auto">
          <div className="h-14 bg-slate-100 dark:bg-slate-800/50 rounded-2xl"></div>
          <div className="h-14 bg-slate-100 dark:bg-slate-800/50 rounded-2xl"></div>
          <div className="h-14 bg-slate-100 dark:bg-slate-800/50 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const currentTemp = Math.round(weather.current.temperature_2m);
  const minTemp = Math.round(weather.daily.temperature_2m_min[0]);
  const weatherCode = weather.current.weather_code;
  const { text: weatherDesc, icon: WeatherIcon, condition } = getWeatherInfo(weatherCode);

  const bgImages = {
    sunny: bgSunny,
    cloudy: bgCloudy,
    rainy: bgRainy,
    snowy: bgSnowy,
    thunderstorm: bgThunderstorm,
    foggy: bgFoggy,
  };
  const currentBg = bgImages[condition] || bgCloudy;
  const colors = useImageColors(currentBg);

  let iconAnimClass = '';
  if (condition === 'sunny') {
    iconAnimClass = 'animate-weather-spin';
  } else if (condition === 'cloudy' || condition === 'foggy') {
    iconAnimClass = 'animate-weather-bounce';
  } else {
    iconAnimClass = 'animate-weather-pulse';
  }

  const pressure = Math.round(weather.current.surface_pressure);
  const visibilityVal = weather.current.visibility;
  // Convert meters to km
  const visibility = visibilityVal ? (visibilityVal / 1000).toFixed(1) : 'N/A';
  const humidity = weather.current.relative_humidity_2m;

  return (
    <div
      className="bg-white rounded-[32px] p-5 sm:p-6 shadow-sm border flex flex-col h-[320px] justify-between relative overflow-hidden group hover:shadow-md transition-all duration-300"
      style={{ borderColor: colors.borderColor }}
    >
      {/* Background illustration */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90 mix-blend-multiply group-hover:scale-105 transition-transform duration-[600ms] pointer-events-none"
        style={{ backgroundImage: `url(${currentBg})` }}
      >
      </div>

      {/* Top Details (Foreground) */}
      <div className="relative z-10 flex flex-col gap-1" style={{ color: colors.primaryText }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: colors.primaryText }}>
              <WeatherIcon className={`stroke-[2.2] ${iconAnimClass}`} size={20} style={{ color: colors.accentColor }} />
              Weather
            </h3>
            <p className="text-xs font-semibold mt-0.5" style={{ color: colors.secondaryText }}>What's the weather.</p>
          </div>
        </div>

        <div className="mt-5 flex items-baseline gap-2">
          <span className="text-5xl font-extrabold tracking-tight" style={{ color: colors.primaryText }}>{currentTemp}°C</span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full shadow-sm border"
            style={{ backgroundColor: colors.badgeBg, color: colors.badgeText, borderColor: colors.borderColor }}
          >
            {minTemp}°C
          </span>
        </div>
        <p className="text-sm font-bold mt-1" style={{ color: colors.secondaryText }}>{weatherDesc}</p>
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

        <div
          className="border rounded-2xl p-2 sm:p-3 flex flex-col items-center justify-center shadow-sm"
          style={{ backgroundColor: colors.badgeBg, borderColor: colors.borderColor }}
        >
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.secondaryText }}>Humidity</span>
          <span className="text-xs sm:text-sm font-extrabold mt-1" style={{ color: colors.primaryText }}>{humidity}%</span>
        </div>
      </div>
    </div>
  );
}
