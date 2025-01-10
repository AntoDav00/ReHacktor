import React from 'react'
import { Link } from 'react-router-dom'
import { FaStar } from 'react-icons/fa'
import PlatformIcon from '../Features/PlatformIcon'
import FavoriteButton from './FavoriteButton'

const GameCard = ({ 
  game, 
  screenshots = {}, 
  gameDetails = {}
}) => {
  // Ottieni il primo genere se disponibile
  const primaryGenre = gameDetails[game.id]?.genres?.[0]?.name || 'Unknown Genre';

  return (
    <div 
      className="relative group w-full h-[280px] px-2 mb-4 transform transition-all duration-300"
    >
      <Link to={`/game/${game.id}`} className="block h-full">
        <div className="group relative bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-10" />
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
                {game.platforms?.slice(0, 3).map((platform) => (
                  platform?.platform?.name && (
                    <PlatformIcon 
                      key={platform.platform.id} 
                      platform={platform.platform.name} 
                      className="w-5 h-5 text-white bg-black/40 rounded-full p-1"
                    />
                  )
                ))}
                {game.rating && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-400">
                    <FaStar className="mr-1" />
                    {game.rating}/5
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-400">
                {game.released 
                  ? new Date(game.released).toLocaleDateString() 
                  : 'Release Date Unknown'}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Bottone per rimuovere dai preferiti */}
      <div className="absolute top-3 right-3 z-30">
        <FavoriteButton game={game} />
      </div>
    </div>
  )
}

export default GameCard