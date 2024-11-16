import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, redirectTo = "/sign-in" }) => {
    const { authToken } = useSelector((state) => state.user);
    return authToken ? children : <Navigate to={redirectTo} />;
};

export default ProtectedRoute;