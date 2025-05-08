import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(user.role)) {
        // Optionally render an "Unauthorized" component or redirect elsewhere
        return <div>Unauthorized</div>;
    }

    return children;
};

export default ProtectedRoute;