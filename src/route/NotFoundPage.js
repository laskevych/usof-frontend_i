import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function NotFoundPage() {
    return (
        <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Typography variant="h1" component="h2" sx={{ fontSize: '3rem', mb: 2 }}>
                404
            </Typography>
            <Typography variant="h5" sx={{ mb: 3 }}>
                Page not found
            </Typography>
            <Button variant="contained" color="primary" component={RouterLink} to="/">
                Go to main page
            </Button>
        </Box>
    );
}

export default NotFoundPage;