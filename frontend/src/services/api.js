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

// Update Neighborhood
export const updateNeighborhood = (neighborhoodId, neighborhoodData) => 
  API.put(`/neighborhoods/${neighborhoodId}`, neighborhoodData);

// Delete Neighborhood
export const deleteNeighborhood = (neighborhoodId) => 
  API.delete(`/neighborhoods/${neighborhoodId}`);

export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { 
    headers: { Authorization: `Bearer ${token}` } 
  };
};
// In api.js
export const createPost = (postData) => API.post('/posts', postData, getAuthHeader());
export const fetchPosts = () => API.get('/posts', getAuthHeader());

export const likePost = (postId) => API.post(`/posts/${postId}/like`, {}, getAuthHeader());