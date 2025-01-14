/* eslint-disable no-unused-vars */
import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex justify-center items-center">
      <div className="relative">
        <div className="w-24 h-24 rounded-full border-8 border-purple-400 border-t-transparent animate-spin"></div>
        <div className="w-24 h-24 rounded-full border-8 border-pink-400 border-t-transparent animate-spin absolute top-0 left-0 animate-ping"></div>
      </div>
    </div>
  );
};

export default Loader;
