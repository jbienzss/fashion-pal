import React from 'react';

/**
 * Body Measurements Step Component
 * 
 * This component handles the fourth step of the form wizard, collecting
 * user's body measurements to help find the perfect fit for recommended outfits.
 */
const BodyMeasurementsStep: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="bg-dark-700 p-4 rounded-lg shadow-sm border border-dark-600 hover:border-orange-600/30 transition-colors">
        <h3 className="text-base font-semibold text-dark-100 mb-3 flex items-center">
          <div className="w-1 h-4 bg-orange-500 rounded-full mr-2"></div>
          Body Measurements
        </h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1">Height (cm)</label>
              <input
                type="number"
                placeholder="170"
                className="w-full px-3 py-2 text-sm bg-dark-600 border border-dark-500 rounded-md text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-600/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1">Weight (kg)</label>
              <input
                type="number"
                placeholder="70"
                className="w-full px-3 py-2 text-sm bg-dark-600 border border-dark-500 rounded-md text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-600/50 transition-colors"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1">Chest (cm)</label>
              <input
                type="number"
                placeholder="95"
                className="w-full px-3 py-2 text-sm bg-dark-600 border border-dark-500 rounded-md text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-600/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1">Waist (cm)</label>
              <input
                type="number"
                placeholder="80"
                className="w-full px-3 py-2 text-sm bg-dark-600 border border-dark-500 rounded-md text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-600/50 transition-colors"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1">Hip (cm)</label>
              <input
                type="number"
                placeholder="100"
                className="w-full px-3 py-2 text-sm bg-dark-600 border border-dark-500 rounded-md text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-600/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1">Inseam (cm)</label>
              <input
                type="number"
                placeholder="80"
                className="w-full px-3 py-2 text-sm bg-dark-600 border border-dark-500 rounded-md text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-600/50 transition-colors"
              />
            </div>
          </div>
          <div className="bg-orange-900/20 p-3 rounded-lg border border-orange-800/30">
            <p className="text-xs text-orange-200">
              <strong>Note:</strong> These measurements help us recommend the right sizes. You can skip this step if you prefer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyMeasurementsStep;
