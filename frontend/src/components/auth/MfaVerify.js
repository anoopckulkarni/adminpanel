import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const MfaVerify = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const userId = location.state?.userId;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(undefined, undefined, verificationCode, userId); // Assuming login function handles MFA verification
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        }
    };

    return (
        <div>
            <h2>Verify Two-Factor Authentication</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="verificationCode">Enter Verification Code:</label>
                    <input
                        type="text"
                        id="verificationCode"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Verify Code</button>
            </form>
        </div>
    );
};

export default MfaVerify;