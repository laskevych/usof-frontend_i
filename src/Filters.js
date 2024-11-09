import React, { useState, useEffect } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Button, TextField, Checkbox, ListItemText, OutlinedInput } from '@mui/material';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

function Filters() {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [status, setStatus] = useState('');
    const [creationAtStart, setCreationAtStart] = useState('');
    const [creationAtEnd, setCreationAtEnd] = useState('');
    const [sortBy, setSortBy] = useState('');

    const location = useLocation();
    const navigate = useNavigate();

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/categories/');
            setCategories(response.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();

        // Ініціалізуємо фільтри з URL
        const queryParams = new URLSearchParams(location.search);
        setStatus(queryParams.get('status') || '');
        setSelectedCategories(queryParams.get('categories') ? queryParams.get('categories').split(',') : []);
        setCreationAtStart(queryParams.get('creationAtStart') || '');
        setCreationAtEnd(queryParams.get('creationAtEnd') || '');
        setSortBy(queryParams.get('sortBy') || '');
    }, []);

    const handleFilterApply = () => {
        const queryParams = new URLSearchParams();

        if (status) queryParams.set('status', status);
        if (selectedCategories.length > 0) queryParams.set('categories', selectedCategories.join(','));
        if (creationAtStart) queryParams.set('creationAtStart', creationAtStart);
        if (creationAtEnd) queryParams.set('creationAtEnd', creationAtEnd);
        if (sortBy) queryParams.set('sortBy', sortBy);

        navigate(`/?${queryParams.toString()}`);
    };

    const handleFilterReset = () => {
        setStatus('');
        setSelectedCategories([]);
        setCreationAtStart('');
        setCreationAtEnd('');
        setSortBy('');
        navigate('/');
    };

    return (
        <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2 }}>
                    <FormControl size="small" fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={status}
                            label="Status"
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <MenuItem value="">Any</MenuItem>
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2 }}>
                    <FormControl size="small" fullWidth>
                        <InputLabel>Categories</InputLabel>
                        <Select
                            multiple
                            value={selectedCategories}
                            onChange={(e) => setSelectedCategories(e.target.value)}
                            input={<OutlinedInput label="Categories" />}
                            renderValue={(selected) =>
                                categories
                                    .filter((cat) => selected.includes(String(cat.id)))
                                    .map((cat) => cat.title)
                                    .join(', ')
                            }
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={String(category.id)}>
                                    <Checkbox checked={selectedCategories.includes(String(category.id))} />
                                    <ListItemText primary={category.title} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2 }}>
                    <FormControl size="small" fullWidth>
                        <TextField
                            label="Creation Date Start"
                            type="date"
                            value={creationAtStart}
                            onChange={(e) => setCreationAtStart(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </FormControl>
                    <FormControl size="small" fullWidth>
                        <TextField
                            label="Creation Date End"
                            type="date"
                            value={creationAtEnd}
                            onChange={(e) => setCreationAtEnd(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </FormControl>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <FormControl size="small" fullWidth>
                        <InputLabel>Sort</InputLabel>
                        <Select
                            value={sortBy}
                            label="Sort By"
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="creationAt-asc">Creation Date ↑</MenuItem>
                            <MenuItem value="creationAt-desc">Creation Date ↓</MenuItem>
                            <MenuItem value="likes-asc">Likes ↑</MenuItem>
                            <MenuItem value="likes-desc">Likes ↓</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button fullWidth variant="contained" onClick={handleFilterApply}>
                        Apply
                    </Button>
                    <Button fullWidth variant="outlined" onClick={handleFilterReset}>
                        Reset
                    </Button>
                </Box>
            </Box>
        </Grid>
    );
}

export default Filters;