import React, { useState, useContext } from 'react';
import { styled } from '@mui/material/styles';
import {Container, TextField, Button, Typography, Link, Box, Grid2 as Grid} from '@mui/material';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

const StyledContainer = styled(Container)(({ theme }) => ({
    display: 'flex',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default,
}));

const StyledForm = styled('form')(({ theme }) => ({
    width: '100%',
    maxWidth: 400,
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
}));

function SignInPage() {
    const [formData, setFormData] = useState({
        login: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const { authToken, setAuthToken } = useContext(AuthContext);
    const navigate = useNavigate();

    // Якщо користувач вже авторизований, перенаправляємо на головну сторінку
    if (authToken) {
        return <Navigate to="/" />;
    }

    // Обробка змін у полях вводу
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Обробка відправки форми
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Очищення попередніх помилок

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', formData);

            if (response.status === 200) {
                // Логін успішний, зберігаємо токен та перенаправляємо користувача
                setAuthToken(response.data.accessToken);
                navigate('/'); // Перенаправляємо на головну сторінку
            }
        } catch (error) {
            if (error.response && error.response.data) {
                // Обробка помилок валідації
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
                // Обробка інших помилок (наприклад, мережевих)
                console.error('Login error:', error);
            }
        }
    };

    return (
        <StyledContainer>
            <StyledForm onSubmit={handleSubmit}>
                <Typography variant="h5" align="center" gutterBottom>
                    Sign in
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
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2 }}
                >
                    Sign in
                </Button>

                <Grid container spacing={2} sx={{ mt: 3 }}>
                    <Grid size={12}>
                        <Box>
                            <Typography align="center">
                                <Link href="/password-reset">Forgot your password?</Link>
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </StyledForm>
        </StyledContainer>
    );
}

export default SignInPage;