import express from 'express';
import { getAllNeighborhoods, createNeighborhood} from '../controllers/neighborhoodController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllNeighborhoods);
router.post('/', protect, createNeighborhood);

export default router;
