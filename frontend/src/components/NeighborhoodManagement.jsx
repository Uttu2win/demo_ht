import React, { useState, useEffect } from 'react';
import ConfirmationModal from './ConfirmationModal';
import { updateNeighborhood } from '../services/api';
import axios from "axios";

const NeighborhoodManagement = ({ setError: setParentError }) => {
    const [neighborhoods, setNeighborhoods] = useState([]);
    const [newNeighborhood, setNewNeighborhood] = useState({
      name: '',
      description: ''
    });
    const [editingNeighborhood, setEditingNeighborhood] = useState(null);
    const [error, setError] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null);
  
    // Utility function to get token with error handling
    const getToken = () => {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setError('No authentication token found');
        setParentError('Authentication failed');
        return null;
      }
      return token;
    };
  
    // Fetch Neighborhoods
    const fetchNeighborhoods = async () => {
      const token = getToken();
      if (!token) return;
  
      try {
        const response = await axios.get('http://localhost:8000/api/neighborhoods', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        setNeighborhoods(response.data);
        setError('');
      } catch (err) {
        handleApiError(err, 'Error fetching neighborhoods');
      }
    };
  
    // Error handling utility
    const handleApiError = (err, defaultMessage) => {
      if (err.response) {
        // The request was made and the server responded with a status code
        const errorMessage = err.response.data.message || defaultMessage;
        setError(errorMessage);
        setParentError(errorMessage);
        
        // Handle 401 (Unauthorized) specifically
        if (err.response.status === 401) {
          localStorage.removeItem('userToken');
          // Optionally redirect to login page
          // window.location.href = '/login';
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response from server');
        setParentError('Network error');
      } else {
        // Something happened in setting up the request
        setError(defaultMessage);
        setParentError(defaultMessage);
      }
      console.error(err);
    };
  
    // Create Neighborhood
    const handleCreateNeighborhood = async (e) => {
      e.preventDefault();
      
      const token = getToken();
      if (!token) return;
  
      if (!newNeighborhood.name.trim()) {
        setError('Neighborhood name is required');
        return;
      }
  
      try {
        await axios.post('http://localhost:8000/api/neighborhoods', newNeighborhood, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
  
        // Reset form and fetch updated neighborhoods
        setNewNeighborhood({ name: '', description: '' });
        fetchNeighborhoods();
        setError('');
      } catch (err) {
        handleApiError(err, 'Error adding neighborhood');
      }
    };
  
    // Edit Neighborhood
    const handleEditNeighborhood = async () => {
      const token = getToken();
      if (!token) return;
  
      if (!editingNeighborhood || !editingNeighborhood.name.trim()) {
        setError('Neighborhood name is required');
        return;
      }
  
      try {
        await axios.put(`http://localhost:8000/api/neighborhoods/${editingNeighborhood._id}`, 
          editingNeighborhood, 
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
  
        setEditingNeighborhood(null);
        fetchNeighborhoods();
        setError('');
      } catch (err) {
        handleApiError(err, 'Error updating neighborhood');
      }
    };
  
    // Delete Neighborhood
    const handleDeleteNeighborhood = async () => {
      const token = getToken();
      if (!token || !confirmDelete) return;
  
      try {
        await axios.delete(`http://localhost:8000/api/neighborhoods/${confirmDelete}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
  
        fetchNeighborhoods();
        setConfirmDelete(null);
        setError('');
      } catch (err) {
        handleApiError(err, 'Error deleting neighborhood');
      }
    };
  
    // Fetch neighborhoods on component mount
    useEffect(() => {
      fetchNeighborhoods();
    }, []);

  // Initiate neighborhood deletion
  const initiateNeighborhoodDeletion = (neighborhoodId) => {
    setConfirmDelete(neighborhoodId);
  };

  // Cancel deletion
  const cancelDeletion = () => {
    setConfirmDelete(null);
  };

  return (
    <div className="neighborhood-management">
      <h2>Neighborhood Management</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Create Neighborhood Form */}
      <form onSubmit={handleCreateNeighborhood} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Neighborhood Name"
          value={newNeighborhood.name}
          onChange={(e) => setNewNeighborhood({...newNeighborhood, name: e.target.value})}
          required
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <textarea
          placeholder="Description (Optional)"
          value={newNeighborhood.description}
          onChange={(e) => setNewNeighborhood({...newNeighborhood, description: e.target.value})}
          style={{ marginRight: '10px', padding: '5px', width: '300px' }}
        />
        <button type="submit" style={{ padding: '5px 10px' }}>Create Neighborhood</button>
      </form>

      {/* Neighborhoods Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Description</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {neighborhoods.map((neighborhood) => (
            <tr key={neighborhood._id}>
              {editingNeighborhood && editingNeighborhood._id === neighborhood._id ? (
                <>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <input
                      type="text"
                      value={editingNeighborhood.name}
                      onChange={(e) => setEditingNeighborhood({
                        ...editingNeighborhood,
                        name: e.target.value
                      })}
                      required
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <textarea
                      value={editingNeighborhood.description || ''}
                      onChange={(e) => setEditingNeighborhood({
                        ...editingNeighborhood,
                        description: e.target.value
                      })}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <button onClick={handleEditNeighborhood}>Save</button>
                    <button onClick={() => setEditingNeighborhood(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{neighborhood.name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{neighborhood.description || 'No description'}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <button onClick={() => setEditingNeighborhood(neighborhood)}>Edit</button>
                    <button onClick={() => initiateNeighborhoodDeletion(neighborhood._id)}>
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!confirmDelete}
        onClose={cancelDeletion}
        onConfirm={handleDeleteNeighborhood}
        message="Are you sure you want to delete this neighborhood? This action cannot be undone."
      />
    </div>
  );
};

export default NeighborhoodManagement;