import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {Box, Avatar, Typography, Button, Card, CircularProgress, Chip} from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

function UserProfilePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, authToken } = useSelector((state) => state.user);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/users/${id}`, {
                    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
                });
                setUserData(response.data.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
            setLoading(false);
        };
        fetchUserData();
    }, [id, authToken]);

    if (loading) {
        return (
            <Box sx={{ textAlign: 'center', mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Card sx={{ padding: 4, maxWidth: 400, textAlign: 'center' }}>
                <Avatar
                    src={`http://localhost:8080/profile-pictures/${userData.profilePicture}`}
                    alt={userData.fullName || userData.login}
                    sx={{ width: 100, height: 100, margin: '0 auto' }}
                />
                <Typography variant="h5" sx={{ mt: 2 }}>
                    {userData.fullName}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    {userData.login}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {userData.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Role: {userData.role}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Rating: {userData.rating}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    {user?.id === userData.id && (
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3 }}
                            component={RouterLink}
                            to={`/users/${id}/edit`}
                        >
                            Edit Profile
                        </Button>
                    )}
                </Box>
                {user?.role === 'admin' && (
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Chip
                            icon={<AdminPanelSettingsIcon />}
                            color="primary"
                            variant="outlined"
                            label="Edit in Admin Panel"
                            sx={{
                                border: 'none',
                                boxShadow: 'none',
                                mt: 2
                            }}
                            href={`http://localhost:8080/admin/resources/users/records/${userData.id}/show`}
                            component="a"
                            clickable
                            target="_blank"
                        />
                    </Box>
                )}
            </Card>
        </Box>
    );
}

export default UserProfilePage;