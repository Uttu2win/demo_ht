// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import AdminNeighborhoodManagement from './AdminNeighborhoodManagement';

// const AdminDashboard = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [activeTab, setActiveTab] = useState('users');
//   const [filters, setFilters] = useState({
//     name: '',
//     email: '',
//     neighborhoodId: '',
//     role: '',
//     sortBy: 'createdAt',
//     sortOrder: 'desc',
//     page: 1,
//     limit: 10
//   });
//   const [pagination, setPagination] = useState({
//     totalUsers: 0,
//     totalPages: 0,
//     currentPage: 1
//   });
//   const [neighborhoods, setNeighborhoods] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch neighborhoods for the dropdown
//     const fetchNeighborhoods = async () => {
//       try {
//         const token = localStorage.getItem('userToken');
//         const response = await fetch('http://localhost:8000/api/neighborhoods', {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
//         const data = await response.json();
//         setNeighborhoods(data);
//       } catch (err) {
//         console.error('Error fetching neighborhoods', err);
//       }
//     };
//     fetchNeighborhoods();
//   }, []);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const token = localStorage.getItem('userToken');

//       if (!token) {
//         navigate('/login/admin');
//         return;
//       }

//       try {
//         // Convert filters to query string
//         const queryParams = new URLSearchParams();
//         Object.entries(filters).forEach(([key, value]) => {
//           if (value) queryParams.append(key, value);
//         });

//         const response = await fetch(`http://localhost:8000/api/users?${queryParams}`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setUsers(data.users);
//           setPagination({
//             totalUsers: data.totalUsers,
//             totalPages: data.totalPages,
//             currentPage: data.currentPage
//           });
//         } else {
//           const errorData = await response.json();
//           setError(errorData.message);
//         }
//       } catch (err) {
//         console.error(err);
//         setError('Error fetching data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, [navigate, filters]);

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value,
//       page: 1 // Reset to first page when filters change
//     }));
//   };

//   const handlePageChange = (newPage) => {
//     setFilters(prev => ({ ...prev, page: newPage }));
//   };

//   const handleDeleteUser = async (userId) => {
//     const token = localStorage.getItem('userToken');

//     try {
//       const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         // Refresh users after deletion
//         const queryParams = new URLSearchParams();
//         Object.entries(filters).forEach(([key, value]) => {
//           if (value) queryParams.append(key, value);
//         });

//         const refreshResponse = await fetch(`http://localhost:8000/api/users?${queryParams}`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         });

//         const data = await refreshResponse.json();
//         setUsers(data.users);
//         setPagination({
//           totalUsers: data.totalUsers,
//           totalPages: data.totalPages,
//           currentPage: data.currentPage
//         });
//       } else {
//         const errorData = await response.json();
//         alert(errorData.message || 'Error deleting user');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Error deleting user');
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('userToken');
//     navigate('/login/admin');
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div>
//       <h1>Admin Dashboard</h1>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
      
//       <div>
//         <button onClick={() => setActiveTab('users')}>Users</button>
//         <button onClick={() => setActiveTab('neighborhoods')}>Neighborhoods</button>
//         <button onClick={handleLogout}>Logout</button>
//       </div>

//       {activeTab === 'users' && (
//         <div>
//           <h2>Users Management</h2>
//           {/* Filter Controls */}
//           <div>
//             <input
//               type="text"
//               name="name"
//               placeholder="Filter by Name"
//               value={filters.name}
//               onChange={handleFilterChange}
//             />
//             <input
//               type="text"
//               name="email"
//               placeholder="Filter by Email"
//               value={filters.email}
//               onChange={handleFilterChange}
//             />
//             <select 
//               name="neighborhoodId"
//               value={filters.neighborhoodId}
//               onChange={handleFilterChange}
//             >
//               <option value="">All Neighborhoods</option>
//               {neighborhoods.map(neighborhood => (
//                 <option 
//                   key={neighborhood._id} 
//                   value={neighborhood._id}
//                 >
//                   {neighborhood.name}
//                 </option>
//               ))}
//             </select>
//             <select
//               name="role"
//               value={filters.role}
//               onChange={handleFilterChange}
//             >
//               <option value="">All Roles</option>
//               <option value="user">User</option>
//               <option value="admin">Admin</option>
//             </select>
//             <select
//               name="sortBy"
//               value={filters.sortBy}
//               onChange={handleFilterChange}
//             >
//               <option value="createdAt">Created Date</option>
//               <option value="name">Name</option>
//               <option value="email">Email</option>
//             </select>
//             <select
//               name="sortOrder"
//               value={filters.sortOrder}
//               onChange={handleFilterChange}
//             >
//               <option value="desc">Descending</option>
//               <option value="asc">Ascending</option>
//             </select>
//           </div>

//           {/* Users Table */}
//           <table>
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Neighborhood</th>
//                 <th>Role</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.length === 0 ? (
//                 <tr>
//                   <td colSpan="5">No users found</td>
//                 </tr>
//               ) : (
//                 users.map((user) => (
//                   <tr key={user._id}>
//                     <td>{user.name}</td>
//                     <td>{user.email}</td>
//                     <td>{user.neighborhoodId?.name || 'No Neighborhood'}</td>
//                     <td>{user.role}</td>
//                     <td>
//                       <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>

