import React, { useState, useEffect } from 'react';
import { registerUser } from '../services/api';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    neighborhoodId: '',
  });
  const [neighborhoods, setNeighborhoods] = useState([]);

  // Fetch neighborhoods on component mount
  useEffect(() => {
    const fetchNeighborhoods = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/neighborhoods');
        setNeighborhoods(response.data);
      } catch (error) {
        console.error('Error fetching neighborhoods:', error);
      }
    };

    fetchNeighborhoods();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select
          name="neighborhoodId"
          value={formData.neighborhoodId}
          onChange={handleChange}
          required
        >
          <option value="">Select Neighborhood</option>
          {neighborhoods.map((neighborhood) => (
            <option key={neighborhood._id} value={neighborhood._id}>
              {neighborhood.name}
            </option>
          ))}
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
