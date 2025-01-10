import { useState, useEffect } from 'react'
import { FaHeart } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'
import { toggleFavorite, checkIsFavorite } from '../utils/firebase'

const FavoriteButton = ({ userId, gameId }) => {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (userId && gameId) {
        try {
          const favoriteStatus = await checkIsFavorite(userId, gameId)
          setIsFavorite(favoriteStatus)
        } catch (error) {
          console.error('Error checking favorite:', error)
        }
      }
    }

    fetchFavoriteStatus()
  }, [userId, gameId])

  const handleToggleFavorite = async (e) => {
    e.preventDefault() // Prevent navigation if used in a Link
    if (!user) {
      // Handle not logged in state - maybe redirect to login
      return
    }

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

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`p-2 rounded-full transition-all duration-300 ${isFavorite
          ? 'bg-pink-500 text-white'
          : 'bg-gray-800/50 text-gray-400 hover:text-pink-500'
        }`}
    >
      <FaHeart className={`text-xl ${isLoading ? 'animate-pulse' : ''}`} />
    </button>
  )
}

export default FavoriteButton 