import express from 'express';
import { getAllNeighborhoods } from '../controllers/neighborhoodController.js';

const router = express.Router();

router.get('/', getAllNeighborhoods);

export default router;
