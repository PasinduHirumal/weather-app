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

export default function TomorrowCard({ weather, location, loading }) {
  if (loading || !weather) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900 rounded-[32px] p-5 sm:p-6 shadow-sm flex flex-col h-[360px] justify-between relative overflow-hidden animate-pulse border border-slate-100 dark:border-slate-800/80">
        <div className="flex flex-col gap-2">
          <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          <div className="h-8 w-44 bg-slate-200 dark:bg-slate-800 rounded-xl mt-2"></div>
        </div>
        <div className="flex flex-col gap-2 mt-auto">
          <div className="h-10 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg mt-1"></div>
        </div>
      </div>
    );
  }

  const weatherCode = weather.daily.weather_code[1];
  const { text: weatherDesc, icon: WeatherIcon, condition } = getWeatherInfo(weatherCode);
  const tomorrowTemp = Math.round(weather.daily.temperature_2m_max[1]);

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

  return (
    <div
      className="rounded-[32px] p-5 sm:p-6 shadow-sm flex flex-col h-[360px] justify-between relative overflow-hidden group hover:shadow-md transition-all duration-300"
      style={{ backgroundColor: colors.pastelBg }}
    >
      {/* Background illustration */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90 group-hover:scale-105 transition-transform duration-[600ms] pointer-events-none mix-blend-multiply"
        style={{ backgroundImage: `url(${currentBg})` }}
      >
      </div>

      {/* Top Details (Foreground) */}
      <div className="relative z-10 flex flex-col gap-0.5" style={{ color: colors.primaryText }}>
        <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-1.5" style={{ color: colors.secondaryText }}>
          <WeatherIcon size={14} className={`${iconAnimClass}`} style={{ color: colors.accentColor }} />
          Tomorrow
        </span>
        <h3 className="text-2xl font-black tracking-tight mt-1 truncate" style={{ color: colors.primaryText }}>
          {location.name}
        </h3>
      </div>

      {/* Bottom Temperature Details (Foreground) */}
      <div className="relative z-10 mt-auto" style={{ color: colors.primaryText }}>
        <span className="text-3xl font-extrabold tracking-tight">{tomorrowTemp}°C</span>
        <p className="text-sm font-extrabold mt-0.5" style={{ color: colors.secondaryText }}>{weatherDesc}</p>
      </div>
    </div>
  );
}
