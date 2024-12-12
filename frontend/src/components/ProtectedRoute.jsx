import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  // If no token, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return element;
};

export default ProtectedRoute;
