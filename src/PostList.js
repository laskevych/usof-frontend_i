import React, { useEffect, useState, useContext } from 'react';
import { Box, Pagination, CircularProgress } from '@mui/material';
import axios from 'axios';
import PostItem from './PostItem';
import { AuthContext } from './auth/AuthContext';
import {Link as RouterLink, useLocation, useNavigate} from 'react-router-dom';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import {useSelector} from "react-redux";

function PostList() {
    const { authToken, user } = useSelector((state) => state.user);
    const [posts, setPosts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams(location.search);
            const response = await axios.get(`http://localhost:8080/api/posts/?${queryParams.toString()}`, {
                headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
            });
            setPosts(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();
    }, [location.search]);

    const handlePageChange = (event, value) => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.set('page', value);
        navigate(`${location.pathname}?${queryParams.toString()}`);
    };

    if (loading) {
        return (
            <Box sx={{ textAlign: 'center', mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Grid size={{ xs: 12, md: 9 }}>
            <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}
            >
                {posts.map((post) => (
                    <PostItem key={post.id} post={post} />
                ))}
            </Box>

            {pagination && pagination.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Pagination
                        count={pagination.totalPages}
                        page={pagination.currentPage}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            )}
        </Grid>
    );
}

export default PostList;