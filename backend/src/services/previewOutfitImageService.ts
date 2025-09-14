import { PreviewOutfitImageRequest, PreviewOutfitImageData, ApiResponse, Product } from '../types';
import { GoogleGenAI, createPartFromUri, createUserContent, Part, File } from '@google/genai';
import * as fs from 'node:fs';
import fetch from 'node-fetch';

export class PreviewOutfitImageService {
    private static instance: PreviewOutfitImageService;
    private static GEN_PROMPT_TEMPLATE =
        'The person in the first image wearing all of the items in the other ' +
        'images at {event_description}.';

    // Supported image MIME types according to Gemini API documentation
    private static SUPPORTED_MIME_TYPES = [
        'image/png',
        'image/jpeg',
        'image/webp',
        'image/heic',
        'image/heif'
    ];

    private constructor() { }

    public static getInstance(): PreviewOutfitImageService {
        if (!PreviewOutfitImageService.instance) {
            PreviewOutfitImageService.instance = new PreviewOutfitImageService();
        }
        return PreviewOutfitImageService.instance;
    }

    /**
     * Generates a preview image buffer for the outfit based on products and user image
     * @param request - The preview outfit image request containing products and image buffer
     * @returns Promise<ApiResponse<PreviewOutfitImageData>> - The response with outfit preview image buffer
     */
    public async generateOutfitPreview(request: PreviewOutfitImageRequest): Promise<ApiResponse<PreviewOutfitImageData>> {
        try {
            // Validate that image buffer exists
            if (!request.userImage) {
                return {
                    success: false,
                    data: {
                        outfitPreviewImageBuffer: Buffer.alloc(0).toString('base64')
                    },
                    error: 'No image buffer provided',
                    message: 'Image buffer is required for outfit preview generation'
                };
            }

            // Validate that event description exists
            if (!request.eventDescription) {
                return {
                    success: false,
                    data: {
                        outfitPreviewImageBuffer: Buffer.alloc(0).toString('base64')
                    },
                    error: 'No event description provided',
                    message: 'Event description is required for outfit preview generation'
                };
            }

            // Validate that products exist
            if (!request.products || request.products.length === 0) {
                return {
                    success: false,
                    data: {
                        outfitPreviewImageBuffer: Buffer.alloc(0).toString('base64')
                    },
                    error: 'No products provided',
                    message: 'At least one product is required for outfit preview generation'
                };
            }

            // Initialize Gemini client
            const geminiApiKey = process.env.GEMINI_API_KEY;
            if (!geminiApiKey) {
                throw new Error('Gemini API key is not configured');
            }

            const ai = new GoogleGenAI({ apiKey: geminiApiKey });

            // Prepare the prompt with event description
            const prompt = PreviewOutfitImageService.GEN_PROMPT_TEMPLATE
                .replace('{event_description}', request.eventDescription);

            // Prepare content array starting with the prompt
            const parts: Array<Part> = [];
            const uploadedFileNames: string[] = [];

            try {
                // Upload user image to Files API
                const userImageMimeType = this.detectMimeType(request.userImage);
                if (!userImageMimeType || !PreviewOutfitImageService.SUPPORTED_MIME_TYPES.includes(userImageMimeType)) {
                    throw new Error('Unsupported user image format');
                }

                const userImageFile = await this.uploadImageToFilesAPI(request.userImage, userImageMimeType, ai);
                if (!userImageFile) {
                    throw new Error('Failed to upload user image to Files API');
                }
                parts.push(createPartFromUri(userImageFile.uri!, userImageFile.mimeType!));
                console.log('userImageFile', userImageFile);
                uploadedFileNames.push(userImageFile.name!);
                // contents[0].parts.push({ inlineData: { mimeType: userImageMimeType, data: request.userImage.toString('base64') } });

                // Download and upload product images to Files API
                for (const product of request.products) {
                    try {
                        const productImageBuffer = await this.downloadImage(product.imageUrl);
                        if (productImageBuffer) {
                            const mimeType = this.detectMimeType(productImageBuffer);
                            if (mimeType && PreviewOutfitImageService.SUPPORTED_MIME_TYPES.includes(mimeType)) {
                                const productImageName = await this.uploadImageToFilesAPI(productImageBuffer, mimeType, ai);
                                if (productImageName) {
                                    parts.push(createPartFromUri(productImageName.uri!, productImageName.mimeType!));
                                    uploadedFileNames.push(productImageName.name!);
                                    console.log('productImageName', productImageName);
                                }
                            }
                        }
                    } catch (error) {
                        console.warn(`Failed to process product image for ${product.title}:`, error);
                        // Continue with other images even if one fails
                    }
                }

            } catch (error) {
                // Clean up uploaded files if generation fails
                await this.cleanupUploadedFiles(uploadedFileNames, ai);
                throw error;
            }

            const contents: any[] = [{ parts: [{ text: prompt }] }];
            console.log('contents', contents);

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image-preview',
                contents: contents
            });

