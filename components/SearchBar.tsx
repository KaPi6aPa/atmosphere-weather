import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xs sm:max-w-md">
      <input
        type="text"
        placeholder="Search city..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={isLoading}
        className="w-full py-2.5 pl-4 pr-10 text-white placeholder-white/50 bg-white/10 border border-white/20 rounded-full outline-none backdrop-blur-md focus:bg-white/20 focus:border-white/40 transition-all duration-300 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isLoading || !query.trim()}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/70 hover:text-white transition-colors disabled:opacity-50"
      >
        <Search size={18} />
      </button>
    </form>
  );
};

export default SearchBar;
