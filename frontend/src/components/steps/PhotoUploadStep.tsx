import React from 'react';

/**
 * Photo Upload Step Component
 * 
 * This component handles the fifth step of the form wizard, allowing users
 * to upload their photo for outfit visualization or capture using their camera.
 */
const PhotoUploadStep: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="bg-dark-700 p-4 rounded-lg shadow-sm border border-dark-600 hover:border-orange-600/30 transition-colors">
        <h3 className="text-base font-semibold text-dark-100 mb-3 flex items-center">
          <div className="w-1 h-4 bg-orange-500 rounded-full mr-2"></div>
          Photo Upload
        </h3>
        <div className="space-y-3">
          <div className="border-2 border-dashed border-orange-600/40 rounded-lg p-6 text-center hover:border-orange-500 hover:bg-orange-600/5 transition-all duration-200">
            <svg className="mx-auto h-8 w-8 text-orange-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="mt-2">
              <label htmlFor="photo-upload" className="cursor-pointer">
                <span className="block text-sm font-medium text-dark-100">
                  Upload your photo
                </span>
                <span className="block text-xs text-orange-300">
                  PNG, JPG, GIF up to 10MB
                </span>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                />
              </label>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-dark-400">
              Or capture using your camera
            </p>
            <button className="mt-1 px-3 py-1 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200">
              Open Camera
            </button>
          </div>
          <div className="bg-orange-900/20 p-3 rounded-lg border border-orange-800/30">
            <h4 className="text-xs font-medium text-orange-300 mb-1">Photo Tips:</h4>
            <ul className="text-xs text-orange-200 space-y-0.5">
              <li>• Use good lighting</li>
              <li>• Stand straight with arms at your sides</li>
              <li>• Wear form-fitting clothes for better results</li>
              <li>• Look directly at the camera</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoUploadStep;
