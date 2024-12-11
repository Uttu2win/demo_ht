import mongoose from 'mongoose';
import Neighborhood from '../models/Neighborhood.js';

export const getAllNeighborhoods = async (req, res) => {
  try {
    // Test DB Connection in Controller
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to Database from controller');

    const neighborhoods = await Neighborhood.find({});
    console.log('Fetched neighborhoods:', neighborhoods); // Check output in console
    res.status(200).json(neighborhoods);
  } catch (error) {
    console.error('Error in getAllNeighborhoods:', error.message);
    res.status(500).json({ message: 'Error fetching neighborhoods', error: error.message });
  }
};
