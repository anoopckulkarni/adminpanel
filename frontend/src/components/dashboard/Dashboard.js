import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div>
            <h2>Dashboard</h2>
            {user && <p>Welcome, {user.username} ({user.role})!</p>}
            <button onClick={logout}>Logout</button>
            <ul>
                <li><Link to="/podcasts">Manage Podcasts</Link></li>
                <li><Link to="/youtube">YouTube Upload</Link></li>
                <li><Link to="/analytics">Analytics</Link></li>
                <li><Link to="/shortener">URL Shortener</Link></li>
                {user?.role === 'Super Admin' || user?.role === 'IT Head' ? (
                    <li><Link to="/users">Manage Users</Link></li>
                ) : null}
            </ul>
        </div>
    );
};

export default Dashboard;