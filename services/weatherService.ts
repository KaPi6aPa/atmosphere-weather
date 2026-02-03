import axios from 'axios';
import { WeatherData, ForecastData } from '../types';

// Cast import.meta to any to resolve TypeScript error regarding 'env' property
const API_KEY = (import.meta as any).env.VITE_OPENWEATHER_API_KEY || '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeatherData = async (city: string): Promise<{ weather: WeatherData; forecast: ForecastData }> => {
  if (!API_KEY) {
    throw new Error('API Key is missing. Please set VITE_OPENWEATHER_API_KEY.');
  }

  try {
    const [weatherResponse, forecastResponse] = await Promise.all([
      axios.get<WeatherData>(`${BASE_URL}/weather`, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric',
        },
      }),
      axios.get<ForecastData>(`${BASE_URL}/forecast`, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric',
        },
      }),
    ]);

    return {
      weather: weatherResponse.data,
      forecast: forecastResponse.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch weather data');
    }
    throw error;
  }
};