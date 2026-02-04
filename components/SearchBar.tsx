import React, { useState } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';

const SearchBar = ({ onSearch, onLocate, isLocating }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mb-8">
      <div className="relative flex items-center">
        {/* Search Icon (Left) */}
        <Search className="absolute left-4 text-white/70 w-5 h-5" />
        
        {/* Input Field */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city..."
          className="w-full py-3 pl-12 pr-12 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg transition-all"
        />

        {/* Locate Me Button (Right) */}
        <button
          type="button"
          onClick={onLocate}
          disabled={isLocating}
          className="absolute right-2 p-2 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Use my current location"
          aria-label="Use my current location"
        >
          {isLocating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <MapPin className="w-5 h-5" />
          )}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
