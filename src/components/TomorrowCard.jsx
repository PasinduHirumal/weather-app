import React from 'react';
import tomorrowBg from '../assets/tomorrow_rainy_bg.png';
import { CloudRain } from 'lucide-react';

export default function TomorrowCard() {
  return (
    <div className="bg-[#D2E984] rounded-[32px] p-6 shadow-sm flex flex-col h-[360px] justify-between relative overflow-hidden group hover:shadow-md transition-all duration-300">
      {/* Background illustration */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-90 group-hover:scale-105 transition-transform duration-[600ms] pointer-events-none mix-blend-multiply" 
        style={{ backgroundImage: `url(${tomorrowBg})` }}
      >
        {/* Soft gradient to protect text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/5"></div>
      </div>

      {/* Top Details (Foreground) */}
      <div className="relative z-10 flex flex-col gap-0.5 text-slate-800">
        <span className="text-xs font-bold text-slate-700/80 uppercase tracking-widest flex items-center gap-1.5">
          <CloudRain size={13} className="text-slate-700" />
          Tomorrow
        </span>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Alam Barzah</h3>
      </div>

      {/* Bottom Temperature Details (Foreground) */}
      <div className="relative z-10 mt-auto text-slate-900">
        <span className="text-4xl font-extrabold tracking-tight">20°C</span>
        <p className="text-sm font-bold text-slate-700 mt-1">Rainny</p>
      </div>
    </div>
  );
}
