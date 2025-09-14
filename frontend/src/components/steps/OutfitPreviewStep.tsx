import React from 'react';
import SelectedProductsPanel from '@/components/SelectedProductsPanel';
import LoadingScreen from '@/components/LoadingScreen';

interface Product {
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  productUrl: string;
}

interface OutfitPreviewStepProps {
  previewImageDataUrl: string; // Data URL from buffer
  selectedProducts: Product[];
  isLoading?: boolean;
}

/**
 * Outfit Preview Step Component
 * 
 * This component handles the fifth step of the form wizard, displaying
 * the generated outfit preview image.
 */
const OutfitPreviewStep: React.FC<OutfitPreviewStepProps> = ({ 
  previewImageDataUrl, 
  selectedProducts,
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <LoadingScreen 
        title="Generating Your Outfit Preview"
        description="Creating a realistic visualization of you wearing the selected outfit..."
      />
    );
  }

  if (!previewImageDataUrl) {
    return (
      <div className="space-y-4">
        <div className="bg-dark-700 p-4 rounded-lg shadow-sm border border-dark-600">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-dark-100 mb-2">No Preview Available</h3>
            <p className="text-sm text-dark-300">We couldn't generate a preview image. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-dark-700 p-4 rounded-lg shadow-sm border border-dark-600">
        <h3 className="text-base font-semibold text-dark-100 mb-3 flex items-center">
          <div className="w-1 h-4 bg-orange-500 rounded-full mr-2"></div>
          Your Outfit Preview
        </h3>
        <p className="text-sm text-dark-300 mb-4">
          Here's how you'll look in the selected outfit!
        </p>
        
        <div className="relative">
          <img 
            src={previewImageDataUrl} 
            alt="Outfit Preview" 
            className="w-full max-w-lg mx-auto rounded-lg shadow-2xl"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMzM0MTU1Ii8+CjxwYXRoIGQ9Ik0xNjAgMTYwSDI0MFYyNDBIMTYwVjE2MFoiIGZpbGw9IiM2NjczODMiLz4KPHBhdGggZD0iTTE2MCAyMDBIMjQwVjIyMEgxNjBWMjAwWiIgZmlsbD0iIzk5OTk5OSIvPgo8L3N2Zz4=';
            }}
          />
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
            <p className="text-xs text-white font-medium">AI Generated Preview</p>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-3 bg-orange-900/20 border border-orange-800/30 rounded-lg">
            <h4 className="text-xs font-medium text-orange-300 mb-2">About This Preview:</h4>
            <ul className="text-xs text-orange-200 space-y-1">
              <li>• This is an AI-generated visualization</li>
              <li>• The preview shows how the selected items would look on you</li>
              <li>• Colors and fit may vary slightly from the actual products</li>
              <li>• For best results, ensure good lighting in your original photo</li>
            </ul>
          </div>
          
          <div className="lg:block">
            <SelectedProductsPanel selectedProducts={selectedProducts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutfitPreviewStep;
