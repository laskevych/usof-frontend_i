import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import PostForm from './PostForm';

function PostEditPage() {
    const { id } = useParams();
    const { authToken } = useSelector((state) => state.user);
    const [post, setPost] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            const response = await axios.get(`http://localhost:8080/api/posts/${id}`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setPost(response.data.data);
        };
        fetchPost();
    }, [id, authToken]);

    const handleSubmit = async (payload) => {
        await axios.patch(`http://localhost:8080/api/posts/${id}/`, payload, {
            headers: { Authorization: `Bearer ${authToken}` },
        });
    };

    const handleDelete = async () => {
        await axios.delete(`http://localhost:8080/api/posts/${id}/`, {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        navigate('/');
    };

    return post ? <PostForm post={post} onSubmit={handleSubmit} onDelete={handleDelete} /> : <div>Loading...</div>;
}

export default PostEditPage;