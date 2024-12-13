import express from 'express';
import PostModel from '../models/Post.js';
import { protect,admin } from '../middleware/authMiddleware.js';
import mongoose from 'mongoose';

const router = express.Router();

router.use(protect);
// Get posts for a specific neighborhood
router.get('/', async (req, res) => {
  try {
    // Fetch posts, sorted by most recent first
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .limit(50); // Limit to prevent overwhelming the client
    
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ 
      error: "Failed to fetch posts", 
      details: error.message 
    });
  }
});
  
// Create a new post
router.post('/', async (req, res) => {
  console.log('Received post data:', req.body);
  console.log('User:', req.user); 
  try {
    const newPost = new PostModel({
      ...req.body,
      createdBy: req.user._id,  // Attach the user who created the post
      neighborhoodId: req.user.neighborhoodId // Assuming user has a neighborhood
    });
    
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Full post creation error:', error);
    res.status(500).json({ 
      message: 'Error creating post', 
      fullError: error 
    });
  }
});
  

// // Add comment to a post
// router.post('/:id/comment', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { text, userId } = req.body;

//     const post = await PostModel.findById(id);
//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }

//     post.comments.push({ text, userId });
//     await post.save();

//     res.status(200).json(post);
//   } catch (err) {
//     res.status(500).json({ message: "Error adding comment", error: err });
//   }
// });

// // Like a post
// router.post('/:id/like', async (req, res) => {
//   try {
//     const { id } = req.params;

//     const post = await PostModel.findById(id);
//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }

//     post.likes += 1;
//     await post.save();

//     res.status(200).json(post);
//   } catch (err) {
//     res.status(500).json({ message: "Error liking post", error: err });
//   }
// });

// Delete a post
router.delete('/:id', admin, async (req, res) => {
    try {
      const post = await PostModel.findByIdAndDelete(req.params.id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting post', error });
    }
  });


router.get("/", async (req, res) => {
    const { neighborhoodId, category } = req.query;
  
    try {
      const filter = {};
      if (neighborhoodId) filter.neighborhoodId = neighborhoodId;
      if (category) filter.category = category;
  
      // Sort posts by creation date, newest first
      const posts = await PostModel.find(filter).sort({ createdAt: -1 });
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch posts", details: error.message });
    }
});

export default router;

