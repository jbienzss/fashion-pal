import React, { useState, useRef, useEffect } from 'react';
import LoadingScreen from '../LoadingScreen';

interface PhotoUploadStepProps {
  onImageChange: (imageFile: File | null) => void;
  onValidationChange: (isValid: boolean) => void;
  isLoading?: boolean;
}

/**
 * Photo Upload Step Component
 * 
 * This component handles the fourth step of the form wizard, allowing users
 * to upload their photo for outfit visualization or capture using their camera.
 */
const PhotoUploadStep: React.FC<PhotoUploadStepProps> = ({ onImageChange, onValidationChange, isLoading = false }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const prevIsValidRef = useRef<boolean | null>(null);

  const isValid = selectedImage !== null;

  useEffect(() => {
    if (prevIsValidRef.current !== isValid) {
      prevIsValidRef.current = isValid;
      onValidationChange(isValid);
    }
  }, [isValid, onValidationChange]);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  if (isLoading) {
    return (
      <LoadingScreen 
        title="Generating Your Outfit Preview"
        description="Creating a realistic visualization of you wearing the selected outfit..."
        countdownSeconds={20}
      />
    );
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      onImageChange(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = async () => {
    try {
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true 
      });
      
      console.log('Camera stream obtained:', stream);
      streamRef.current = stream;
      setIsCameraOpen(true);
      setIsCameraLoading(false);
      
      // Wait for the component to re-render with the camera open before setting the stream
      setTimeout(() => {
        if (videoRef.current) {
          console.log('Setting stream to video element');
          videoRef.current.srcObject = stream;
          
          // Force the video to play
          videoRef.current.play().then(() => {
            console.log('Video is playing');
          }).catch((err) => {
            console.error('Error playing video:', err);
          });
        } else {
          console.error('Video ref is null after timeout');
        }
      }, 100);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError('Unable to access camera. Please check permissions.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      setCameraError('Camera not ready. Please try again.');
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) {
      setCameraError('Failed to capture photo. Please try again.');
      return;
    }

    // Check if video is ready
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setCameraError('Camera feed not ready. Please wait a moment and try again.');
      return;
    }

    try {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          setSelectedImage(file);
          onImageChange(file);
          setImagePreview(canvas.toDataURL());
          closeCamera();
        } else {
          setCameraError('Failed to process photo. Please try again.');
        }
      }, 'image/jpeg', 0.8);
    } catch (error) {
      console.error('Error capturing photo:', error);
      setCameraError('Failed to capture photo. Please try again.');
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
    setIsCameraLoading(false);
    setCameraError(null);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-dark-700 p-4 rounded-lg shadow-sm border border-dark-600 hover:border-orange-600/30 transition-colors">
        <h3 className="text-base font-semibold text-dark-100 mb-3 flex items-center">
          <div className="w-1 h-4 bg-orange-500 rounded-full mr-2"></div>
          Upload Your Photo
        </h3>
        <p className="text-sm text-dark-300 mb-4">
          Upload a photo of yourself or take one with your camera to see how the outfit looks on you.
        </p>
        
        {!isCameraOpen ? (
          <div className="space-y-4">
            {!imagePreview ? (
              <>
                <div 
                  className="border-2 border-dashed border-orange-600/40 rounded-lg p-6 text-center hover:border-orange-500 hover:bg-orange-600/5 transition-all duration-200 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg className="mx-auto h-12 w-12 text-orange-400 mb-3" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div>
                    <span className="block text-sm font-medium text-dark-100 mb-1">
                      Click to upload your photo
                    </span>
                    <span className="block text-xs text-orange-300">
                      PNG, JPG, GIF up to 10MB
                    </span>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-xs text-dark-400 mb-2">Or capture using your camera</p>
                  <button 
                    onClick={handleCameraClick}
                    disabled={isCameraLoading}
                    className="px-4 py-2 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCameraLoading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Opening Camera...
                      </div>
                    ) : (
                      'Open Camera'
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Selected" 
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="sr-only"
            />
          </div>
        ) : (
          <div className="space-y-4">
            {cameraError ? (
              <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4">
                <p className="text-sm text-red-200 mb-3">{cameraError}</p>
                <button
                  onClick={handleCameraClick}
                  className="px-3 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors mr-2"
                >
                  Try Again
                </button>
                <button
                  onClick={closeCamera}
                  className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  width="400"
                  height="300"
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg border-2 border-orange-500"
                  style={{ backgroundColor: '#1f2937' }}
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  <button
                    onClick={capturePhoto}
                    className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors shadow-lg"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={closeCamera}
                    className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}
        
        <div className="bg-orange-900/20 p-3 rounded-lg border border-orange-800/30">
          <h4 className="text-xs font-medium text-orange-300 mb-1">Photo Tips:</h4>
          <ul className="text-xs text-orange-200 space-y-0.5">
            <li>• Use good lighting</li>
            <li>• Stand straight with arms at your sides</li>
            <li>• Wear form-fitting clothes for better results</li>
            <li>• Look directly at the camera</li>
          </ul>
        </div>
        
        {!isValid && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-800/30 rounded-lg">
            <p className="text-xs text-red-200">
              Please upload a photo or take one with your camera to continue.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoUploadStep;
