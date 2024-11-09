import React, { useContext } from 'react';
import {List, ListItem, ListItemText, Divider, Typography, Box, Button} from '@mui/material';
import { AuthContext } from './auth/AuthContext';
import { Link as RouterLink } from 'react-router-dom';

function Sidebar() {
    const { authToken } = useContext(AuthContext);

    return (
        <Box sx={{ width: '20%', p: 2, borderRight: '1px solid #ddd' }}>
            <Typography variant="h6" gutterBottom>Filters</Typography>
            {/* Place filter inputs here */}
            <Button variant="contained" fullWidth sx={{ mb: 1 }}>Apply</Button>
            <Button variant="outlined" fullWidth>Reset</Button>
        </Box>
        // <List component="nav">
        //     <ListItem button component={RouterLink} to="/?sortBy=creationAt-desc">
        //         <ListItemText primary="Latest Posts" />
        //     </ListItem>
        //     <ListItem button component={RouterLink} to="/?sortBy=likes-desc">
        //         <ListItemText primary="Popular Posts" />
        //     </ListItem>
        //     <ListItem button component={RouterLink} to="/?showOnHomepage=1">
        //         <ListItemText primary="TOP Posts" />
        //     </ListItem>
        //     {authToken && (
        //         <ListItem button component={RouterLink} to="/favorites">
        //             <ListItemText primary="Favorite Posts" />
        //         </ListItem>
        //     )}
        //     <ListItem button component={RouterLink} to="/categories">
        //         <ListItemText primary="Categories" />
        //     </ListItem>
        //     <Divider />
        // </List>
    );
}

export default Sidebar;