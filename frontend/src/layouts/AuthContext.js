import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Assuming you have an API service

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                try {
                    // Assuming your backend has an endpoint to fetch user data from the token
                    const response = await api.get('/api/auth/me'); // You'll need to create this route
                    setUser(response.data.user);
                } catch (error) {
                    console.error('Error loading user:', error);
                    setToken(null);
                    setUser(null);
                    localStorage.removeItem('token');
                }
            }
        };

        loadUser();
    }, [token]);

    const login = async (identifier, password) => {
        try {
            const response = await api.post('/api/auth/login', { identifier, password });
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            setUser(response.data.user);
            return response.data; // May contain mfaRequired flag
        } catch (error) {
            localStorage.removeItem('token');
            setUser(null);
            throw error?.response?.data || error || new Error('Login failed');
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);