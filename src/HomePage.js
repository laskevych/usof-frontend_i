import React from 'react';
import PostList from './PostList';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import {Box, Pagination} from "@mui/material";
import PostItem from "./PostItem";
import Filters from "./Filters";

function HomePage() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div>
                <Typography variant="h1" gutterBottom>
                    Blog
                </Typography>
                <Typography>Stay in the loop with the latest about our products</Typography>
            </div>
            <Grid container spacing={2}>
                <Filters/>
                <PostList/>
            </Grid>
        </Box>

    );
}

export default HomePage;