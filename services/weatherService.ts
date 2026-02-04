import axios from 'axios';
import { WeatherData, ForecastData } from '../types';

// Cast import.meta to any to resolve TypeScript error regarding 'env' property
const API_KEY = (import.meta as any).env.VITE_OPENWEATHER_API_KEY || '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const PHOTON_API_URL = 'https://photon.komoot.io/api/';

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
  if (!query) return [];

  try {
    const response = await axios.get(PHOTON_API_URL, {
      params: {
        q: query,
        lang: 'uk',
        limit: 5
      }
    });
    
    const uniqueCities = new Map<string, City>();

    response.data.features.forEach((feature: any) => {
      const { name, country, state, countrycode } = feature.properties;
      const [lon, lat] = feature.geometry.coordinates;
      const key = `${name}-${state || ''}-${country || ''}`;

      if (!uniqueCities.has(key) && name) {
        uniqueCities.set(key, {
          name,
          lat,
          lon,
          country: country || countrycode || '',
          state
        });
      }
    });

    return Array.from(uniqueCities.values());
  } catch (error) {
    console.error("Failed to fetch city suggestions:", error);
    return [];
  }
};