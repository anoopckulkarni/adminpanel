import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const InviteUser = () => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Editor');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        try {
            const response = await api.post('/api/users/invite', { email, role });
            setSuccessMessage(response.data.message || 'Invitation sent successfully!');
            setEmail('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send invitation');
        }
    };

    return (
        <div>
            <h2>Invite New User</h2>
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email of User to Invite:</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="role">Role:</label>
                    <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="Admin" disabled={user?.role === 'Viewer' || user?.role === 'Editor'}>Admin</option>
                        <option value="Editor" disabled={user?.role === 'Viewer'}>Editor</option>
                        <option value="Viewer">Viewer</option>
                    </select>
                    <p><small>You can only invite users with a role equal to or below your own.</small></p>
                </div>
                <button type="submit">Send Invitation</button>
            </form>
        </div>
    );
};

export default InviteUser;