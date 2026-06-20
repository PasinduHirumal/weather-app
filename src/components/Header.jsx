import React from 'react';
import { Search, Bell } from 'lucide-react';
import avatarImg from '../assets/avatar.png';

export default function Header() {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full mb-8">
      {/* Profile Greeting Section */}
      <div className="flex items-center gap-4">
        <img
          src={avatarImg}
          alt="Jack Grealish"
          className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-sm"
        />
        <div>
          <span className="text-slate-400 text-xs font-semibold block uppercase tracking-wider">Hello,</span>
          <h2 className="text-slate-800 text-xl font-bold leading-tight">Jack Grealish</h2>
        </div>
      </div>

      {/* Search and Notification Section */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-none">
          <input
            type="text"
            placeholder="Search anything ..."
            className="w-full sm:w-64 pl-5 pr-11 py-2.5 rounded-full border border-slate-100 bg-slate-50/50 text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/70 placeholder:text-slate-400 transition-all duration-300"
          />
          <Search
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500 pointer-events-none stroke-[2.5]"
          />
        </div>

        <button className="relative p-2.5 rounded-full border border-slate-100 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 shadow-sm transition-all duration-300 group">
          <Bell size={18} className="stroke-[2.2] group-hover:rotate-12 transition-transform duration-300" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
}
