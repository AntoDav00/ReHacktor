/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from 'react'

const LoadingSkeleton = ({ type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="bg-gray-800 rounded-xl overflow-hidden animate-pulse">
        <div className="w-full h-64 bg-gray-700" />
        <div className="p-6">
          <div className="h-6 bg-gray-700 rounded-full w-3/4 mb-4" />
          <div className="flex justify-between">
            <div className="h-4 bg-gray-700 rounded-full w-1/4" />
            <div className="h-4 bg-gray-700 rounded-full w-1/4" />
          </div>
        </div>
      </div>
    )
  }

  if (type === 'detail') {
    return (
      <div className="animate-pulse">
        <div className="h-[400px] bg-gray-700 rounded-xl mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-gray-800 p-6 rounded-xl">
              <div className="h-8 bg-gray-700 rounded w-1/4 mb-4" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-700 rounded w-3/4" />
              </div>
            </div>
          </div>
          <div className="md:col-span-1">
            <div className="bg-gray-800 p-6 rounded-xl">
              <div className="h-6 bg-gray-700 rounded w-1/2 mb-4" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-700 rounded w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default LoadingSkeleton 
