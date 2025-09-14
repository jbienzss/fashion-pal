import { Logger } from '../utils/logger';

// #region [Types]

export interface VideoGenerationRequest {
  imageBase64: string;
  promptText?: string;
  ratio?: string;
  duration?: number;
}

export interface VideoGenerationTask {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'succeeded' | 'failed';
  output?: {
    video: string;
  };
  error?: string;
}

// #endregion [Types]

// #region [Private Constants]

const RUNWAY_API_BASE_URL = 'https://api.dev.runwayml.com/v1';

// #endregion [Private Constants]

// #region [Private Methods]

/**
 * Makes authenticated API requests to Runway AI
 * @param endpoint - The API endpoint
 * @param method - HTTP method
 * @param body - Request body
 * @returns Promise with response data
 */
async function _makeApiRequest(endpoint: string, method: string = 'GET', body?: any): Promise<any> {
  const apiKey = process.env.RUNWAY_API_KEY;
  
  if (!apiKey) {
    throw new Error('Runway AI API key is not configured. Please set RUNWAY_API_KEY environment variable.');
  }

  const response = await fetch(`${RUNWAY_API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'X-Runway-Version': '2024-11-06',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({})) as any;
    Logger.error('Runway AI API Error Details:', {
      status: response.status,
      statusText: response.statusText,
      errorData: errorData
    });
    
    // Extract more detailed error information
    const errorMessage = errorData.message || errorData.error || errorData.detail || 'Unknown error';
    
    // Handle specific error cases
    if (errorMessage.includes('not have enough credits')) {
      throw new Error('Insufficient credits: Please add credits to your Runway AI account to generate videos.');
    }
    
    throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  return response.json();
}

// #endregion [Private Methods]

// #region [Public Methods]

/**
 * Creates a video generation task using Runway AI
 * @param request - Video generation request parameters
 * @returns Promise with task ID
 */
export async function createVideoTask(request: VideoGenerationRequest): Promise<string> {
  const { imageBase64, promptText, ratio, duration } = request;

  // Log payload size for debugging
  const payloadSize = Math.round(JSON.stringify(request).length / 1024);
  Logger.info(`Creating video generation task with payload size: ${payloadSize}KB`);

  if (payloadSize > 45000) { // 45MB limit (leaving some buffer)
    throw new Error('Payload too large. Please use a smaller image.');
  }

  // Validate and process the image data
  let processedImageData = imageBase64;
  
  // If the image doesn't start with data:, it's just base64, so we need to add the data URI prefix
  if (!imageBase64.startsWith('data:')) {
    processedImageData = `data:image/jpeg;base64,${imageBase64}`;
  }
  
  Logger.info(`Processing image data. Format: ${processedImageData.substring(0, 50)}...`);
  
  const requestBody = {
    promptImage: processedImageData,
    seed: 4294967295,
    model: 'gen4_turbo',
    promptText: promptText || 'A person wearing clothing, standing and moving naturally',
    duration: duration || 5,
    ratio: ratio || '1280:720',
    contentModeration: {
      publicFigureThreshold: 'auto'
    }
  };

  Logger.info('Request body structure:', {
    model: requestBody.model,
    promptText: requestBody.promptText,
    ratio: requestBody.ratio,
    duration: requestBody.duration,
    promptImagePrefix: requestBody.promptImage.substring(0, 50) + '...',
    promptImageLength: requestBody.promptImage.length
  });

  const response = await _makeApiRequest('/image_to_video', 'POST', requestBody);
  
  if (!response.id) {
    throw new Error('Invalid response from Runway AI API: missing task ID');
  }

  Logger.info(`Video generation task created with ID: ${response.id}`);
  return response.id;
}

/**
 * Gets the status of a video generation task
 * @param taskId - The task ID to check
 * @returns Promise with task data
 */
export async function getVideoTaskStatus(taskId: string): Promise<VideoGenerationTask> {
  Logger.info(`Getting status for task: ${taskId}`);

  const response = await _makeApiRequest(`/tasks/${taskId}`);
  
  const taskData: VideoGenerationTask = {
    id: response.id,
    status: response.status?.toLowerCase() || 'pending',
    output: response.output ? {
      video: Array.isArray(response.output) ? response.output[0] : response.output.video || response.output
    } : undefined,
    error: response.error,
  };

  Logger.info(`Task ${taskId} status: ${taskData.status}`);
  return taskData;
}

// #endregion [Public Methods]
