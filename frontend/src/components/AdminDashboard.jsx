import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // for navigation after logout

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users data on component mount
    const fetchUsers = async () => {
      const token = localStorage.getItem('userToken'); // Get token from localStorage

      if (!token) {
        // If no token is found, redirect to login
        navigate('/login/admin');
        return;
      }

      try {
        // Fetch user data with token in Authorization header
        const response = await fetch('http://localhost:8000/api/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,  // Send token with request
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data); // Set the fetched user data
        } else {
          setError('Error fetching data');
        }
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem('userToken');

    try {
      const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Send token with request
        },
      });

      if (response.ok) {
        // On success, remove the user from the state
        setUsers(users.filter(user => user._id !== userId));
      } else {
        alert('Error deleting user');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting user');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken'); // Remove token from localStorage
    navigate('/login/admin'); // Redirect to admin login page
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {error && <p>{error}</p>}
      <button onClick={handleLogout}>Logout</button>

      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="3">No users found</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
