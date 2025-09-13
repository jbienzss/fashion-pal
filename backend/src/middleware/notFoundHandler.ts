import { Request, Response } from 'express';
import { ErrorResponse } from '../types';

export const notFoundHandler = (req: Request, res: Response): void => {
  const errorResponse: ErrorResponse = {
    success: false,
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    statusCode: 404
  };

  res.status(404).json(errorResponse);
};
