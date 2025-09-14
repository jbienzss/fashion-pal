import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { recommendProductsRoutes } from './routes/recommendProductsRoutes';
import { previewOutfitImageRoutes } from './routes/previewOutfitImageRoutes';
import videoGenerationRoutes from './routes/videoGenerationRoutes';
import { notFoundHandler } from './middleware/notFoundHandler';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend server is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/recommend-products', recommendProductsRoutes);
app.use('/api/preview-outfit-image', previewOutfitImageRoutes);
app.use('/api/video-generation', videoGenerationRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Fashion Pal Backend server running on port ${PORT}`);
  console.log(`👗 Recommend products endpoint available at http://localhost:${PORT}/api/recommend-products`);
  console.log(`🖼️ Preview outfit image endpoint available at http://localhost:${PORT}/api/preview-outfit-image`);
  console.log(`🎥 Video generation endpoint available at http://localhost:${PORT}/api/video-generation`);
});

export default app;
