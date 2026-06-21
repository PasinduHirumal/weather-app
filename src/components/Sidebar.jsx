import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, MapPin, Calendar, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { showMonitor } from '../lib/webStatus';
import Logo from '../assets/logo.jpg';

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  const menuItems = [
    { icon: Home, id: 'home', path: '/' },
    { icon: MapPin, id: 'location', path: '/location' },
    { icon: Calendar, id: 'calendar', path: '/calendar' },
    ...(showMonitor ? [{ icon: Activity, id: 'monitor', path: '/monitor' }] : []),
  ];

  return (
    <>
      {/* Backdrop overlay for mobile when sidebar is open */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      />

      <aside className={`bg-white dark:bg-slate-950 h-full flex flex-col py-5 border-r border-slate-100 dark:border-slate-900 transition-all duration-300 
        fixed lg:relative inset-y-0 left-0 z-50 lg:z-30 px-4 items-stretch
        ${isOpen ? 'translate-x-0 w-52' : '-translate-x-full lg:translate-x-0 lg:w-20'}`}
      >
        {/* Brand Logo */}
        <div className="flex flex-row items-center justify-start h-12 mb-6 w-full overflow-hidden shrink-0">
          <div className="w-12 h-12 flex items-center justify-center shrink-0">
            <img 
              src={Logo} 
              alt="MinuteCast Logo" 
              className="w-10 h-10 object-contain rounded-full shadow-md shadow-orange-500/10"
            />
          </div>
          <span className={`font-extrabold tracking-widest text-slate-800 dark:text-slate-100 uppercase transition-all duration-300 whitespace-nowrap text-xs ${isOpen ? 'opacity-100 max-w-[120px] ml-3' : 'opacity-0 max-w-0 ml-0'
            }`}>
            MinuteCast
          </span>
        </div>

        {/* Navigation Icons */}
        <nav className="flex-1 flex flex-col gap-4 w-full items-stretch">
          {menuItems.map((item) => {
            const Icon = item.icon;

            // Check if the current navlink is active
            const isActiveLink =
              location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));

            return (
              <NavLink
                key={item.id}
                to={`${item.path}${location.search}`}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setIsOpen(false);
                  }
                }}
                className={`relative flex flex-row items-center h-12 rounded-2xl transition-all duration-300 group ${isActiveLink
                  ? 'text-white font-bold'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50/60 dark:hover:bg-slate-900/60 font-medium'
                  }`}
              >
                {isActiveLink && (
                  <motion.div
                    layoutId="activeTabBubble"
                    className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl z-0 shadow-md shadow-orange-500/30"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}

                {/* Icon Wrapper */}
                <div className="w-12 h-12 flex items-center justify-center shrink-0 z-10">
                  <Icon size={20} className="stroke-[2.2]" />
                </div>

                {/* Text Label */}
                <span className={`capitalize text-sm tracking-wide transition-all duration-300 whitespace-nowrap z-10 ${isOpen ? 'opacity-100 max-w-[120px] ml-2' : 'opacity-0 max-w-0 ml-0'
                  }`}>
                  {item.id}
                </span>

                {/* Tooltip */}
                <span className={`absolute left-20 bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none transition-opacity duration-200 capitalize font-medium z-50 shadow-md ${isOpen ? 'hidden' : 'group-hover:opacity-100'
                  }`}>
                  {item.id}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Action Icon (Sidebar Toggle) */}
        <div className="w-full flex flex-row items-center justify-end mt-auto h-12 overflow-hidden shrink-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-3.5 rounded-2xl text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-300 shrink-0 cursor-pointer"
          >
            {isOpen ? <ChevronLeft size={20} className="stroke-[2.2]" /> : <ChevronRight size={20} className="stroke-[2.2]" />}
          </button>
        </div>
      </aside>
    </>
  );
}
