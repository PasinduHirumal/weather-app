import React from 'react';
import weatherBg from '../assets/weather_bg.png';
import { CloudSun } from 'lucide-react';

export default function WeatherCard() {
  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100/50 flex flex-col h-[320px] justify-between relative overflow-hidden group hover:shadow-md transition-all duration-300">
      {/* Background illustration */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-90 mix-blend-multiply group-hover:scale-105 transition-transform duration-[600ms] pointer-events-none" 
        style={{ backgroundImage: `url(${weatherBg})` }}
      >
        {/* Gradients to keep text readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-black/5"></div>
      </div>

      {/* Top Details (Foreground) */}
      <div className="relative z-10 flex flex-col gap-1 text-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <CloudSun className="text-orange-500 stroke-[2.2]" size={20} />
              Weather
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">What's the weather.</p>
          </div>
        </div>

        <div className="mt-5 flex items-baseline gap-2">
          <span className="text-5xl font-extrabold tracking-tight">22°C</span>
          <span className="text-xs font-bold text-slate-600 bg-white/80 px-2 py-0.5 rounded-full shadow-sm border border-slate-100">11°C</span>
        </div>
        <p className="text-sm font-bold text-slate-700 mt-1">Partly Cloudy</p>
      </div>

      {/* Bottom Metrics Details (Foreground) */}
      <div className="relative z-10 grid grid-cols-3 gap-2.5 mt-auto">
        <div className="bg-[#1E293B] text-white rounded-2xl p-3 flex flex-col items-center justify-center shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pressure</span>
          <span className="text-xs font-extrabold mt-1 text-white">800mb</span>
        </div>

        <div className="bg-[#EBF7E3] text-[#558B2F] rounded-2xl p-3 flex flex-col items-center justify-center shadow-sm">
          <span className="text-[10px] text-[#7CB342] font-bold uppercase tracking-wider">Visibility</span>
          <span className="text-xs font-extrabold mt-1">4.3 km</span>
        </div>

        <div className="bg-white text-slate-800 border border-slate-100 rounded-2xl p-3 flex flex-col items-center justify-center shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Humidity</span>
          <span className="text-xs font-extrabold mt-1">87%</span>
        </div>
      </div>
    </div>
  );
}
