import React, {useEffect, useState} from 'react';
import PostList from './PostList';
import Grid from "@mui/material/Grid2";
import {Box, Chip} from "@mui/material";
import Filters from "./Filters";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import {Link as RouterLink} from "react-router-dom";
import axios from "axios";


const HomePagePostItem = ({post}) => {
    return (
        <ListItem alignItems="flex-start" component={RouterLink} to={`/posts/${post.id}/`} sx={{
            textDecoration: 'none',
            color: 'black'
        }}>
            <ListItemAvatar>
                <Avatar
                    key={post.author.id}
                    alt={post.author.login}
                    src={'http://localhost:8080/profile-pictures/' + post.author.profilePicture}
                    component={RouterLink} to={`/users/${post.author.id}/`}
                />
            </ListItemAvatar>
            <ListItemText
                primary={post.title}
                secondary={
                    <React.Fragment>
                        <Box sx={{ mt: 1 }}>
                            {post.categories.map((category) => (
                                <Chip
                                    key={category.id}
                                    label={category.title}
                                    component={RouterLink}
                                    to={`/categories/${category.id}/posts`}
                                    clickable
                                    sx={{ mr: 1, mb: 1 }}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                />
                            ))}
                        </Box>
                    </React.Fragment>
                }
            />
        </ListItem>
    );
};


function HomePage() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPostsForHomePage = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/posts/?showOnHomepage=1&status=active&sortBy=rating:desc`);
                setPosts(response.data.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchPostsForHomePage();
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Grid container spacing={1}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <div>
                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            {posts.map((post, index) => (
                                (index === 0 || index === 1) && (
                                    <HomePagePostItem key={post.id} post={post} />
                                )
                            ))}
                        </List>
                    </div>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <div>
                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            {posts.map((post, index) => (
                                (index === 2 || index === 3) && (
                                    <HomePagePostItem key={post.id} post={post} />
                                )
                            ))}
                        </List>
                    </div>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <div>
                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            {posts.map((post, index) => (
                                (index === 4 || index === 5) && (
                                    <HomePagePostItem key={post.id} post={post} />
                                )
                            ))}
                        </List>
                    </div>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Filters/>
                <PostList/>
            </Grid>
        </Box>

    );
}

export default HomePage;