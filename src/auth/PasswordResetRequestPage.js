import React, { useState, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { Container, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { Navigate } from 'react-router-dom';

const StyledContainer = styled(Container)(({ theme }) => ({
    display: 'flex',
    minHeight: '50vh',
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

function PasswordResetRequestPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { authToken } = useContext(AuthContext);

    // Якщо користувач авторизований, перенаправляємо на головну сторінку
    if (authToken) {
        return <Navigate to="/" />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.post('http://localhost:8080/api/auth/password-reset/', { email });

            if (response.status === 200) {
                setMessage('An email has been sent to you to reset your password.');
            }
        } catch (error) {
            setError('Email not found.');
        }
    };

    return (
        <StyledContainer>
            <StyledForm onSubmit={handleSubmit}>
                <Typography variant="h5" align="center" gutterBottom>
                    Password Reset
                </Typography>

                {message && (
                    <Typography variant="body1" align="center" color="success.main" gutterBottom>
                        {message}
                    </Typography>
                )}

                {error && (
                    <Typography variant="body1" align="center" color="error.main" gutterBottom>
                        {error}
                    </Typography>
                )}

                {!message && (
                    <>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2 }}
                        >
                            Submit
                        </Button>
                    </>
                )}
            </StyledForm>
        </StyledContainer>
    );
}

export default PasswordResetRequestPage;