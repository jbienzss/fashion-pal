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
  outfitPreviewImageBuffer: string; // Base64 encoded buffer
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
  imageFile: File,
  eventDescription: string
): Promise<ApiResponse<PreviewOutfitImageData>> {
  try {
    const formData = new FormData();
    formData.append('products', JSON.stringify(products));
    formData.append('image', imageFile);
    formData.append('eventDescription', eventDescription);
    
    const url = `${API_BASE_URL}/preview-outfit-image`;
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - let browser set it with boundary
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Convert buffer to data URL if successful
    if (data.success && data.data?.outfitPreviewImageBuffer) {
      // The buffer comes as base64 string from the backend
      const base64Buffer = data.data.outfitPreviewImageBuffer;
      
      // Determine MIME type from buffer signature
      const mimeType = detectImageMimeType(base64Buffer);
      
      // Create data URL
      data.data.outfitPreviewImageBuffer = `data:${mimeType};base64,${base64Buffer}`;
    }
    
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
 * Detects MIME type from base64 encoded buffer by examining the file signature
 * @param base64Buffer - The base64 encoded buffer to analyze
 * @returns string - The detected MIME type (defaults to 'image/png')
 */
function detectImageMimeType(base64Buffer: string): string {
  try {
    // Decode base64 to get the first few bytes
    const binaryString = atob(base64Buffer);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Check file signatures (magic numbers)
    if (bytes.length < 4) return 'image/png';

    // PNG signature: 89 50 4E 47
    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
      return 'image/png';
    }

    // JPEG signature: FF D8 FF
    if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
      return 'image/jpeg';
    }

    // WebP signature: 52 49 46 46 (RIFF) followed by WEBP
    if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
      if (bytes.length >= 12) {
        const webpSignature = bytes.slice(8, 12);
        if (webpSignature[0] === 0x57 && webpSignature[1] === 0x45 && webpSignature[2] === 0x42 && webpSignature[3] === 0x50) {
          return 'image/webp';
        }
      }
    }

    // Default to PNG if signature is not recognized
    return 'image/png';
  } catch (error) {
    console.warn('Failed to detect MIME type, defaulting to PNG:', error);
    return 'image/png';
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
