import React from 'react';
import airQualityBg from '../assets/air_quality_bg.png';
import { Wind } from 'lucide-react';

export default function AirQualityCard() {
  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100/50 flex flex-col h-[320px] justify-between relative overflow-hidden group hover:shadow-md transition-all duration-300">
      {/* Background illustration */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-90 mix-blend-multiply group-hover:scale-105 transition-transform duration-[600ms] pointer-events-none" 
        style={{ backgroundImage: `url(${airQualityBg})` }}
      >
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-black/5"></div>
      </div>

      {/* Top Details (Foreground) */}
      <div className="relative z-10 flex flex-col gap-1 text-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Wind className="text-blue-500 stroke-[2.2]" size={20} />
              Air Quality
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Main pollutan : PM 2.5</p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2.5">
          <span className="text-5xl font-extrabold tracking-tight">390</span>
          <span className="text-xs font-extrabold text-[#7CB342] bg-[#EBF7E3] px-2.5 py-1 rounded-lg border border-[#C5E1A5]/30">AQI</span>
        </div>
        <p className="text-sm font-bold text-slate-700 mt-1">West Wind</p>
      </div>

      {/* Bottom Range Slider (Foreground) */}
      <div className="relative z-10 bg-white/80 backdrop-blur-md border border-white/50 rounded-2xl p-4 mt-auto shadow-sm">
        {/* Slider Indicator Card */}
        <div className="relative w-full h-2 bg-slate-200/80 rounded-full mb-5">
          {/* Active orange path */}
          <div className="absolute top-0 left-0 h-full w-[65%] bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
          
          {/* Active indicator bubble */}
          <div className="absolute top-1/2 left-[50%] -translate-y-1/2 -translate-x-1/2 -mt-5">
            <div className="bg-[#1E293B] text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg relative shadow-md">
              Standard
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
