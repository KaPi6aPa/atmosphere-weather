import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { getWeatherData } from './services/weatherService';
import { WeatherData, ForecastData } from './types';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import WeatherGrid from './components/WeatherGrid';

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
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            🌤️ Atmosphere Weather
          </h1>
          <div className="w-full md:w-auto">
            <SearchBar onSearch={handleSearch} onLocate={handleLocate} isLocating={isLocating} />
          </div>
        </header>

        {weather && forecast && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <CurrentWeather data={weather} />
              <WeatherGrid data={weather} />
            </div>
            <div className="lg:col-span-1">
              <ForecastList data={forecast} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;