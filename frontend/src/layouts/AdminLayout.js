import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Go up one level to 'src' and then into 'contexts'
import './AdminLayout.css'; // Assuming you create this CSS file

const AdminLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="admin-layout">
            <header className="admin-header">
                <h1>Admin Panel</h1>
                {user && <p>Welcome, {user.username}</p>}
                <button onClick={handleLogout}>Logout</button>
            </header>
            <aside className="admin-sidebar">
                <ul>
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li><a href="/podcasts">Podcasts</a></li>
                    <li><a href="/youtube">YouTube Upload</a></li>
                    <li><a href="/analytics">Analytics</a></li>
                    <li><a href="/shortener">URL Shortener</a></li>
                    {user?.role === 'Super Admin' || user?.role === 'IT Head' ? (
                        <li><a href="/users">Users</a></li>
                    ) : null}
                </ul>
            </aside>
            <main className="admin-content">
                {children}
            </main>
            <footer className="admin-footer">
                <p>&copy; {new Date().getFullYear()} Podcast Club</p>
            </footer>
        </div>
    );
};

export default AdminLayout;