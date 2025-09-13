import { Router } from 'express';
import multer from 'multer';
import { PreviewOutfitImageController } from '../controllers/previewOutfitImageController';

const router = Router();
const previewOutfitImageController = new PreviewOutfitImageController();

// Configure multer to store files in memory as buffers
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Preview outfit image endpoint for generating outfit preview images
router.post('/', upload.single('image'), previewOutfitImageController.generateOutfitPreview);

export { router as previewOutfitImageRoutes };
