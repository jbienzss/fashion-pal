import { Request, Response } from 'express';
import { PreviewOutfitImageService } from '../services/previewOutfitImageService';
import { ProductImageMergeService } from '../services/productImageMergeService';
import { PreviewOutfitImageRequest, PreviewOutfitImageData, ApiResponse, Product } from '../types';

export class PreviewOutfitImageController {
    private previewOutfitImageService: PreviewOutfitImageService;
    private productImageMergeService: ProductImageMergeService;

    constructor() {
        this.previewOutfitImageService = PreviewOutfitImageService.getInstance();
        this.productImageMergeService = ProductImageMergeService.getInstance();
    }

    /**
     * Handles POST request for preview-outfit-image endpoint
     * @param req - Express request object with file and JSON data
     * @param res - Express response object
     */
    public generateOutfitPreview = async (req: Request, res: Response): Promise<void> => {
        try {
            // Validate that image file was uploaded
            if (!req.file) {
                res.status(400).json({
                    success: false,
                    error: 'No image file provided',
                    message: 'Request must include an image file'
                });
                return;
            }

            // Parse JSON data from form fields
            let products;
            try {
                products = JSON.parse(req.body.products);
            } catch (parseError) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid JSON data',
                    message: 'products must be a valid JSON string'
                });
                return;
            }

            // Validate products array
            if (!Array.isArray(products) || products.length === 0) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid products',
                    message: 'products must be a non-empty array'
                });
                return;
            }

            // Validate each product has required fields
            for (const product of products) {
                if (!product.title ||
                    product.price === undefined ||
                    product.price === null ||
                    product.price <= 0 ||
                    !product.imageUrl ||
                    !product.productUrl) {
                    res.status(400).json({
                        success: false,
                        error: 'Invalid product',
                        message: 'Each product must include title, price, imageUrl, and productUrl'
                    });
                    return;
                }
            }

            // Parse event description from form fields
            const eventDescription = req.body.eventDescription;
            if (!eventDescription) {
                res.status(400).json({
                    success: false,
                    error: 'No event description provided',
                    message: 'eventDescription is required'
                });
                return;
            }

            // Create request object with image buffer
            const request: PreviewOutfitImageRequest = {
                eventDescription,
                products,
                userImage: req.file.buffer
            };

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
                    outfitPreviewImageBuffer: Buffer.alloc(0).toString('base64')
                },
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error occurred'
            };

            res.status(500).json(errorResponse);
        }
    };

    /**
     * Handles POST request for merging product images
     * @param req - Express request object with JSON data containing products
     * @param res - Express response object
     */
    public mergeProductImages = async (req: Request, res: Response): Promise<void> => {
        try {
            // Parse products from request body
            const { products } = req.body;

            // Validate products array
            if (!Array.isArray(products) || products.length === 0) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid products',
                    message: 'products must be a non-empty array'
                });
                return;
            }

            // Validate each product has required fields
            for (const product of products) {
                if (!product.title ||
                    product.price === undefined ||
                    product.price === null ||
                    product.price <= 0 ||
                    !product.imageUrl ||
                    !product.productUrl) {
                    res.status(400).json({
                        success: false,
                        error: 'Invalid product',
                        message: 'Each product must include title, price, imageUrl, and productUrl'
                    });
                    return;
                }
            }

            // Merge product images with debug mode enabled
            const mergedImageBuffer = await this.productImageMergeService.mergeProductImages(products, true);

            if (!mergedImageBuffer) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to merge images',
                    message: 'Could not create merged product image'
                });
                return;
            }

            // Return the merged image as base64
            res.status(200).json({
                success: true,
                data: {
                    mergedImageBuffer: mergedImageBuffer.toString('base64')
                },
                message: 'Product images merged successfully'
            });

        } catch (error) {
            console.error('Error in merge product images controller:', error);

            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        }
    };
}
