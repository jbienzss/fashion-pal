import React, { useState, useEffect } from 'react';
import { generateVideoFromImage, VideoGenerationTask } from '@/utils/videoGenerationService';
import LoadingScreen from '../LoadingScreen';

interface VideoPreviewStepProps {
  previewImageDataUrl?: string;
  videoUrl?: string;
  eventDescription?: string;
  onVideoGenerated?: (videoUrl: string) => void;
}

/**
 * Video Preview Step Component
 * 
 * This component handles the sixth step of the form wizard, displaying
 * a video preview of the outfit generated using Runway AI.
 */
const VideoPreviewStep: React.FC<VideoPreviewStepProps> = ({ 
  previewImageDataUrl,
  videoUrl,
  eventDescription,
  onVideoGenerated
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(videoUrl || null);

  // Auto-generate video when preview image is available
  useEffect(() => {
    if (previewImageDataUrl && !currentVideoUrl && !isGenerating) {
      handleGenerateVideo();
    }
  }, [previewImageDataUrl, currentVideoUrl, isGenerating]);

  // Monitor currentVideoUrl state changes
  useEffect(() => {
    console.log('currentVideoUrl state changed to:', currentVideoUrl);
  }, [currentVideoUrl]);

  const handleGenerateVideo = async () => {
    if (!previewImageDataUrl) {
      setError('No preview image available for video generation');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationStatus('Starting video generation...');

    try {
      const videoUrl = await generateVideoFromImage(
        previewImageDataUrl,
        {
          promptText: `A person featured moving naturally and appropriately ${eventDescription ? ` at ${eventDescription}` : ''}`,
          ratio: '1280:720',
          duration: 5,
        },
        (status: VideoGenerationTask) => {
          console.log('Video generation status update:', status);
          switch (status.status) {
            case 'pending':
              setGenerationStatus('Video generation queued...');
              break;
            case 'processing':
              setGenerationStatus('Generating your video...');
              break;
            case 'completed':
            case 'succeeded':
              setGenerationStatus('Video generation completed!');
              console.log('Status update shows completed/succeeded with output:', status.output);
              break;
            case 'failed':
              setGenerationStatus('Video generation failed');
              break;
          }
        }
      );

      console.log('Setting video URL:', videoUrl);
      console.log('Video URL type:', typeof videoUrl);
      console.log('Video URL length:', videoUrl?.length);
      
      if (videoUrl && videoUrl.trim()) {
        setCurrentVideoUrl(videoUrl);
        console.log('Video URL set successfully');
        if (onVideoGenerated) {
          onVideoGenerated(videoUrl);
        }
      } else {
        console.error('Invalid video URL received:', videoUrl);
        setError('Invalid video URL received from server');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate video';
      setError(errorMessage);
      setGenerationStatus('Video generation failed');
    } finally {
      setIsGenerating(false);
    }
  };
  // Show loading state while generating video
  if (isGenerating) {
    return (
      <LoadingScreen 
        title="Generating Your Video"
        description="Creating your video in your outfit..."
      />
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-dark-700 p-4 rounded-lg shadow-sm border border-dark-600">
          <h3 className="text-base font-semibold text-dark-100 mb-3 flex items-center">
            <div className="w-1 h-4 bg-red-500 rounded-full mr-2"></div>
            Video Generation Error
          </h3>
          <p className="text-sm text-dark-300 mb-4">
            We encountered an issue while generating your video.
          </p>
          
          <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-200">{error}</p>
          </div>
          
          <button 
            onClick={handleGenerateVideo}
            className="w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show video when available
  console.log('Current video URL state:', currentVideoUrl);
  if (currentVideoUrl) {
    return (
      <div className="space-y-4">
        <div className="bg-dark-700 p-4 rounded-lg shadow-sm border border-dark-600">
          <h3 className="text-base font-semibold text-dark-100 mb-3 flex items-center">
            <div className="w-1 h-4 bg-orange-500 rounded-full mr-2"></div>
            Your Outfit Video Preview
          </h3>
          <p className="text-sm text-dark-300 mb-4">
            Watch how the outfit looks in motion! This AI-generated video shows the selected items in action.
          </p>
          
          <div className="relative">
            <div className="aspect-video bg-dark-600 rounded-lg overflow-hidden shadow-2xl">
              <video 
                controls 
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                poster={previewImageDataUrl}
                onLoadStart={() => console.log('Video started loading')}
                onCanPlay={() => console.log('Video can play')}
                onError={(e) => console.error('Video error:', e)}
              >
                <source src={currentVideoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
              <p className="text-xs text-white font-medium">AI Generated Video</p>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-orange-900/20 border border-orange-800/30 rounded-lg">
              <h4 className="text-xs font-medium text-orange-300 mb-2">Video Features:</h4>
              <ul className="text-xs text-orange-200 space-y-1">
                <li>• AI-generated realistic movement</li>
                <li>• Multiple angles and poses</li>
                <li>• Professional quality rendering</li>
                <li>• 5-second duration</li>
              </ul>
            </div>
            
            <div className="p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg">
              <h4 className="text-xs font-medium text-blue-300 mb-2">Next Steps:</h4>
              <ul className="text-xs text-blue-200 space-y-1">
                <li>• Share your outfit preview</li>
                <li>• Save to your favorites</li>
                <li>• Get shopping links</li>
                <li>• Try different combinations</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            {/* <button className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 font-medium">
              Get Shopping Links
            </button> */}
            <button 
              onClick={handleGenerateVideo}
              className="flex-1 px-4 py-2 bg-dark-600 text-dark-200 rounded-md hover:bg-dark-500 border border-dark-500 hover:border-dark-400 transition-all duration-200 font-medium"
            >
              Regenerate Video
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show initial state when no preview image is available
  return (
    <div className="space-y-4">
      <div className="bg-dark-700 p-4 rounded-lg shadow-sm border border-dark-600">
        <h3 className="text-base font-semibold text-dark-100 mb-3 flex items-center">
          <div className="w-1 h-4 bg-orange-500 rounded-full mr-2"></div>
          Video Preview
        </h3>
        <p className="text-sm text-dark-300 mb-4">
          Complete the previous steps to generate a video preview of your outfit.
        </p>
        
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-dark-100 mb-2">No Video Available</h4>
          <p className="text-sm text-dark-300">Please complete the outfit preview step first.</p>
        </div>
      </div>
    </div>
  );
};

export default VideoPreviewStep;
