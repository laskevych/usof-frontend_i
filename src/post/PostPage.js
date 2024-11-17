import React, { useEffect, useState } from 'react';
import {Avatar, Box, Card, CardContent, Chip, CircularProgress, IconButton, Tooltip, Typography} from '@mui/material';
import axios from 'axios';
import {Link as RouterLink, useParams} from 'react-router-dom';
import Grid from "@mui/material/Grid2";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import EditIcon from '@mui/icons-material/Edit';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import {styled} from "@mui/material/styles";
import {useSelector} from "react-redux";
import { Link } from '@mui/material';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import CommentsBlock from "../comment/CommentsBlock";

const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    height: '100%',
    backgroundColor: (theme.vars || theme).palette.background.paper,
    textDecoration: 'none'
}));

const StyledCardContent = styled(CardContent)({
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: 16,
    flexGrow: 1
});

const StyledTypography = styled(Typography)({
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
});

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' ' +
        date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function PostPage() {
    const { id } = useParams();
    const { authToken, user } = useSelector((state) => state.user);
    const [post, setPost] = useState({});
    const [likes, setLikes] = useState([]);
    const [favoritePosts, setFavoritePosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPost = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/posts/${id}`, {
                headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
            });
            setPost(response.data.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
        setLoading(false);
    };

    const fetchLikes = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/posts/${id}/like/`, {
                headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
            });
            setLikes(response.data.data);
        } catch (error) {
            console.error('Error fetching likes:', error);
        }
    }

    const fetchFavoritePosts = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/users/${user.id}/favorite/`, {
                headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
            });
            setFavoritePosts(response.data.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleFavorite = async () => {
        try {
            if (userHasFavorited) {
                await axios.delete(`http://localhost:8080/api/posts/${id}/favorite/`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
            } else {
                await axios.post(`http://localhost:8080/api/posts/${id}/favorite`, {}, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
            }
            await fetchFavoritePosts();
        } catch (error) {
            console.error('Error handling favorite:', error);
        }
    };

    const handleLike = async () => {
        if (!authToken) return;
        try {
            if (userHasLiked) {
                const likeId = likes.find((like) => like.type === 'like' && like.author.id === user.id).id;
                await axios.delete(`http://localhost:8080/api/posts/${id}/like/${likeId}`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
            } else {
                await axios.post(`http://localhost:8080/api/posts/${id}/like`, { type: 'like' }, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
            }
            await fetchLikes();
        } catch (error) {
            console.error('Error handling like:', error);
        }
    };

    const handleDislike = async () => {
        try {
            if (userHasDisliked) {
                const dislikeId = likes.find((like) => like.type === 'dislike' && like.author.id === user.id).id;
                await axios.delete(`http://localhost:8080/api/posts/${id}/like/${dislikeId}`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
            } else {
                await axios.post(`http://localhost:8080/api/posts/${id}/like`, { type: 'dislike' }, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
            }
            await fetchLikes();
        } catch (error) {
            console.error('Error handling dislike:', error);
        }
    };

    const userHasLiked = likes.some((like) => like.type === 'like' && like.author.id === user?.id);
    const userHasDisliked = likes.some((like) => like.type === 'dislike' && like.author.id === user?.id);
    const userHasFavorited = favoritePosts.some((favoritePost) => favoritePost.id === post.id);

    useEffect(() => {
        fetchPost();
        fetchLikes();
        if (authToken) {
            fetchFavoritePosts();
        }
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ textAlign: 'center', mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Grid size={{ xs: 12, md: 8 }}>
            <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}
            >
                <StyledCard
                    variant="outlined"
                    tabIndex={0}
                    sx={{ height: '100%' }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 2,
                            alignItems: 'center',
                            padding: '16px',
                            textDecoration: 'none',
                            color: 'inherit'
                        }}
                    >
                        <Box
                            sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
                            component={RouterLink}
                            to={`/users/${post.author.id}/`}
                        >
                            <Avatar
                                key={post.author.id}
                                alt={post.author.login}
                                src={'http://localhost:8080/profile-pictures/' + post.author.profilePicture}
                                sx={{ width: 36, height: 36 }}
                            />
                            <Typography variant="caption">
                                {post.author.fullName || post.author.login}
                            </Typography>
                        </Box>
                        <Typography>•</Typography>
                        <Typography variant="caption">{formatTimestamp(post.creationAt)}</Typography>
                    </Box>
                    <StyledCardContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '100%',
                            pb: 0
                        }}
                    >
                        <div>
                            <Typography gutterBottom variant="h6" component="div">
                                {post.title}
                            </Typography>
                            <StyledTypography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                            >
                                {post.content}
                            </StyledTypography>
                            <Box sx={{ mt: 1 }}>
                                {post.categories.map((category) => (
                                    <Chip
                                        key={category.id}
                                        label={category.title}
                                        component={RouterLink}
                                        to={`/categories/${category.id}/posts`}
                                        clickable
                                        sx={{ mr: 1, mb: 1 }}
                                        color="default"
                                        variant="outlined"
                                    />
                                ))}
                            </Box>
                        </div>
                    </StyledCardContent>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 2,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '16px',
                        }}
                    >
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <IconButton
                                onClick={handleLike}
                                disabled={!authToken}
                            >
                                {userHasLiked ? <ThumbUpIcon color="primary" /> : <ThumbUpOutlinedIcon />}
                            </IconButton>
                            <Typography>{likes.filter(like => like.type === 'like').length}</Typography>

                            <IconButton
                                onClick={handleDislike}
                                disabled={!authToken}
                            >
                                {userHasDisliked ? <ThumbDownIcon color="error" /> : <ThumbDownOffAltIcon />}
                            </IconButton>
                            <Typography>{likes.filter(like => like.type === 'dislike').length}</Typography>

                            {user && (
                                <Tooltip title="Save" placement="top">
                                    <IconButton onClick={handleFavorite} disabled={!authToken}>
                                        {userHasFavorited ? <BookmarkAddedIcon color="success" /> : <BookmarkAddIcon />}
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            {user?.id === post.author.id && (
                                <Link
                                    component={RouterLink}
                                    to={`/posts/${post.id}/edit/`}
                                    underline="none"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: 'primary.main',
                                        textDecoration: 'none'
                                    }}
                                >
                                    <EditIcon sx={{ mr: 1 }} />
                                    <Typography variant="body2">Edit</Typography>
                                </Link>

                            )}

                            {user?.role === 'admin' && (
                                <Link
                                    href={`http://localhost:8080/admin/resources/posts/records/${post.id}/show`}
                                    target="_blank"
                                    underline="none"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: 'primary.main',
                                        textDecoration: 'none'
                                    }}
                                >
                                    <AdminPanelSettingsIcon sx={{ mr: 1 }} color="secondary" />
                                    <Typography variant="body2" color="secondary">Edit in Admin Panel</Typography>
                                </Link>
                            )}
                        </Box>
                    </Box>
                </StyledCard>
            </Box>

            <CommentsBlock post={post}/>
        </Grid>
    );
}

export default PostPage;