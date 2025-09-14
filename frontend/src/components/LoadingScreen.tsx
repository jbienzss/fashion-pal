import React from 'react';

interface LoadingScreenProps {
  title: string;
  description: string;
}

/**
 * LoadingScreen Component
 * 
 * A reusable loading screen component that displays a spinner with
 * customizable title and description text.
 */
const LoadingScreen: React.FC<LoadingScreenProps> = ({ title, description }) => {
  return (
    <div className="space-y-4">
      <div className="bg-dark-700 p-4 rounded-lg shadow-sm border border-dark-600">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            {/* Spinning loader */}
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            
            {/* Title */}
            <h3 className="text-lg font-semibold text-dark-100 mb-2">{title}</h3>
            
            {/* Description */}
            <p className="text-sm text-dark-300">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
