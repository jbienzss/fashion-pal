import { RecommendProductsRequest, RecommendProductsData, ApiResponse, Product } from '../types';
import OpenAI from 'openai';
import { z } from 'zod';

export class RecommendProductsService {
  private static instance: RecommendProductsService;
  private static SEARCH_TERMS_SYSTEM_PROMPT =
    'You are a helpful AI that assists a user in searching for outfits and accessories to wear at ' +
    'special events. The user will specify an event. You must respond with a list of 3 to 5 items ' +
    'this person might wear to the event. The list should include garmants and accessories. Each ' +
    'item MUST be returned in the form of a search term that could be submitted to an online retailer. ' +
    'Do not include any other details in your response.';
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
        throw new Error('OpenAI API key is not configured');
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
        model: 'gpt-4o-mini', // Use model that supports structured outputs
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
   * Generates product recommendations based on personal info and event description
   * @param request - The recommend products request containing personal info and event description
   * @returns Promise<ApiResponse<RecommendProductsData>> - The response with product recommendations
   */
  public async generateRecommendations(request: RecommendProductsRequest): Promise<ApiResponse<RecommendProductsData>> {
    try {
      // Generate search terms using OpenAI
      const searchTerms = await this.generateSearchTerms(request);

      // Generate dummy products based on the search terms
      const recommendations = this.generateDummyProducts(searchTerms);

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
   * Generates dummy product data based on search terms
   * @param searchTerms - Array of search terms to use as product titles
   * @returns Array<Record<string, Product[]>> - Categorized product recommendations
   */
  private generateDummyProducts(searchTerms: string[]): Array<Record<string, Product[]>> {
    // Generate products based on search terms
    const products: Product[] = searchTerms.map((searchTerm, index) => ({
      title: searchTerm,
      price: 50 + (index * 15) + Math.random() * 50, // Vary prices between $50-$100
      description: `High-quality ${searchTerm.toLowerCase()} perfect for your event.`,
      imageUrl: `https://example.com/images/product${index + 1}.jpg`,
      productUrl: `https://amazon.com/dp/product${index + 1}`
    }));

    // Categorize products into different categories
    const categories: Record<string, Product[]> = {
      'Main Outfit': products.slice(0, Math.ceil(products.length / 2)),
      'Accessories': products.slice(Math.ceil(products.length / 2))
    };

    return [categories];
  }
}
