// eslint-disable-next-line no-unused-vars
import React from 'react'

// eslint-disable-next-line react/prop-types
const GameFilter = ({ onFilterChange, onSortChange, currentFilters }) => {
  const platforms = [
    { id: 4, name: 'PC' },
    { id: 187, name: 'PlayStation 5' },
    { id: 1, name: 'Xbox Series X' },
    { id: 7, name: 'Nintendo Switch' },
  ]

  const sortOptions = [
    { value: '-rating', label: 'Rating (High to Low)' },
    { value: '-released', label: 'Release Date (New to Old)' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: '-metacritic', label: 'Metacritic Score' },
  ]

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-6">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Platform</label>
          <select
            className="w-full bg-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(e) => onFilterChange('platform', e.target.value)}
            // eslint-disable-next-line react/prop-types
            value={currentFilters.platform || ''}
          >
            <option value="">All Platforms</option>
            {platforms.map((platform) => (
              <option key={platform.id} value={platform.id}>
                {platform.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Sort By</label>
          <select
            className="w-full bg-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(e) => onSortChange(e.target.value)}
            // eslint-disable-next-line react/prop-types
            value={currentFilters.sort || '-rating'}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Metacritic Score</label>
          <select
            className="w-full bg-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(e) => onFilterChange('metacritic', e.target.value)}
            // eslint-disable-next-line react/prop-types
            value={currentFilters.metacritic || ''}
          >
            <option value="">Any Score</option>
            <option value="90,100">90+</option>
            <option value="80,89">80-89</option>
            <option value="70,79">70-79</option>
            <option value="1,69">Under 70</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default GameFilter 