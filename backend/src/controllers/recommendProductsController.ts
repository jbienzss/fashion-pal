import { Request, Response } from 'express';
import { RecommendProductsService } from '../services/recommendProductsService';
import { RecommendProductsRequest, RecommendProductsData, ApiResponse } from '../types';

export class RecommendProductsController {
  private recommendProductsService: RecommendProductsService;

  constructor() {
    this.recommendProductsService = RecommendProductsService.getInstance();
  }

  /**
   * Handles POST request for recommend-products endpoint
   * @param req - Express request object
   * @param res - Express response object
   */
  public generateRecommendations = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate request body
      if (!req.body || !req.body.personalInfo || !req.body.eventDescription) {
        res.status(400).json({
          success: false,
          error: 'Invalid request body',
          message: 'Request must include personalInfo and eventDescription'
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

      const request: RecommendProductsRequest = req.body;
      
      // Generate recommendations using the service
      const response: ApiResponse<RecommendProductsData> = await this.recommendProductsService.generateRecommendations(request);
      
      // Return appropriate status code based on success
      const statusCode = response.success ? 200 : 500;
      res.status(statusCode).json(response);
      
    } catch (error) {
      console.error('Error in recommend products controller:', error);
      
      const errorResponse: ApiResponse<RecommendProductsData> = {
        success: false,
        data: {
          recommendations: []
        },
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };

      res.status(500).json(errorResponse);
    }
  };
}
