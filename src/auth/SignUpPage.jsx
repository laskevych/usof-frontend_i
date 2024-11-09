import React, { useState, useContext } from 'react';
import { styled } from '@mui/material/styles';
import {Container, TextField, Button, Typography, Grid2 as Grid, Box, Link} from '@mui/material';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { Navigate } from 'react-router-dom';

const StyledContainer = styled(Container)(({ theme }) => ({
    display: 'flex',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default,
}));

const StyledForm = styled('form')(({ theme }) => ({
    width: '100%',
    maxWidth: 500,
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
}));

function SignUpPage() {
    const [formData, setFormData] = useState({
        login: '',
        email: '',
        fullName: '',
        password: '',
        password_confirm: '',
    });

    const [errors, setErrors] = useState({});

    const [registeredEmail, setRegisteredEmail] = useState('');

    const { authToken } = useContext(AuthContext);
    if (authToken) {
        return <Navigate to="/" />;
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', formData);

            if (response.status === 201) {
                setRegisteredEmail(response.data.data.email);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                const validationErrors = error.response.data.validationErrors;
                const newErrors = {};

                validationErrors.forEach((err) => {
                    const field = err.path;
                    if (!newErrors[field]) {
                        newErrors[field] = err.msg;
                    }
                });

                setErrors(newErrors);
            } else {
                console.error('Registration error:', error);
            }
        }
    };

    if (registeredEmail.length) {
        return (
            <StyledContainer>
                <Typography variant="h6" align="center">
                    You need to confirm your email address. We sent you an email to {registeredEmail}.
                </Typography>
            </StyledContainer>
        );
    }

    return (
        <StyledContainer>
            <StyledForm onSubmit={handleSubmit}>
                <Typography variant="h5" align="center" gutterBottom>
                    Sign up
                </Typography>

                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="login"
                    label="Login"
                    name="login"
                    autoComplete="username"
                    value={formData.login}
                    onChange={handleChange}
                    error={!!errors.login}
                    helperText={errors.login}
                />

                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                />

                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="fullName"
                    label="Full Name"
                    name="fullName"
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={handleChange}
                    error={!!errors.fullName}
                    helperText={errors.fullName}
                />

                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                />

                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password_confirm"
                    label="Confirm Password"
                    type="password"
                    id="password_confirm"
                    autoComplete="new-password"
                    value={formData.password_confirm}
                    onChange={handleChange}
                    error={!!errors.password_confirm}
                    helperText={errors.password_confirm}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2 }}
                >
                    Sign up
                </Button>

                <Grid container spacing={2} sx={{ mt: 3 }}>
                    <Grid size={12}>
                        <Box>
                            <Typography align="center">
                                Already have an account? <Link href="/sign-in">Sign in</Link>
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </StyledForm>
        </StyledContainer>
    );
}

export default SignUpPage;