import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNeighborhoodManagement from './AdminNeighborhoodManagement';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    neighborhoodId: '',
    role: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    totalUsers: 0,
    totalPages: 0,
    currentPage: 1
  });
  const [neighborhoods, setNeighborhoods] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch neighborhoods for the dropdown
    const fetchNeighborhoods = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const response = await fetch('http://localhost:8000/api/neighborhoods', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setNeighborhoods(data);
      } catch (err) {
        console.error('Error fetching neighborhoods', err);
      }
    };
    fetchNeighborhoods();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('userToken');

      if (!token) {
        navigate('/login/admin');
        return;
      }

      try {
        // Convert filters to query string
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });

        const response = await fetch(`http://localhost:8000/api/users?${queryParams}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
          setPagination({
            totalUsers: data.totalUsers,
            totalPages: data.totalPages,
            currentPage: data.currentPage
          });
        } else {
          const errorData = await response.json();
          setError(errorData.message);
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem('userToken');

    try {
      const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Refresh users after deletion
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });

        const refreshResponse = await fetch(`http://localhost:8000/api/users?${queryParams}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await refreshResponse.json();
        setUsers(data.users);
        setPagination({
          totalUsers: data.totalUsers,
          totalPages: data.totalPages,
          currentPage: data.currentPage
        });
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Error deleting user');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting user');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login/admin');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div>
        <button onClick={() => setActiveTab('users')}>Users</button>
        <button onClick={() => setActiveTab('neighborhoods')}>Neighborhoods</button>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {activeTab === 'users' && (
        <div>
          <h2>Users Management</h2>
          {/* Filter Controls */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Filter by Name"
              value={filters.name}
              onChange={handleFilterChange}
            />
            <input
              type="text"
              name="email"
              placeholder="Filter by Email"
              value={filters.email}
              onChange={handleFilterChange}
            />
            <select 
              name="neighborhoodId"
              value={filters.neighborhoodId}
              onChange={handleFilterChange}
            >
              <option value="">All Neighborhoods</option>
              {neighborhoods.map(neighborhood => (
                <option 
                  key={neighborhood._id} 
                  value={neighborhood._id}
                >
                  {neighborhood.name}
                </option>
              ))}
            </select>
            <select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
            >
              <option value="createdAt">Created Date</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
            </select>
            <select
              name="sortOrder"
              value={filters.sortOrder}
              onChange={handleFilterChange}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          {/* Users Table */}
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Neighborhood</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5">No users found</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.neighborhoodId?.name || 'No Neighborhood'}</td>
                    <td>{user.role}</td>
                    <td>
                      <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div>
            <button 
              disabled={filters.page === 1}
              onClick={() => handlePageChange(filters.page - 1)}
            >
              Previous
            </button>
            <span>
              Page {filters.page} of {pagination.totalPages}
            </span>
            <button 
              disabled={filters.page === pagination.totalPages}
              onClick={() => handlePageChange(filters.page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {activeTab === 'neighborhoods' && (
        <AdminNeighborhoodManagement />
      )}
    </div>
  );
};

export default AdminDashboard;