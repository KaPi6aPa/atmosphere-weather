import React from 'react';
import { WeatherData } from '../types';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { MapPin, ArrowUp, ArrowDown } from 'lucide-react';

interface CurrentWeatherProps {
  data: WeatherData;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data }) => {
  const { main, weather, sys, name, dt } = data;
  const currentDate = new Date(dt * 1000);

  return (
    <div className="flex flex-col items-center md:items-start text-white space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center space-x-2 text-white/90 mb-4">
        <MapPin size={20} />
        <h2 className="text-2xl font-medium tracking-wide">
          {name}, {sys.country}
        </h2>
      </div>

      <div className="flex flex-col items-center md:items-start">
        <h1 className="text-8xl md:text-9xl font-thin tracking-tighter">
          {Math.round(main.temp)}°
        </h1>
        <div className="text-2xl font-light text-white/90 capitalize mt-2">
          {weather[0].description}
        </div>
        <div className="text-white/60 font-light mt-1 capitalize">
          {format(currentDate, 'EEEE, d MMMM', { locale: uk })}
        </div>
      </div>

      <div className="flex items-center space-x-6 mt-6 text-lg font-light">
        <div className="flex items-center space-x-1">
          <ArrowUp size={18} className="text-white/80" />
          <span>{Math.round(main.temp_max)}°</span>
        </div>
        <div className="flex items-center space-x-1">
          <ArrowDown size={18} className="text-white/80" />
          <span>{Math.round(main.temp_min)}°</span>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
