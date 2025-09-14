import { Router } from 'express';
import { createVideoGenerationTask, getTaskStatus } from '../controllers/videoGenerationController';

const router = Router();

// #region [Routes]

/**
 * POST /api/video-generation/create
 * Creates a new video generation task
 */
router.post('/create', createVideoGenerationTask);

/**
 * GET /api/video-generation/status/:taskId
 * Gets the status of a video generation task
 */
router.get('/status/:taskId', getTaskStatus);

// #endregion [Routes]

export default router;
