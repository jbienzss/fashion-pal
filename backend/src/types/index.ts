export interface Product {
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  productUrl: string;
}

export interface RecommendProductsRequest {
  personalInfo: {
    age: number;
    gender: string;
  };
  eventDescription: string;
}

export interface RecommendProductsData {
  recommendations: Array<Record<string, Product[]>>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  statusCode: number;
}
