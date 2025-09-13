import React from 'react';

/**
 * Review & Confirm Step Component
 * 
 * This component handles the final step of the form wizard, displaying
 * a summary of all information provided by the user before generating recommendations.
 */
const ReviewConfirmStep: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="bg-dark-700 p-4 rounded-lg shadow-sm border border-dark-600 hover:border-orange-600/30 transition-colors">
        <h3 className="text-base font-semibold text-dark-100 mb-3 flex items-center">
          <div className="w-1 h-4 bg-orange-500 rounded-full mr-2"></div>
          Review Your Information
        </h3>
        <div className="space-y-3">
          <div className="bg-dark-600 p-3 rounded-lg border border-dark-500 hover:border-orange-600/30 transition-colors">
            <h4 className="text-sm font-medium text-dark-100 mb-2 flex items-center">
              <div className="w-1 h-3 bg-orange-400 rounded-full mr-2"></div>
              Personal Information
            </h4>
            <p className="text-xs text-dark-300">Age and gender will be used to create your profile.</p>
          </div>
          <div className="bg-dark-600 p-3 rounded-lg border border-dark-500 hover:border-orange-600/30 transition-colors">
            <h4 className="text-sm font-medium text-dark-100 mb-2 flex items-center">
              <div className="w-1 h-3 bg-orange-400 rounded-full mr-2"></div>
              Event Details
            </h4>
            <p className="text-xs text-dark-300">Event type, date, and time will help us suggest appropriate outfits.</p>
          </div>
          <div className="bg-dark-600 p-3 rounded-lg border border-dark-500 hover:border-orange-600/30 transition-colors">
            <h4 className="text-sm font-medium text-dark-100 mb-2 flex items-center">
              <div className="w-1 h-3 bg-orange-400 rounded-full mr-2"></div>
              Style Preferences
            </h4>
            <p className="text-xs text-dark-300">Your color preferences, style type, and budget range for recommendations.</p>
          </div>
          <div className="bg-dark-600 p-3 rounded-lg border border-dark-500 hover:border-orange-600/30 transition-colors">
            <h4 className="text-sm font-medium text-dark-100 mb-2 flex items-center">
              <div className="w-1 h-3 bg-orange-400 rounded-full mr-2"></div>
              Body Measurements
            </h4>
            <p className="text-xs text-dark-300">Measurements help us find the perfect fit for your recommended outfits.</p>
          </div>
          <div className="bg-dark-600 p-3 rounded-lg border border-dark-500 hover:border-orange-600/30 transition-colors">
            <h4 className="text-sm font-medium text-dark-100 mb-2 flex items-center">
              <div className="w-1 h-3 bg-orange-400 rounded-full mr-2"></div>
              Photo
            </h4>
            <p className="text-xs text-dark-300">Your photo will be used to visualize how the recommended outfits look on you.</p>
          </div>
          <div className="bg-orange-900/20 p-3 rounded-lg border border-orange-800/30">
            <h4 className="text-sm font-medium text-orange-300 mb-1">Ready to proceed?</h4>
            <p className="text-xs text-orange-200">
              Click "Complete" to generate your personalized outfit recommendations based on all the information you've provided.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewConfirmStep;
