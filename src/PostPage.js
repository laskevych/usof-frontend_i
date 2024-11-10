import React, { useEffect, useState, useContext } from 'react';
import {Avatar, Box, Card, CardContent, Chip, CircularProgress, Typography} from '@mui/material';
import axios from 'axios';
import PostItem from './PostItem';
import { AuthContext } from './auth/AuthContext';
import {Link as RouterLink, useLocation, useNavigate, useParams} from 'react-router-dom';
import Grid from "@mui/material/Grid2";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import EditIcon from '@mui/icons-material/Edit';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import MapsUgcOutlinedIcon from "@mui/icons-material/MapsUgcOutlined";
import {styled} from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    height: '100%',
    backgroundColor: (theme.vars || theme).palette.background.paper,
    textDecoration: 'none',
    '&:hover': {
        backgroundColor: 'transparent'
    },
    '&:focus-visible': {
        outline: '3px solid',
        outlineColor: 'hsla(210, 98%, 48%, 0.5)',
        outlineOffset: '2px',
    }
}));

const StyledCardContent = styled(CardContent)({
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: 16,
    flexGrow: 1,
    '&:last-child': {
        paddingBottom: 16,
    },
});

const StyledTypography = styled(Typography)({
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
});

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    return date.toLocaleDateString('en-US', options);
}

function PostPage() {
    const { id } = useParams();
    const { authToken } = useContext(AuthContext);
    const [post, setPost] = useState({});
    const [likes, setLikes] = useState([]);
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
            console.log(response.data.data);
            setLikes(response.data.data);
        } catch (error) {
            console.error('Error fetching likes:', error);
        }
    }

    useEffect(() => {
        fetchPost();
        fetchLikes();
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
                            justifyContent: 'space-between',
                            padding: '16px',
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
                                sx={{ width: 24, height: 24 }}
                            />
                            <Typography variant="caption">
                                {post.author.fullName || post.author.login}
                            </Typography>
                        </Box>
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
                                        size="small"
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
                        <Box>
                            <Chip icon={<ThumbUpOutlinedIcon />} color="default" variant="outlined" label={likes.filter(like => like.type === 'like').length} sx={{
                                border: 'none',
                                boxShadow: 'none',
                            }} />
                            <Chip icon={<ThumbUpOffAltIcon />} color="default" variant="outlined" label={likes.filter(like => like.type === 'dislike').length} sx={{
                                border: 'none',
                                boxShadow: 'none',
                            }} />
                            <Chip icon={<MapsUgcOutlinedIcon />} color="default" variant="outlined" label="2" sx={{
                                border: 'none',
                                boxShadow: 'none',
                            }} />
                            <Chip icon={<ThumbUpIcon />} color="default" variant="outlined" label={likes.filter(like => like.type === 'like').length} sx={{
                                border: 'none',
                                boxShadow: 'none',
                            }} />
                            <Chip icon={<ThumbDownIcon />} color="default" variant="outlined" label={likes.filter(like => like.type === 'dislike').length} sx={{
                                border: 'none',
                                boxShadow: 'none',
                            }} />
                        </Box>
                        <Box>
                            <Chip icon={<EditIcon />} color="default" variant="outlined" label="Edit" sx={{
                                border: 'none',
                                boxShadow: 'none',
                            }} />
                            <Chip icon={<AdminPanelSettingsIcon />} color="default" variant="outlined" label="Edit in Admin Panel" sx={{
                                border: 'none',
                                boxShadow: 'none',
                            }} />
                        </Box>
                    </Box>
                </StyledCard>
            </Box>
        </Grid>
    );
}

export default PostPage;