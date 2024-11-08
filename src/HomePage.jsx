import React, { useContext } from 'react';
import { styled } from '@mui/material/styles';
import { Container, Typography, Button } from '@mui/material';
import { AuthContext } from './auth/AuthContext';

const StyledContainer = styled(Container)(({ theme }) => ({
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default,
}));

function HomePage() {
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
    };

    return (
        <StyledContainer>
            <Typography variant="h4" align="center" gutterBottom>
                Ви авторизовані! Хаха!
            </Typography>
            <Button variant="contained" onClick={handleLogout} sx={{ mt: 2 }}>
                Вийти
            </Button>
        </StyledContainer>
    );
}

export default HomePage;