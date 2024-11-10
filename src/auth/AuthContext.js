import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState(() => {
    return localStorage.getItem('authToken') || null;
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (authToken) {
      localStorage.setItem('authToken', authToken);
      axios
        .get('http://localhost:8080/api/auth/user', {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          setAuthToken(null);
          setUser(null);
        });
    } else {
      localStorage.removeItem('authToken');
      setUser(null);
    }
  }, [authToken]);

  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}