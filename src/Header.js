import React, { useContext } from 'react';
import {
    AppBar,
    Toolbar,
    Button,
    Avatar,
    IconButton,
    Container,
    Box,
    alpha,
    Drawer,
    MenuItem, Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {styled} from "@mui/material/styles";
import { useDispatch, useSelector } from 'react-redux';
import Typography from "@mui/material/Typography";
import LogoutIcon from '@mui/icons-material/Logout';
import { logout } from './store/userSlice';
import WbCloudyIcon from '@mui/icons-material/WbCloudy';
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

function Header() {
    const { authToken, user } = useSelector((state) => state.user);

    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const StyledToolbar = styled(Toolbar)(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
        backdropFilter: 'blur(24px)',
        border: '1px solid',
        borderColor: (theme.vars || theme).palette.divider,
        backgroundColor: theme.vars
            ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
            : alpha(theme.palette.background.default, 0.4),
        boxShadow: (theme.vars || theme).shadows[1],
        padding: '8px 12px',
    }));

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <AppBar
            position="fixed"
            enableColorOnDark
            sx={{
                boxShadow: 0,
                bgcolor: 'transparent',
                backgroundImage: 'none',
                mt: 'calc(var(--template-frame-height, 0px) + 28px)',
            }}
        >
            <Container maxWidth="lg">
                <StyledToolbar variant="dense" disableGutters>
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
                        <WbCloudyIcon color="primary" fontSize="large"/>
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <Button variant="text" color="info" size="small" component={RouterLink} to={`/`}>
                                Tech_Cloud
                            </Button>
                            {authToken && user?.role === 'admin' && (
                                <Button variant="text" color="secondary" size="large" href="http://localhost:8080/admin" target="_blank" startIcon={<AdminPanelSettingsIcon fontSize="large" color="secondary"/>}>
                                    Admin Panel
                                </Button>
                            )}
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            gap: 1,
                            alignItems: 'center',
                        }}
                    >
                    {authToken && user ? (
                        <>
                            <Box sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'black' }}>
                                <IconButton component={RouterLink} to={`/users/${user.id}`} sx={{ p: 0 }}>
                                    <Avatar alt={user.login} src={`http://localhost:8080/profile-pictures/${user.profilePicture}`} />
                                </IconButton>
                                <Typography variant="body2" sx={{ml: 1}}>
                                    {user.fullName || user.login}
                                </Typography>
                                <IconButton onClick={handleLogout} color="inherit">
                                    <LogoutIcon />
                                </IconButton>
                            </Box>
                        </>
                        ) : (
                        <>
                            <Button color="primary" variant="text" size="small" component={RouterLink} to={`/sign-in/`}>
                                Sign in
                            </Button>
                            <Button color="primary" variant="contained" size="small" component={RouterLink} to={`/sign-up/`}>
                                Sign up
                            </Button>
                        </>
                        )}
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
                        <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                        <Drawer
                            anchor="top"
                            open={open}
                            onClose={toggleDrawer(false)}
                            PaperProps={{
                                sx: {
                                    top: 'var(--template-frame-height, 0px)',
                                },
                            }}
                        >
                            <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    <IconButton onClick={toggleDrawer(false)}>
                                    </IconButton>
                                </Box>

                                <MenuItem component={RouterLink} to={`/`}>Posts</MenuItem>
                                {authToken && user?.role === 'admin' && (
                                    <MenuItem href="http://localhost:8080/admin" target="_blank">Admin Panel</MenuItem>
                                )}
                                <Divider sx={{ my: 3 }} />
                                {authToken && user ? (
                                    <>
                                        <MenuItem component={RouterLink} to={`/users/${user.id}`} onClick={toggleDrawer(false)} sx={{color: "black"}}>
                                            <Avatar alt={user.login} src={`http://localhost:8080/profile-pictures/${user.profilePicture}`} sx={{ mr: 1 }} />
                                            {user.fullName || user.login}
                                        </MenuItem>
                                        <MenuItem onClick={handleLogout} sx={{color: "black"}}>
                                            <LogoutIcon sx={{ mr: 1 }} />
                                            Logout
                                        </MenuItem>
                                    </>
                                ) : (
                                    <>
                                        <MenuItem>
                                            <Button color="primary" variant="contained" fullWidth component={RouterLink} to="/sign-up" onClick={toggleDrawer(false)}>
                                                Sign up
                                            </Button>
                                        </MenuItem>
                                        <MenuItem>
                                            <Button color="primary" variant="outlined" fullWidth component={RouterLink} to="/sign-in" onClick={toggleDrawer(false)}>
                                                Sign in
                                            </Button>
                                        </MenuItem>
                                    </>
                                )}
                            </Box>
                        </Drawer>
                    </Box>
                </StyledToolbar>
            </Container>
        </AppBar>
    );
}

export default Header;