import mongoose from "mongoose";
import Neighborhood from "./models/Neighborhood.js"; // Adjust the path as necessary
import UserModel from "./models/User.js"; // Ensure the correct path to your User model
import dotenv from "dotenv";

dotenv.config();

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

// Function to Add Sample Data
const addUser = async () => {
  try {
    // Define your sample data
    const sampleData = {
      name: "Uttam Gowda",
      email: "hmuttamgowdaa@gmail.com",
      password: "Uttu@9303", // Ideally, hash the password before saving
      neighborhoodId: null, // Replace with actual Neighborhood ID if available
      profilePic: "",
      role: "user",
    };

    // Insert the data into the users collection using UserModel
    await UserModel.create(sampleData);
    console.log("Sample user added successfully");

    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error("Error adding user:", error.message);
    mongoose.connection.close();
  }
};

// Run the script
const run = async () => {
  await connectDB();
  await addUser();
};

run();
