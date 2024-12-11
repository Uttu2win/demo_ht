import dotenv from 'dotenv';
import express from "express";
import cors from "cors";

import connectDB from "./database/database.js";
import User from "./models/User.js";
import userRoutes from './routes/userRoutes.js';
import neighborhoodRoutes from './routes/neighborhoodRoutes.js';

dotenv.config();


const app = express();
app.use(cors());
//Middleware
app.use(express.json()); // To parse JSON requests


//Connection to Database 
connectDB();



// Test route to create a user
app.use('/api/users', userRoutes);

//To fetch neighborhoods from the database
app.use('/api/neighborhood', (req, res, next) => {
    console.log('Neighborhoods route accessed');
    next();
  }, neighborhoodRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, ()=>console.log(`Server started on PORT ${PORT}`))