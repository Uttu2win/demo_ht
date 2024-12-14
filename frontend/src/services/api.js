import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Add User
export const registerUser = (userData) => API.post('/users/register', userData);

export const loginUser = async (loginData) => {
  try {
    const response = await API.post(
      loginData.isAdmin ? '/users/login/admin' : '/users/login', 
      loginData
    );
    
    // Store the token in localStorage
    localStorage.setItem('token', response.data.token);
    
    // Store the user information in localStorage
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error);
    throw error;
  }
};

export const fetchNeighborhoods = () => API.get('/neighborhoods');

export const fetchUsers = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return API.get(`/users?${queryString}`);
};

export const deleteUser = (userId) => API.delete(`/users/${userId}`);

export const createNeighborhood = (neighborhoodData) => 
  API.post('/neighborhoods', neighborhoodData);

export const updateNeighborhood = (neighborhoodId, neighborhoodData) => 
  API.put(`/neighborhoods/${neighborhoodId}`, neighborhoodData);

export const deleteNeighborhood = (neighborhoodId) => 
  API.delete(`/neighborhoods/${neighborhoodId}`);

export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const createPost = (postData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.neighborhoodId) {
    return Promise.reject(new Error('No neighborhood ID found'));
  }
  return API.post('/posts', { ...postData, neighborhoodId: user.neighborhoodId }, getAuthHeader());
};

export const fetchPosts = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.neighborhoodId) {
      console.warn('No neighborhood ID found');
      return { data: [] };
    }
    
    return await API.get(`/posts?neighborhoodId=${user.neighborhoodId}`, getAuthHeader());
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const likePost = (postId) => {
  try {
    return API.post(`/posts/${postId}/like`, {}, getAuthHeader());
  } catch (error) {
    console.error('API Like Post Error:', error);
    throw error;
  }
};

export const fetchListings = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return API.get(`/listings?${queryString}`, getAuthHeader());
};

export const createListing = (listingData) => {
  return API.post('/listings', listingData, getAuthHeader());
};

export const deleteListing = (listingId) => {
  return API.delete(`/listings/${listingId}`, getAuthHeader());
};