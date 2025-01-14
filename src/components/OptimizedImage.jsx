/* eslint-disable react/prop-types */
import { useState } from 'react'

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = '/placeholder.webp',
  width,
  height
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder)
  const [isLoaded, setIsLoaded] = useState(false)

  const handleImageLoad = () => {
    setImageSrc(src)
    setIsLoaded(true)
  }

  return (
    <div 
      className={`relative overflow-hidden transition-opacity duration-500 ${className}`}
      style={{ width, height }}
    >
      <img
        src={imageSrc}
        alt={alt}
        loading="lazy"
        onLoad={handleImageLoad}
        className={`
          absolute top-0 left-0 w-full h-full object-cover
          ${isLoaded ? 'opacity-100' : 'opacity-0 blur-lg'}
          transition-all duration-500
        `}
      />
    </div>
  )
}

export default OptimizedImage
