import React from 'react';
import AppRouter from './router';
import { AuthProvider } from './contexts/AuthContext'; // Corrected path
import './styles/global.css';

function App() {
    return (
        <AuthProvider>
            <AppRouter />
        </AuthProvider>
    );
}

export default App;