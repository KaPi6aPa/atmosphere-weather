import axios from 'axios';
import { WeatherData, ForecastData } from '../types';

// Cast import.meta to any to resolve TypeScript error regarding 'env' property
const API_KEY = (import.meta as any).env?.VITE_OPENWEATHER_API_KEY || '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export interface City {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export const getWeatherData = async (city: string, lat?: number, lon?: number): Promise<{ weather: WeatherData; forecast: ForecastData }> => {
  if (!API_KEY) {
    throw new Error('API Key is missing. Please set VITE_OPENWEATHER_API_KEY.');
  }

  try {
    const params = (lat !== undefined && lon !== undefined)
      ? { lat, lon, appid: API_KEY, units: 'metric', lang: 'ua' }
      : { q: city, appid: API_KEY, units: 'metric', lang: 'ua' };

    const [weatherResponse, forecastResponse] = await Promise.all([
      axios.get<WeatherData>(`${BASE_URL}/weather`, {
        params,
      }),
      axios.get<ForecastData>(`${BASE_URL}/forecast`, {
        params,
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
  if (!query) return [];

  try {
    const response = await axios.get(GEO_API_URL, {
      params: {
        name: query,
        count: 5,
        language: 'uk',
        format: 'json'
      }
    });
    
    if (!response.data.results) return [];

    return response.data.results.map((item: any) => ({
      name: item.name,
      lat: item.latitude,
      lon: item.longitude,
      country: item.country_code,
      state: item.admin1
    }));
  } catch (error) {
    console.error("Failed to fetch city suggestions:", error);
    return [];
  }
};