import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Avatar, IconButton } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser } from '../store/userSlice';

function UserEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, authToken } = useSelector((state) => state.user);

    const [formData, setFormData] = useState({
        fullName: '',
        password: '',
        password_confirm: '',
    });
    const [avatar, setAvatar] = useState(null);
    const [userData, setUserData] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/users/${id}`, {
                    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
                });
                setUserData(response.data.data);
                setFormData((prevData) => ({
                    ...prevData,
                    fullName: response.data.data.fullName,
                }));
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [id, authToken]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleAvatarChange = (e) => {
        setAvatar(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const payload = { fullName: formData.fullName };

        if (formData.password) {
            payload.password = formData.password;
            payload.password_confirm = formData.password_confirm;
        }

        try {
            const response = await axios.patch(`http://localhost:8080/api/users/${id}`, payload, {
                headers: { Authorization: `Bearer ${authToken}` },
            });

            dispatch(setUser({
                authToken,
                user: {
                    ...user,
                    fullName: response.data.data.fullName,
                },
            }));

            navigate(`/users/${id}`);
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

    const handleAvatarSubmit = async () => {
        if (!avatar) return;

        const formData = new FormData();
        formData.append('profilePicture', avatar);

        try {
            const response = await axios.patch(`http://localhost:8080/api/users/${id}/avatar`, formData, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            dispatch(setUser({
                authToken,
                user: {
                    ...user,
                    profilePicture: response.data.data.profilePicture,
                },
            }));

            navigate(`/users/${id}`);
        } catch (error) {
            console.error('Error uploading avatar:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom align="center">
                Edit Profile
            </Typography>
            <Avatar
                src={`http://localhost:8080/profile-pictures/${userData.profilePicture}`}
                alt={userData.fullName || userData.login}
                sx={{ width: 250, height: 250, mt: 2 }}
            />
            <IconButton component="label" sx={{ mt: 2 }}>
                <input type="file" hidden onChange={handleAvatarChange} />
                <Typography>Upload New Avatar</Typography>
            </IconButton>
            <Button onClick={handleAvatarSubmit} variant="contained" sx={{ mt: 2 }}>
                Save Avatar
            </Button>
            <TextField
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                error={!!errors.fullName}
                helperText={errors.fullName}
            />
            <TextField
                label="New Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.password}
                helperText={errors.password}
            />
            <TextField
                label="Confirm Password"
                name="password_confirm"
                type="password"
                value={formData.password_confirm}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.password_confirm}
                helperText={errors.password_confirm}
            />
            <Box mt={2}>
                <Button variant="contained" color="default" fullWidth onClick={() => navigate(-1)}>
                    Back
                </Button>
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} fullWidth>
                    Save Changes
                </Button>
            </Box>
        </Box>
    );
}

export default UserEditPage;