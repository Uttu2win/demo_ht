import express from 'express';
import { registerUser, loginUser, deleteUser, getUsers } from '../controllers/userController.js';
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();
// Register a new user
router.post('/register', registerUser);
// Authenticate user login
router.post('/login', loginUser);
router.post('/login/admin', loginUser);
router.get('/', protect,admin, getUsers);
router.delete("/:userId", protect,deleteUser);

export default router;
