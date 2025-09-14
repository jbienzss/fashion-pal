import React from 'react';

interface Product {
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  productUrl: string;
}

interface SelectedProductsPanelProps {
  selectedProducts: Product[];
}

/**
 * Selected Products Panel Component
 * 
 * This component displays a list of selected products with links to their
 * Amazon product pages and a "Buy All" functionality.
 */
const SelectedProductsPanel: React.FC<SelectedProductsPanelProps> = ({ 
  selectedProducts 
}) => {
  const handleBuyAll = async () => {
    // Open all product URLs in new tabs with small delays to avoid popup blockers
    for (let i = 0; i < selectedProducts.length; i++) {
      const product = selectedProducts[i];
      window.open(product.productUrl, '_blank');
      
      // Add a small delay between opening tabs to avoid popup blockers
      if (i < selectedProducts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 250));
      }
    }
  };

  return (
    <div className="bg-dark-700 p-4 rounded-lg shadow-sm border border-dark-600">
      <h3 className="text-base font-semibold text-dark-100 mb-3 flex items-center">
        <div className="w-1 h-4 bg-orange-500 rounded-full mr-2"></div>
        Selected Products
      </h3>
      
      {selectedProducts.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-sm text-dark-300">Nothing selected</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-2">
            {selectedProducts.map((product, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-dark-600 rounded border border-dark-500 flex-shrink-0">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjMzM0MTU1Ii8+CjxwYXRoIGQ9Ik0xMiAxMkgyMFYyMEgxMlYxMloiIGZpbGw9IiM2NjczODMiLz4KPHBhdGggZD0iTTEyIDE2SDIwVjE4SDEyVjE2WiIgZmlsbD0iIzk5OTk5OSIvPgo8L3N2Zz4=';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <a
                    href={product.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-orange-300 hover:text-orange-200 hover:underline transition-colors duration-200 truncate block"
                    title={product.title}
                  >
                    {product.title}
                  </a>
                  <p className="text-xs text-dark-400 mt-0.5">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-2 border-t border-dark-600">
            <button
              onClick={handleBuyAll}
              className="w-full px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-md transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              <span>Buy All</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectedProductsPanel;
