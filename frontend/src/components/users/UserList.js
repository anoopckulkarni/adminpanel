import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await api.get('/api/users');
                setUsers(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/api/users/${id}`);
                setUsers(users.filter(user => user._id !== id));
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete user');
            }
        }
    };

    if (loading) {
        return <div>Loading users...</div>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div>
            <h2>User Management</h2>
            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <ul>
                    {users.map((user) => (
                        <li key={user._id}>
                            {user.username} ({user.email}) - Role: {user.role}
                            {/* Conditionally render edit/delete based on user roles */}
                            <button onClick={() => handleDelete(user._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
            <Link to="/users/create">Create New User</Link>
            <Link to="/users/invite">Invite User</Link>
        </div>
    );
};

export default UserList;