import React from 'react';

interface VideoPreviewStepProps {
  videoUrl?: string;
}

/**
 * Video Preview Step Component
 * 
 * This component handles the sixth step of the form wizard, displaying
 * a video preview of the outfit (using a dummy URL for now).
 */
const VideoPreviewStep: React.FC<VideoPreviewStepProps> = ({ 
  videoUrl = "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" 
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-dark-700 p-4 rounded-lg shadow-sm border border-dark-600">
        <h3 className="text-base font-semibold text-dark-100 mb-3 flex items-center">
          <div className="w-1 h-4 bg-orange-500 rounded-full mr-2"></div>
          Outfit Video Preview
        </h3>
        <p className="text-sm text-dark-300 mb-4">
          Watch how the outfit looks in motion! This video shows the selected items in action.
        </p>
        
        <div className="relative">
          <div className="aspect-video bg-dark-600 rounded-lg overflow-hidden shadow-2xl">
            <video 
              controls 
              className="w-full h-full object-cover"
              poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4MCIgaGVpZ2h0PSI3MjAiIHZpZXdCb3g9IjAgMCAxMjgwIDcyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyODAiIGhlaWdodD0iNzIwIiBmaWxsPSIjMzM0MTU1Ii8+CjxwYXRoIGQ9Ik01NjAgMzIwSDcyMFY0MDBINTYwVjMyMFoiIGZpbGw9IiM2NjczODMiLz4KPHBhdGggZD0iTTU2MCA0MDBINzIwVjQ0MEg1NjBWNDAwWiIgZmlsbD0iIzk5OTk5OSIvPgo8L3N2Zz4="
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
            <p className="text-xs text-white font-medium">Demo Video</p>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-orange-900/20 border border-orange-800/30 rounded-lg">
            <h4 className="text-xs font-medium text-orange-300 mb-2">Video Features:</h4>
            <ul className="text-xs text-orange-200 space-y-1">
              <li>• 360° view of the outfit</li>
              <li>• Multiple angles and poses</li>
              <li>• Realistic movement simulation</li>
              <li>• High-quality rendering</li>
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
          <button className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 font-medium">
            Get Shopping Links
          </button>
          <button className="flex-1 px-4 py-2 bg-dark-600 text-dark-200 rounded-md hover:bg-dark-500 border border-dark-500 hover:border-dark-400 transition-all duration-200 font-medium">
            Try Different Outfit
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPreviewStep;
