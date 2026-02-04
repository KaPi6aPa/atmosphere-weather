// src/components/SearchBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { searchCities } from '../services/weather';

// Иконка поиска (SVG)
const SearchIcon = () => (
  <svg className="w-5 h-5 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

// Иконка геолокации (SVG)
const LocationIcon = () => (
  <svg className="w-5 h-5 text-white hover:text-blue-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const SearchBar = ({ onSearch, onLocate }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Ref для отслеживания кликов вне компонента
  const wrapperRef = useRef(null);

  // Debounce эффект: ждем 400мс после окончания ввода перед запросом
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 2) {
        setLoading(true);
        const results = await searchCities(query);
        setSuggestions(results);
        setShowSuggestions(true);
        setLoading(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Закрытие списка при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSuggestionClick = (city) => {
    // 1. Обновляем текст в инпуте
    setQuery(city.name);
    // 2. Скрываем подсказки
    setShowSuggestions(false);
    // 3. Сразу запускаем поиск (передаем название города)
    if (onSearch) onSearch(city.name); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md mx-auto z-50">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        {/* Иконка поиска слева */}
        <div className="absolute left-3 pointer-events-none">
          <SearchIcon />
        </div>

        {/* Поле ввода */}
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Введіть місто..."
          className="w-full py-3 pl-10 pr-12 text-white bg-white/20 backdrop-blur-md border border-white/30 rounded-full shadow-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
        />

        {/* Кнопка геолокации справа */}
        <button
          type="button"
          onClick={onLocate}
          title="Визначити моє місцезнаходження"
          className="absolute right-3 p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <LocationIcon />
        </button>
      </form>

      {/* Выпадающий список (Glassmorphism) */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute w-full mt-2 overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl animate-fade-in">
          {suggestions.map((city, index) => (
            <li
              key={`${city.lat}-${city.lon}-${index}`}
              onClick={() => handleSuggestionClick(city)}
              className="px-4 py-3 cursor-pointer hover:bg-white/20 transition-colors border-b border-white/10 last:border-none text-left"
            >
              <div className="flex flex-col">
                <span className="text-white font-medium text-base">
                  {city.name}
                </span>
                <span className="text-gray-300 text-xs">
                  {city.state ? `${city.state}, ` : ''}{city.country}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      {/* Индикатор загрузки (опционально) */}
      {loading && query.length > 2 && !suggestions.length && (
        <div className="absolute w-full mt-2 p-3 text-center text-white/70 bg-white/10 backdrop-blur-xl rounded-xl border border-white/10">
          Пошук...
        </div>
      )}
    </div>
  );
};

export default SearchBar;
