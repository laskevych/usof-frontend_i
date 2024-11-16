import React from 'react';
import { Box, Typography } from '@mui/material';
import WbCloudyIcon from '@mui/icons-material/WbCloudy';

function Footer() {
    return (
        <Box sx={{ mt: 'auto', py: 2, textAlign: 'center', backgroundColor: '#f5f5f5', flex: 'row' }}>
            <WbCloudyIcon color="primary" fontSize="large"/>
            <Typography variant="body2" color="textSecondary" gutterBottom>
                © {new Date().getFullYear()} Tech_Cloud
            </Typography>
        </Box>
    );
}

export default Footer;