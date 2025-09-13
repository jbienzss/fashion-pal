/**
 * API utility functions for making requests to the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface Product {
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  productUrl: string;
}

export interface PersonalInfo {
  age: number;
  gender: string;
}

export interface RecommendProductsRequest {
  personalInfo: PersonalInfo;
  eventDescription: string;
}

export interface RecommendProductsData {
  recommendations: Array<Record<string, Product[]>>;
}

export interface PreviewOutfitImageData {
  outfitPreviewImageUrl: string;
}

/**
 * Generic API request function with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      message: 'Failed to complete request'
    };
  }
}

/**
 * Fetch product recommendations based on personal info and event description
 */
export async function fetchRecommendations(
  personalInfo: PersonalInfo,
  eventDescription: string
): Promise<ApiResponse<RecommendProductsData>> {
  return apiRequest<RecommendProductsData>('/recommend-products', {
    method: 'POST',
    body: JSON.stringify({
      personalInfo,
      eventDescription,
    }),
  });
}

/**
 * Generate outfit preview image
 */
export async function generateOutfitPreview(
  products: Product[],
  imageFile: File
): Promise<ApiResponse<PreviewOutfitImageData>> {
  try {
    const formData = new FormData();
    formData.append('products', JSON.stringify(products));
    formData.append('image', imageFile);
    
    const url = `${API_BASE_URL}/preview-outfit-image`;
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed for preview-outfit-image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      message: 'Failed to generate outfit preview'
    };
  }
}

/**
 * Check if backend is available
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
}
