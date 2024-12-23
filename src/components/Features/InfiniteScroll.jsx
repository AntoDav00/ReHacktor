/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useEffect, useRef, useState } from 'react'
import LoadingSkeleton from './LoadingSkeleton'

const InfiniteScroll = ({ children, loadMore, hasMore, loading }) => {
  const observerTarget = useRef(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [observerTarget])

  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      loadMore()
    }
  }, [isIntersecting, hasMore, loading, loadMore])

  return (
    <div className="space-y-8">
      {children}

      {hasMore && (
        <div ref={observerTarget} className="w-full">
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-purple-400 border-t-transparent animate-spin"></div>
                <div className="w-12 h-12 rounded-full border-4 border-pink-400 border-t-transparent absolute top-0 left-0 animate-ping"></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default InfiniteScroll 