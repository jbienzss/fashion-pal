import React from 'react';

/**
 * Personal Information Step Component
 * 
 * This component handles the first step of the form wizard, collecting
 * basic personal information including age and gender.
 */
const PersonalInformationStep: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="bg-dark-700 p-4 rounded-lg shadow-sm border border-dark-600 hover:border-orange-600/30 transition-colors">
        <h3 className="text-base font-semibold text-dark-100 mb-3 flex items-center">
          <div className="w-1 h-4 bg-orange-500 rounded-full mr-2"></div>
          Personal Details
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-1">Age</label>
            <input
              type="number"
              placeholder="Enter your age"
              min="13"
              max="120"
              className="w-full px-3 py-2 text-sm bg-dark-600 border border-dark-500 rounded-md text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-600/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-1">Gender</label>
            <select className="w-full px-3 py-2 text-sm bg-dark-600 border border-dark-500 rounded-md text-dark-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-600/50 transition-colors">
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationStep;
