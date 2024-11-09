import React, { useContext } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
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
import { AuthContext } from './auth/AuthContext';
import { Link as RouterLink } from 'react-router-dom';
import {styled} from "@mui/material/styles";
import Sitemark from './SitemarkIcon';
function Header() {
    const { authToken, user } = useContext(AuthContext);

    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

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
                        <Sitemark />
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <Button variant="text" color="info" size="small" component={RouterLink} to={`/`}>
                                Posts
                            </Button>
                            {/*<Button variant="text" color="info" size="small">*/}
                            {/*    Testimonials*/}
                            {/*</Button>*/}
                            {/*<Button variant="text" color="info" size="small">*/}
                            {/*    Highlights*/}
                            {/*</Button>*/}
                            {/*<Button variant="text" color="info" size="small">*/}
                            {/*    Pricing*/}
                            {/*</Button>*/}
                            {/*<Button variant="text" color="info" size="small" sx={{ minWidth: 0 }}>*/}
                            {/*    FAQ*/}
                            {/*</Button>*/}
                            {/*<Button variant="text" color="info" size="small" sx={{ minWidth: 0 }}>*/}
                            {/*    Blog*/}
                            {/*</Button>*/}
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
                            <IconButton component={RouterLink} to={`/users/${user.id}`}>
                                <Avatar alt={user.login} src={'/profile-pictures/' + user.profilePicture || '/default-avatar.png'} />
                            </IconButton>
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

                                <MenuItem>Features</MenuItem>
                                <MenuItem>Testimonials</MenuItem>
                                <MenuItem>Highlights</MenuItem>
                                <MenuItem>Pricing</MenuItem>
                                <MenuItem>FAQ</MenuItem>
                                <MenuItem>Blog</MenuItem>
                                <Divider sx={{ my: 3 }} />
                                <MenuItem>
                                    <Button color="primary" variant="contained" fullWidth>
                                        Sign up
                                    </Button>
                                </MenuItem>
                                <MenuItem>
                                    <Button color="primary" variant="outlined" fullWidth>
                                        Sign in
                                    </Button>
                                </MenuItem>
                            </Box>
                        </Drawer>
                    </Box>
                </StyledToolbar>
            </Container>
        </AppBar>
    );
}

export default Header;