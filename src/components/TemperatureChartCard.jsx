import React, { useState } from 'react';
import { Thermometer, CloudRain, Wind, Sun, Cloud, CloudSun } from 'lucide-react';
import { getWeatherInfo } from '../utils/weatherUtils';

export default function TemperatureChartCard({ weather, loading }) {
  const [activeTab, setActiveTab] = useState('temp');
  const [hoveredIndex, setHoveredIndex] = useState(1); // Default afternoon active

  if (loading || !weather) {
    return (
      <div className="bg-white rounded-[32px] p-5 sm:p-6 shadow-sm border border-slate-100/50 flex flex-col justify-between h-[360px] animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-6 w-52 bg-slate-200 rounded-lg"></div>
          <div className="h-8 w-24 bg-slate-200 rounded-xl"></div>
        </div>
        <div className="h-40 bg-slate-50 rounded-2xl my-4"></div>
        <div className="grid grid-cols-4 gap-4 mt-auto">
          <div className="h-10 bg-slate-100 rounded-xl"></div>
          <div className="h-10 bg-slate-100 rounded-xl"></div>
          <div className="h-10 bg-slate-100 rounded-xl"></div>
          <div className="h-10 bg-slate-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  // Hourly indices: Morning (8 AM = index 8), Afternoon (2 PM = index 14), Evening (6 PM = index 18), Night (10 PM = index 22)
  const timeSlots = [
    { label: 'Morning', time: '08:00 AM', index: 8 },
    { label: 'Afternoon', time: '02:00 PM', index: 14 },
    { label: 'Evening', time: '06:00 PM', index: 18 },
    { label: 'Night', time: '10:00 PM', index: 22 }
  ];

  // Extract raw values from API response based on active tab
  const getRawValues = () => {
    if (activeTab === 'temp') {
      return timeSlots.map(slot => weather.hourly.temperature_2m[slot.index]);
    } else if (activeTab === 'rain') {
      return timeSlots.map(slot => weather.hourly.precipitation_probability[slot.index]);
    } else { // wind
      return timeSlots.map(slot => weather.hourly.wind_speed_10m[slot.index]);
    }
  };

  const values = getRawValues();
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  // Scale Y coordinates between 45 (high peak) and 115 (low trough)
  const yCoords = values.map(val => {
    if (activeTab === 'rain') {
      // Scale rain probability (0 to 100%) directly
      return 115 - (val / 100) * 70;
    }
    // Scale temp or wind speed dynamically
    return 115 - ((val - minVal) / range) * 70;
  });

  const xCoords = [62, 172, 282, 392];

  // Generate bezier path
  const wavePath = `M ${xCoords[0]},${yCoords[0]} ` +
    `C ${xCoords[0] + 55},${yCoords[0]} ${xCoords[1] - 55},${yCoords[1]} ${xCoords[1]},${yCoords[1]} ` +
    `C ${xCoords[1] + 55},${yCoords[1]} ${xCoords[2] - 55},${yCoords[2]} ${xCoords[2]},${yCoords[2]} ` +
    `C ${xCoords[2] + 55},${yCoords[2]} ${xCoords[3] - 55},${yCoords[3]} ${xCoords[3]},${yCoords[3]}`;

  // Build points with labels
  const dataPoints = timeSlots.map((slot, idx) => {
    const rawVal = values[idx];
    let displayVal = '';
    let IconComponent = Cloud;

    if (activeTab === 'temp') {
      displayVal = `${Math.round(rawVal)}°`;
      IconComponent = getWeatherInfo(weather.hourly.weather_code[slot.index]).icon;
    } else if (activeTab === 'rain') {
      displayVal = `${Math.round(rawVal)}%`;
      IconComponent = CloudRain;
    } else {
      displayVal = `${Math.round(rawVal)} km/h`;
      IconComponent = Wind;
    }

    return {
      label: slot.label,
      time: slot.time,
      display: displayVal,
      x: xCoords[idx],
      y: yCoords[idx],
      icon: IconComponent
    };
  });

  return (
    <div className="bg-white rounded-[32px] p-5 sm:p-6 shadow-sm border border-slate-100/50 flex flex-col justify-between h-[360px] group hover:shadow-md transition-all duration-300">
      {/* Header and Filter Tabs */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-slate-800 tracking-tight max-w-[200px] sm:max-w-none">
          How's the weather today?
        </h3>
        
        {/* Toggle tabs */}
        <div className="flex items-center bg-slate-50 border border-slate-100 p-1.5 rounded-2xl gap-1">
          <button
            onClick={() => {
              setActiveTab('temp');
              setHoveredIndex(1);
            }}
            title="Temperature"
            className={`p-2 rounded-xl transition-all duration-300 cursor-pointer ${
              activeTab === 'temp'
                ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <Thermometer size={16} className="stroke-[2.5]" />
          </button>
          
          <button
            onClick={() => {
              setActiveTab('rain');
              setHoveredIndex(1);
            }}
            title="Rain Probability"
            className={`p-2 rounded-xl transition-all duration-300 cursor-pointer ${
              activeTab === 'rain'
                ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <CloudRain size={16} className="stroke-[2.5]" />
          </button>

          <button
            onClick={() => {
              setActiveTab('wind');
              setHoveredIndex(1);
            }}
            title="Wind Speed"
            className={`p-2 rounded-xl transition-all duration-300 cursor-pointer ${
              activeTab === 'wind'
                ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <Wind size={16} className="stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative flex-1 flex items-center justify-center mt-4">
        <svg 
          viewBox="0 0 450 150" 
          className="w-full h-full max-h-[160px] overflow-visible"
        >
          {/* Defs for gradients & shadow filters */}
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F97316" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#F97316" stopOpacity="0.0" />
            </linearGradient>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#F97316" floodOpacity="0.15" />
            </filter>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#F87171" />
            </linearGradient>
          </defs>

          {/* Area fill under curve */}
          <path 
            d={`${wavePath} L 392,150 L 62,150 Z`} 
            fill="url(#chartGradient)" 
            className="transition-all duration-500"
          />

          {/* Connection Wave Curve */}
          <path
            d={wavePath}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="transition-all duration-500"
            filter="url(#shadow)"
          />

          {/* Hover guidelines */}
          {hoveredIndex !== null && dataPoints[hoveredIndex] && (
            <line
              x1={dataPoints[hoveredIndex].x}
              y1={dataPoints[hoveredIndex].y}
              x2={dataPoints[hoveredIndex].x}
              y2={135}
              stroke="#E2E8F0"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="animate-pulse"
            />
          )}

          {/* Data Points */}
          {dataPoints.map((point, index) => {
            const IconComponent = point.icon;
            const isHovered = hoveredIndex === index;
            
            return (
              <g 
                key={index} 
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
              >
                {/* Invisible larger hover trigger area */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="24"
                  fill="transparent"
                />

                {/* Styled weather icon above point */}
                <foreignObject 
                  x={point.x - 14} 
                  y={point.y - 44} 
                  width="28" 
                  height="28"
                  className="overflow-visible"
                >
                  <div className={`flex items-center justify-center w-7 h-7 rounded-full bg-white shadow-sm border border-slate-100 transition-all duration-350 ${isHovered ? 'scale-120 border-orange-200' : 'opacity-85'}`}>
                    <IconComponent className={`stroke-[2.2] ${isHovered ? 'text-orange-500' : 'text-slate-400'}`} size={14} />
                  </div>
                </foreignObject>

                {/* Point dot on the line */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isHovered ? "7" : "4.5"}
                  fill={isHovered ? "#FFFFFF" : "#1E293B"}
                  stroke={isHovered ? "#F97316" : "none"}
                  strokeWidth={isHovered ? "3.5" : "0"}
                  className="transition-all duration-300 shadow-md"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Dynamic X-Axis Labels */}
      <div className="grid grid-cols-4 w-full border-t border-slate-100/70 pt-4 px-2">
        {dataPoints.map((point, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center cursor-pointer"
            onMouseEnter={() => setHoveredIndex(index)}
          >
            <span className={`text-base font-extrabold transition-all duration-200 ${hoveredIndex === index ? 'text-slate-800 scale-105' : 'text-slate-500'}`}>
              {point.display}
            </span>
            <span className="text-[11px] text-slate-400 font-bold mt-1 uppercase tracking-wider">
              {point.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
