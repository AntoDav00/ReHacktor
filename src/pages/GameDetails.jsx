import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { FaStar, FaCalendar, FaGlobe } from 'react-icons/fa'
import LoadingSkeleton from '../components/Features/LoadingSkeleton'
import Comments from '../components/Game/Comments'
import FavoriteButton from '../components/Game/FavoriteButton'
import ScreenshotsGallery from '../components/Game/ScreenshotsGallery'
import GameAchievements from '../components/Game/GameAchievements'

const GameDetails = () => {
  const { id } = useParams()
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const API_KEY = import.meta.env.VITE_RAWG_API_KEY



  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await fetch(
          `https://api.rawg.io/api/games/${id}?key=${API_KEY}`
        )
        const data = await response.json()
        setGame(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching game details:', error)
        setLoading(false)
      }
    }

    fetchGameDetails()
  }, [id])

  if (loading) {
    return <LoadingSkeleton type="details" />
  }

  if (!game) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-400">Game not found</h2>
      </div>
    )
  }



  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="space-y-8">
        {/* Hero Section - make it shorter on mobile */}
        <div className="relative h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.8)_100%)] z-[5]" />
          <img
            src={game.background_image}
            alt={game.name}
            className="w-full h-full object-cover"
          />

          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8 z-20">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-start justify-between">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  {game.name}
                </h1>
                <FavoriteButton game={game} size="large" />
              </div>

              <div className="flex flex-wrap items-center gap-3 md:gap-6 text-sm md:text-base lg:text-lg">
                <div className="flex items-center space-x-2">
                  <FaStar className="text-yellow-500" />
                  <span>{game.rating}/5</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCalendar className="text-purple-400" />
                  <span>{new Date(game.released).toLocaleDateString()}</span>
                </div>
                {game.website && (
                  <a
                    href={game.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 hover:text-purple-400 transition-colors"
                  >
                    <FaGlobe />
                    <span>Website</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Game Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6 lg:space-y-8">
            {/* About */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-4 md:p-6 lg:p-8 rounded-2xl border border-gray-700">
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                About
              </h2>
              <div
                className="prose prose-sm md:prose lg:prose-lg prose-invert max-w-none prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: game.description }}
              />
            </div>

            {/* Screenshots Gallery */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-4 md:p-6 lg:p-8 rounded-2xl border border-gray-700">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Screenshots
              </h2>
              <ScreenshotsGallery gameId={id} />
            </div>

            {/* Comments Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-4 md:p-6 lg:p-8 rounded-2xl border border-gray-700">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Comments
              </h2>
              <Comments gameId={id} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 md:space-y-6 lg:space-y-8">
            {/* Game Info */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-4 md:p-6 lg:p-8 rounded-2xl border border-gray-700">
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Game Info
              </h2>
              <dl className="space-y-3 md:space-y-4 text-sm md:text-base">
                {game.platforms && (
                  <div>
                    <dt className="text-gray-400">Platforms</dt>
                    <dd className="mt-1">
                      {game.platforms.map(p => p.platform.name).join(', ')}
                    </dd>
                  </div>
                )}
                {game.genres && (
                  <div>
                    <dt className="text-gray-400">Genres</dt>
                    <dd className="mt-1">
                      {game.genres.map(g => g.name).join(', ')}
                    </dd>
                  </div>
                )}
                {game.developers && (
                  <div>
                    <dt className="text-gray-400">Developers</dt>
                    <dd className="mt-1">
                      {game.developers.map(d => d.name).join(', ')}
                    </dd>
                  </div>
                )}
                {game.publishers && (
                  <div>
                    <dt className="text-gray-400">Publishers</dt>
                    <dd className="mt-1">
                      {game.publishers.map(p => p.name).join(', ')}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Achievements */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-4 md:p-6 lg:p-8 rounded-2xl border border-gray-700">
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Achievements
              </h2>
              <GameAchievements gameId={id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameDetails 