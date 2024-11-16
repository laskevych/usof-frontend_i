import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

function PrivateRoute({ children }) {
  const { authToken } = useContext(AuthContext);

  if (!authToken) {
    return <Navigate to="/sign-in" />;
  }

  return children;
}

export default PrivateRoute;