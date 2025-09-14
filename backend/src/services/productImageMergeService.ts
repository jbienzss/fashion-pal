import { Product } from '../types';
import sharp from 'sharp';
import fetch from 'node-fetch';
import * as fs from 'node:fs';
import * as path from 'node:path';

export class ProductImageMergeService {
    private static instance: ProductImageMergeService;

    // #region Private Constants
    private static readonly MAX_IMAGE_WIDTH = 400;
    private static readonly MAX_IMAGE_HEIGHT = 400;
    private static readonly IMAGES_PER_ROW = 3;
    private static readonly PADDING = 10;
    private static readonly BACKGROUND_COLOR = '#FFFFFF';
    private static readonly DEBUG_SAVE_PATH = path.join(process.cwd(), 'debug', 'merged-images');
    private static readonly TARGET_ASPECT_RATIO = 3 / 4; // 3:4 aspect ratio
    // #endregion

    private constructor() {}

    // #region Public Methods
    /**
     * Gets the singleton instance of ProductImageMergeService
     * @returns ProductImageMergeService - The singleton instance
     */
    public static getInstance(): ProductImageMergeService {
        if (!ProductImageMergeService.instance) {
            ProductImageMergeService.instance = new ProductImageMergeService();
        }
        return ProductImageMergeService.instance;
    }

    /**
     * Merges all product images into a single concatenated image
     * @param products - Array of products with image URLs
     * @param saveDebugImage - Whether to save the merged image locally for debugging
     * @returns Promise<Buffer | null> - The merged image buffer or null if merge fails
     */
    public async mergeProductImages(products: Product[], saveDebugImage: boolean = false): Promise<Buffer | null> {
        try {
            if (!products || products.length === 0) {
                return null;
            }

            // Download and process all product images
            const imageBuffers: Buffer[] = [];
            for (const product of products) {
                try {
                    const imageBuffer = await this.downloadImage(product.imageUrl);
                    if (imageBuffer) {
                        const processedBuffer = await this.processImage(imageBuffer);
                        if (processedBuffer) {
                            imageBuffers.push(processedBuffer);
                        }
                    }
                } catch (error) {
                    console.warn(`Failed to process image for product ${product.title}:`, error);
                    // Continue with other images even if one fails
                }
            }

            if (imageBuffers.length === 0) {
                return null;
            }

            // Calculate grid dimensions
            const totalImages = imageBuffers.length;
            const rows = Math.ceil(totalImages / ProductImageMergeService.IMAGES_PER_ROW);
            const cols = Math.min(totalImages, ProductImageMergeService.IMAGES_PER_ROW);

            // Calculate content dimensions (without padding)
            const cellWidth = ProductImageMergeService.MAX_IMAGE_WIDTH;
            const cellHeight = ProductImageMergeService.MAX_IMAGE_HEIGHT;
            const contentWidth = (cellWidth * cols) + (ProductImageMergeService.PADDING * (cols + 1));
            const contentHeight = (cellHeight * rows) + (ProductImageMergeService.PADDING * (rows + 1));

            // Calculate final canvas dimensions to achieve 3:4 aspect ratio
            let canvasWidth = contentWidth;
            let canvasHeight = contentHeight;

            // Check if we need to adjust for 3:4 aspect ratio
            const currentAspectRatio = canvasWidth / canvasHeight;
            
            if (currentAspectRatio > ProductImageMergeService.TARGET_ASPECT_RATIO) {
                // Width is too much compared to height, increase height to achieve 3:4 ratio
                canvasHeight = Math.ceil(canvasWidth / ProductImageMergeService.TARGET_ASPECT_RATIO);
            } else if (currentAspectRatio < ProductImageMergeService.TARGET_ASPECT_RATIO) {
                // Height is too much compared to width, increase width to achieve 3:4 ratio
                canvasWidth = Math.ceil(canvasHeight * ProductImageMergeService.TARGET_ASPECT_RATIO);
            }

            // Calculate offset to center the content
            const offsetX = Math.floor((canvasWidth - contentWidth) / 2);
            const offsetY = Math.floor((canvasHeight - contentHeight) / 2);

            // Log dimensions for debugging
            console.log(`Product merge dimensions:`, {
                totalImages,
                rows,
                cols,
                contentWidth,
                contentHeight,
                canvasWidth,
                canvasHeight,
                aspectRatio: (canvasWidth / canvasHeight).toFixed(3),
                targetAspectRatio: ProductImageMergeService.TARGET_ASPECT_RATIO.toFixed(3),
                offsetX,
                offsetY
            });

            // Create canvas
            const canvas = sharp({
                create: {
                    width: canvasWidth,
                    height: canvasHeight,
                    channels: 3,
                    background: ProductImageMergeService.BACKGROUND_COLOR
                }
            });

            // Create composite operations for each image
            const compositeOperations: sharp.OverlayOptions[] = [];
            
            for (let i = 0; i < imageBuffers.length; i++) {
                const row = Math.floor(i / ProductImageMergeService.IMAGES_PER_ROW);
                const col = i % ProductImageMergeService.IMAGES_PER_ROW;
                
                // Calculate position within the content area
                const contentX = (col * cellWidth) + (ProductImageMergeService.PADDING * (col + 1));
                const contentY = (row * cellHeight) + (ProductImageMergeService.PADDING * (row + 1));
                
                // Apply offset to center the content on the canvas
                const x = contentX + offsetX;
                const y = contentY + offsetY;

                compositeOperations.push({
                    input: imageBuffers[i],
                    left: x,
                    top: y
                });
            }

            // Composite all images onto canvas
            const mergedBuffer = await canvas
                .composite(compositeOperations)
                .jpeg({ quality: 90 })
                .toBuffer();

            // Save debug image if requested
            if (saveDebugImage) {
                await this.saveDebugImage(mergedBuffer, products);
            }

            return mergedBuffer;
        } catch (error) {
            console.error('Failed to merge product images:', error);
            return null;
        }
    }
    // #endregion

