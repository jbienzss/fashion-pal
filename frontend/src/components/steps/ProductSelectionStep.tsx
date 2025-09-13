import React, { useState, useEffect, useRef } from 'react';

interface Product {
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  productUrl: string;
}

interface ProductSelectionStepProps {
  recommendations: Array<Record<string, Product[]>>;
  onSelectionChange: (selectedProducts: Product[]) => void;
  onValidationChange: (isValid: boolean) => void;
  isLoading?: boolean;
}

/**
 * Product Selection Step Component
 * 
 * This component handles the third step of the form wizard, displaying
 * product recommendations and allowing users to select items.
 */
const ProductSelectionStep: React.FC<ProductSelectionStepProps> = ({ 
  recommendations, 
  onSelectionChange, 
  onValidationChange,
  isLoading = false 
}) => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const prevIsValidRef = useRef<boolean | null>(null);

  const isValid = selectedProducts.length > 0;

  useEffect(() => {
    if (prevIsValidRef.current !== isValid) {
      prevIsValidRef.current = isValid;
      onValidationChange(isValid);
    }
  }, [isValid, onValidationChange]);

  const handleProductToggle = (product: Product) => {
    setSelectedProducts(prev => {
      const isSelected = prev.some(p => p.productUrl === product.productUrl);
      
      if (isSelected) {
        return prev.filter(p => p.productUrl !== product.productUrl);
      } else {
        return [...prev, product];
      }
    });
  };

  // Update parent component when selectedProducts changes
  React.useEffect(() => {
    onSelectionChange(selectedProducts);
  }, [selectedProducts, onSelectionChange]);

  const isProductSelected = (product: Product) => {
    return selectedProducts.some(p => p.productUrl === product.productUrl);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-dark-700 p-4 rounded-lg shadow-sm border border-dark-600">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-dark-100 mb-2">Finding Perfect Outfits</h3>
              <p className="text-sm text-dark-300">Analyzing your preferences and event details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-dark-700 p-4 rounded-lg shadow-sm border border-dark-600">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-dark-100 mb-2">No Recommendations Found</h3>
            <p className="text-sm text-dark-300">We couldn't find any outfit recommendations. Please try again.</p>
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
          Select Your Outfit Items
        </h3>
        <p className="text-sm text-dark-300 mb-4">
          Choose the items you'd like to try on. You can select multiple pieces to create your perfect outfit.
        </p>
        
        <div className="space-y-6">
          {recommendations.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              {Object.entries(category).map(([categoryName, products]) => (
                <div key={categoryName} className="mb-6">
                  <h4 className="text-sm font-medium text-dark-200 mb-3 capitalize">
                    {categoryName.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {products.map((product, productIndex) => (
                      <div
                        key={`${categoryName}-${productIndex}`}
                        className={`relative cursor-pointer group transition-all duration-200 ${
                          isProductSelected(product)
                            ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-dark-700'
                            : 'hover:ring-2 hover:ring-orange-500/50 hover:ring-offset-2 hover:ring-offset-dark-700'
                        }`}
                        onClick={() => handleProductToggle(product)}
                      >
                        <div className="bg-dark-600 rounded-lg overflow-hidden border border-dark-500 group-hover:border-orange-600/50 transition-colors">
                          <div className="aspect-square relative">
                            <img
                              src={product.imageUrl}
                              alt={product.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzM0MTU1Ii8+CjxwYXRoIGQ9Ik04MCA2MEgxMjBWMTQwSDgwVjYwWiIgZmlsbD0iIzY2NzM4MCIvPgo8cGF0aCBkPSJNODAgODBIMTIwVjEwMEg4MFY4MFoiIGZpbGw9IiM5OTk5OTkiLz4KPC9zdmc+';
                              }}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                              <div className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                                isProductSelected(product)
                                  ? 'bg-orange-500 border-orange-500'
                                  : 'bg-transparent border-white/50 group-hover:border-white'
                              }`}>
                                {isProductSelected(product) && (
                                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        
        {selectedProducts.length > 0 && (
          <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <p className="text-sm text-orange-200">
              <span className="font-medium">{selectedProducts.length}</span> item{selectedProducts.length !== 1 ? 's' : ''} selected
            </p>
          </div>
        )}
        
        {!isValid && recommendations.length > 0 && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-800/30 rounded-lg">
            <p className="text-xs text-red-200">
              Please select at least one item to continue.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSelectionStep;
