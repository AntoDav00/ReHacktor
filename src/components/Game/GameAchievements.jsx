import { useState, useEffect } from 'react'
import { FaTrophy } from 'react-icons/fa'

// eslint-disable-next-line react/prop-types
const GameAchievements = ({ gameId }) => {
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const API_KEY = import.meta.env.VITE_RAWG_API_KEY

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch(
          `https://api.rawg.io/api/games/${gameId}/achievements?key=${API_KEY}`
        )
        const data = await response.json()
        setAchievements(data.results)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching achievements:', error)
        setLoading(false)
      }
    }

    fetchAchievements()
  }, [gameId])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-gray-800 p-4 rounded-lg animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-3/4" />
          </div>
        ))}
      </div>
    )
  }

  if (!achievements.length) {
    return (
      <div className="text-center text-gray-400 py-8">
        No achievements available for this game.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {achievements.map((achievement) => (
        <div
          key={achievement.id}
          className="bg-gray-800 p-4 rounded-lg flex items-center space-x-4 hover:bg-gray-700 transition-colors"
        >
          <div className="flex-shrink-0">
            {achievement.image ? (
              <img
                src={achievement.image}
                alt={achievement.name}
                className="w-12 h-12 rounded"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center">
                <FaTrophy className="text-yellow-500" />
              </div>
            )}
          </div>
          <div className="flex-grow">
            <h3 className="font-semibold">{achievement.name}</h3>
            <p className="text-sm text-gray-400">{achievement.description}</p>
            <div className="mt-1 text-xs text-gray-500">
              {achievement.percent}% of players unlocked
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default GameAchievements 