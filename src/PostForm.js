import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Select, MenuItem, FormControl, InputLabel, Checkbox, ListItemText } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate} from "react-router-dom";

function PostForm({ post, onSubmit, onDelete }) {
    const navigate = useNavigate();
    const { authToken } = useSelector((state) => state.user);
    const [title, setTitle] = useState(post?.title || '');
    const [content, setContent] = useState(post?.content || '');
    const [status, setStatus] = useState(post?.status || 'active');
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState(post?.categories || []);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/categories/');
                setCategories(response.data.data);

                if (post && post.categories) {
                    const initialSelectedCategories = response.data.data.filter(category =>
                        post.categories.some(selected => selected.id === category.id)
                    );
                    setSelectedCategories(initialSelectedCategories);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const payload = {
            title,
            content,
            status,
            categories: selectedCategories.map(category => category.id).join(','),
        };

        try {
            await onSubmit(payload);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const validationErrors = error.response.data.validationErrors;
                const newErrors = {};
                validationErrors.forEach((err) => {
                    newErrors[err.path] = err.msg;
                });
                setErrors(newErrors);
            }
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 500, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                {post ? 'Edit Post' : 'Create Post'}
            </Typography>
            <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                margin="normal"
                required
                error={!!errors.title}
                helperText={errors.title}
            />
            <TextField
                label="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                fullWidth
                margin="normal"
                required
                multiline
                rows={6}
                error={!!errors.content}
                helperText={errors.content}
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    label="Status"
                >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel>Categories</InputLabel>
                <Select
                    multiple
                    value={selectedCategories}
                    onChange={(e) => setSelectedCategories(e.target.value)}
                    renderValue={(selected) => selected.map(cat => cat.title).join(', ')}
                >
                    {categories.map((category) => (
                        <MenuItem key={category.id} value={category}>
                            <Checkbox checked={selectedCategories.includes(category)} />
                            <ListItemText primary={category.title} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Box mt={2}>
                <Button variant="contained" color="default" fullWidth onClick={() => navigate(-1)}>
                    Back
                </Button>
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} fullWidth>
                    Save
                </Button>
                {onDelete && (
                    <Button variant="outlined" color="error" onClick={onDelete} sx={{ mt: 2 }} fullWidth>
                        Delete
                    </Button>
                )}
            </Box>
        </Box>
    );
}

export default PostForm;