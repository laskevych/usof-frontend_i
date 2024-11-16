import React, { useState, useContext } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Container, TextField, Button, Typography, Link } from '@mui/material';
import axios from 'axios';
import { AuthContext } from './AuthContext';

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

function PasswordResetConfirmPage() {
    const { confirm_token } = useParams();
    const [formData, setFormData] = useState({
        password: '',
        password_confirm: '',
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
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
        setMessage('');

        try {
            const response = await axios.post(
                `http://localhost:8080/api/auth/password-reset/${confirm_token}`,
                formData
            );

            if (response.status === 200) {
                setMessage('success');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
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
                setMessage('An error occurred. Please try again.');
            }
        }
    };

    return (
        <StyledContainer>
            <StyledForm onSubmit={handleSubmit}>
                <Typography variant="h5" align="center" gutterBottom>
                    Reset Password
                </Typography>

                {message === 'success' && (
                    <Typography variant="body1" align="center" color="success.main" gutterBottom>
                        Your password has been changed. You can{' '}
                        <Link href="/sign-in/">
                            log in
                        </Link>
                        .
                    </Typography>
                )}

                {message && message !== 'success' && (
                    <Typography variant="body1" align="center" color="error.main" gutterBottom>
                        {message}
                    </Typography>
                )}

                {!message && (
                    <>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="New Password"
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
                            label="Confirm New Password"
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
                            Submit
                        </Button>
                    </>
                )}
            </StyledForm>
        </StyledContainer>
    );
}

export default PasswordResetConfirmPage;