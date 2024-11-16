import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AuthorRoute = ({ children }) => {
    const { id } = useParams();
    const { user, authToken } = useSelector((state) => state.user);
    const [isAuthor, setIsAuthor] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/posts/${id}`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                setIsAuthor(response.data.data.creationById === user.id);
            } catch (error) {
                console.error('Error fetching post:', error);
            }
            setLoading(false);
        };
        fetchPost();
    }, [id, authToken, user]);

    if (loading) return <div>Loading...</div>;
    return isAuthor ? children : <Navigate to="/" />;
};

export default AuthorRoute;