import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudDrizzle, 
  Wind
} from 'lucide-react';

// Maps WMO Weather Codes to descriptions and Lucide Icons
// Reference: WMO weather codes on Open-Meteo
export function getWeatherInfo(code) {
  if (code === undefined || code === null) {
    return { text: 'Unknown', icon: Cloud };
  }
  
  switch (code) {
    case 0:
      return { text: 'Clear Sky', icon: Sun };
    case 1:
      return { text: 'Mainly Clear', icon: CloudSun };
    case 2:
      return { text: 'Partly Cloudy', icon: CloudSun };
    case 3:
      return { text: 'Overcast', icon: Cloud };
    case 45:
    case 48:
      return { text: 'Foggy', icon: Cloud };
    case 51:
    case 53:
    case 55:
      return { text: 'Drizzle', icon: CloudDrizzle };
    case 56:
    case 57:
      return { text: 'Freezing Drizzle', icon: CloudSnow };
    case 61:
      return { text: 'Slight Rain', icon: CloudRain };
    case 63:
      return { text: 'Moderate Rain', icon: CloudRain };
    case 65:
      return { text: 'Heavy Rain', icon: CloudRain };
    case 66:
    case 67:
      return { text: 'Freezing Rain', icon: CloudRain };
    case 71:
    case 73:
    case 75:
      return { text: 'Snow Fall', icon: CloudSnow };
    case 77:
      return { text: 'Snow Grains', icon: CloudSnow };
    case 80:
    case 81:
    case 82:
      return { text: 'Rain Showers', icon: CloudRain };
    case 85:
    case 86:
      return { text: 'Snow Showers', icon: CloudSnow };
    case 95:
      return { text: 'Thunderstorm', icon: CloudLightning };
    case 96:
    case 99:
      return { text: 'Thunderstorm with Hail', icon: CloudLightning };
    default:
      return { text: 'Cloudy', icon: Cloud };
  }
}

// Maps US AQI values to EPA categories
export function getAqiCategory(aqi) {
  if (aqi === undefined || aqi === null) {
    return { text: 'Unknown', colorClass: 'text-slate-500 bg-slate-100', standardLevel: 'Unknown' };
  }
  
  if (aqi <= 50) {
    return { text: 'Good', colorClass: 'text-[#558B2F] bg-[#EBF7E3] border-[#C5E1A5]/30', standardLevel: 'Good' };
  } else if (aqi <= 100) {
    return { text: 'Moderate', colorClass: 'text-amber-700 bg-amber-50 border-amber-200/50', standardLevel: 'Standard' };
  } else if (aqi <= 150) {
    return { text: 'Unhealthy for Sensitive Groups', colorClass: 'text-orange-700 bg-orange-50 border-orange-200/50', standardLevel: 'Standard' };
  } else if (aqi <= 200) {
    return { text: 'Unhealthy', colorClass: 'text-red-700 bg-red-50 border-red-200/50', standardLevel: 'Standard' };
  } else if (aqi <= 300) {
    return { text: 'Very Unhealthy', colorClass: 'text-purple-700 bg-purple-50 border-purple-200/50', standardLevel: 'Hazardous' };
  } else {
    return { text: 'Hazardous', colorClass: 'text-rose-950 bg-rose-100 border-rose-200/50', standardLevel: 'Hazardous' };
  }
}

// Maps UV Index value to WHO danger levels
export function getUviCategory(uvi) {
  const val = Math.round(uvi || 0);
  if (val <= 2) {
    return { text: 'Low', colorClass: 'text-[#558B2F]', bgClass: 'bg-lime-500/10', textClass: 'text-lime-400', badgeClass: 'bg-[#EBF7E3] text-[#558B2F]' };
  } else if (val <= 5) {
    return { text: 'Moderate', colorClass: 'text-amber-600', bgClass: 'bg-amber-500/10', textClass: 'text-amber-400', badgeClass: 'bg-amber-500/20 text-amber-400' };
  } else if (val <= 7) {
    return { text: 'High', colorClass: 'text-orange-600', bgClass: 'bg-orange-500/10', textClass: 'text-orange-400', badgeClass: 'bg-orange-500/20 text-orange-400' };
  } else if (val <= 10) {
    return { text: 'Very High', colorClass: 'text-red-600', bgClass: 'bg-red-500/10', textClass: 'text-red-400', badgeClass: 'bg-red-500/20 text-red-400' };
  } else {
    return { text: 'Extreme', colorClass: 'text-purple-600', bgClass: 'bg-purple-500/10', textClass: 'text-purple-400', badgeClass: 'bg-purple-500/20 text-purple-400' };
  }
}

// Converts wind direction in degrees to cardinal coordinates
export function getWindDirection(deg) {
  if (deg === undefined || deg === null) return 'N Wind';
  const val = Math.floor((deg / 22.5) + 0.5);
  const directions = [
    'North', 'NNE', 'NE', 'ENE', 
    'East', 'ESE', 'SE', 'SSE', 
    'South', 'SSW', 'SW', 'WSW', 
    'West', 'WNW', 'NW', 'NNW'
  ];
  return (directions[(val % 16)] || 'N') + ' Wind';
}

// Helper to format ISO time string to "08:00 AM" format
export function formatTime(isoString) {
  try {
    const date = new Date(isoString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  } catch (e) {
    return '';
  }
}

// Helper to format ISO date to "November 10" or similar
export function formatDate(isoString) {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  } catch (e) {
    return '';
  }
}
