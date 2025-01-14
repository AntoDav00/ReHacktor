import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';

const AutoCompleteCardUi = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [games, setGames] = useState([]);
  const [selectedItem, setSelectedItem] = useState(-1);
  const Navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/games?key=' + import.meta.env.VITE_RAWG_API_KEY);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setGames(data.games);
      } catch (error) {
        console.error('Errore nel recupero dei giochi:', error);
      }
    };
    fetchGames();
  }, []);

  const handleSearch = async (event) => {
    const searchQuery = event.target.value;
    setSearchQuery(searchQuery);
    if (searchQuery.length > 0) {
      try {
        const response = await fetch(`/api/games?key=${import.meta.env.VITE_RAWG_API_KEY}&search=${encodeURI(searchQuery)}`);
        const data = await response.json();
        setSuggestions(data.results);
      } catch (error) {
        console.error('Errore durante la ricerca:', error);
      }
    } else if (searchQuery.length === 0) {
      setSuggestions([]);
      setSelectedItem(-1);
    }
  };

  const handleSuggestionClick = (game) => {
    setSearchQuery('');
    setSuggestions([]);
    // Navigate directly to the game details page
    Navigate(`/game/${game.id}`);
  };

  const handleKeyDown = (e) => {
    if (suggestions.length > 0) {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setSelectedItem(prev => (prev <= 0 ? suggestions.length - 1 : prev - 1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedItem(prev => (prev >= suggestions.length - 1 ? 0 : prev + 1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedItem >= 0) {
            handleSuggestionClick(suggestions[selectedItem]);
          } else {
            Navigate(`/search?q=${searchQuery}`);
            setSuggestions([]);
            setSearchQuery('');
          }
          break;
        case 'Escape':
          setSuggestions([]);
          setSelectedItem(-1);
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    if (selectedItem >= 0) {
      const element = document.getElementById(`suggestion-${selectedItem}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedItem]);

  return (
    <div className="flex flex-1 max-w-xl mx-4 relative">
      <div className="relative w-full">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          placeholder="Search games..."
          className="w-full px-6 py-3 rounded-full bg-gray-800/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700 backdrop-blur-sm placeholder-gray-500"
        />
        <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
      {suggestions.length > 1 && (
        <div className="absolute top-14 left-0 w-full bg-gray-800/90 backdrop-blur-md rounded-lg shadow-xl border border-gray-700/50">
          <ul className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-800">
            {suggestions.map((game, index) => (
              <li
                key={game.id}
                id={`suggestion-${index}`}
                className={`flex items-center p-3 hover:bg-purple-500/20 cursor-pointer transition-colors ${selectedItem === index ? 'bg-purple-500/20' : ''
                  }`}
                onClick={() => handleSuggestionClick(game)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSuggestionClick(game);
                }}
                tabIndex={0}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={game.background_image}
                      alt={game.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-white">{game.name}</h3>
                    <p className="text-xs text-gray-400">
                      {game.released ? new Date(game.released).getFullYear() : 'N/A'}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AutoCompleteCardUi;