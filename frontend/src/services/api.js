import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Add User
export const registerUser = (userData) => API.post('/users/register', userData);

// Login User
// export const loginUser = (loginData) => API.post('/users/login', loginData);

export const loginUser = (loginData) =>
  API.post(loginData.isAdmin ? '/users/login/admin' : '/users/login', loginData);

// Fetch Neighborhoods
export const fetchNeighborhoods = () => API.get('/neighborhoods');


// Fetch Users
export const fetchUsers = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return API.get(`/users?${queryString}`);
};

// Delete User
export const deleteUser = (userId) => API.delete(`/users/${userId}`);

// Create Neighborhood
export const createNeighborhood = (neighborhoodData) => 
  API.post('/neighborhoods', neighborhoodData);


// Delete Neighborhood
export const deleteNeighborhood = (neighborhoodId) => 
  API.delete(`/neighborhoods/${neighborhoodId}`);