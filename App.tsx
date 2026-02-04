import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Wind, Droplets, Eye, Gauge, Cloud, Thermometer } from 'lucide-react';
import { getWeatherData } from './services/weatherService';
import { WeatherData, ForecastData } from './types';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';

const getBackgroundClass = (condition?: string) => {
  const deepPurple = 'from-indigo-900 via-purple-900 to-slate-900';
  if (!condition) return deepPurple;

  switch (condition.toLowerCase()) {
    case 'clear':
      return 'from-blue-400 to-emerald-400';
    case 'clouds':
      return deepPurple;
    case 'rain':
    case 'drizzle':
      return deepPurple;
    case 'snow':
      return 'from-blue-800 to-indigo-900';
    case 'thunderstorm':
      return 'from-gray-900 to-black';
    default:
      return deepPurple;
  }
};

const App: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const fetchWeather = async (city: string, lat?: number, lon?: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getWeatherData(city, lat, lon);
      
      setWeather(data.weather);
      setForecast(data.forecast);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError(err instanceof Error ? err.message : 'Failed to load weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeWeather = () => {
      if (!navigator.geolocation) {
        fetchWeather('Kyiv');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather('', position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn('Geolocation access denied or failed:', error);
          fetchWeather('Kyiv');
        }
      );
    };

    initializeWeather();
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    fetchWeather(query);
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather('', position.coords.latitude, position.coords.longitude);
        setIsLocating(false);
      },
      (error) => {
        console.warn('Geolocation access denied:', error);
        setError('Unable to access your location');
        setIsLocating(false);
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-gray-600 font-medium">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => fetchWeather('Kyiv')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Reload Default City
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundClass(weather?.weather?.[0]?.main)} p-4 md:p-6 text-white/90`}>
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            🌤️ Atmosphere Weather
          </h1>
          <div className="w-full md:w-auto">
            <SearchBar onSearch={handleSearch} onLocate={handleLocate} isLocating={isLocating} />
          </div>
        </header>

        {weather && forecast && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Current Weather */}
            <div>
              <CurrentWeather data={weather} />
            </div>

            {/* Right Column: Grid & Forecast */}
            <div className="flex flex-col gap-6">
              {/* 2x3 Detail Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl flex flex-col items-center justify-center text-center">
                  <Thermometer className="w-6 h-6 mb-2 text-yellow-300" />
                  <span className="text-sm text-white/80">Відчувається як</span>
                  <span className="text-xs text-white/50 mb-1">Реальне відчуття</span>
                  <span className="text-lg font-bold">{Math.round(weather.main.feels_like)}°</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl flex flex-col items-center justify-center text-center">
                  <Wind className="w-6 h-6 mb-2 text-blue-300" />
                  <span className="text-sm text-white/80">Вітер</span>
                  <span className="text-xs text-white/50 mb-1">Напрямок: {weather.wind.deg}°</span>
                  <span className="text-lg font-bold">{weather.wind.speed} m/s</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl flex flex-col items-center justify-center text-center">
                  <Droplets className="w-6 h-6 mb-2 text-blue-400" />
                  <span className="text-sm text-white/80">Вологість</span>
                  <span className="text-xs text-white/50 mb-1">Точка роси</span>
                  <span className="text-lg font-bold">{weather.main.humidity}%</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl flex flex-col items-center justify-center text-center">
                  <Gauge className="w-6 h-6 mb-2 text-red-300" />
                  <span className="text-sm text-white/80">Тиск</span>
                  <span className="text-xs text-white/50 mb-1">Атмосферний</span>
                  <span className="text-lg font-bold">{weather.main.pressure} hPa</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl flex flex-col items-center justify-center text-center">
                  <Eye className="w-6 h-6 mb-2 text-teal-300" />
                  <span className="text-sm text-white/80">Видимість</span>
                  <span className="text-xs text-white/50 mb-1">Ясна видимість</span>
                  <span className="text-lg font-bold">
                    {weather.visibility ? (weather.visibility / 1000).toFixed(1) : '10.0'} km
                  </span>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl flex flex-col items-center justify-center text-center">
                  <Cloud className="w-6 h-6 mb-2 text-gray-300" />
                  <span className="text-sm text-white/80">Хмарність</span>
                  <span className="text-xs text-white/50 mb-1">Покриття неба</span>
                  <span className="text-lg font-bold">{weather.clouds.all}%</span>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white/90 mt-2">Прогноз на 5 днів</h3>
              <ForecastList data={forecast} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;