            // Extract image data from response
            let imageBuffer: Buffer = Buffer.alloc(0);
            let totalBytes = 0;

            if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts) {
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData && part.inlineData.data) {
                        imageBuffer = Buffer.from(part.inlineData.data, 'base64');
                        totalBytes = imageBuffer.length;
                        console.log(`Generated image size: ${totalBytes} bytes`);
                        break;
                    }
                }
            }

            if (imageBuffer.length === 0) {
                throw new Error('No image data received from Gemini API');
            }

            // Clean up uploaded files after successful generation
            await this.cleanupUploadedFiles(uploadedFileNames, ai);

            return {
                success: true,
                data: {
                    outfitPreviewImageBuffer: imageBuffer.toString('base64')
                },
                message: 'Outfit preview image generated successfully'
            };
        } catch (error) {
            return {
                success: false,
                data: {
                    outfitPreviewImageBuffer: Buffer.alloc(0).toString('base64')
                },
                error: 'Failed to generate outfit preview',
                message: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    /**
     * Uploads an image buffer to Gemini Files API
     * @param imageBuffer - The image buffer to upload
     * @param mimeType - The MIME type of the image
     * @param ai - The GoogleGenAI client instance
     * @returns Promise<string | null> - The file name or null if upload fails
     */
    private async uploadImageToFilesAPI(imageBuffer: Buffer, mimeType: string, ai: GoogleGenAI): Promise<File> {
        try {
            // Convert Buffer to Blob for upload
            const blob = new Blob([imageBuffer], { type: mimeType });
            const file = await ai.files.upload({
                file: blob,
                config: { mimeType: mimeType }
            });
            return file;
        } catch (error) {
            console.error('Failed to upload image to Files API:', error);
            return null;
        }
    }

    /**
     * Cleans up uploaded files from Gemini Files API
     * @param fileNames - Array of file names to delete
     * @param ai - The GoogleGenAI client instance
     */
    private async cleanupUploadedFiles(fileNames: string[], ai: GoogleGenAI): Promise<void> {
        for (const fileName of fileNames) {
            try {
                await ai.files.delete({ name: fileName });
            } catch (error) {
                console.warn(`Failed to delete file ${fileName}:`, error);
                // Continue with other files even if one fails
            }
        }
    }

    /**
     * Downloads an image from a URL
     * @param url - The URL to download the image from
     * @returns Promise<Buffer | null> - The image buffer or null if download fails
     */
    private async downloadImage(url: string): Promise<Buffer | null> {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const arrayBuffer = await response.arrayBuffer();
            return Buffer.from(arrayBuffer);
        } catch (error) {
            console.error(`Failed to download image from ${url}:`, error);
            return null;
        }
    }

    /**
     * Detects MIME type from image buffer by examining the file signature
     * @param buffer - The image buffer to analyze
     * @returns string | null - The detected MIME type or null if not supported
     */
    private detectMimeType(buffer: Buffer): string | null {
        if (buffer.length < 4) return null;

        // Check file signatures (magic numbers)
        const signature = buffer.subarray(0, 4);

        // PNG signature: 89 50 4E 47
        if (signature[0] === 0x89 && signature[1] === 0x50 && signature[2] === 0x4E && signature[3] === 0x47) {
            return 'image/png';
        }

        // JPEG signature: FF D8 FF
        if (signature[0] === 0xFF && signature[1] === 0xD8 && signature[2] === 0xFF) {
            return 'image/jpeg';
        }

        // WebP signature: 52 49 46 46 (RIFF) followed by WEBP
        if (signature[0] === 0x52 && signature[1] === 0x49 && signature[2] === 0x46 && signature[3] === 0x46) {
            if (buffer.length >= 12) {
                const webpSignature = buffer.subarray(8, 12);
                if (webpSignature[0] === 0x57 && webpSignature[1] === 0x45 && webpSignature[2] === 0x42 && webpSignature[3] === 0x50) {
                    return 'image/webp';
                }
            }
        }

        // HEIC signature: 00 00 00 20 66 74 79 70 68 65 69 63
        if (buffer.length >= 12) {
            const heicSignature = buffer.subarray(4, 12);
            if (heicSignature[0] === 0x66 && heicSignature[1] === 0x74 && heicSignature[2] === 0x79 && heicSignature[3] === 0x70 &&
                heicSignature[4] === 0x68 && heicSignature[5] === 0x65 && heicSignature[6] === 0x69 && heicSignature[7] === 0x63) {
                return 'image/heic';
            }
        }

        // HEIF signature: 00 00 00 20 66 74 79 70 68 65 69 66
        if (buffer.length >= 12) {
            const heifSignature = buffer.subarray(4, 12);
            if (heifSignature[0] === 0x66 && heifSignature[1] === 0x74 && heifSignature[2] === 0x79 && heifSignature[3] === 0x70 &&
                heifSignature[4] === 0x68 && heifSignature[5] === 0x65 && heifSignature[6] === 0x69 && heifSignature[7] === 0x66) {
                return 'image/heif';
            }
        }

        return null;
    }
}
