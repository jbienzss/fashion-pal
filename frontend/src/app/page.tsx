'use client';

import React, { useState, useEffect, useCallback } from 'react';
import FormWizard from '@/components/FormWizard';
import PersonalInformationStep from '@/components/steps/PersonalInformationStep';
import EventDetailsStep from '@/components/steps/EventDetailsStep';
import ProductSelectionStep from '@/components/steps/ProductSelectionStep';
import PhotoUploadStep from '@/components/steps/PhotoUploadStep';
import OutfitPreviewStep from '@/components/steps/OutfitPreviewStep';
import VideoPreviewStep from '@/components/steps/VideoPreviewStep';
import ErrorNotification from '@/components/ErrorNotification';
import { fetchRecommendations, generateOutfitPreview, checkBackendHealth, Product } from '@/utils/api';

export default function Home() {
  const [personalInfo, setPersonalInfo] = useState<{ age: number; gender: string } | null>(null);
  const [eventDescription, setEventDescription] = useState<string>('');
  const [recommendations, setRecommendations] = useState<Array<Record<string, Product[]>>>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('');
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'healthy' | 'unhealthy'>('checking');
  const [stepValidation, setStepValidation] = useState<boolean[]>([false, false, false, false, true, true]);
  const [videoUrl, setVideoUrl] = useState<string>('');

  // Backend health check
  useEffect(() => {
    const checkBackend = async () => {
      setBackendStatus('checking');
      const isHealthy = await checkBackendHealth();
      setBackendStatus(isHealthy ? 'healthy' : 'unhealthy');
      if (!isHealthy) {
        setError('Backend server is not available. Please make sure the backend is running on port 3001.');
      }
    };
    checkBackend();
  }, []);

  // API call functions
  const handleFetchRecommendations = async () => {
    if (!personalInfo || !eventDescription) return;
    
    setIsLoadingRecommendations(true);
    try {
      const response = await fetchRecommendations(personalInfo, eventDescription);
      if (response.success && response.data) {
        setRecommendations(response.data.recommendations);
        setError(null);
      } else {
        const errorMessage = response.error || 'Failed to fetch recommendations';
        setError(errorMessage);
        console.error('Failed to fetch recommendations:', response.error);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch recommendations';
      setError(errorMessage);
      console.error('Error fetching recommendations:', error);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const handleGenerateOutfitPreview = async () => {
    if (!selectedProducts.length || !uploadedImage || !eventDescription) return;
    
    setIsLoadingPreview(true);
    try {
      const response = await generateOutfitPreview(selectedProducts, uploadedImage, eventDescription);
      if (response.success && response.data) {
        setPreviewImageUrl(response.data.outfitPreviewImageBuffer);
        setError(null);
      } else {
        const errorMessage = response.error || 'Failed to generate outfit preview';
        setError(errorMessage);
        console.error('Failed to generate preview:', response.error);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate outfit preview';
      setError(errorMessage);
      console.error('Error generating preview:', error);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleStepValidationChange = useCallback((stepIndex: number, isValid: boolean) => {
    setStepValidation(prev => {
      const newValidation = [...prev];
      newValidation[stepIndex] = isValid;
      return newValidation;
    });
  }, []);

  const steps = [
    {
      id: 1,
      title: 'Personal Information',
      description: 'Tell us about yourself',
      content: (
        <PersonalInformationStep 
          onDataChange={setPersonalInfo}
          onValidationChange={(isValid) => handleStepValidationChange(0, isValid)}
        />
      ),
    },
    {
      id: 2,
      title: 'Event Description',
      description: 'What event are you attending?',
      content: (
        <EventDetailsStep 
          onDataChange={(data) => setEventDescription(data.eventDescription)}
          onValidationChange={(isValid) => handleStepValidationChange(1, isValid)}
        />
      ),
    },
    {
      id: 3,
      title: 'Select Outfit Items',
      description: 'Choose your perfect outfit',
      content: (
        <ProductSelectionStep 
          recommendations={recommendations}
          onSelectionChange={setSelectedProducts}
          onValidationChange={(isValid) => handleStepValidationChange(2, isValid)}
          isLoading={isLoadingRecommendations}
        />
      ),
    },
    {
      id: 4,
      title: 'Upload Your Photo',
      description: 'Upload your photo for outfit visualization',
      content: (
        <PhotoUploadStep 
          onImageChange={setUploadedImage}
          onValidationChange={(isValid) => handleStepValidationChange(3, isValid)}
          isLoading={isLoadingPreview}
        />
      ),
    },
    {
      id: 5,
      title: 'Outfit Preview',
      description: 'See how you look in the outfit',
      content: (
        <OutfitPreviewStep 
          previewImageDataUrl={previewImageUrl}
          selectedProducts={selectedProducts}
          isLoading={isLoadingPreview}
        />
      ),
    },
    {
      id: 6,
      title: 'Video Preview',
      description: 'Watch your outfit in motion',
      content: (
        <VideoPreviewStep 
          previewImageDataUrl={previewImageUrl}
          videoUrl={videoUrl}
          eventDescription={eventDescription}
          onVideoGenerated={(videoUrl) => {
            setVideoUrl(videoUrl);
            console.log('Video generated:', videoUrl);
          }}
        />
      ),
    },
  ];

  const handleComplete = (formData: any) => {
    console.log('Form completed with data:', formData);
    // Handle form completion logic here
  };

  return (
    <div className="min-h-screen bg-dark-900 py-4">
      <div className="max-w-6xl mx-auto px-4">
        {/* Backend Status Indicator */}
        {backendStatus === 'checking' && (
          <div className="mb-4 p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg">
            <p className="text-sm text-blue-200">Checking backend connection...</p>
          </div>
        )}
        
        {backendStatus === 'unhealthy' && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-800/30 rounded-lg">
            <p className="text-sm text-red-200">
              ⚠️ Backend server is not available. Please start the backend server on port 3001.
            </p>
          </div>
        )}

        <FormWizard 
          steps={steps} 
          onComplete={handleComplete}
          personalInfo={personalInfo}
          eventDescription={eventDescription}
          recommendations={recommendations}
          selectedProducts={selectedProducts}
          uploadedImage={uploadedImage}
          previewImageUrl={previewImageUrl}
          isLoadingRecommendations={isLoadingRecommendations}
          isLoadingPreview={isLoadingPreview}
          onFetchRecommendations={handleFetchRecommendations}
          onGeneratePreview={handleGenerateOutfitPreview}
          stepValidation={stepValidation}
        />
      </div>
      
      {/* Error Notification */}
      {error && (
        <ErrorNotification
          message={error}
          onClose={() => setError(null)}
          type="error"
        />
      )}
    </div>
  );
}