import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../common/ThemeContext';

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  // Active theme's icon
  const getActiveIcon = () => {
    if (theme === 'light') return Sun;
    if (theme === 'dark') return Moon;
    return Monitor;
  };
  const ActiveIcon = getActiveIcon();

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title={`Theme: ${theme}`}
        className="flex items-center gap-1.5 p-2.5 rounded-full border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 shadow-sm transition-all duration-300 group cursor-pointer"
      >
        <ActiveIcon size={18} className="stroke-[2.2] group-hover:scale-110 transition-transform duration-300 text-orange-500" />
        <ChevronDown size={12} className={`stroke-[2.2] text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-36 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg overflow-hidden z-50 py-1"
          >
            {options.map((opt) => {
              const Icon = opt.icon;
              const isSelected = theme === opt.value;

              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    setTheme(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3.5 py-2.5 text-left text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-orange-50/80 dark:bg-orange-950/20 text-orange-500'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon size={14} className={`stroke-[2.2] ${isSelected ? 'text-orange-500' : 'text-slate-400 dark:text-slate-500'}`} />
                  {opt.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
