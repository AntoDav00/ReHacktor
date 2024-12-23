import { useState, useEffect } from 'react'
import { FaHeart } from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext'
import { toggleFavorite, checkIsFavorite } from '../../utils/firebase'
import { Link } from 'react-router-dom'

const FavoriteButton = ({ game, size = 'normal' }) => {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user) {
        const status = await checkIsFavorite(user.uid, game.id)
        setIsFavorite(status)
      }
    }

    checkFavoriteStatus()
  }, [user, game.id])

  const handleToggleFavorite = async (e) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    try {
      const newStatus = await toggleFavorite(user.uid, game)
      setIsFavorite(newStatus)
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <Link
        to="/login"
        className={`group flex items-center justify-center ${size === 'large'
            ? 'px-6 py-3 text-lg space-x-2'
            : 'p-2'
          } rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 
        hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105`}
      >
        <FaHeart className="text-gray-400 group-hover:text-purple-400 transition-colors duration-300" />
        {size === 'large' && (
          <span className="text-gray-400 group-hover:text-purple-400 transition-colors duration-300">
            Login to Favorite
          </span>
        )}
      </Link>
    )
  }

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`group relative flex items-center justify-center ${size === 'large'
          ? 'px-6 py-3 text-lg space-x-2'
          : 'p-2'
        } rounded-xl ${isFavorite
          ? 'bg-gradient-to-r from-purple-600/10 to-pink-600/10 border-purple-500/50'
          : 'bg-gray-800/50 hover:border-purple-500/50'
        } backdrop-blur-sm border border-gray-700 
      transition-all duration-300 transform hover:scale-105 
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
    >
      <FaHeart
        className={`${isFavorite
            ? 'text-pink-500'
            : 'text-gray-400 group-hover:text-purple-400'
          } transition-colors duration-300 ${isLoading ? 'animate-pulse' : ''
          }`}
      />
      {size === 'large' && (
        <span
          className={`${isFavorite
              ? 'text-pink-500'
              : 'text-gray-400 group-hover:text-purple-400'
            } transition-colors duration-300`}
        >
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </span>
      )}
    </button>
  )
}

export default FavoriteButton