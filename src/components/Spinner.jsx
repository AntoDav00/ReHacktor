import React from 'react';
import { ImSpinner9 } from 'react-icons/im';

const Spinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
      <div className="animate-spin text-6xl text-blue-500">
        <ImSpinner9 />
      </div>
    </div>
  );
};

export default Spinner;
