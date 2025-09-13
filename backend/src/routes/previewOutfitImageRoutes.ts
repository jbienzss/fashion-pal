import { Router } from 'express';
import { PreviewOutfitImageController } from '../controllers/previewOutfitImageController';

const router = Router();
const previewOutfitImageController = new PreviewOutfitImageController();

// Preview outfit image endpoint for generating outfit preview images
router.post('/', previewOutfitImageController.generateOutfitPreview);

export { router as previewOutfitImageRoutes };
