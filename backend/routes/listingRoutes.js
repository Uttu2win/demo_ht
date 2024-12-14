import express from 'express';
import ListingModel from '../models/Listing.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all listings for a neighborhood
router.get('/', protect, async (req, res) => {
  try {
    const { 
      category,
      sortBy,
      sortOrder = 'desc',
      onlyUserListings
    } = req.query;

    // Base query - get listings from user's neighborhood
    const query = { neighborhoodId: req.user.neighborhoodId };

    // Add category filter if specified
    if (category) {
      query.category = category;
    }

    // Add user filter if only user's listings are requested
    if (onlyUserListings === 'true') {
      query.createdBy = req.user._id;
    }

    // Build sort options
    let sortOptions = {};
    if (sortBy === 'price') {
      sortOptions.price = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'date') {
      sortOptions.createdAt = sortOrder === 'asc' ? 1 : -1;
    }

    const listings = await ListingModel.find(query)
      .sort(sortOptions)
      .populate('createdBy', 'name profilePic')
      .exec();

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching listings', 
      error: error.message 
    });
  }
});

// Create a new listing
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, price, category, imageUrl } = req.body;

    const newListing = new ListingModel({
      title,
      description,
      price: category === 'free' ? 0 : price,
      category,
      imageUrl,
      createdBy: req.user._id,
      neighborhoodId: req.user.neighborhoodId
    });

    await newListing.save();

    await createNeighborhoodNotification({
        type: 'listing',
        actorId: req.user._id,
        neighborhoodId: req.user.neighborhoodId,
        excludeUserId: req.user._id,
        data: {
          category: newListing.category
        }
      });

    const populatedListing = await ListingModel.findById(newListing._id)
      .populate('createdBy', 'name profilePic');

    res.status(201).json(populatedListing);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating listing', 
      error: error.message 
    });
  }
});

// Delete a listing
router.delete('/:listingId', protect, async (req, res) => {
  try {
    const listing = await ListingModel.findById(req.params.listingId);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user owns the listing
    if (listing.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await listing.deleteOne();
    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting listing', 
      error: error.message 
    });
  }
});

export default router;