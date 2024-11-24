import React, { useEffect, useState } from 'react';
import {useParams, Link as RouterLink, useNavigate} from 'react-router-dom';
import {Box, Avatar, Typography, Button, Card, CircularProgress, Chip, Badge} from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import ArticleIcon from '@mui/icons-material/Article';
import Grid from "@mui/material/Grid2";
import Tooltip from '@mui/material/Tooltip';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import PostItem from "../post/PostItem";
import PersonIcon from '@mui/icons-material/Person';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

function UserProfilePage() {
    const { id } = useParams();
    const { user, authToken } = useSelector((state) => state.user);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [favoritePosts, setFavoritePosts] = useState([]);
    const [userPosts, setUserPosts] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const navigate = useNavigate();

    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/users/${id}`, {
                    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
                });
                setUserData(response.data.data);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    navigate('/404');
                } else {
                    console.error('Error fetching user data:', error);console.error('Error fetching posts:', error);
                }

            }
            setLoading(false);
        };

        const fetchFavoritePosts = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/users/${id}/favorite/`, {
                    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
                });
                setFavoritePosts(response.data.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        const fetchUserPosts = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/users/${id}/posts/`, {
                    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
                });
                setUserPosts(response.data.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchUserData();
        fetchFavoritePosts();
        fetchUserPosts();
    }, [id, authToken]);

    if (loading) {
        return (
            <Box sx={{ textAlign: 'center', mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', mt: 4, gap: 4 }}>
            <Grid container spacing={1} sx={{justifyContent: 'center'}}>
                <Card sx={{ padding: 4, maxWidth: 400, textAlign: 'center' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 2,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            textDecoration: 'none',
                            color: 'inherit'
                        }}
                    >

                        <Tooltip title="Rating">
                            <Badge color={(userData.rating < 0) ? 'error' : 'success'} badgeContent={userData.rating}>
                                <ThumbsUpDownIcon fontSize="large"/>
                            </Badge>
                        </Tooltip>

                        <Tooltip title={(userData.role === 'admin' ? 'Admin' : 'User') + ' Role'}>
                            {userData.role === 'admin' ? (
                                <AdminPanelSettingsIcon fontSize="large" color="secondary"/>
                            ): (
                                <PersonIcon fontSize="large"/>
                            )}

                        </Tooltip>
                    </Box>
                    <Avatar
                        src={`http://localhost:8080/profile-pictures/${userData.profilePicture}`}
                        alt={userData.fullName || userData.login}
                        sx={{ width: 150, height: 150, margin: '0 auto' }}
                    />
                    <Typography variant="h5" sx={{ mt: 2 }}>
                        {userData.fullName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {userData.email}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        {user?.id === userData.id && (
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ mt: 3 }}
                                component={RouterLink}
                                to={`/users/${id}/edit`}
                            >
                                Edit Profile
                            </Button>
                        )}
                    </Box>
                    {user?.role === 'admin' && (
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
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
                                href={`http://localhost:8080/admin/resources/users/records/${userData.id}/show`}
                                component="a"
                                clickable
                                target="_blank"
                            />
                        </Box>
                    )}
                </Card>
            </Grid>

            <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <Tabs
                    value={tabValue}
                    onChange={handleChangeTab}
                    centered
                    variant="fullWidth"
                >
                    <Tab icon={<ArticleIcon color="primary" />} label="Posts"/>
                    <Tab icon={<BookmarkAddedIcon color="primary" />} label="Favorites" />
                </Tabs>
            </Box>

            {tabValue === 0 && (
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}
                    >
                        {userPosts.map((post) => (
                            <PostItem key={post.id} post={post} />
                        ))}
                    </Box>
                </Grid>
            )}

            {tabValue === 1 && (
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}
                    >
                        {favoritePosts.map((post) => (
                            <PostItem key={post.id} post={post} />
                        ))}
                    </Box>
                </Grid>
            )}
        </Box>
    );
}

export default UserProfilePage;