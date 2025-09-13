import React from 'react';

/**
 * Event Details Step Component
 * 
 * This component handles the second step of the form wizard, collecting
 * information about the event the user will be attending.
 */
const EventDetailsStep: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="bg-dark-700 p-4 rounded-lg shadow-sm border border-dark-600 hover:border-orange-600/30 transition-colors">
        <h3 className="text-base font-semibold text-dark-100 mb-3 flex items-center">
          <div className="w-1 h-4 bg-orange-500 rounded-full mr-2"></div>
          Event Information
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-1">Event Type</label>
            <select className="w-full px-3 py-2 text-sm bg-dark-600 border border-dark-500 rounded-md text-dark-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-600/50 transition-colors">
              <option value="">Select event type</option>
              <option value="wedding">Wedding</option>
              <option value="business">Business Meeting</option>
              <option value="casual">Casual Outing</option>
              <option value="formal">Formal Event</option>
              <option value="party">Party</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1">Event Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 text-sm bg-dark-600 border border-dark-500 rounded-md text-dark-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-600/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1">Event Time</label>
              <input
                type="time"
                className="w-full px-3 py-2 text-sm bg-dark-600 border border-dark-500 rounded-md text-dark-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-600/50 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-1">Event Description</label>
            <textarea
              placeholder="Describe the event (optional)"
              rows={2}
              className="w-full px-3 py-2 text-sm bg-dark-700 border border-dark-600 rounded-md text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-600/50 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsStep;
