import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignInPage from './auth/SignInPage';
import SignUpPage from './auth/SignUpPage';
import ConfirmEmailPage from './auth/ConfirmEmailPage';
import MainPage from './main/MainPage';
import { AuthProvider } from './auth/AuthContext';
import PasswordResetRequestPage from "./auth/PasswordResetRequestPage";
import PasswordResetConfirmPage from "./auth/PasswordResetConfirmPage";
import Footer from "./main/Footer";
import Header from "./main/Header";
import {Box, Container} from "@mui/material";
import PostPage from "./post/PostPage";
import CategoryPage from "./category/CategoryPage";
import PostEditPage from "./post/PostEditPage";
import PostCreatePage from "./post/PostCreatePage";
import UserProfilePage from "./user/UserProfilePage";
import UserEditPage from "./user/UserEditPage";
import ProtectedRoute from './route/ProtectedRoute';
import AuthorRoute from './route/AuthorRoute';
import ProfileOwnerRoute from './route/ProfileOwnerRoute';
import GuestRoute from "./route/GuestRoute";
import NotFoundPage from './route/NotFoundPage';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '100vh',
                    }}
                >
                    <Header />
                    <Container
                        maxWidth="md"
                        component="main"
                        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
                    >
                        <Routes>
                            <Route
                                path="/sign-in"
                                element={
                                    <GuestRoute>
                                        <SignInPage />
                                    </GuestRoute>
                                }
                            />
                            <Route
                                path="/sign-up"
                                element={
                                    <GuestRoute>
                                        <SignUpPage />
                                    </GuestRoute>
                                }
                            />
                            <Route
                                path="/confirm-email/:confirm_token"
                                element={
                                    <GuestRoute>
                                        <ConfirmEmailPage />
                                    </GuestRoute>
                                }
                            />
                            <Route
                                path="/password-reset"
                                element={
                                    <GuestRoute>
                                        <PasswordResetRequestPage />
                                    </GuestRoute>
                                }
                            />
                            <Route
                                path="/password-reset/:confirm_token"
                                element={
                                    <GuestRoute>
                                        <PasswordResetConfirmPage />
                                    </GuestRoute>
                                }
                            />

                            <Route path="/" element={<MainPage />} />
                            <Route path="/posts/:id" element={<PostPage />} />
                            <Route path="/categories/:id/posts" element={<CategoryPage />} />
                            <Route path="/users/:id" element={<UserProfilePage />} />

                            <Route
                                path="/posts/create/"
                                element={
                                    <ProtectedRoute>
                                        <PostCreatePage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/posts/:id/edit"
                                element={
                                    <ProtectedRoute>
                                        <AuthorRoute>
                                            <PostEditPage />
                                        </AuthorRoute>
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/users/:id/edit"
                                element={
                                    <ProtectedRoute>
                                        <ProfileOwnerRoute>
                                            <UserEditPage />
                                        </ProfileOwnerRoute>
                                    </ProtectedRoute>
                                }
                            />

                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </Container>
                    <Footer />
                </Box>
            </Router>
        </AuthProvider>
    );
}

export default App;