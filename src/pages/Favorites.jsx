import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaStar, FaHeart } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'
import { getFavorites } from '../utils/firebase'
import Loader from '../components/Loader'

const Favorites = () => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const loadFavorites = async () => {
      if (user) {
        try {
          const userFavorites = await getFavorites(user.uid)
          setFavorites(userFavorites)
        } catch (error) {
          console.error('Error loading favorites:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    loadFavorites()
  }, [user])

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Please login to view your favorites</h2>
        <Link
          to="/login"
          className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          Login
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <Loader key={n} />
        ))}
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <FaHeart className="text-4xl text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">No favorites yet</h2>
        <p className="text-gray-400 mb-4">Start adding games to your favorites!</p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          Explore Games
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold flex items-center gap-2">
        <FaHeart className="text-pink-500" />
        My Favorites
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((game) => (
          <Link to={`/game/${game.gameId}`} key={game.gameId}>
            <div className="group relative bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-10" />
              <img
                src={game.gameImage}
                alt={game.gameName}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <h2 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                  {game.gameName}
                </h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-400">
                      <FaStar className="mr-1" />
                      {game.rating}/5
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(game.released).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Favorites