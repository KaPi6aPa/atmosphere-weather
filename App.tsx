import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import { getWeatherData } from './services/weatherService';
import { getWeatherByCoords } from './services/weather';
// ... other imports (WeatherCard, etc.)

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false); // General loading state
  const [isLocating, setIsLocating] = useState(false); // Specific loading state for geolocation

  // Helper to fetch default city
  const fetchDefaultCity = async () => {
    setLoading(true);
    try {
      const data = await getWeatherData('Kyiv');
      setWeather(data);
    } catch (error) {
      console.error("Failed to load default city:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handler for Geolocation
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await getWeatherByCoords(latitude, longitude);
          setWeather(data);
        } catch (error) {
          console.error("Error fetching weather by location:", error);
          // Optional: Show an error toast here
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.warn("Geolocation denied or error:", error);
        setIsLocating(false);
        // If we don't have weather data yet (startup), fallback to default
        if (!weather) fetchDefaultCity();
      }
    );
  };

  // Initial Load Logic
  useEffect(() => {
    if (navigator.geolocation) {
      // Attempt to get location on startup
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const data = await getWeatherByCoords(latitude, longitude);
            setWeather(data);
          } catch (error) {
            fetchDefaultCity();
          }
        },
        (error) => {
          // Fallback to Kyiv if denied or error
          fetchDefaultCity();
        }
      );
    } else {
      fetchDefaultCity();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (city) => {
    setLoading(true);
    try {
      const data = await getWeatherData(city);
      setWeather(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Pass the new props to SearchBar */}
      <SearchBar 
        onSearch={handleSearch} 
        onLocate={handleLocateMe} 
        isLocating={isLocating} 
      />
      
      {/* Render your weather content here */}
      {/* ... */}
    </div>
  );
}

export default App;
