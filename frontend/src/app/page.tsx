'use client';

import FormWizard from '@/components/FormWizard';
import PersonalInformationStep from '@/components/steps/PersonalInformationStep';
import EventDetailsStep from '@/components/steps/EventDetailsStep';
import StylePreferencesStep from '@/components/steps/StylePreferencesStep';
import BodyMeasurementsStep from '@/components/steps/BodyMeasurementsStep';
import PhotoUploadStep from '@/components/steps/PhotoUploadStep';
import ReviewConfirmStep from '@/components/steps/ReviewConfirmStep';

const steps = [
  {
    id: 1,
    title: 'Personal Information',
    description: 'Tell us about yourself',
    content: <PersonalInformationStep />,
  },
  {
    id: 2,
    title: 'Event Details',
    description: 'What event are you attending?',
    content: <EventDetailsStep />,
  },
  {
    id: 3,
    title: 'Style Preferences',
    description: 'What\'s your style?',
    content: <StylePreferencesStep />,
  },
  {
    id: 4,
    title: 'Body Measurements',
    description: 'Help us find the perfect fit',
    content: <BodyMeasurementsStep />,
  },
  {
    id: 5,
    title: 'Photo Upload',
    description: 'Upload your photo for outfit visualization',
    content: <PhotoUploadStep />,
  },
  {
    id: 6,
    title: 'Review & Confirm',
    description: 'Review your information before we generate recommendations',
    content: <ReviewConfirmStep />,
  },
];

export default function Home() {
  const handleComplete = (formData: any) => {
    console.log('Form completed with data:', formData);
    // Handle form completion logic here
  };

  return (
    <div className="min-h-screen bg-dark-900 py-4">
      <div className="max-w-6xl mx-auto px-4">
        <FormWizard steps={steps} onComplete={handleComplete} />
      </div>
    </div>
  );
}