import React, {lazy, Suspense} from 'react';
import {Card, CardContent, Avatar, Typography, Chip, Box} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import MapsUgcOutlinedIcon from "@mui/icons-material/MapsUgcOutlined";
import {styled} from "@mui/material/styles";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const MarkdownPreview = lazy(() => import('@uiw/react-markdown-preview'));

const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    backgroundColor: (theme.vars || theme).palette.background.paper,
    textDecoration: 'none',
}));

const StyledCardContent = styled(CardContent)({
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: 16,
    flexGrow: 1,
    textDecoration: 'none',
    color: 'black'
});

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' ' +
        date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function PostItem({ post }) {
    return  (
        <StyledCard
            variant="outlined"
            tabIndex={0}
            sx={{opacity: post.status === 'inactive' ? 0.5 : 1}}
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
                <Typography variant="caption">{formatTimestamp(post.creationAt)}</Typography>
            </Box>
            <StyledCardContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    pb: 0
                }}
                component={RouterLink}
                to={`/posts/${post.id}/`}
            >
                <div>
                    <Typography gutterBottom variant="h6" component="div">
                        {post.title}
                    </Typography>
                    <Suspense fallback={<div>Loading content...</div>}>
                        <Box data-color-mode="light">
                            <Box className="wmde-markdown-var"> </Box>
                            <MarkdownPreview source={post.content} />
                        </Box>
                    </Suspense>
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
                    padding: '16px',
                    justifyContent: 'space-between'
                }}
            >
                <Chip icon={<ThumbUpOutlinedIcon />} color="default" variant="outlined" label={post.likes} sx={{
                    border: 'none',
                    boxShadow: 'none',
                }} />
                {post.status === 'inactive' && (
                    <Chip label="Disabled" icon={<VisibilityOffIcon/>}></Chip>
                )}
                <Chip icon={<MapsUgcOutlinedIcon />} color="default" variant="outlined" label={post.numberOfComments} sx={{
                    border: 'none',
                    boxShadow: 'none',
                }} />
            </Box>
        </StyledCard>
    )
}

export default PostItem;