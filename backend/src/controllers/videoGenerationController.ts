import { Request, Response } from 'express';
import { Logger } from '../utils/logger';
import * as videoGenerationService from '../services/videoGenerationService';

// #region [Types]

interface VideoGenerationResponse {
  success: boolean;
  data?: {
    taskId: string;
  };
  error?: string;
}

interface TaskStatusResponse {
  success: boolean;
  data?: videoGenerationService.VideoGenerationTask;
  error?: string;
}

// #endregion [Types]

// #region [Public Methods]

/**
 * Creates a video generation task
 * POST /api/video-generation/create
 */
export const createVideoGenerationTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const request: videoGenerationService.VideoGenerationRequest = req.body;

    if (!request.imageBase64) {
      res.status(400).json({
        success: false,
        error: 'Image base64 data is required'
      } as VideoGenerationResponse);
      return;
    }

    const taskId = await videoGenerationService.createVideoTask(request);

    res.json({
      success: true,
      data: {
        taskId: taskId
      }
    } as VideoGenerationResponse);

  } catch (error) {
    Logger.error('Error creating video generation task:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to create video generation task';
    
    // Handle specific error cases for appropriate HTTP status codes
    if (errorMessage.includes('Payload too large')) {
      res.status(413).json({
        success: false,
        error: errorMessage
      } as VideoGenerationResponse);
    } else {
      res.status(500).json({
        success: false,
        error: errorMessage
      } as VideoGenerationResponse);
    }
  }
};

/**
 * Gets the status of a video generation task
 * GET /api/video-generation/status/:taskId
 */
export const getTaskStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { taskId } = req.params;

    if (!taskId) {
      res.status(400).json({
        success: false,
        error: 'Task ID is required'
      } as TaskStatusResponse);
      return;
    }

    const taskData = await videoGenerationService.getVideoTaskStatus(taskId);

    res.json({
      success: true,
      data: taskData
    } as TaskStatusResponse);

  } catch (error) {
    Logger.error('Error getting task status:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to get task status';
    
    res.status(500).json({
      success: false,
      error: errorMessage
    } as TaskStatusResponse);
  }
};

// #endregion [Public Methods]
