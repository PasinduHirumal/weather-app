import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Activity, ShieldAlert, Cpu, Database, Thermometer, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 90,
      damping: 14
    }
  }
};

export default function Monitor() {
  const { weather, airQuality, location, loading, error } = useOutletContext();
  const [logs, setLogs] = useState([]);
  const [latency, setLatency] = useState(72);
  const logEndRef = useRef(null);

  // Generate simulated telemetry logs
  useEffect(() => {
    if (loading || !weather) return;

    const initialLogs = [
      { id: 1, time: new Date(Date.now() - 5000).toLocaleTimeString(), text: 'System initialized successfully.' },
      { id: 2, time: new Date(Date.now() - 4000).toLocaleTimeString(), text: `Selected Location: ${location.name} (${location.latitude}, ${location.longitude})` },
      { id: 3, time: new Date(Date.now() - 3000).toLocaleTimeString(), text: 'Establishing secure link to Open-Meteo API...' },
      { id: 4, time: new Date(Date.now() - 2000).toLocaleTimeString(), text: 'Connection established. Ping: 74ms' },
      { id: 5, time: new Date(Date.now() - 1000).toLocaleTimeString(), text: `Data streams online: Temperature (${weather.current.temperature_2m}°C), Humidity (${weather.current.relative_humidity_2m}%)` }
    ];
    setLogs(initialLogs);

    const logInterval = setInterval(() => {
      setLatency(prev => Math.max(prev + Math.floor(Math.random() * 11) - 5, 45));
      const logMessages = [
        `Polling weather feed for ${location.name}...`,
        `Analyzing atmospheric variables: Wind speed ${weather.current.wind_speed_10m} km/h`,
        'Verifying Air Quality telemetry data streams...',
        airQuality ? `Pollutant PM2.5 checked: ${airQuality.current.pm2_5} µg/m³` : 'AQI indexes validated.',
        'Data buffer clean. Sync status: 100%',
        `Ping response from Open-Meteo server: ${latency}ms`
      ];
      const randomMsg = logMessages[Math.floor(Math.random() * logMessages.length)];
      setLogs(prev => [
        ...prev.slice(-30), // keep last 30 logs
        { id: Date.now(), time: new Date().toLocaleTimeString(), text: randomMsg }
      ]);
    }, 4500);

    return () => clearInterval(logInterval);
  }, [weather, loading, location]);

  // Auto-scroll logs to bottom
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div>
      {/* Page Title */}
      <div className="flex items-center gap-2 mb-6 mt-2">
        <Activity className="text-orange-500 stroke-[2.2]" size={20} />
        <h3 className="text-slate-800 text-sm font-extrabold tracking-tight uppercase">
          Forecast Monitor & Telemetry
        </h3>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 text-orange-800 rounded-2xl text-sm font-medium flex items-center justify-between animate-fadeIn">
          <span>{error}</span>
        </div>
      )}

      {loading || !weather ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-slate-50 border border-slate-100 rounded-[28px] animate-pulse"></div>
          <div className="h-96 bg-slate-50 border border-slate-100 rounded-[28px] animate-pulse"></div>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Main Monitor Metrics */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Status Panel Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* API Connection */}
              <motion.div variants={itemVariants} className="bg-white border border-slate-100/70 p-5 rounded-[28px] shadow-sm flex flex-col justify-between h-36">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">API Connection</span>
                  <div className="p-2 rounded-xl bg-green-50 text-green-600">
                    <Database size={16} />
                  </div>
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-800">ONLINE</span>
                  <span className="text-slate-400 text-[10px] font-bold block mt-1">Uptime: 99.9% • Latency: {latency}ms</span>
                </div>
              </motion.div>

              {/* Data Telemetry */}
              <motion.div variants={itemVariants} className="bg-white border border-slate-100/70 p-5 rounded-[28px] shadow-sm flex flex-col justify-between h-36">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Metrics Active</span>
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-500">
                    <Cpu size={16} />
                  </div>
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-800">12 Channels</span>
                  <span className="text-slate-400 text-[10px] font-bold block mt-1">Updates: Dynamic Polling</span>
                </div>
              </motion.div>

              {/* Status Alert */}
              <motion.div variants={itemVariants} className="bg-white border border-slate-100/70 p-5 rounded-[28px] shadow-sm flex flex-col justify-between h-36">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Warnings</span>
                  <div className="p-2 rounded-xl bg-orange-50 text-orange-500">
                    <ShieldAlert size={16} />
                  </div>
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-800">0 Alerts</span>
                  <span className="text-slate-400 text-[10px] font-bold block mt-1">Environment parameters stable</span>
                </div>
              </motion.div>
            </div>

            {/* Simulated Live System Logs console */}
            <motion.div variants={itemVariants} className="bg-[#1E293B] text-white rounded-[28px] p-6 shadow-md flex flex-col h-[320px] overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Telemetry Terminal Feed</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                  <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                  <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                </div>
              </div>

              {/* Logs area */}
              <div className="flex-1 overflow-y-auto font-mono text-[11px] leading-relaxed text-slate-300 pr-1 flex flex-col gap-2">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold shrink-0">[{log.time}]</span>
                    <span className="text-slate-100">{log.text}</span>
                  </div>
                ))}
                <div ref={logEndRef}></div>
              </div>
            </motion.div>

          </div>

          {/* Station Context Sidebar */}
          <div className="flex flex-col gap-6">
            
            {/* Station details card */}
            <motion.div variants={itemVariants} className="bg-white border border-slate-100/70 p-5 rounded-[28px] shadow-sm flex flex-col gap-5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Meteorological Node</span>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                  <Thermometer size={22} className="stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-slate-800 text-base font-extrabold">{location.name}</h4>
                  <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{location.country || 'Global Feed'}</span>
                </div>
              </div>

              <div className="border-t border-slate-50 pt-4 flex flex-col gap-3.5 text-xs text-slate-600 font-bold">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Node Lat</span>
                  <span className="font-mono text-slate-700">{location.latitude.toFixed(4)}°N</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Node Lon</span>
                  <span className="font-mono text-slate-700">{location.longitude.toFixed(4)}°E</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Timezone Offset</span>
                  <span className="font-mono text-slate-700">+{weather.utc_offset_seconds}s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Current Temperature</span>
                  <span className="text-slate-700">{weather.current.temperature_2m}°C</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Current Humidity</span>
                  <span className="text-slate-700">{weather.current.relative_humidity_2m}%</span>
                </div>
              </div>
            </motion.div>

            {/* Sync rate indicator */}
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-[28px] p-5 shadow-md flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/20 border border-white/20">
                <Clock size={20} className="stroke-[2.5] text-white" />
              </div>
              <div>
                <span className="text-[10px] text-orange-100 font-bold uppercase tracking-wider block">Sync Frequency</span>
                <span className="text-sm font-extrabold block mt-0.5">Real-Time (Continuous)</span>
              </div>
            </motion.div>

          </div>
        </motion.div>
      )}
    </div>
  );
}
