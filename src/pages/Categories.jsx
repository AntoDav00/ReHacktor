import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaGamepad, FaArrowRight } from 'react-icons/fa'
import { motion } from 'framer-motion'
import Footer from '../components/Footer/Footer'
import Loader from '../components/Loader'

const Categories = () => {
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)
  const API_KEY = import.meta.env.VITE_RAWG_API_KEY

  useEffect(() => {
    const fetchGenresData = async () => {
      try {
        const response = await fetch(
          `https://api.rawg.io/api/genres?key=${API_KEY}`
        )
        const data = await response.json()
        setGenres(data.results)
      } catch (error) {
        console.error('Error fetching genres:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGenresData()
  }, [])

  if (loading) {
    return <Loader />
  }

  return (
    <div className="space-y-12">
      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {genres.map((genre, index) => (
          <motion.div
            key={genre.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={`/search?genre=${genre.slug}`}
              className="block h-80 rounded-2xl overflow-hidden relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-700 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              <img
                src={genre.image_background}
                alt={genre.name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                <h3 className="text-2xl font-bold text-white mb-2">{genre.name}</h3>
                <div className="flex items-center text-white opacity-70 group-hover:opacity-100 transition-opacity">
                  <span>{genre.games_count} Games</span>
                  <FaArrowRight className="ml-2" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      <Footer />
    </div>
  )
}

export default Categories