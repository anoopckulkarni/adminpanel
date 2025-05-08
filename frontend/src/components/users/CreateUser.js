import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const CreateUser = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Editor');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        try {
            const response = await api.post('/api/users', { username, email, password, role });
            setSuccessMessage(response.data.message || 'User created successfully!');
            setTimeout(() => navigate('/users'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create user');
        }
    };

    return (
        <div>
            <h2>Create New User</h2>
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="role">Role:</label>
                    <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="Super Admin">Super Admin</option>
                        <option value="IT Head">IT Head</option>
                        <option value="Admin">Admin</option>
                        <option value="Editor">Editor</option>
                        <option value="Viewer">Viewer</option>
                    </select>
                </div>
                <button type="submit">Create User</button>
            </form>
        </div>
    );
};

export default CreateUser;