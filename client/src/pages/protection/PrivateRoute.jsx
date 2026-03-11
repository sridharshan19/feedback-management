import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './Login'; 
const PrivateRoute = ({ element, ...rest }) => {
  return (
    <Route 
      {...rest} 
      element={isAuthenticated() ? element : <Navigate to="/login" />} 
    />
  );
};

export default PrivateRoute;
