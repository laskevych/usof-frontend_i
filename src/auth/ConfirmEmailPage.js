import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {Container, Typography, Button, Box} from '@mui/material';
import axios from 'axios';

const StyledContainer = styled(Container)(({ theme }) => ({
    display: 'flex',
    minHeight: '50vh',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default,
}));

function ConfirmEmailPage() {
    const { confirm_token } = useParams();
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/auth/confirm-email/${confirm_token}`);
                if (response.status === 200) {
                    setMessage('Your email has been successfully confirmed!');
                    setIsError(false);
                }
            } catch (error) {
                setMessage('Invalid email confirmation token.');
                setIsError(true);
            }
        };

        confirmEmail();
    }, [confirm_token]);

    return (
        <StyledContainer>
            <Box>
                <Typography variant="h6" align="center" gutterBottom color="success">
                    {message}
                </Typography>
                {!isError && (
                    <Button
                        variant="contained"
                        component={RouterLink}
                        to="/sign-in"
                        sx={{ mt: 2 }}
                    >
                        Sign in
                    </Button>
                )}
            </Box>
        </StyledContainer>
    );
}

export default ConfirmEmailPage;