import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './auth/LoginPage';
import RegistrationPage from './auth/RegistrationPage';
import ConfirmEmailPage from './auth/ConfirmEmailPage';
import HomePage from './HomePage';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './auth/AuthContext';
import PasswordResetRequestPage from "./auth/PasswordResetRequestPage";
import PasswordResetConfirmPage from "./auth/PasswordResetConfirmPage";
import PublicRoute from './PublicRoute';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <HomePage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <LoginPage />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <PublicRoute>
                                <RegistrationPage />
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

                    {/* Додайте інші маршрути за потреби */}
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;