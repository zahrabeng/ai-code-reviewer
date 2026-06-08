import { Router } from 'express';
import { reviewCode } from '../controllers/review.controller.js';
import { reviewLimiter } from '../middlewares/rateLimit.middleware.js';

const router = Router();

router.post('/', reviewLimiter, reviewCode);

export default router;
