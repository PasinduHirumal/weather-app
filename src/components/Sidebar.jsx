import React from 'react';
import { Home, Monitor, MapPin, Calendar, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
  const menuItems = [
    { icon: Home, id: 'home', active: true },
    { icon: Monitor, id: 'monitor' },
    { icon: MapPin, id: 'location' },
    { icon: Calendar, id: 'calendar' },
    { icon: Settings, id: 'settings' },
  ];

  return (
    <>
      {/* Backdrop overlay for mobile when sidebar is open */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      />

      <aside className={`bg-white h-full flex flex-col py-8 border-r border-slate-100 transition-all duration-300 
        fixed lg:relative inset-y-0 left-0 z-50 lg:z-30 
        ${isOpen ? 'translate-x-0 w-52 items-start' : '-translate-x-full lg:translate-x-0 lg:w-20 items-center'}`}
      >
        {/* Brand Logo */}
        <div className={`flex ${isOpen ? 'flex-row items-center gap-3.5 px-4 justify-start' : 'flex-col items-center gap-1.5 justify-center'} mb-12 w-full`}>
          <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md shadow-orange-500/20 shrink-0">
            <div className="w-5 h-1.5 bg-white/40 rounded-full absolute top-2.5"></div>
            <div className="w-6 h-1.5 bg-white/70 rounded-full absolute top-4"></div>
            <div className="w-5 h-1.5 bg-white/90 rounded-full absolute top-5.5"></div>
          </div>
          <span className={`font-extrabold tracking-widest text-slate-800 uppercase ${isOpen ? 'text-xs' : 'hidden'}`}>Ngijih</span>
        </div>

        {/* Navigation Icons */}
        <nav className={`flex-1 flex flex-col gap-6 w-full ${isOpen ? 'items-start px-4' : 'items-center'}`}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`relative flex items-center transition-all duration-300 group ${isOpen
                    ? 'w-full px-4 py-3 gap-3.5 rounded-2xl'
                    : 'p-3.5 rounded-2xl justify-center'
                  } ${item.active
                    ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/35'
                    : 'text-slate-400 hover:text-slate-800 hover:bg-slate-50'
                  }`}
              >
                <Icon size={20} className="stroke-[2.2] shrink-0" />

                {/* Text Label */}
                <span className={`capitalize font-bold text-sm tracking-wide transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0 block' : 'opacity-0 -translate-x-2 pointer-events-none hidden'
                  }`}>
                  {item.id}
                </span>

                {/* Tooltip */}
                <span className={`absolute left-20 bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none transition-opacity duration-200 capitalize font-medium z-50 shadow-md ${isOpen ? 'hidden' : 'group-hover:opacity-100'
                  }`}>
                  {item.id}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Action Icon (Sidebar Toggle) */}
        <div className={`w-full flex ${isOpen ? 'justify-end px-5' : 'justify-center'} mt-auto`}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-3.5 rounded-2xl text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition-all duration-300"
          >
            {isOpen ? <ChevronLeft size={20} className="stroke-[2.2]" /> : <ChevronRight size={20} className="stroke-[2.2]" />}
          </button>
        </div>
      </aside>
    </>
  );
}
