import React, { useState, useRef, useEffect } from 'react';

interface PersonalInformationStepProps {
  onDataChange: (data: { age: number; gender: string }) => void;
  onValidationChange: (isValid: boolean) => void;
}

/**
 * Personal Information Step Component
 * 
 * This component handles the first step of the form wizard, collecting
 * basic personal information including age and gender.
 */
const PersonalInformationStep: React.FC<PersonalInformationStepProps> = ({ onDataChange, onValidationChange }) => {
  const [age, setAge] = useState<number>(0);
  const [gender, setGender] = useState<string>('');
  const prevIsValidRef = useRef<boolean | null>(null);

  const isValid = age >= 13 && age <= 120 && gender !== '';

  useEffect(() => {
    if (prevIsValidRef.current !== isValid) {
      prevIsValidRef.current = isValid;
      onValidationChange(isValid);
    }
  }, [isValid, onValidationChange]);

  const handleAgeChange = (value: string) => {
    const ageValue = parseInt(value) || 0;
    setAge(ageValue);
    if (ageValue >= 13 && ageValue <= 120 && gender) {
      onDataChange({ age: ageValue, gender });
    }
  };

  const handleGenderChange = (value: string) => {
    setGender(value);
    if (age >= 13 && age <= 120 && value) {
      onDataChange({ age, gender: value });
    }
  };

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
              value={age || ''}
              onChange={(e) => handleAgeChange(e.target.value)}
              className={`w-full px-3 py-2 text-sm bg-dark-600 border rounded-md text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-600/50 transition-colors ${
                age > 0 && (age < 13 || age > 120) ? 'border-red-500' : 'border-dark-500'
              }`}
            />
            {age > 0 && (age < 13 || age > 120) && (
              <p className="text-xs text-red-400 mt-1">Age must be between 13 and 120</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-1">Gender</label>
            <select 
              value={gender}
              onChange={(e) => handleGenderChange(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-dark-600 border border-dark-500 rounded-md text-dark-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-600/50 transition-colors"
              style={{
                colorScheme: 'dark',
                backgroundColor: '#374151',
                color: '#f3f4f6'
              }}
            >
              <option value="" style={{ backgroundColor: '#374151', color: '#f3f4f6' }}>Select gender</option>
              <option value="male" style={{ backgroundColor: '#374151', color: '#f3f4f6' }}>Male</option>
              <option value="female" style={{ backgroundColor: '#374151', color: '#f3f4f6' }}>Female</option>
              <option value="non-binary" style={{ backgroundColor: '#374151', color: '#f3f4f6' }}>Non-binary</option>
            </select>
          </div>
          {!isValid && (
            <div className="p-3 bg-red-900/20 border border-red-800/30 rounded-lg">
              <p className="text-xs text-red-200">
                Please provide a valid age (13-120) and select your gender to continue.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationStep;
