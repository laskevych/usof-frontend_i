import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';

const ProfileOwnerRoute = ({ children }) => {
    const { id } = useParams();
    const { user } = useSelector((state) => state.user);

    return user.id === parseInt(id, 10) ? children : <Navigate to="/" />;
};

export default ProfileOwnerRoute;