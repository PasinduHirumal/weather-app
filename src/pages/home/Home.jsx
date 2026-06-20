import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import WeatherCard from './components/WeatherCard';
import AirQualityCard from './components/AirQualityCard';
import TemperatureChartCard from './components/TemperatureChartCard';
import TomorrowCard from './components/TomorrowCard';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
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

export default function Home() {
    const { weather, airQuality, location, loading } = useOutletContext();

    // If data is loading or weather data is missing, render pulse skeletons without entry animations
    if (loading || !weather) {
        return (
            <div className="grid grid-cols-1 gap-6">
                {/* Row 1 Loading skeletons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <WeatherCard weather={null} loading={true} />
                    <AirQualityCard airQuality={null} weather={null} loading={true} />
                </div>

                {/* Row 2 Loading skeletons */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <TemperatureChartCard weather={null} loading={true} />
                    </div>
                    <div className="lg:col-span-1">
                        <TomorrowCard weather={null} location={location} loading={true} />
                    </div>
                </div>
            </div>
        );
    }

    // Once loading completes, animate the staggered entrance of card elements
    return (
        <motion.main
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-6"
        >
            {/* Row 1: Weather Info & Air Quality */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                    <WeatherCard weather={weather} loading={false} />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <AirQualityCard airQuality={airQuality} weather={weather} loading={false} />
                </motion.div>
            </div>

            {/* Row 2: Temperature Curve Chart & Tomorrow Forecast Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <TemperatureChartCard weather={weather} loading={false} />
                </motion.div>
                <motion.div variants={itemVariants} className="lg:col-span-1">
                    <TomorrowCard weather={weather} location={location} loading={false} />
                </motion.div>
            </div>
        </motion.main>
    );
}
