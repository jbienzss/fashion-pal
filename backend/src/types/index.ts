export interface Product {
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  productUrl: string;
  rating?: number;
  reviews?: number;
  brand?: string;
  condition?: string;
  availability?: string;
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

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PreviewOutfitImageRequest {
  eventDescription: string;
  products: Product[];
  userImage?: Buffer;
}

export interface PreviewOutfitImageData {
  outfitPreviewImageBuffer: Buffer;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  statusCode: number;
}
