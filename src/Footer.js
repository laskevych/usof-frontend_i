import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
    return (
        <Box sx={{ mt: 'auto', py: 2, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
            <Typography variant="body2" color="textSecondary">
                © {new Date().getFullYear()} USOF
            </Typography>
        </Box>
    );
}

export default Footer;