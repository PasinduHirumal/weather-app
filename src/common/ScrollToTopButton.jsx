import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = (event) => {
      const target = event.target;
      let scrollTop = 0;
      let scrollHeight = 0;
      let clientHeight = 0;

      if (target === document) {
        scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        clientHeight = document.documentElement.clientHeight || window.innerHeight;
      } else if (target && target.classList && (target.classList.contains('overflow-y-auto') || target.className.includes('overflow-y-auto'))) {
        scrollTop = target.scrollTop;
        scrollHeight = target.scrollHeight;
        clientHeight = target.clientHeight;
      } else {
        return;
      }

      const totalScroll = scrollHeight - clientHeight;
      if (totalScroll > 0) {
        const progressPercent = Math.min((scrollTop / totalScroll) * 100, 100);
        setScrollProgress(progressPercent);
      } else {
        setScrollProgress(0);
      }

      if (scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const scrollContainers = document.querySelectorAll('.overflow-y-auto, [class*="overflow-y-auto"]');
    scrollContainers.forEach((container) => {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const buttonVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.4,
      y: 40,
      rotate: -45
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.6,
      y: 30,
      rotate: 45,
      transition: {
        duration: 0.25,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-white text-orange-500 shadow-xl shadow-slate-200/80 border border-slate-100/50 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-300 cursor-pointer focus:outline-none"
          title="Scroll to Top"
        >
          <div className="relative w-12 h-12 flex items-center justify-center">
            {/* Circular Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 40 40">
              {/* Track (gray) */}
              <circle
                cx="20"
                cy="20"
                r="16.5"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="2.5"
              />
              {/* Active stroke */}
              <motion.circle
                cx="20"
                cy="20"
                r="16.5"
                fill="none"
                stroke="url(#orange-gradient)"
                strokeWidth="2.5"
                strokeDasharray={103.67} // 2 * pi * 16.5 = 103.67
                animate={{ strokeDashoffset: 103.67 - (scrollProgress / 100) * 103.67 }}
                transition={{ type: 'tween', ease: 'easeOut', duration: 0.1 }}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="orange-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Arrow Icon */}
            <ArrowUp size={18} className="text-orange-500 stroke-[2.5]" />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
