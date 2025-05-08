import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Assuming you have an API service

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = async () => {
            setLoading(true);
            if (token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                try {
                    const response = await api.get('/api/auth/me'); // Backend endpoint to get user data
                    setUser(response.data.user);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Error loading user:', error);
                    setToken(null);
                    setUser(null);
                    setIsAuthenticated(false);
                    localStorage.removeItem('token');
                    delete api.defaults.headers.common['Authorization'];
                }
            } else {
                setIsAuthenticated(false);
            }
            setLoading(false);
        };

        loadUser();
    }, [token]);

    const login = async (identifier, password, verificationCode = null, userId = null) => {
        try {
            const payload = { identifier, password };
            if (verificationCode) {
                payload.token = verificationCode;
            }
            if (userId) {
                payload.userId = userId;
            }
            const response = await api.post('/api/auth/login', payload);
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            setUser(response.data.user);
            setIsAuthenticated(true);
            return response.data; // May contain mfaRequired flag
        } catch (error) {
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
            delete api.defaults.headers.common['Authorization'];
            throw error?.response?.data || error || new Error('Login failed');
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        navigate('/login');
    };

    const contextValue = {
        token,
        user,
        isAuthenticated,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);