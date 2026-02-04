import axios from 'axios';

// Assuming these constants exist in your file. 
// If not, ensure API_KEY and BASE_URL are defined.
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// ... existing getWeather function ...

/**
 * Fetches weather data based on geographic coordinates.
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Weather data
 */
export const getWeatherByCoords = async (lat, lon) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        units: 'metric',
        lang: 'ua',
        appid: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather by coordinates:', error);
    throw error;
  }
};
