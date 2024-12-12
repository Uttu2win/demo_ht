import express from 'express';
import { getAllNeighborhoods, createNeighborhood,deleteNeighborhood } from '../controllers/neighborhoodController.js';
import { protect,admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, admin, getAllNeighborhoods);
router.post('/', protect, admin, createNeighborhood);
router.delete('/:neighborhoodId', protect, admin, deleteNeighborhood);

export default router;
