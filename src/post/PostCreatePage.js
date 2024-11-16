import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import PostForm from './PostForm';

function PostCreatePage() {
    const { authToken } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const handleSubmit = async (payload) => {
        const response = await axios.post('http://localhost:8080/api/posts/', payload, {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        if (response.status === 201) {
            const postId = response.data.data.id;
            navigate(`/posts/${postId}/edit`);
        }
    };

    return <PostForm onSubmit={handleSubmit} />;
}

export default PostCreatePage;