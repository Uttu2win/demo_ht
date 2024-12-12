import express from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';
// import { protect } from '../middleware/authMiddleware.js'; // Use the middleware if you want to protect routes
import { registerUser, loginUser, deleteUser, getUsers } from '../controllers/userController.js';

import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Get the logged-in user's information (protected route)
// router.get('/profile', protect, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select('-password');
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching user profile', error: error.message });
//   }
// });

// Authenticate user login
router.post('/login', loginUser);
router.post('/login/admin', loginUser);
// router.get('/protected', authenticateToken, (req, res) => {
//   res.send('This is a protected route');
// });
router.get('/', protect,admin, getUsers);
router.delete("/:userId", protect,deleteUser);

export default router;
