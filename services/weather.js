// src/api/weather.js

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';

/**
 * Поиск городов через Open-Meteo Geocoding API.
 * @param {string} query - Название города для поиска.
 * @returns {Promise<Array>} - Массив отформатированных объектов городов.
 */
export const searchCities = async (query) => {
  // Предотвращаем запросы для слишком коротких строк
  if (!query || query.length < 3) {
    return [];
  }

  try {
    // Формируем URL с параметрами:
    // count=5: ограничиваем выдачу 5 результатами
    // language=uk: предпочитаем украинские названия (как в ТЗ)
    const url = `${GEOCODING_API_URL}?name=${encodeURIComponent(
      query
    )}&count=5&language=uk&format=json`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.results) {
      return [];
    }

    // ВАЖНО: Сортируем по населению (по убыванию), чтобы крупные города были выше
    // Затем приводим к нужному формату
    return data.results
      .sort((a, b) => (b.population || 0) - (a.population || 0))
      .map((city) => ({
        name: city.name,
        country: city.country,
        state: city.admin1 || "", // admin1 обычно содержит область/регион
        lat: city.latitude,
        lon: city.longitude,
      }));
  } catch (error) {
    console.error("Failed to fetch cities:", error);
    return [];
  }
};

// ... (остальной код API, например getWeather, если он был в этом файле)
