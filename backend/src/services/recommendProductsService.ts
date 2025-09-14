import { RecommendProductsRequest, RecommendProductsData, ApiResponse, Product } from '../types';
import OpenAI from 'openai';
import { z } from 'zod';
import { getJson } from 'serpapi';

export class RecommendProductsService {
  private static instance: RecommendProductsService;
  private static SEARCH_TERMS_SYSTEM_PROMPT =
    'You are a helpful AI that assists a user in searching for outfits and accessories to wear at ' +
    'special events. The user will specify an event. You must respond with a list of 3 to 5 items ' +
    'this person might wear to the event. The list might include garmants and accessories if they are appropriate for the event. Each ' +
    'item MUST be returned in the form of a search term that could be submitted to an online retailer. ' +
    'Do not include any other details in your response. Do not return unnecessary or unrelated search terms.';
  private static SEARCH_TERMS_USER_TEMPLATE = 'I am a {age} year old {gender} and I am attending {event_description}.';

  // Zod schema for structured response validation
  private static SearchTermsSchema = z.object({
    searchTerms: z.array(z.string())
  });

  private constructor() { }

  public static getInstance(): RecommendProductsService {
    if (!RecommendProductsService.instance) {
      RecommendProductsService.instance = new RecommendProductsService();
    }
    return RecommendProductsService.instance;
  }

