import React, { useEffect, useState } from 'react';
import { Box, Pagination, CircularProgress, Chip } from '@mui/material';
import axios from 'axios';
import PostItem from '../post/PostItem';
import { useLocation, useNavigate, useParams} from 'react-router-dom';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useSelector } from "react-redux";

function CategoryPage() {
    const { id } = useParams();
    const { authToken, user } = useSelector((state) => state.user);
    const [category, setCategory] = useState({});
    const [posts, setPosts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();

    const fetchCategory = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/categories/${id}`, {
                headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
            });
            setCategory(response.data.data);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                navigate('/404');
            } else {
                console.error('Error fetching categories:', error);
            }

        }
        setLoading(false);
    };

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams(location.search);
            const response = await axios.get(`http://localhost:8080/api/categories/${id}/posts/?${queryParams.toString()}`, {
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
        fetchCategory();
        fetchPosts();
    }, [id, location.search]);

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
        <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ mb: 5, textAlign: "center" }}>
                <Typography variant="h3" gutterBottom>
                    {category.title}
                </Typography>
                <Typography>{category.description}</Typography>
                {user?.role === 'admin' && (
                    <Chip
                        icon={<AdminPanelSettingsIcon />}
                        color="secondary"
                        variant="outlined"
                        label="Edit in Admin Panel"
                        sx={{
                            border: 'none',
                            boxShadow: 'none',
                            mt: 2
                        }}
                        href={`http://localhost:8080/admin/resources/categories/records/${category.id}/show`}
                        component="a"
                        clickable
                        target="_blank"
                    />
                )}
            </Box>
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

export default CategoryPage;