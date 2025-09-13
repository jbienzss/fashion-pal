'use client';

import FormWizard from '@/components/FormWizard';

const steps = [
  {
    id: 1,
    title: 'Personal Information',
    description: 'Tell us about yourself',
    content: (
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Personal Details</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: 'Event Details',
    description: 'What event are you attending?',
    content: (
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Event Information</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
              <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Time</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Description</label>
              <textarea
                placeholder="Describe the event (optional)"
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: 'Style Preferences',
    description: 'What\'s your style?',
    content: (
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Style Preferences</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Colors</label>
              <div className="grid grid-cols-4 gap-1">
                {['Black', 'White', 'Blue', 'Red', 'Green', 'Gray', 'Brown', 'Navy'].map((color) => (
                  <label key={color} className="flex items-center space-x-1 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-xs" />
                    <span className="text-xs text-gray-700">{color}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Style Type</label>
              <div className="grid grid-cols-3 gap-2">
                {['Classic', 'Modern', 'Vintage', 'Casual', 'Elegant', 'Trendy'].map((style) => (
                  <label key={style} className="flex items-center space-x-1 cursor-pointer">
                    <input type="radio" name="style" className="text-blue-600 text-xs" />
                    <span className="text-xs text-gray-700">{style}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range</label>
              <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
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
    ),
  },
  {
    id: 4,
    title: 'Body Measurements',
    description: 'Help us find the perfect fit',
    content: (
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Body Measurements</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  placeholder="170"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  placeholder="70"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chest (cm)</label>
                <input
                  type="number"
                  placeholder="95"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Waist (cm)</label>
                <input
                  type="number"
                  placeholder="80"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hip (cm)</label>
                <input
                  type="number"
                  placeholder="100"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Inseam (cm)</label>
                <input
                  type="number"
                  placeholder="80"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600">
                <strong>Note:</strong> These measurements help us recommend the right sizes. You can skip this step if you prefer.
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    title: 'Photo Upload',
    description: 'Upload your photo for outfit visualization',
    content: (
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Photo Upload</h3>
          <div className="space-y-3">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="mt-2">
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <span className="block text-sm font-medium text-gray-900">
                    Upload your photo
                  </span>
                  <span className="block text-xs text-gray-500">
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
              <p className="text-xs text-gray-500">
                Or capture using your camera
              </p>
              <button className="mt-1 px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                Open Camera
              </button>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="text-xs font-medium text-blue-900 mb-1">Photo Tips:</h4>
              <ul className="text-xs text-blue-800 space-y-0.5">
                <li>• Use good lighting</li>
                <li>• Stand straight with arms at your sides</li>
                <li>• Wear form-fitting clothes for better results</li>
                <li>• Look directly at the camera</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    title: 'Review & Confirm',
    description: 'Review your information before we generate recommendations',
    content: (
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Review Your Information</h3>
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Personal Information</h4>
              <p className="text-xs text-gray-600">Name, email, and phone number will be used to create your profile.</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Event Details</h4>
              <p className="text-xs text-gray-600">Event type, date, and time will help us suggest appropriate outfits.</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Style Preferences</h4>
              <p className="text-xs text-gray-600">Your color preferences, style type, and budget range for recommendations.</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Body Measurements</h4>
              <p className="text-xs text-gray-600">Measurements help us find the perfect fit for your recommended outfits.</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Photo</h4>
              <p className="text-xs text-gray-600">Your photo will be used to visualize how the recommended outfits look on you.</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-1">Ready to proceed?</h4>
              <p className="text-xs text-blue-800">
                Click "Complete" to generate your personalized outfit recommendations based on all the information you've provided.
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

export default function Home() {
  const handleComplete = (formData: any) => {
    console.log('Form completed with data:', formData);
    // Handle form completion logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-6xl mx-auto px-4">
        <FormWizard steps={steps} onComplete={handleComplete} />
      </div>
    </div>
  );
}