import React, { useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { getWeather } from '../services/weatherService';
import { Cloud, Sun, CloudRain, Wind, Thermometer } from 'lucide-react';
import { motion } from 'framer-motion';

const WeatherCard = () => {
  const { weather, setWeather } = useAppStore();

  useEffect(() => {
    if (!weather) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const data = await getWeather(pos.coords.latitude, pos.coords.longitude);
        if (data) setWeather(data);
      }, async () => {
        // Fallback to Delhi if geolocation denied
        const data = await getWeather(28.61, 77.23);
        if (data) setWeather(data);
      });
    }
  }, []);

  if (!weather) return null;

  const getWeatherIcon = (code) => {
    if (code === 0) return <Sun className="text-yellow-400" size={32} />;
    if (code < 4) return <Cloud className="text-blue-300" size={32} />;
    return <CloudRain className="text-blue-500" size={32} />;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 flex items-center justify-between gap-6"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-2xl">
          {getWeatherIcon(weather.weathercode)}
        </div>
        <div>
          <h4 className="text-sm font-bold text-muted uppercase tracking-widest">Current Weather</h4>
          <p className="text-2xl font-display font-bold text-text">{weather.temperature}°C</p>
        </div>
      </div>
      
      <div className="flex gap-4">
        <div className="flex items-center gap-2 text-muted">
          <Wind size={18} />
          <span className="text-sm font-medium">{weather.windspeed} km/h</span>
        </div>
        <div className="flex items-center gap-2 text-muted">
          <Thermometer size={18} />
          <span className="text-sm font-medium">Feels Local</span>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherCard;
