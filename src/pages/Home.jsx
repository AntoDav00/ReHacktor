import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FaArrowRight, FaGamepad, FaFilter } from 'react-icons/fa'
import { motion } from 'framer-motion'
import InfiniteScroll from '../components/Features/InfiniteScroll'
import Loader from '../components/Loader'
import GameCard from '../components/Game/GameCard'

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [genres, setGenres] = useState([])
  const [platforms, setPlatforms] = useState([])

  // eslint-disable-next-line no-unused-vars
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const API_KEY = import.meta.env.VITE_RAWG_API_KEY
  console.log('Valore API_KEY:', API_KEY);
  console.log('import.meta.env completo:', import.meta.env);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [filters, setFilters] = useState({})

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(`https://api.rawg.io/api/genres?key=${API_KEY}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          // eslint-disable-next-line no-unused-vars
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const genresMap = {};
        data.results.forEach(genre => {
          genresMap[genre.id.toString()] = genre.name;
          genresMap[genre.slug] = genre.name;
        });
        setGenres(genresMap);
      } catch (error) {
        console.error('Errore durante il fetch dei generi:', error);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const response = await fetch(`https://api.rawg.io/api/platforms?key=${API_KEY}&page_size=100`);
        
        if (!response.ok) {
          console.error('Errore nel fetch delle piattaforme:', response.status, response.statusText);
          return;
        }

        const data = await response.json();
        const platformsMap = {};
        data.results.forEach(platform => {
          platformsMap[platform.id.toString()] = platform.name;
        });
        setPlatforms(platformsMap);
      } catch (error) {
        console.error('Errore durante il fetch delle piattaforme:', error);
      }
    };

    fetchPlatforms();
  }, []);

  useEffect(() => {
    const genreFromUrl = searchParams.get('genre');
    if (genreFromUrl) {
      setFilters(prev => ({
        ...prev,
        genre: genreFromUrl
      }));
    }
  }, [searchParams]);

  const fetchGames = async (pageNumber) => {
    setLoading(true)
    try {
      let url = `https://api.rawg.io/api/games?key=${API_KEY}&page=${pageNumber}&page_size=12`

      if (filters.platform) url += `&platforms=${filters.platform}`
      if (filters.genre) url += `&genres=${filters.genre}`

      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Errore nel fetch dei giochi:', response.status, response.statusText, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      setGames(prevGames => 
        pageNumber === 1 ? data.results : [...prevGames, ...data.results]
      );
      
      setHasMore(data.next !== null);
      setLoading(false);
    } catch (error) {
      console.error('Errore nel recupero dei giochi:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchGames(1);
  }, [filters]);

  const loadMore = () => {
    if (!loading) {
      setPage(prev => {
        fetchGames(prev + 1)
        return prev + 1
      })
    }
  }

  const resetFilters = () => {
    setFilters({});
    searchParams.delete('genre');
    searchParams.delete('platform');
    setSearchParams(searchParams);
  };

  if (loading && games.length === 0) {
    return <Loader />
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {!filters.genre && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative mt-8 mb-12 overflow-hidden rounded-2xl"
        >
          <div className="absolute inset-0 z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-pink-800 to-purple-900 opacity-90 animate-gradient-x" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/60 via-transparent to-transparent" />
          </div>

          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8 }}
            src="/hero-bg.jpg"
            alt="Hero Background"
            className="w-full h-[500px] sm:h-[600px] lg:h-[650px] object-cover"
          />

          <div className="absolute inset-0 z-20 flex items-center">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-4xl"
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent leading-tight">
                  Discover Your Next Gaming Adventure
                </h1>

                <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8 max-w-2xl leading-relaxed">
                  Explore thousands of games, read reviews, and join a community of gamers passionate about great gaming experiences.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/categories"
                    className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 text-base sm:text-lg font-medium group"
                  >
                    <FaGamepad className="mr-2 text-xl group-hover:rotate-12 transition-transform" />
                    Explore Games
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {filters.genre
              ? `Category: ${genres[filters.genre] || genres[filters.genre.toLowerCase()] || 'All'}`
              : "Popular Games"
            }
          </h2>
        </div>
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-gray-900/40 hover:bg-gray-800/60 
          transition-all duration-300 backdrop-blur-md border border-gray-700/30 hover:border-purple-500/50 
          shadow-lg shadow-purple-500/5 hover:shadow-purple-500/20 group"
        >
          <FaFilter
            className="text-purple-400 group-hover:text-purple-300 transform group-hover:rotate-180 
            transition-all duration-500"
          />
          <span className="text-gray-300 group-hover:text-white font-medium tracking-wide 
            transition-colors duration-300">
            Filter
          </span>
        </button>
      </div>

      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} loading={loading}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, index) => (
            <GameCard key={index} game={game} />
          ))}
        </div>
      </InfiniteScroll>

      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-gray-900 rounded-xl p-6 w-full max-w-md shadow-xl border border-gray-800"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Filter Games</h2>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Platform</label>
                <select
                  className="w-full bg-gray-800 rounded-lg p-2 border border-gray-700"
                  value={filters.platform || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, platform: e.target.value }))}
                >
                  <option value="">All Platforms</option>
                  {Object.entries(platforms).map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Genre</label>
                <select
                  className="w-full bg-gray-800 rounded-lg p-2 border border-gray-700"
                  value={filters.genre}
                  onChange={(e) => setFilters(prev => ({ ...prev, genre: e.target.value }))}
                >
                  <option value="">All Genres</option>
                  {Object.entries(genres).map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <select
                  className="w-full bg-gray-800 rounded-lg p-2 border border-gray-700"
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                >
                  <option value="relevance">Relevance</option>
                  <option value="-released">Release Date</option>
                  <option value="-rating">Rating</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setPage(1);
                  fetchGames(1);
                  setIsFilterModalOpen(false);
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Apply Filters
              </button>
              <button
                onClick={resetFilters}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Home