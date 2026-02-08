import { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, onFilterChange, activeFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filters = ['GAMES', 'SOFTWARE'];

  // Live search - triggers search as user types
  useEffect(() => {
    onSearch?.(searchTerm);
  }, [searchTerm, onSearch]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch?.(searchTerm);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch?.('');
  };

  return (
    <div className="bg-neon-green border-b-4 border-white p-6 md:px-12 flex flex-col md:flex-row gap-4 items-center top-0 z-50">
      <div className="w-full md:flex-1 relative">
        <input
          type="text"
          placeholder="SEARCH FOR FILES"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="w-full bg-white text-black border-4 border-black p-4 text-xl placeholder-gray-500 focus:outline-none focus:shadow-hard transition-all font-mono pr-24"
        />
        {searchTerm ? (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-red-500 text-white px-4 py-1 font-bold hover:bg-red-600 border-2 border-black transition-colors"
          >
            CLEAR
          </button>
        ) : (
          <button
            onClick={() => onSearch?.(searchTerm)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black text-white px-4 py-1 font-bold hover:bg-[#ff00ff] hover:text-black border-2 border-transparent hover:border-black transition-colors"
          >
            SEARCH
          </button>
        )}
      </div>

      <div className="flex gap-8 sm:gap-5 flex-shrink-0">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange?.(filter)}
            className={`px-6 py-4 border-4 border-black font-bold whitespace-nowrap transition-all ${activeFilter === filter
              ? 'bg-white text-black shadow-hard'
              : 'bg-black text-white hover:bg-white hover:text-black hover:shadow-hard'
              }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
