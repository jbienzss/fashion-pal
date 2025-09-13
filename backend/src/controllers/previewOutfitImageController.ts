import { Request, Response } from 'express';
import { PreviewOutfitImageService } from '../services/previewOutfitImageService';
import { PreviewOutfitImageRequest, PreviewOutfitImageData, ApiResponse } from '../types';

export class PreviewOutfitImageController {
    private previewOutfitImageService: PreviewOutfitImageService;

    constructor() {
        this.previewOutfitImageService = PreviewOutfitImageService.getInstance();
    }

    /**
     * Handles POST request for preview-outfit-image endpoint
     * @param req - Express request object
     * @param res - Express response object
     */
    public generateOutfitPreview = async (req: Request, res: Response): Promise<void> => {
        try {
            // Validate request body
            if (!req.body || !req.body.personalInfo || !req.body.products) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid request body',
                    message: 'Request must include personalInfo and products'
                });
                return;
            }

            // Validate required personalInfo fields
            if (!req.body.personalInfo.age || !req.body.personalInfo.gender) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid personalInfo',
                    message: 'personalInfo must include age and gender'
                });
                return;
            }

            // Validate products array
            if (!Array.isArray(req.body.products) || req.body.products.length === 0) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid products',
                    message: 'products must be a non-empty array'
                });
                return;
            }

            // Validate each product has required fields
            for (const product of req.body.products) {
                if (!product.title || !product.price || !product.description || !product.imageUrl || !product.productUrl) {
                    res.status(400).json({
                        success: false,
                        error: 'Invalid product',
                        message: 'Each product must include title, price, description, imageUrl, and productUrl'
                    });
                    return;
                }
            }

            const request: PreviewOutfitImageRequest = req.body;

            // Generate outfit preview using the service
            const response: ApiResponse<PreviewOutfitImageData> = await this.previewOutfitImageService.generateOutfitPreview(request);

            // Return appropriate status code based on success
            const statusCode = response.success ? 200 : 500;
            res.status(statusCode).json(response);

        } catch (error) {
            console.error('Error in preview outfit image controller:', error);

            const errorResponse: ApiResponse<PreviewOutfitImageData> = {
                success: false,
                data: {
                    outfitPreviewImageUrl: ''
                },
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error occurred'
            };

            res.status(500).json(errorResponse);
        }
    };
}
