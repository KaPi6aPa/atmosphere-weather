import React, { useState, useEffect, useRef } from 'react';
import { searchCities, City } from '../services/weatherService';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Обробка кліку поза компонентом
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounce пошуку
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2) {
        const cities = await searchCities(query);
        setSuggestions(cities);
        setShowSuggestions(cities.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSuggestionClick = (city: City) => {
    const locationString = city.name; // Можна додати країну, якщо потрібно: `${city.name}, ${city.country}`
    setQuery(locationString);
    setShowSuggestions(false);
    onSearch(city.name);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  const highlightMatch = (text: string, highlight: string) => {
    if (!highlight.trim()) return <span>{text}</span>;
    
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <span>
        {parts.map((part, i) => 
          regex.test(part) ? <span key={i} className="font-bold text-white">{part}</span> : <span key={i} className="text-white/80">{part}</span>
        )}
      </span>
    );
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <form onSubmit={handleFormSubmit} className="relative flex items-center">
        <input
          type="text"
          placeholder="Введіть назву міста..."
          value={query}
          onChange={handleInputChange}
          className="w-full px-4 py-3 pl-12 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:bg-white/20 focus:border-white/30 backdrop-blur-md transition-all"
        />
        <Search className="absolute left-4 text-white/50" size={20} />
        {isLoading && (
          <div className="absolute right-4 w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}
      </form>

      {showSuggestions && (
        <ul className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto text-white">
          {suggestions.map((city, index) => (
            <li
              key={`${city.lat}-${city.lon}-${index}`}
              onClick={() => handleSuggestionClick(city)}
              className="px-4 py-3 hover:bg-white/20 cursor-pointer transition-colors flex items-center justify-between"
            >
              {highlightMatch(city.name, query)}
              <span className="text-xs opacity-60 bg-white/10 px-2 py-1 rounded">
                {city.country}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
