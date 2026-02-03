import React, { useMemo } from 'react';
import { ForecastData } from '../types';
import { format } from 'date-fns';
import { CloudRain, Sun, Cloud, CloudLightning, CloudSnow, CloudDrizzle } from 'lucide-react';

interface ForecastListProps {
  data: ForecastData;
}

const ForecastList: React.FC<ForecastListProps> = ({ data }) => {
  // Filter list to get one forecast per day (e.g., around noon)
  const dailyForecasts = useMemo(() => {
    const seenDates = new Set();
    return data.list.filter((item) => {
      const date = new Date(item.dt * 1000).getDate();
      if (!seenDates.has(date)) {
        seenDates.add(date);
        return true;
      }
      return false;
    }).slice(0, 5); // Ensure only 5 days
  }, [data]);

  const getWeatherIcon = (weatherMain: string) => {
    switch (weatherMain.toLowerCase()) {
      case 'clear': return <Sun size={24} className="text-yellow-300" />;
      case 'clouds': return <Cloud size={24} className="text-gray-300" />;
      case 'rain': return <CloudRain size={24} className="text-blue-300" />;
      case 'drizzle': return <CloudDrizzle size={24} className="text-blue-200" />;
      case 'thunderstorm': return <CloudLightning size={24} className="text-purple-300" />;
      case 'snow': return <CloudSnow size={24} className="text-white" />;
      default: return <Sun size={24} />;
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
      <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider mb-4 flex items-center">
        <span className="mr-2">📅</span> 5-Day Forecast
      </h3>
      <div className="space-y-4">
        {dailyForecasts.map((item) => (
          <div key={item.dt} className="flex items-center justify-between text-white group">
            <span className="w-16 font-medium text-lg">
              {format(new Date(item.dt * 1000), 'E')}
            </span>
            <div className="flex flex-col items-center flex-1">
              <div className="opacity-80 group-hover:scale-110 transition-transform duration-300">
                {getWeatherIcon(item.weather[0].main)}
              </div>
            </div>
            <div className="flex items-center space-x-4 w-24 justify-end">
              <span className="text-white/60 text-lg">{Math.round(item.main.temp_min)}°</span>
              <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden relative">
                 <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-300 to-yellow-300 opacity-50 w-full" />
              </div>
              <span className="font-medium text-lg">{Math.round(item.main.temp_max)}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastList;
