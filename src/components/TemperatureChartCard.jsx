import React, { useState } from 'react';
import { Thermometer, CloudRain, Wind, Sun, Cloud, CloudSun } from 'lucide-react';

export default function TemperatureChartCard() {
  const [activeTab, setActiveTab] = useState('temp');
  const [hoveredIndex, setHoveredIndex] = useState(1); // Default afternoon active like mockup

  const dataPoints = [
    { label: 'Morning', temp: '20°', x: 62, y: 110, icon: Cloud, time: '08:00 AM' },
    { label: 'Afternoon', temp: '34°', x: 172, y: 50, icon: Sun, time: '02:00 PM', active: true },
    { label: 'Evening', temp: '28°', x: 282, y: 80, icon: CloudSun, time: '06:00 PM' },
    { label: 'Night', temp: '22°', x: 392, y: 100, icon: Cloud, time: '10:00 PM' }
  ];

  // SVG Wave path generator: connects data points with a smooth curve
  const wavePath = `M 62,110 C 117,110 117,50 172,50 C 227,50 227,80 282,80 C 337,80 337,100 392,100`;

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100/50 flex flex-col justify-between h-[360px] group hover:shadow-md transition-all duration-300">
      {/* Header and Filter Tabs */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-slate-800 tracking-tight max-w-[200px] sm:max-w-none">
          How's the temperature today?
        </h3>
        
        {/* Toggle tabs */}
        <div className="flex items-center bg-slate-50 border border-slate-100 p-1.5 rounded-2xl gap-1">
          <button
            onClick={() => setActiveTab('temp')}
            className={`p-2 rounded-xl transition-all duration-300 ${
              activeTab === 'temp'
                ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <Thermometer size={16} className="stroke-[2.5]" />
          </button>
          
          <button
            onClick={() => setActiveTab('rain')}
            className={`p-2 rounded-xl transition-all duration-300 ${
              activeTab === 'rain'
                ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <CloudRain size={16} className="stroke-[2.5]" />
          </button>

          <button
            onClick={() => setActiveTab('wind')}
            className={`p-2 rounded-xl transition-all duration-300 ${
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
          </defs>

          {/* Area fill under curve */}
          <path 
            d={`${wavePath} L 392,150 L 62,150 Z`} 
            fill="url(#chartGradient)" 
            className="transition-all duration-300"
          />

          {/* Connection Wave Curve */}
          <path
            d={wavePath}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="stroke-orange-500 transition-all duration-300"
            filter="url(#shadow)"
          />
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#F87171" />
          </linearGradient>

          {/* Hover guidelines */}
          {hoveredIndex !== null && (
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
                  <div className={`flex items-center justify-center w-7 h-7 rounded-full bg-white shadow-sm border border-slate-100 transition-transform duration-300 ${isHovered ? 'scale-120 border-orange-200' : 'opacity-85'}`}>
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

      {/* Dynamic X-Axis Labels with Temperatures */}
      <div className="grid grid-cols-4 w-full border-t border-slate-100/70 pt-4 px-2">
        {dataPoints.map((point, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center cursor-pointer"
            onMouseEnter={() => setHoveredIndex(index)}
          >
            <span className={`text-base font-extrabold transition-colors duration-200 ${hoveredIndex === index ? 'text-slate-800 scale-105' : 'text-slate-600'}`}>
              {point.temp}
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
