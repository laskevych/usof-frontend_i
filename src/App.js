import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignInPage from './auth/SignInPage';
import SignUpPage from './auth/SignUpPage';
import ConfirmEmailPage from './auth/ConfirmEmailPage';
import HomePage from './HomePage';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './auth/AuthContext';
import PasswordResetRequestPage from "./auth/PasswordResetRequestPage";
import PasswordResetConfirmPage from "./auth/PasswordResetConfirmPage";
import PublicRoute from './PublicRoute';
import Footer from "./Footer";
import Header from "./Header";
import {Container} from "@mui/material";
import PostPage from "./PostPage";
import CategoryPage from "./CategoryPage";
import PostEditPage from "./PostEditPage";
import PostCreatePage from "./PostCreatePage";
import UserProfilePage from "./UserProfilePage";
import UserEditPage from "./UserEditPage";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <Container
                    maxWidth="md"
                    component="main"
                    sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
                >
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/posts/:id" element={<PostPage />} />
                        <Route path="/posts/:id/edit" element={<PostEditPage />} />
                        <Route path="/posts/create/" element={<PostCreatePage />} />

                        <Route path="/categories/:id/posts" element={<CategoryPage />} />

                        <Route path="/users/:id" element={<UserProfilePage />} />
                        <Route path="/users/:id/edit" element={<UserEditPage />} />

                        <Route
                            path="/sign-in"
                            element={
                                <PublicRoute>
                                    <SignInPage />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/sign-up"
                            element={
                                <PublicRoute>
                                    <SignUpPage />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/confirm-email/:confirm_token"
                            element={
                                <PublicRoute>
                                    <ConfirmEmailPage />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/password-reset"
                            element={
                                <PublicRoute>
                                    <PasswordResetRequestPage />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/password-reset/:confirm_token"
                            element={
                                <PublicRoute>
                                    <PasswordResetConfirmPage />
                                </PublicRoute>
                            }
                        />
                    </Routes>
                </Container>
                <Footer />
            </Router>
        </AuthProvider>
    );
}

export default App;