import React from 'react';
import { motion } from 'framer-motion';

// Sunny Effect: Rotating rays or soft pulsing glowing sun rays overlay
export function SunnyEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Sun glow */}
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-gradient-to-br from-amber-400/40 to-yellow-300/10 blur-3xl"
      />
      {/* Sparkles */}
      <div className="absolute top-12 left-1/4 w-1.5 h-1.5 rounded-full bg-white opacity-40 animate-ping" style={{ animationDuration: '4s' }} />
      <div className="absolute top-24 left-2/3 w-1 h-1 rounded-full bg-white opacity-30 animate-ping" style={{ animationDuration: '3s' }} />
    </div>
  );
}

// Cloudy Effect: Slow horizontally drifting clouds
export function CloudyEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
      {/* Floating Cloud 1 */}
      <motion.div
        initial={{ x: -100 }}
        animate={{ x: 300 }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-6 left-0 w-20 h-8 bg-white/40 rounded-full blur-[2px]"
      />
      {/* Floating Cloud 2 */}
      <motion.div
        initial={{ x: 200 }}
        animate={{ x: -200 }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-16 left-0 w-28 h-10 bg-white/30 rounded-full blur-[3px]"
      />
    </div>
  );
}

// Rainy Effect: Falling raindrops
export function RainyEffect() {
  const drops = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 2,
    duration: 1 + Math.random() * 0.8,
    length: 12 + Math.random() * 12
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {drops.map((drop) => (
        <motion.div
          key={drop.id}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 320, opacity: [0, 0.8, 0.8, 0] }}
          transition={{
            duration: drop.duration,
            repeat: Infinity,
            delay: drop.delay,
            ease: "linear"
          }}
          className="absolute bg-gradient-to-b from-blue-300/40 to-blue-400/80 w-[1.5px]"
          style={{
            left: drop.left,
            height: `${drop.length}px`,
            transform: 'rotate(15deg)'
          }}
        />
      ))}
    </div>
  );
}

// Snowy Effect: Soft falling snow
export function SnowyEffect() {
  const flakes = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 3,
    size: 2 + Math.random() * 4
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {flakes.map((flake) => (
        <motion.div
          key={flake.id}
          initial={{ y: -10, x: 0, opacity: 0 }}
          animate={{
            y: 320,
            x: [0, 10, -10, 0],
            opacity: [0, 0.9, 0.9, 0]
          }}
          transition={{
            y: { duration: flake.duration, repeat: Infinity, delay: flake.delay, ease: "linear" },
            x: { duration: flake.duration * 0.5, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: flake.duration, repeat: Infinity, delay: flake.delay, ease: "linear" }
          }}
          className="absolute bg-white rounded-full blur-[0.5px]"
          style={{
            left: flake.left,
            width: `${flake.size}px`,
            height: `${flake.size}px`
          }}
        />
      ))}
    </div>
  );
}

// Thunderstorm Effect: Lightning flashes + rapid rain
export function ThunderstormEffect() {
  const drops = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 1.5,
    duration: 0.8 + Math.random() * 0.6,
    length: 15 + Math.random() * 15
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Lightning Flashes */}
      <motion.div
        animate={{
          opacity: [0, 0, 0.6, 0, 0, 0.7, 0, 0, 0]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          times: [0, 0.6, 0.62, 0.64, 0.66, 0.68, 0.7, 0.9, 1]
        }}
        className="absolute inset-0 bg-white/70 z-10"
      />

      {/* Rainy backdrop for thunderstorm */}
      {drops.map((drop) => (
        <motion.div
          key={drop.id}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 320, opacity: [0, 0.7, 0.7, 0] }}
          transition={{
            duration: drop.duration,
            repeat: Infinity,
            delay: drop.delay,
            ease: "linear"
          }}
          className="absolute bg-gradient-to-b from-purple-300/40 to-blue-500/60 w-[1.8px]"
          style={{
            left: drop.left,
            height: `${drop.length}px`,
            transform: 'rotate(20deg)'
          }}
        />
      ))}
    </div>
  );
}

// Foggy Effect: Drifting thick mist
export function FoggyEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-35">
      <motion.div
        animate={{
          x: [-300, 300],
          y: [0, 5, -5, 0]
        }}
        transition={{
          x: { duration: 25, repeat: Infinity, ease: "linear" },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute -bottom-10 -left-10 w-[500px] h-32 bg-slate-200/50 rounded-full blur-2xl"
      />
      <motion.div
        animate={{
          x: [300, -300],
          y: [0, -5, 5, 0]
        }}
        transition={{
          x: { duration: 30, repeat: Infinity, ease: "linear" },
          y: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute top-10 -right-10 w-[500px] h-32 bg-slate-100/40 rounded-full blur-2xl"
      />
    </div>
  );
}

export default function WeatherEffects({ condition }) {
  switch (condition) {
    case 'sunny':
      return <SunnyEffect />;
    case 'cloudy':
      return <CloudyEffect />;
    case 'rainy':
      return <RainyEffect />;
    case 'snowy':
      return <SnowyEffect />;
    case 'thunderstorm':
      return <ThunderstormEffect />;
    case 'foggy':
      return <FoggyEffect />;
    default:
      return null;
  }
}
