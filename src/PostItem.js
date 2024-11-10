import React from 'react';
import {Card, CardContent, Avatar, Typography, Chip, Box, Button} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import MapsUgcOutlinedIcon from "@mui/icons-material/MapsUgcOutlined";
import {styled} from "@mui/material/styles";
import { useSelector } from 'react-redux';

const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    height: '100%',
    backgroundColor: (theme.vars || theme).palette.background.paper,
    textDecoration: 'none',
    '&:hover': {
        backgroundColor: 'transparent',
        cursor: 'pointer',
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

function PostItem({ post }) {
    const { user } = useSelector((state) => state.user);

    return  (
        <StyledCard
            variant="outlined"
            tabIndex={0}
            sx={{ height: '100%' }}
            component={RouterLink}
            to={`/posts/${post.id}/`}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    textDecoration: 'none',
                    color: 'inherit'
                }}
            >
                <Box
                    sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}
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
                {((user?.id === post.author.id || user?.role === 'admin') && post.status === 'inactive') && (
                    <Chip label={post.status} size="small" />
                )}
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
                        {post.content.substring(0, 150)}...
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
                                color="primary"
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
                    //justifyContent: 'space-between',
                    padding: '16px',
                }}
            >
                <Chip icon={<ThumbUpOutlinedIcon />} color="default" variant="outlined" label={post.likes} sx={{
                    border: 'none',
                    boxShadow: 'none',
                }} />
                <Chip icon={<MapsUgcOutlinedIcon />} color="default" variant="outlined" label="2" sx={{
                    border: 'none',
                    boxShadow: 'none',
                }} />
            </Box>
        </StyledCard>
    )
}

export default PostItem;