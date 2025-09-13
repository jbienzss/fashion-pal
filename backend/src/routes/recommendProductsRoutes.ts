import { Router } from 'express';
import { RecommendProductsController } from '../controllers/recommendProductsController';

const router = Router();
const recommendProductsController = new RecommendProductsController();

// Recommend products endpoint for generating outfit recommendations
router.post('/', recommendProductsController.generateRecommendations);

export { router as recommendProductsRoutes };
