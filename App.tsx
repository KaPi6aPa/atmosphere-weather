import React, { useState, useEffect } from 'react';
import { getWeatherData } from './services/weatherService';
import { WeatherData, ForecastData } from './types';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import WeatherGrid from './components/WeatherGrid';
import ForecastList from './components/ForecastList';
import { Loader2, CloudOff } from 'lucide-react';

const App: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState('London'); // Default city

  const fetchWeather = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeatherData(query);
      setWeather(data.weather);
      setForecast(data.forecast);
    } catch (err: any) {
      setError(err.message || 'Не вдалося отримати дані про погоду');
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleSearch = (query: string) => {
    setCity(query);
    fetchWeather(query);
  };

  // Dynamic background based on weather condition
  const getBackgroundClass = () => {
    if (!weather) return 'bg-gradient-to-br from-gray-800 to-gray-900';

    const id = weather.weather[0].id;
    const isNight = weather.weather[0].icon.includes('n');

    if (isNight) return 'bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900';

    if (id >= 200 && id < 300) return 'bg-gradient-to-br from-slate-800 to-gray-900'; // Thunderstorm
    if (id >= 300 && id < 600) return 'bg-gradient-to-br from-gray-700 via-slate-600 to-slate-800'; // Drizzle & Rain
    if (id >= 600 && id < 700) return 'bg-gradient-to-br from-blue-100 via-slate-200 to-gray-300 text-gray-800'; // Snow
    if (id >= 700 && id < 800) return 'bg-gradient-to-br from-slate-500 to-gray-600'; // Atmosphere (Fog, etc)
    if (id === 800) return 'bg-gradient-to-br from-sky-400 to-blue-600'; // Clear
    if (id > 800) return 'bg-gradient-to-br from-blue-400 via-slate-400 to-gray-400'; // Clouds

    return 'bg-gradient-to-br from-sky-400 to-blue-600';
  };

  return (
    <div className={`min-h-screen w-full transition-all duration-1000 ease-in-out ${getBackgroundClass()} flex items-center justify-center p-4 sm:p-8`}>
      <div className="w-full max-w-6xl mx-auto min-h-[600px] flex flex-col">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12 gap-4">
          <div className="text-white">
            <h1 className="text-2xl font-semibold tracking-tight">Atmosphere</h1>
            <p className="text-white/60 text-sm font-light">Погодна панель</p>
          </div>
          <SearchBar onSearch={handleSearch} isLoading={loading} placeholder="Пошук міста..." />
        </div>

        {/* Content */}
        <div className="flex-1">
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center text-white/80 space-y-4">
              <Loader2 className="animate-spin" size={48} />
              <p className="text-lg font-light animate-pulse">Завантаження...</p>
            </div>
          ) : error ? (
            <div className="h-96 flex flex-col items-center justify-center text-white/80 space-y-4 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8">
              <CloudOff size={64} className="opacity-50" />
              <p className="text-xl font-medium">{error}</p>
              <button 
                onClick={() => fetchWeather(city)}
                className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                Спробувати ще раз
              </button>
            </div>
          ) : weather && forecast ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Current Weather */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
                <CurrentWeather data={weather} />
                <div className="hidden lg:block">
                    {/* Spacer or additional decorative elements could go here */}
                </div>
              </div>

              {/* Right Column: Grid & Forecast */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <WeatherGrid data={weather} />
                <ForecastList data={forecast} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default App;
