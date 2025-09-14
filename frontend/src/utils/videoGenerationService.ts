/**
 * Video Generation Service
 * 
 * This service handles video generation using Runway AI's API.
 * It provides functions to create video generation tasks and poll for completion.
 */

// #region [Types]

export interface VideoGenerationTask {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'succeeded' | 'failed';
  output?: {
    video: string;
  };
  error?: string;
}

export interface VideoGenerationOptions {
  promptText?: string;
  ratio?: string;
  duration?: number;
}

// #endregion [Types]

// #region [Private Constants]

const BACKEND_API_BASE_URL = 'http://localhost:3001/api';
const POLLING_INTERVAL = 5000; // 5 seconds
const MAX_POLLING_ATTEMPTS = 60; // 5 minutes max

// #endregion [Private Constants]

// #region [Private Methods]

/**
 * Compresses a base64 image to reduce file size
 * @param base64String - The base64 encoded image string
 * @param maxWidth - Maximum width for compression (default: 1280)
 * @param quality - Image quality 0-1 (default: 0.8)
 * @returns Promise with compressed base64 string
 */
async function _compressImage(base64String: string, maxWidth: number = 1280, quality: number = 0.8): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(base64String);
        return;
      }
      
      // Calculate new dimensions
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };
    
    img.onerror = () => {
      resolve(base64String);
    };
    
    img.src = base64String;
  });
}

/**
 * Converts base64 image data to data URI format
 * @param base64String - The base64 encoded image string
 * @param mimeType - The MIME type of the image (default: image/png)
 * @returns Data URI string
 */
function _convertToDataUri(base64String: string, mimeType: string = 'image/png'): string {
  // Remove data URL prefix if present
  const cleanBase64 = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
  return `data:${mimeType};base64,${cleanBase64}`;
}

/**
 * Makes API requests to the backend
 * @param endpoint - The API endpoint
 * @param method - HTTP method
 * @param body - Request body
 * @returns Promise with response data
 */
async function _makeApiRequest(endpoint: string, method: string = 'GET', body?: any): Promise<any> {
  const response = await fetch(`${BACKEND_API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorData.error || 'Unknown error'}`);
  }

  return response.json();
}

// #endregion [Private Methods]

// #region [Public Methods]

/**
 * Creates a video generation task from an image
 * @param imageBase64 - Base64 encoded image string
 * @param options - Video generation options
 * @returns Promise with task ID
 */
export async function createVideoGenerationTask(
  imageBase64: string,
  options: VideoGenerationOptions = {}
): Promise<string> {
  try {
    // Compress the image to reduce payload size
    const compressedImage = await _compressImage(imageBase64, 1280, 0.8);
    
    // Log payload size for debugging
    const originalSize = Math.round(imageBase64.length / 1024);
    const compressedSize = Math.round(compressedImage.length / 1024);
    console.log(`Image compression: ${originalSize}KB -> ${compressedSize}KB`);
    
    const requestBody = {
      imageBase64: compressedImage,
      promptText: options.promptText || 'A person wearing the selected outfit, moving naturally and elegantly',
      ratio: options.ratio || '1280:720',
      duration: options.duration || 5,
    };
    
    const payloadSize = Math.round(JSON.stringify(requestBody).length / 1024);
    console.log(`Total payload size: ${payloadSize}KB`);

    const response = await _makeApiRequest('/video-generation/create', 'POST', requestBody);
    
    if (!response.success || !response.data?.taskId) {
      throw new Error('Invalid response from backend: missing task ID');
    }

    return response.data.taskId;
  } catch (error) {
    console.error('Error creating video generation task:', error);
    throw error;
  }
}

/**
 * Retrieves the status of a video generation task
 * @param taskId - The task ID to check
 * @returns Promise with task status
 */
export async function getTaskStatus(taskId: string): Promise<VideoGenerationTask> {
  try {
    const response = await _makeApiRequest(`/video-generation/status/${taskId}`);
    
    if (!response.success || !response.data) {
      throw new Error('Invalid response from backend');
    }
    
    const taskData = {
      id: response.data.id,
      status: response.data.status?.toLowerCase() || 'pending',
      output: response.data.output,
      error: response.data.error,
    };
    
    console.log('Task status response:', taskData);
    
    return taskData;
  } catch (error) {
    console.error('Error getting task status:', error);
    throw error;
  }
}

/**
 * Polls for task completion with automatic retry
 * @param taskId - The task ID to poll
 * @param onStatusUpdate - Callback function for status updates
 * @returns Promise with final task result
 */
export async function pollTaskCompletion(
  taskId: string,
  onStatusUpdate?: (status: VideoGenerationTask) => void
): Promise<VideoGenerationTask> {
  let attempts = 0;
  
  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        attempts++;
        const task = await getTaskStatus(taskId);
        
        // Call status update callback
        if (onStatusUpdate) {
          onStatusUpdate(task);
        }
        
        // Check if task is complete
        if (task.status === 'completed' || task.status === 'succeeded') {
          console.log('Task completed, resolving with:', task);
          resolve(task);
          return;
        }
        
        if (task.status === 'failed') {
          reject(new Error(`Video generation failed: ${task.error || 'Unknown error'}`));
          return;
        }
        
        // Check if we've exceeded max attempts
        if (attempts >= MAX_POLLING_ATTEMPTS) {
          reject(new Error('Video generation timed out after maximum polling attempts'));
          return;
        }
        
        // Continue polling
        setTimeout(poll, POLLING_INTERVAL);
      } catch (error) {
        reject(error);
      }
    };
    
    // Start polling
    poll();
  });
}

/**
 * Generates a video from an image with automatic polling
 * @param imageBase64 - Base64 encoded image string
 * @param options - Video generation options
 * @param onStatusUpdate - Callback function for status updates
 * @returns Promise with video URL
 */
export async function generateVideoFromImage(
  imageBase64: string,
  options: VideoGenerationOptions = {},
  onStatusUpdate?: (status: VideoGenerationTask) => void
): Promise<string> {
  try {
    // Create the video generation task
    const taskId = await createVideoGenerationTask(imageBase64, options);
    
    // Poll for completion
    const result = await pollTaskCompletion(taskId, onStatusUpdate);
    
    console.log('Video generation completed. Result:', result);
    
    if (!result.output?.video) {
      console.error('No video URL found in result:', result);
      throw new Error('Video generation completed but no video URL was provided');
    }
    
    console.log('Video URL:', result.output.video);
    return result.output.video;
  } catch (error) {
    console.error('Error generating video from image:', error);
    throw error;
  }
}

// #endregion [Public Methods]
