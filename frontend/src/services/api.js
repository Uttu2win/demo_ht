import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api', // Backend base URL
});

// Add User
export const registerUser = (userData) => API.post('/users/register', userData);

// Login User
export const loginUser = (loginData) => API.post('/users/login', loginData);
