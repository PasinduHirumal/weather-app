import React, { useState } from 'react';
import { Sun, ChevronDown, Calendar, Cloud, SunDim } from 'lucide-react';

export default function RightPanel() {
  const [location, setLocation] = useState('Banten, Indonesia');

  // Sun path arc values
  // Semicircle arc: starts at 15,90, ends at 185,90, radius 85,85
  const sunPath = "M 15,90 A 85,85 0 0,1 185,90";
  
  // Let's place the sun icon at some coordinate along the path. 
  // Let's calculate for 60% progress:
  // Center is (100, 90). Radius is 85. 
  // Angle = 180 * 0.6 = 108 degrees (from right to left, or left to right).
  // Left to right: 0% is 180 deg (15,90), 50% is 90 deg (100,5), 100% is 0 deg (185,90)
  // At 40% (mid-morning/afternoon): Angle = 180 - (180 * 0.45) = 99 degrees.
  // x = 100 + 85 * cos(99 deg) = 100 + 85 * (-0.156) = 86.7
  // y = 90 - 85 * sin(99 deg) = 90 - 85 * (0.987) = 6.1
  const sunX = 86;
  const sunY = 32;

  return (
    <div className="bg-slate-50/50 w-full lg:w-[350px] flex flex-col p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-slate-100/70 justify-between gap-8">
      
      {/* Sun & Location Temperature section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Sun</span>
            <button className="flex items-center gap-1 text-slate-700 hover:text-slate-900 font-bold text-sm mt-1 transition-colors">
              {location}
              <ChevronDown size={14} className="stroke-[2.5] text-slate-500" />
            </button>
          </div>
          <span className="text-3xl font-black text-slate-800">22°C</span>
        </div>

        {/* Sun Trajectory Path (Custom SVG) */}
        <div className="flex flex-col items-center justify-center bg-white border border-slate-100/50 rounded-[28px] p-5 shadow-sm mt-2 relative overflow-hidden group">
          <div className="w-full h-[110px] relative mt-2">
            <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="sunPathGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                </linearGradient>
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
                d={sunPath}
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />

              {/* Filled Semicircle Trajectory for elapsed day */}
              <path
                d="M 15,90 A 85,85 0 0,1 86,32"
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
                {/* Sun rays effect */}
                <circle cx="0" cy="0" r="12" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 2" className="animate-spin" style={{ transformOrigin: 'center', animationDuration: '10s' }} />
              </g>
            </svg>
          </div>

          {/* Time text markers */}
          <div className="flex items-center justify-between w-full mt-3 border-t border-slate-50 pt-3 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
            <div className="text-left">
              <span className="block text-slate-300">Sunset</span>
              <span className="text-slate-600 mt-0.5 block">06:00 am</span>
            </div>
            <div className="text-right">
              <span className="block text-slate-300">Sunrise</span>
              <span className="text-slate-600 mt-0.5 block">06:45 am</span>
            </div>
          </div>
        </div>
      </div>

      {/* UV Index card */}
      <div className="bg-[#1E293B] text-white rounded-[28px] p-5 shadow-md flex items-center justify-between group hover:-translate-y-1 transition-all duration-300">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-white">20 UVI</span>
            <span className="text-[9px] font-extrabold text-lime-700 bg-lime-300 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Moderate
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 font-medium leading-relaxed max-w-[170px]">
            Moderate risk of from UV rays
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
          <div className="flex items-center justify-between bg-white border border-slate-100/50 rounded-2xl p-4 shadow-sm group hover:border-slate-200 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                <Cloud className="stroke-[2.2]" size={20} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-700">November 10</span>
                <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">Cloudy</span>
              </div>
            </div>
            <span className="text-xs font-black text-slate-800 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100/50">26° / 19°</span>
          </div>

          <div className="flex items-center justify-between bg-white border border-slate-100/50 rounded-2xl p-4 shadow-sm group hover:border-slate-200 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                <SunDim className="stroke-[2.2]" size={20} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-700">November 11</span>
                <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">Bright</span>
              </div>
            </div>
            <span className="text-xs font-black text-slate-800 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100/50">26° / 20°</span>
          </div>
        </div>

        {/* Next 5 Days Action Button */}
        <button className="w-full py-3.5 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 group mt-2">
          <Calendar size={14} className="stroke-[2.5]" />
          Next 5 Days
        </button>
      </div>

    </div>
  );
}