//           {/* Pagination Controls */}
//           <div>
//             <button 
//               disabled={filters.page === 1}
//               onClick={() => handlePageChange(filters.page - 1)}
//             >
//               Previous
//             </button>
//             <span>
//               Page {filters.page} of {pagination.totalPages}
//             </span>
//             <button 
//               disabled={filters.page === pagination.totalPages}
//               onClick={() => handlePageChange(filters.page + 1)}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}

//       {activeTab === 'neighborhoods' && (
//         <AdminNeighborhoodManagement />
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <p>{message}</p>
        <div>
          <button 
            onClick={onConfirm}
            style={{
              backgroundColor: 'red',
              color: 'white',
              marginRight: '10px',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Confirm
          </button>
          <button 
            onClick={onClose}
            style={{
              backgroundColor: 'gray',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [newNeighborhood, setNewNeighborhood] = useState('');
  const [editingNeighborhood, setEditingNeighborhood] = useState(null);

  // Filters and Pagination for Users
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

  const navigate = useNavigate();

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`http://localhost:8000/api/users?${queryParams}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setPagination({
          totalUsers: data.totalUsers,
          totalPages: data.totalPages,
          currentPage: data.currentPage
        });
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error fetching users');
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Neighborhoods
  const fetchNeighborhoods = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('http://localhost:8000/api/neighborhoods', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNeighborhoods(data);
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error fetching neighborhoods');
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again.');
    }
  };

  // User Deletion
  const handleDeleteUser = async () => {
    if (!confirmDelete) return;
    const token = localStorage.getItem('userToken');
    setLoading(true);
    setDeleteError('');
    try {
      const response = await fetch(`http://localhost:8000/api/users/${confirmDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Refresh users after deletion
        fetchUsers();
        setConfirmDelete(null);
      } else {
        const errorData = await response.json();
        setDeleteError(errorData.message || 'Error deleting user');
      }
    } catch (err) {
      console.error(err);
      setDeleteError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Neighborhood Methods
  const handleAddNeighborhood = async () => {
    if (!newNeighborhood.trim()) return;
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('http://localhost:8000/api/neighborhoods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newNeighborhood })
      });

      if (response.ok) {
        setNewNeighborhood('');
        fetchNeighborhoods();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error adding neighborhood');
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again.');
    }
  };

  const handleEditNeighborhood = async () => {
    if (!editingNeighborhood || !editingNeighborhood.name.trim()) return;
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`http://localhost:8000/api/neighborhoods/${editingNeighborhood._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: editingNeighborhood.name })
      });

      if (response.ok) {
        setEditingNeighborhood(null);
        fetchNeighborhoods();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error updating neighborhood');
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again.');
    }
  };

  const handleDeleteNeighborhood = async () => {
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`http://localhost:8000/api/neighborhoods/${confirmDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchNeighborhoods();
        setConfirmDelete(null);
        setDeleteError('');
      } else {
        const errorData = await response.json();
        setDeleteError(errorData.message || 'Error deleting neighborhood');
      }
    } catch (err) {
      console.error(err);
      setDeleteError('Network error. Please try again.');
    }
  };

  // Initial Data Fetching
  useEffect(() => {
    fetchUsers();
    fetchNeighborhoods();
  }, []);

  // Utility Methods
  const initiateUserDeletion = (userId) => {
    setConfirmDelete(userId);
    setDeleteError('');
  };

  const initiateNeighborhoodDeletion = (neighborhoodId) => {
    setConfirmDelete(neighborhoodId);
    setDeleteError('');
  };

  const cancelDeletion = () => {
    setConfirmDelete(null);
    setDeleteError('');
  };

  // Render Loading State
  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      
      {/* Tabs */}
      <div>
        <button 
          onClick={() => setActiveTab('users')} 
          style={{ 
            backgroundColor: activeTab === 'users' ? '#007bff' : 'gray',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            margin: '0 10px'
          }}
        >
          Users
        </button>
        <button 
          onClick={() => setActiveTab('neighborhoods')} 
          style={{ 
            backgroundColor: activeTab === 'neighborhoods' ? '#007bff' : 'gray',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            margin: '0 10px'
          }}
        >
          Neighborhoods
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {deleteError && <p style={{ color: 'red' }}>{deleteError}</p>}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
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
                      <button
                        onClick={() => initiateUserDeletion(user._id)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* Pagination could be added here */}
        </div>
      )}

      {/* Neighborhoods Tab */}
      {activeTab === 'neighborhoods' && (
        <div>
          <div>
            <input
              type="text"
              value={newNeighborhood}
              onChange={(e) => setNewNeighborhood(e.target.value)}
              placeholder="New Neighborhood Name"
            />
            <button onClick={handleAddNeighborhood}>Add Neighborhood</button>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {neighborhoods.map((neighborhood) => (
                <tr key={neighborhood._id}>
                  {editingNeighborhood && editingNeighborhood._id === neighborhood._id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          value={editingNeighborhood.name}
                          onChange={(e) => setEditingNeighborhood({
                            ...editingNeighborhood,
                            name: e.target.value
                          })}
                        />
                      </td>
                      <td>
                        <button onClick={handleEditNeighborhood}>Save</button>
                        <button onClick={() => setEditingNeighborhood(null)}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{neighborhood.name}</td>
                      <td>
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
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!confirmDelete}
        onClose={cancelDeletion}
        onConfirm={activeTab === 'users' ? handleDeleteUser : handleDeleteNeighborhood}
        message={`Are you sure you want to delete this ${activeTab === 'users' ? 'user' : 'neighborhood'}? This action cannot be undone.`}
      />
    </div>
  );
};

export default AdminDashboard;