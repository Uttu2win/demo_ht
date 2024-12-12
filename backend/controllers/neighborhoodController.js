import NeighborhoodModel from "../models/Neighborhood.js";

export const getAllNeighborhoods = async (req, res) => {
  try {
    const neighborhoods = await NeighborhoodModel.find({});
    res.status(200).json(neighborhoods);
  } catch (error) {
    res.status(500).json({ message: "Error fetching neighborhoods", error: error.message });
  }
};


// backend/controllers/neighborhoodController.js

export const createNeighborhood = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Neighborhood name is required' });
  }

  try {
    const newNeighborhood = new NeighborhoodModel({ name });
    await newNeighborhood.save();
    res.status(201).json(newNeighborhood);
  } catch (error) {
    res.status(500).json({ message: 'Error creating neighborhood', error: error.message });
  }
};
