import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { FaStar, FaSearch, FaFilter, FaTimes } from 'react-icons/fa'
import GameFilter from '../components/Game/GameFilter'

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const query = searchParams.get('genre')
  const API_KEY = import.meta.env.VITE_RAWG_API_KEY

  const [filters, setFilters] = useState({
    platform: searchParams.get('platform') || '',
    genre: searchParams.get('genre') || '',
    ordering: searchParams.get('ordering') || '-rating'
  })

  useEffect(() => {
    const searchGames = async () => {
      if (!searchParams.get('q') && (!query || !filters.genre)) return

      setLoading(true)
      try {
        let url = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=24&ordering=${filters.ordering}`

        if (query || searchParams.get('q')) url += `&search=${query || searchParams.get('q')}`
        if (filters.platform) url += `&platforms=${filters.platform}`
        if (filters.genre) url += `&genres=${filters.genre}`

        const response = await fetch(url)
        const data = await response.json()
        setGames(data.results)
        console.log(data.results);

        setLoading(false)
      } catch (error) {
        console.error('Error searching games:', error)
        setLoading(false)
      }
    }

    searchGames()
  }, [query, searchParams, filters])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setSearchParams({
      ...(query && { q: query }),
      ...(newFilters.platform && { platform: newFilters.platform }),
      ...(newFilters.genre && { genre: newFilters.genre }),
      ordering: newFilters.ordering
    })
  }

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {/* {query ? `Search Results for "${query}"` : 'Browse Games'} */}
            {searchParams.get('q') ? `Search Results for "${searchParams.get('q').charAt(0).toUpperCase() + searchParams.get('q').slice(1)}"` : query ? `Search Results for "${query.charAt(0).toUpperCase() + query.slice(1)}"` : 'Browse Games'}
          </h1>
          <p className="text-gray-400 mt-2">
            {games.length} games found
          </p>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          {showFilters ? <FaTimes className="mr-2" /> : <FaFilter className="mr-2" />}
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700">
          <GameFilter
            currentFilters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>
      )}

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="bg-gray-800/50 rounded-2xl overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-700" />
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-700 rounded-full w-3/4" />
                <div className="h-4 bg-gray-700 rounded-full w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : games.length === 0 ? (
        <div className="text-center py-16">
          <FaSearch className="text-6xl text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-400 mb-2">No games found</h2>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game) => (
            <Link
              to={`/game/${game.id}`}
              key={game.id}
              className="group bg-gray-800/50 rounded-2xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300 border border-gray-700 hover:border-purple-500/50"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <img
                  src={game.background_image}
                  alt={game.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {game.metacritic && (
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-sm font-medium
                    ${game.metacritic >= 80 ? 'bg-green-500/20 text-green-400' :
                      game.metacritic >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'}`}>
                    {game.metacritic}
                  </div>
                )}
              </div>

              <div className="p-4">
                <h2 className="text-lg font-bold mb-2 group-hover:text-purple-400 transition-colors">
                  {game.name}
                </h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <FaStar className="text-yellow-500" />
                    <span className="text-gray-400">{game.rating}/5</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(game.released).getFullYear()}
                  </span>
                </div>

                {/* Platforms */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {game.parent_platforms?.slice(0, 3).map(({ platform }) => (
                    <span
                      key={platform.id}
                      className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-400"
                    >
                      {platform.name}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Search 