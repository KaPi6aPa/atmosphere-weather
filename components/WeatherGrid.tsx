import React from 'react';
import { WeatherData } from '../types';
import { Wind, Droplets, Thermometer, Gauge, Eye, Cloud } from 'lucide-react';

interface WeatherGridProps {
  data: WeatherData;
}

const WeatherGrid: React.FC<WeatherGridProps> = ({ data }) => {
  const { main, wind, visibility, clouds } = data;

  const items = [
    {
      label: 'Feels Like',
      value: `${Math.round(main.feels_like)}°`,
      icon: Thermometer,
      desc: 'Actual feel'
    },
    {
      label: 'Wind',
      value: `${Math.round(wind.speed)} km/h`,
      icon: Wind,
      desc: `Direction: ${wind.deg}°`
    },
    {
      label: 'Humidity',
      value: `${main.humidity}%`,
      icon: Droplets,
      desc: 'Dew point'
    },
    {
      label: 'Pressure',
      value: `${main.pressure} hPa`,
      icon: Gauge,
      desc: 'Atmospheric'
    },
    {
      label: 'Visibility',
      value: `${(visibility / 1000).toFixed(1)} km`,
      icon: Eye,
      desc: 'Clear view'
    },
    {
      label: 'Cloudiness',
      value: `${clouds.all}%`,
      icon: Cloud,
      desc: 'Sky cover'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 flex flex-col justify-between aspect-square md:aspect-auto md:h-40 hover:bg-white/15 transition-colors duration-300"
          >
            <div className="flex items-center space-x-2 text-white/60 mb-2">
              <Icon size={18} />
              <span className="text-sm font-medium uppercase tracking-wider">{item.label}</span>
            </div>
            <div>
              <div className="text-3xl font-light text-white">{item.value}</div>
              <div className="text-xs text-white/50 mt-1 font-light">{item.desc}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeatherGrid;
