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
    
    console.log('Login Response:', response.data);
    
    // Store the token in localStorage
    localStorage.setItem('token', response.data.token);
    
    // Store the user information in localStorage
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
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
  return { 
    headers: { Authorization: `Bearer ${token}` } 
  };
};
// In api.js
export const createPost = (postData) => API.post('/posts', postData, getAuthHeader());
export const fetchPosts = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  // More flexible neighborhood ID extraction
  const neighborhoodId = user?.neighborhoodId || 
                         user?.neighborhood || 
                         user?.neighborhood_id;
  
  if (!neighborhoodId) {
    console.warn('No neighborhood ID found', user);
    return Promise.resolve({ data: [] }); // Return empty array if no neighborhood
  }
  
  return API.get(`/posts?neighborhoodId=${neighborhoodId}`, getAuthHeader());
};

export const likePost = (postId) => {
  try {
    return API.post(`/posts/${postId}/like`, {}, getAuthHeader());
  } catch (error) {
    console.error('API Like Post Error:', error);
    throw error;
  }
};