  /**
   * Generates search terms using OpenAI chat completion with structured response
   * @param request - The recommend products request containing personal info and event description
   * @returns Promise<string[]> - Array of search terms for product recommendations
   */
  public async generateSearchTerms(request: RecommendProductsRequest): Promise<string[]> {
    try {
      const openaiApiKey = process.env.OPENAI_API_KEY;

      if (!openaiApiKey) {
        throw new Error('OPENAI_API_KEY environment variable is not configured');
      }

      // Initialize OpenAI client
      const openai = new OpenAI({
        apiKey: openaiApiKey
      });

      // Replace template variables with actual values
      const userPrompt = RecommendProductsService.SEARCH_TERMS_USER_TEMPLATE
        .replace('{age}', request.personalInfo.age.toString())
        .replace('{gender}', request.personalInfo.gender)
        .replace('{event_description}', request.eventDescription);

      // Make OpenAI API call with structured response
      // Note: For structured outputs, use gpt-4o-mini, gpt-4o, or gpt-4-turbo
      // For cheaper models like gpt-3.5-turbo, remove response_format and rely on fallback parsing
      const completion = await openai.chat.completions.create({
        model: 'gpt-4.1', // Use model that supports structured outputs
        // Alternative for gpt-3.5-turbo (cheaper but no structured outputs):
        // model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: RecommendProductsService.SEARCH_TERMS_SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'search_terms_response',
            schema: {
              type: 'object',
              properties: {
                searchTerms: {
                  type: 'array',
                  items: {
                    type: 'string'
                  }
                }
              },
              required: ['searchTerms'],
              additionalProperties: false
            }
          }
        },
        temperature: 0.7,
        max_tokens: 500
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error('No response content received from OpenAI');
      }

      // Parse and validate the response using Zod
      const parsedResponse = JSON.parse(responseContent);
      const validatedResponse = RecommendProductsService.SearchTermsSchema.parse(parsedResponse);

      return validatedResponse.searchTerms;
    } catch (error) {
      throw new Error(`Failed to generate search terms: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
  }

  /**
   * Searches for products using SerpApi Google Product API
   * @param searchTerms - Array of search terms to search for
   * @returns Promise<Array<{searchTerm: string, products: Product[]}>> - Array of search results with associated products
   */
  public async searchProductsWithSerpApi(searchTerms: string[]): Promise<Array<{ searchTerm: string, products: Product[] }>> {
    try {
      const serpApiKey = process.env.SERP_API_KEY;
      if (!serpApiKey) {
        throw new Error('SERP_API_KEY environment variable is not configured');
      }

      // Create parallel search promises for each search term
      const searchPromises = searchTerms.map(async (searchTerm) => {
        try {
          const response = await getJson({
            engine: 'google_shopping',
            q: searchTerm,
            api_key: serpApiKey,
            gl: 'us', // Country
            hl: 'en', // Language
            num: 5 // Limit to 5 results per search term
          });

          // Extract products from the response
          const products: Product[] = [];

          // Google Shopping API returns results in shopping_results array
          if (response.shopping_results) {
            response.shopping_results.forEach((shoppingResult: any) => {
              const product = this.mapGoogleShoppingResultToProduct(shoppingResult);
              if (product) {
                products.push(product);
              }
            });
          }

          // Also check for inline shopping results
          if (response.inline_shopping_results) {
            response.inline_shopping_results.forEach((inlineResult: any) => {
              const product = this.mapGoogleShoppingResultToProduct(inlineResult);
              if (product) {
                products.push(product);
              }
            });
          }

          // Limit to 3-5 products per search term
          const maxProductsPerTerm = Math.min(5, Math.max(3, products.length));
          return {
            searchTerm,
            products: products.slice(0, maxProductsPerTerm)
          };
        } catch (error) {
          console.error(`Error searching for "${searchTerm}":`, error);
          return { searchTerm, products: [] }; // Return empty products for failed searches
        }
      });

      // Wait for all searches to complete
      const searchResults = await Promise.all(searchPromises);

      // Filter out empty results and return search results with products
      return searchResults.filter(result => result.products.length > 0);
    } catch (error) {
      throw new Error(`Failed to search products with SerpApi: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
  }

  /**
   * Maps Google Shopping result to our Product interface
   * @param shoppingResult - Shopping result from Google Shopping API
   * @returns Product or null if mapping fails
   */
  private mapGoogleShoppingResultToProduct(shoppingResult: any): Product | null {
    try {
      const price = this.extractPrice(shoppingResult.price);

      // Ensure all required fields have valid values
      const title = shoppingResult.title?.trim() || 'Unknown Product';
      const description = (shoppingResult.description || shoppingResult.snippet || 'No description available').trim();
      const imageUrl = (shoppingResult.thumbnail || shoppingResult.image || '').trim();
      const productUrl = (shoppingResult.link || shoppingResult.product_link || '').trim();

      // Only return product if all required fields are present and valid
      if (!title || !imageUrl || !productUrl || price <= 0) {
        console.warn('Skipping product due to missing required fields:', {
          title: !!title,
          imageUrl: !!imageUrl,
          productUrl: !!productUrl,
          price: price
        });
        return null;
      }

      return {
        title,
        price,
        description,
        imageUrl,
        productUrl,
        rating: shoppingResult.rating,
        reviews: shoppingResult.reviews,
        brand: shoppingResult.brand || shoppingResult.source,
        condition: shoppingResult.condition,
        availability: shoppingResult.availability || 'Available'
      };
    } catch (error) {
      console.error('Error mapping Google Shopping result:', error);
      return null;
    }
  }

  /**
   * Extracts numeric price from SerpApi price string
   * @param priceString - Price string from SerpApi
   * @returns Numeric price value
   */
  private extractPrice(priceString: string | undefined): number {
    if (!priceString) return 0;

    try {
      // Remove currency symbols and extract numeric value
      const cleanPrice = priceString.replace(/[^0-9.,]/g, '');
      const numericMatch = cleanPrice.match(/(\d+[.,]?\d*)/);

      if (numericMatch) {
        const price = parseFloat(numericMatch[1].replace(',', '.'));
        return isNaN(price) ? 0 : price;
      }

      return 0;
    } catch (error) {
      console.warn('Error extracting price from:', priceString, error);
      return 0;
    }
  }

  /**
   * Generates product recommendations based on personal info and event description
   * @param request - The recommend products request containing personal info and event description
   * @returns Promise<ApiResponse<RecommendProductsData>> - The response with product recommendations
   */
  public async generateRecommendations(request: RecommendProductsRequest): Promise<ApiResponse<RecommendProductsData>> {
    try {
      // Generate search terms using OpenAI
      const searchTerms = await this.generateSearchTerms(request);

      // Search for real products using SerpApi
      const searchResults = await this.searchProductsWithSerpApi(searchTerms);

      // Categorize products by search terms
      const recommendations = this.categorizeProductsBySearchTerms(searchResults);

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
   * Categorizes products by their search terms
   * @param searchResults - Array of search results with associated products
   * @returns Array<Record<string, Product[]>> - Products categorized by search terms
   */
  private categorizeProductsBySearchTerms(searchResults: Array<{ searchTerm: string, products: Product[] }>): Array<Record<string, Product[]>> {
    if (searchResults.length === 0) {
      return [];
    }

    // Group products by their search terms
    const categories: Record<string, Product[]> = {};

    searchResults.forEach(result => {
      if (result.products.length > 0) {
        // Use the search term as the category name
        categories[result.searchTerm] = result.products;
      }
    });

    // If we don't have enough categories, create some fallback products
    if (Object.keys(categories).length === 0) {
      console.warn('No valid products found from search results, creating fallback products');
      categories['Fallback Outfit'] = this.createFallbackProducts();
    }

    return [categories];
  }

  /**
   * Creates fallback products when no valid products are found from search
   * @returns Array of fallback products
   */
  private createFallbackProducts(): Product[] {
    return [
      {
        title: 'Classic Black Dress',
        price: 49.99,
        description: 'Elegant black dress perfect for formal occasions',
        imageUrl: 'https://via.placeholder.com/300x400/000000/FFFFFF?text=Black+Dress',
        productUrl: 'https://example.com/black-dress',
        availability: 'Available'
      },
      {
        title: 'Professional Blazer',
        price: 79.99,
        description: 'Tailored blazer for business and formal events',
        imageUrl: 'https://via.placeholder.com/300x400/2C3E50/FFFFFF?text=Blazer',
        productUrl: 'https://example.com/blazer',
        availability: 'Available'
      },
      {
        title: 'Comfortable Dress Shoes',
        price: 89.99,
        description: 'Polished dress shoes for any formal occasion',
        imageUrl: 'https://via.placeholder.com/300x400/8B4513/FFFFFF?text=Dress+Shoes',
        productUrl: 'https://example.com/dress-shoes',
        availability: 'Available'
      }
    ];
  }
}