    // #region Private Methods
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
     * Processes an image to fit the required dimensions and format
     * @param imageBuffer - The original image buffer
     * @returns Promise<Buffer | null> - The processed image buffer or null if processing fails
     */
    private async processImage(imageBuffer: Buffer): Promise<Buffer | null> {
        try {
            return await sharp(imageBuffer)
                .resize(ProductImageMergeService.MAX_IMAGE_WIDTH, ProductImageMergeService.MAX_IMAGE_HEIGHT, {
                    fit: 'contain',
                    background: ProductImageMergeService.BACKGROUND_COLOR
                })
                .jpeg({ quality: 90 })
                .toBuffer();
        } catch (error) {
            console.error('Failed to process image:', error);
            return null;
        }
    }

    /**
     * Saves the merged image locally for debugging purposes
     * @param mergedBuffer - The merged image buffer
     * @param products - Array of products used to create the merged image
     */
    private async saveDebugImage(mergedBuffer: Buffer, products: Product[]): Promise<void> {
        try {
            // Ensure debug directory exists
            if (!fs.existsSync(ProductImageMergeService.DEBUG_SAVE_PATH)) {
                fs.mkdirSync(ProductImageMergeService.DEBUG_SAVE_PATH, { recursive: true });
            }

            // Create filename with timestamp and product count
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const productCount = products.length;
            const filename = `merged-products-${productCount}-${timestamp}.jpg`;
            const filePath = path.join(ProductImageMergeService.DEBUG_SAVE_PATH, filename);

            // Save the image
            fs.writeFileSync(filePath, mergedBuffer);
            console.log(`Debug image saved to: ${filePath}`);

            // Also save a metadata file with product information
            const metadataPath = path.join(ProductImageMergeService.DEBUG_SAVE_PATH, `metadata-${timestamp}.json`);
            const metadata = {
                timestamp: new Date().toISOString(),
                productCount: products.length,
                products: products.map(p => ({
                    title: p.title,
                    imageUrl: p.imageUrl,
                    price: p.price
                })),
                imagePath: filePath
            };
            fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
            console.log(`Debug metadata saved to: ${metadataPath}`);

        } catch (error) {
            console.error('Failed to save debug image:', error);
        }
    }
    // #endregion
}