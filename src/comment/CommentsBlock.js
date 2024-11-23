import React, { useState, useEffect } from 'react';
import {Box, Avatar, Typography, IconButton, TextField, Button, Tooltip, AvatarGroup} from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import AddIcon from "@mui/icons-material/Add";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import ReplyIcon from '@mui/icons-material/Reply';
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' ' +
        date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

const CommentItem = ({ comment, post, onCommentUpdate, onDelete, updateCommentInState, level }) => {
    const { authToken, user } = useSelector((state) => state.user);
    const [likes, setLikes] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [content, setContent] = useState(comment.content);
    const userHasLiked = likes.some(like => like.type === 'like' && like.author.id === user?.id);
    const userHasDisliked = likes.some(like => like.type === 'dislike' && like.author.id === user?.id);
    const userCanSetHelpful = !comment.isHelpful && post.author.id === user?.id;

    const [showReplyForm, setShowReplyForm] = useState(false); // State для форми відповіді
    const [replyContent, setReplyContent] = useState(''); // State для тексту відповіді

    const fetchLikes = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/comments/${comment.id}/like`);
            setLikes(response.data.data);
        } catch (error) {
            console.error('Error fetching likes:', error);
        }
    };

    useEffect(() => {
        fetchLikes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [comment.id]);

    const handleLike = async () => {
        if (!authToken) return;
        try {
            if (userHasLiked) {
                const likeId = likes.find((like) => like.type === 'like' && like.author.id === user.id).id;
                await axios.delete(`http://localhost:8080/api/comments/${comment.id}/like/${likeId}`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
            } else {
                await axios.post(`http://localhost:8080/api/comments/${comment.id}/like`, { type: 'like' }, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
            }
            await fetchLikes();
        } catch (error) {
            console.error('Error handling like:', error);
        }
    };

    const handleDislike = async () => {
        if (!authToken) return;
        try {
            if (userHasDisliked) {
                const dislikeId = likes.find((like) => like.type === 'dislike' && like.author.id === user.id).id;
                await axios.delete(`http://localhost:8080/api/comments/${comment.id}/like/${dislikeId}`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
            } else {
                await axios.post(`http://localhost:8080/api/comments/${comment.id}/like`, { type: 'dislike' }, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
            }
            await fetchLikes();
        } catch (error) {
            console.error('Error handling dislike:', error);
        }
    };

    const handleSave = async () => {
        try {
            await axios.patch(`http://localhost:8080/api/comments/${comment.id}`, { content }, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setEditMode(false);
            onCommentUpdate();
        } catch (error) {
            console.error('Error saving comment:', error);
        }
    };

    const handleDisable = async () => {
        try {
            await axios.patch(`http://localhost:8080/api/comments/${comment.id}`, { content, status: 'inactive' }, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            updateCommentInState(comment.id, { status: 'inactive' });
        } catch (error) {
            console.error('Error saving comment:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/comments/${comment.id}`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            onDelete();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleHelpful = async () => {
        try {
            await axios.patch(`http://localhost:8080/api/comments/${comment.id}/setHelpful`, {}, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            updateCommentInState(comment.id, { isHelpful: true });
        } catch (error) {
            console.error('Error marking comment as helpful:', error);
        }
    };

    const handleAddReply = async () => {
        if (!replyContent.trim()) return;
        try {
            const response = await axios.post(`http://localhost:8080/api/posts/${post.id}/comments`, {
                content: replyContent,
                commentId: comment.id,
            }, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            updateCommentInState(comment.id, {
                comments: [...(comment.comments || []), response.data.data]
            });
            setReplyContent('');
            setShowReplyForm(false);
        } catch (error) {
            console.error('Error adding reply:', error);
        }
    };

    return (
        <Box sx={{ border: '1px solid #ddd', p: 2, borderRadius: 1, mb: 2, opacity: comment.status === 'inactive' ? 0.5 : 1 }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    alignItems: 'center',
                    mb: 2
                }}
            >
                <Box
                    sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
                    component={RouterLink}
                    to={`/users/${comment.author.id}/`}
                >
                    <Avatar
                        key={comment.author.id}
                        alt={comment.author.login}
                        src={'http://localhost:8080/profile-pictures/' + comment.author.profilePicture}
                        sx={{ width: 24, height: 24 }}
                    />
                    <Typography variant="caption">
                        {comment.author.fullName || comment.author.login}
                    </Typography>
                </Box>
                <Typography>•</Typography>
                <Typography variant="caption">{formatTimestamp(comment.creationAt)}</Typography>
            </Box>
            {editMode ? (
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                        fullWidth
                        multiline
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        size="small"
                    />
                </Box>
            ) : (
                <Typography variant="body2">{content}</Typography>
            )}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        onClick={handleLike}
                        disabled={!authToken}
                        size="small"
                    >
                        {userHasLiked ? <ThumbUpIcon color="primary"/> : <ThumbUpOutlinedIcon />}
                    </IconButton>
                    <AvatarGroup total={likes.filter(like => like.type === 'like').length} spacing="medium" max="3" sx={{
                        '& .MuiAvatar-root': {
                            width: 24,
                            height: 24,
                            fontSize: '0.8rem'
                        }
                    }}>
                        {likes
                            .filter(like => like.type === 'like')
                            .sort((a, b) => b.id - a.id)
                            .map((like) => (
                                <Avatar
                                    key={like.id}
                                    alt={like.author.login}
                                    src={`http://localhost:8080/profile-pictures/${like.author.profilePicture}`}
                                    sx={{ width: 24, height: 24 }}
                                />
                            ))
                        }
                    </AvatarGroup>

                    <IconButton
                        onClick={handleDislike}
                        disabled={!authToken}
                    >
                        {userHasDisliked ? <ThumbDownIcon color="error" /> : <ThumbDownOffAltIcon />}
                    </IconButton>
                    <AvatarGroup total={likes.filter(like => like.type === 'dislike').length} spacing="medium" max="3" sx={{
                        '& .MuiAvatar-root': {
                            width: 24,
                            height: 24,
                            fontSize: '0.8rem'
                        }
                    }}>
                        {likes
                            .filter(like => like.type === 'dislike')
                            .sort((a, b) => b.id - a.id)
                            .map((like) => (
                                <Avatar
                                    key={like.id}
                                    alt={like.author.login}
                                    src={`http://localhost:8080/profile-pictures/${like.author.profilePicture}`}
                                    sx={{ width: 24, height: 24 }}
                                />
                            ))
                        }
                    </AvatarGroup>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {userCanSetHelpful ?
                        <Tooltip title="Helpful" placement="top">
                            <Button onClick={handleHelpful} size="small" color="warning">
                                <EmojiEventsOutlinedIcon />
                            </Button>
                        </Tooltip>
                        : (comment.isHelpful || comment.isHelpful === 1) && (
                        <Tooltip title="Helpful" placement="top">
                                <span>
                                    <IconButton disabled size="small">
                                        {comment.isHelpful ? <EmojiEventsIcon color="warning" /> : <EmojiEventsOutlinedIcon />}
                                    </IconButton>
                                </span>
                        </Tooltip>
                    )
                    }
                    {authToken && level < 2 && (
                        <Tooltip title="Reply" placement="top">
                            <Button onClick={() => setShowReplyForm(!showReplyForm)} size="small">
                                <ReplyIcon />
                            </Button>
                        </Tooltip>
                    )}
                    {(user?.id === comment.author.id && !editMode && comment.status === 'active') && (
                        <Tooltip title="Edit" placement="top">
                            <Button onClick={() => setEditMode(!editMode)} size="small" color="default">
                                <EditIcon />
                            </Button>
                        </Tooltip>
                    )}

                    {(user?.id === comment.author.id && editMode) && (
                        <Tooltip title="Save" placement="top">
                            <Button onClick={handleSave} size="small" color="success">
                                <SaveIcon />
                            </Button>
                        </Tooltip>
                    )}

                    {(user?.id === comment.author.id && comment.status === 'active') && (
                        <Tooltip title="Disable" placement="top">
                            <Button onClick={handleDisable} size="small" color="secondary">
                                <VisibilityOffIcon />
                            </Button>
                        </Tooltip>
                    )}

                    {user?.id === comment.author.id && (
                        <Tooltip title="Delete" placement="top">
                            <Button onClick={handleDelete} size="small" color="error">
                                <DeleteIcon />
                            </Button>
                        </Tooltip>
                    )}

                    {(user?.role === 'admin') && (
                        <Tooltip title="Edit in Admin Panel" placement="top">
                            <Button
                                size="small"
                                color="secondary"
                                href={`http://localhost:8080/admin/resources/comments/records/${comment.id}/show`}
                                component="a"
                                clickable
                                target="_blank"
                            >
                                <AdminPanelSettingsIcon />
                            </Button>
                        </Tooltip>
                    )}
                </Box>
            </Box>

            {authToken && (
                <>
                    {showReplyForm && (
                        <Box sx={{ display: 'flex', gap: 1, mt: 1, mb: 1 }}>
                            <TextField
                                fullWidth
                                placeholder="Write reply..."
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                multiline
                                size="small"
                            />
                            <Button onClick={handleAddReply} variant="contained" color="primary" startIcon={<AddIcon />}>Comment</Button>
                        </Box>
                    )}
                </>
            )}

            {comment.comments?.map(reply => (
                level < 2 && (
                    <CommentItem key={reply.id} comment={reply} post={post} onCommentUpdate={onCommentUpdate} onDelete={onDelete} updateCommentInState={updateCommentInState} level={level+1} />
                )
            ))}
        </Box>
    );
};

function CommentsBlock({ post }) {
    const { authToken } = useSelector(state => state.user);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/posts/${post.id}/comments`);
                setComments(response.data.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, [post]);

    const updateCommentInState = (commentId, updatedFields) => {
        setComments(prevComments =>
            prevComments.map(comment =>
                comment.id === commentId
                    ? { ...comment, ...updatedFields }
                    : {
                        ...comment,
                        comments: comment.comments.map(reply =>
                            reply.id === commentId ? { ...reply, ...updatedFields } : reply
                        )
                    }
            )
        );
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            const response = await axios.post(`http://localhost:8080/api/posts/${post.id}/comments`, { content: newComment }, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setComments([response.data.data, ...comments]);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <Box sx={{mt: 2}}>
            {authToken && (
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                        fullWidth
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        multiline
                    />
                    <Button onClick={handleAddComment} variant="contained" color="primary" startIcon={<AddIcon />}>Comment</Button>
                </Box>
            )}
            {comments.map(comment => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    post={post}
                    onCommentUpdate={() => setComments(prev => prev)}
                    onDelete={() => setComments(prev => prev.filter(c => c.id !== comment.id))}
                    updateCommentInState={updateCommentInState}
                    level={1}
                />
            ))}
        </Box>
    );
}

export default CommentsBlock;