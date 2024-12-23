import { Link } from 'react-router-dom'
import { FaStar } from 'react-icons/fa'
import FavoriteButton from './FavoriteButton'

const GameCard = ({ game }) => {
  return (
    <div className="group relative">
      <Link to={`/game/${game.id}`}>
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 
        rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 
        transform hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 
          to-transparent z-10" />

          <img
            src={game.background_image}
            alt={game.name}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
          />

          <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
            <h2 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
              {game.name}
            </h2>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm 
                font-medium bg-purple-500/20 text-purple-400">
                  <FaStar className="mr-1" />
                  {game.rating}/5
                </span>
              </div>
              <span className="text-sm text-gray-400">
                {new Date(game.released).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      </Link>
      <div className="absolute top-4 right-4 z-20">
        <FavoriteButton game={game} />
      </div>
    </div>
  )
}

export default GameCard 