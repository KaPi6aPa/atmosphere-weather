import axios from 'axios';
import { WeatherData, ForecastData } from '../types';

// Cast import.meta to any to resolve TypeScript error regarding 'env' property
const API_KEY = (import.meta as any).env.VITE_OPENWEATHER_API_KEY || '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_BASE_URL = 'https://api.openweathermap.org/geo/1.0/direct';

export interface City {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

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
          lang: 'ua',
        },
      }),
      axios.get<ForecastData>(`${BASE_URL}/forecast`, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric',
          lang: 'ua',
        },
      }),
    ]);

    return {
      weather: weatherResponse.data,
      forecast: forecastResponse.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      if (message === 'city not found') {
        throw new Error('Місто не знайдено');
      }
      throw new Error(message || 'Не вдалося отримати дані про погоду');
    }
    throw error;
  }
};

export const searchCities = async (query: string): Promise<City[]> => {
  if (!query || !API_KEY) return [];

  try {
    // Use any[] to access local_names which is not in the City interface
    const response = await axios.get<any[]>(GEO_BASE_URL, {
      params: {
        q: query,
        limit: 5,
        appid: API_KEY
      }
    });
    
    return response.data.map((item) => ({
      name: item.local_names?.['uk'] || item.local_names?.['ru'] || item.name,
      lat: item.lat,
      lon: item.lon,
      country: item.country,
      state: item.state
    }));
  } catch (error) {
    console.error("Failed to fetch city suggestions:", error);
    return [];
  }
};