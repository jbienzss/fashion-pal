import React, { useState, useRef, useEffect } from 'react';

interface EventDetailsStepProps {
  onDataChange: (data: { eventDescription: string }) => void;
  onValidationChange: (isValid: boolean) => void;
}

/**
 * Event Details Step Component
 * 
 * This component handles the second step of the form wizard, collecting
 * the event description for outfit recommendations.
 */
const EventDetailsStep: React.FC<EventDetailsStepProps> = ({ onDataChange, onValidationChange }) => {
  const [eventDescription, setEventDescription] = useState<string>('');
  const prevIsValidRef = useRef<boolean | null>(null);

  const isValid = eventDescription.trim().length >= 10;

  useEffect(() => {
    if (prevIsValidRef.current !== isValid) {
      prevIsValidRef.current = isValid;
      onValidationChange(isValid);
    }
  }, [isValid, onValidationChange]);

  const handleDescriptionChange = (value: string) => {
    setEventDescription(value);
    onDataChange({ eventDescription: value });
  };

  return (
    <div className="space-y-4">
      <div className="bg-dark-700 p-4 rounded-lg shadow-sm border border-dark-600 hover:border-orange-600/30 transition-colors">
        <h3 className="text-base font-semibold text-dark-100 mb-3 flex items-center">
          <div className="w-1 h-4 bg-orange-500 rounded-full mr-2"></div>
          Event Description
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-1">What event are you attending?</label>
            <textarea
              placeholder="Describe the event you're attending (e.g., 'A formal wedding in the evening', 'Casual dinner with friends', 'Business meeting at a corporate office')"
              rows={4}
              value={eventDescription}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-dark-600 border border-dark-500 rounded-md text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-600/50 transition-colors resize-none"
            />
            <p className="text-xs text-dark-400 mt-1">
              Be as specific as possible to get the best outfit recommendations!
            </p>
            {eventDescription.length > 0 && eventDescription.length < 10 && (
              <p className="text-xs text-red-400 mt-1">
                Description must be at least 10 characters long ({eventDescription.length}/10)
              </p>
            )}
          </div>
          {!isValid && (
            <div className="p-3 bg-red-900/20 border border-red-800/30 rounded-lg">
              <p className="text-xs text-red-200">
                Please provide a detailed event description (at least 10 characters) to continue.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsStep;
