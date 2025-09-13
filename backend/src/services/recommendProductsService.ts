import { RecommendProductsRequest, RecommendProductsData, ApiResponse, Product } from '../types';

export class RecommendProductsService {
  private static instance: RecommendProductsService;

  private constructor() {}

  public static getInstance(): RecommendProductsService {
    if (!RecommendProductsService.instance) {
      RecommendProductsService.instance = new RecommendProductsService();
    }
    return RecommendProductsService.instance;
  }

  /**
   * Generates dummy product recommendations based on personal info and event description
   * @param request - The recommend products request containing personal info and event description
   * @returns Promise<ApiResponse<RecommendProductsData>> - The response with product recommendations
   */
  public async generateRecommendations(request: RecommendProductsRequest): Promise<ApiResponse<RecommendProductsData>> {
    try {
      // Generate dummy products based on the request
      const recommendations = this.generateDummyProducts(request);

      return {
        success: true,
        data: {
          recommendations
        },
        message: 'Product recommendations generated successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: {
          recommendations: []
        },
        error: 'Failed to generate recommendations',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Generates dummy product data based on the request
   * @param request - The recommend products request
   * @returns Array<Record<string, Product[]>> - Categorized product recommendations
   */
  private generateDummyProducts(request: RecommendProductsRequest): Array<Record<string, Product[]>> {
    const { personalInfo, eventDescription } = request;
    
    // Generate products based on event description and personal preferences
    const products: Product[] = [
      {
        title: `Elegant Event Dress`,
        price: 89.99,
        description: `Perfect for ${eventDescription}. A stylish and comfortable choice.`,
        imageUrl: 'https://example.com/images/dress1.jpg',
        productUrl: 'https://amazon.com/dp/dress1'
      },
      {
        title: `Classic Formal Shirt`,
        price: 45.50,
        description: `High-quality formal shirt perfect for ${eventDescription}.`,
        imageUrl: 'https://example.com/images/shirt1.jpg',
        productUrl: 'https://amazon.com/dp/shirt1'
      },
      {
        title: `Stylish ${personalInfo.gender} Blazer`,
        price: 120.00,
        description: `Professional blazer perfect for ${eventDescription}.`,
        imageUrl: 'https://example.com/images/blazer1.jpg',
        productUrl: 'https://amazon.com/dp/blazer1'
      },
      {
        title: `Comfortable Dress Shoes`,
        price: 75.25,
        description: `Elegant shoes that provide comfort for ${eventDescription}.`,
        imageUrl: 'https://example.com/images/shoes1.jpg',
        productUrl: 'https://amazon.com/dp/shoes1'
      },
      {
        title: `Accessory Set`,
        price: 25.99,
        description: `Complete accessory set to complement your outfit for ${eventDescription}.`,
        imageUrl: 'https://example.com/images/accessories1.jpg',
        productUrl: 'https://amazon.com/dp/accessories1'
      }
    ];

    // Categorize products based on event type and personal preferences
    const categories: Record<string, Product[]> = {
      'Main Outfit': products.slice(0, 2),
      'Accessories': products.slice(2, 4),
      'Shoes': products.slice(4, 5)
    };

    return [categories];
  }
}
