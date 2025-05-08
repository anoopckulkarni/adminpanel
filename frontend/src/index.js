import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './router'; // Assuming AppRouter contains BrowserRouter
import { AuthProvider } from './contexts/AuthContext';
import './styles/global.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AuthProvider>
            <AppRouter />
        </AuthProvider>
    </React.StrictMode>
);