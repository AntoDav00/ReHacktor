import { useState, useEffect } from 'react'
import { FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa'

// eslint-disable-next-line react/prop-types
const ScreenshotsGallery = ({ gameId }) => {
  const [screenshots, setScreenshots] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const API_KEY = import.meta.env.VITE_RAWG_API_KEY

  useEffect(() => {
    const fetchScreenshots = async () => {
      try {
        const response = await fetch(
          `https://api.rawg.io/api/games/${gameId}/screenshots?key=${API_KEY}`
        )
        const data = await response.json()
        setScreenshots(data.results)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching screenshots:', error)
        setLoading(false)
      }
    }

    fetchScreenshots()
  }, [gameId])

  const handlePrevious = () => {
    const currentIndex = screenshots.findIndex(img => img.id === selectedImage.id)
    const previousIndex = (currentIndex - 1 + screenshots.length) % screenshots.length
    setSelectedImage(screenshots[previousIndex])
  }

  const handleNext = () => {
    const currentIndex = screenshots.findIndex(img => img.id === selectedImage.id)
    const nextIndex = (currentIndex + 1) % screenshots.length
    setSelectedImage(screenshots[nextIndex])
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="h-48 bg-gray-700 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 auto-rows-[200px]">
        {screenshots.map((screenshot, index) => (
          <div
            key={screenshot.id}
            className={`cursor-pointer overflow-hidden rounded-xl group relative
              border border-gray-700 hover:border-purple-500/50
              transition-all duration-300 transform hover:scale-[1.02]
              ${index % 3 === 0 ? 'row-span-2' : ''}`}
            onClick={() => setSelectedImage(screenshot)}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent 
            to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
            <img
              src={screenshot.image}
              alt="Game Screenshot"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white opacity-0 
            group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 
            translate-y-2 z-20">
              <span className="inline-flex items-center px-4 py-2 rounded-lg 
              bg-purple-500/20 backdrop-blur-sm text-purple-300 text-sm font-medium">
                Click to view fullscreen
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal with zoom effect */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center 
          backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-7xl px-4 animate-fade-in">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-4 text-white/80 hover:text-white 
              transition-colors p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50"
            >
              <FaTimes size={24} />
            </button>

            <img
              src={selectedImage.image}
              alt="Game Screenshot"
              className="w-full h-auto rounded-xl shadow-2xl border border-gray-700"
            />

            <div className="absolute left-4 right-4 bottom-4 flex justify-between">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrevious()
                }}
                className="p-4 rounded-full bg-gray-800/50 hover:bg-gray-700/50 
                backdrop-blur-sm transition-all duration-300 transform hover:scale-110"
              >
                <FaArrowLeft size={24} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
                className="p-4 rounded-full bg-gray-800/50 hover:bg-gray-700/50 
                backdrop-blur-sm transition-all duration-300 transform hover:scale-110"
              >
                <FaArrowRight size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ScreenshotsGallery 