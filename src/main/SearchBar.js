import React, { useState, useCallback } from 'react';
import { Box, TextField, InputAdornment, List, ListItem, ListItemText, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const navigate = useNavigate();

    const handleSearchChange = useCallback((event) => {
        const query = event.target.value;
        setSearchQuery(query);
        const trimmedQuery = query.trim();

        if (trimmedQuery.length >= 3) {
            searchPosts(trimmedQuery);
        } else {
            setShowResults(false);
        }
    }, []);

    const searchPosts = useCallback(async (query) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/posts/`, {
                params: { title: query },
            });
            setSearchResults(response.data.data || []);
            setShowResults(true);
        } catch (error) {
            console.error("Error fetching search results:", error);
            setSearchResults([]);
            setShowResults(true);
        }
    }, []);

    const handleResultClick = (postId) => {
        navigate(`/posts/${postId}`);
        setShowResults(false);
        setSearchQuery('');
    };

    const highlightText = (text, highlight) => {
        const parts = text.split(new RegExp(`(${highlight})`, 'gi')); // Розбиваємо текст на частини
        return parts.map((part, index) =>
            part.toLowerCase() === highlight.toLowerCase() ? (
                <Typography
                    key={index}
                    component="span"
                    color="primary"
                    fontWeight="bold"
                >
                    {part}
                </Typography>
            ) : (
                part
            )
        );
    };

    return (
        <Box sx={{ position: 'relative', flexGrow: 1 }}>
            <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') e.preventDefault();
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color={searchQuery.trim() ? "primary" : "inherit"} />
                        </InputAdornment>
                    ),
                }}
                sx={{
                    backgroundColor: 'white',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'rgba(0, 0, 0, 0.2)',
                        },
                    },
                }}
            />
            {showResults && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        bgcolor: 'background.paper',
                        color: 'text.primary',
                        boxShadow: 3,
                        zIndex: 10,
                        borderRadius: 1,
                        mt: 1,
                        maxHeight: 200,
                        overflowY: 'auto',
                    }}
                >
                    <List>
                        {searchResults.length > 0 ? (
                            searchResults.map((post) => (
                                <ListItem
                                    key={post.id}
                                    button
                                    onClick={() => handleResultClick(post.id)}
                                >
                                    <ListItemText
                                        primary={highlightText(post.title, searchQuery.trim())}
                                    />
                                </ListItem>
                            ))
                        ) : (
                            <ListItem>
                                <ListItemText primary="No posts found" />
                            </ListItem>
                        )}
                    </List>
                </Box>
            )}
        </Box>
    );
};

export default React.memo(SearchBar);