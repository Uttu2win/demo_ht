import express from 'express';
import PostModel from '../models/Post.js';
import { protect,admin } from '../middleware/authMiddleware.js';
import mongoose from 'mongoose';

const router = express.Router();

router.use(protect);
// Get posts for a specific neighborhood
router.get('/', async (req, res) => {
  try {
    const { category, neighborhoodId } = req.query;
    
    const filter = {};
    if (category) filter.category = category;
    if (neighborhoodId) filter.neighborhoodId = neighborhoodId;

    const posts = await PostModel.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('createdBy', 'name profilePic')
      .populate('likes', 'name')
      .populate({
        path: 'comments.userId',
        select: 'name profilePic'
      });
    
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
  
//Add a comment to a post
router.post('/:id/comment', async (req, res) => {
  try {
    const postId = req.params.id;
    const { text } = req.body;
    const userId = req.user._id;
    const userName = req.user.name;

    const post = await PostModel.findById(postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({ 
      text, 
      userId, 
      userName 
    });

    await post.save();

    // Populate comments with user details
    await post.populate({
      path: 'comments.userId',
      select: 'name profilePic'
    });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ 
      message: "Error adding comment", 
      error: error.message 
    });
  }
});

// Like/Unlike a post
router.post('/:id/like', protect, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    
    const post = await PostModel.findById(postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Ensure likes is always an array
    post.likes = post.likes || [];

    // Check if user has already liked the post
    const likeIndex = post.likes.findIndex(like => 
      // Handle both ObjectId and string comparisons
      like.toString() === userId.toString()
    );
    
    if (likeIndex > -1) {
      // Unlike the post
      post.likes.splice(likeIndex, 1);
    } else {
      // Like the post
      post.likes.push(userId);
    }
    
    await post.save();

    // Fully populate likes with user details
    await post.populate('likes', 'name');
    
    res.status(200).json(post);
  } catch (error) {
    console.error('Like Post Error:', error);
    res.status(500).json({
      message: "Error liking/unliking post",
      error: error.message
    });
  }
});

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


export default router;

