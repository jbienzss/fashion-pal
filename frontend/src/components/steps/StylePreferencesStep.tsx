import React from 'react';

/**
 * Style Preferences Step Component
 * 
 * This component handles the third step of the form wizard, collecting
 * user's style preferences including colors, style type, and budget range.
 */
const StylePreferencesStep: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="bg-dark-700 p-4 rounded-lg shadow-sm border border-dark-600 hover:border-orange-600/30 transition-colors">
        <h3 className="text-base font-semibold text-dark-100 mb-3 flex items-center">
          <div className="w-1 h-4 bg-orange-500 rounded-full mr-2"></div>
          Style Preferences
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-1">Preferred Colors</label>
            <div className="grid grid-cols-4 gap-1">
              {['Black', 'White', 'Blue', 'Red', 'Green', 'Gray', 'Brown', 'Navy'].map((color) => (
                <label key={color} className="flex items-center space-x-1 cursor-pointer p-1 rounded hover:bg-orange-600/10 transition-colors">
                  <input type="checkbox" className="rounded border-dark-500 text-orange-500 bg-dark-600 focus:ring-orange-500 focus:ring-2" />
                  <span className="text-xs text-dark-200">{color}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-1">Style Type</label>
            <div className="grid grid-cols-3 gap-2">
              {['Classic', 'Modern', 'Vintage', 'Casual', 'Elegant', 'Trendy'].map((style) => (
                <label key={style} className="flex items-center space-x-1 cursor-pointer p-2 rounded border border-dark-500 hover:border-orange-600/50 hover:bg-orange-600/10 transition-colors">
                  <input type="radio" name="style" className="text-orange-500 bg-dark-600 border-dark-500 focus:ring-orange-500 focus:ring-2" />
                  <span className="text-xs text-dark-200">{style}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-1">Budget Range</label>
            <select className="w-full px-3 py-2 text-sm bg-dark-600 border border-dark-500 rounded-md text-dark-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-600/50 transition-colors">
              <option value="">Select budget range</option>
              <option value="under-50">Under $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100-200">$100 - $200</option>
              <option value="200-500">$200 - $500</option>
              <option value="over-500">Over $500</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StylePreferencesStep;
