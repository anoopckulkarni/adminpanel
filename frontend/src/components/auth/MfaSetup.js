import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import QRCode from 'qrcode.react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const MfaSetup = () => {
    const [secret, setSecret] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMfaSecret = async () => {
            try {
                const response = await api.get('/api/auth/mfa/setup');
                setSecret(response.data.secret);
                setQrCodeUrl(response.data.qrCodeUrl);
            } catch (err) {
                setError(err.message || 'Failed to fetch MFA setup data');
            }
        };

        fetchMfaSecret();
    }, []);

    const handleVerify = async () => {
        setError('');
        setSuccessMessage('');
        try {
            const response = await api.post('/api/auth/mfa/verify-setup', { token: verificationCode });
            setSuccessMessage(response.data.message || 'MFA setup successful!');
            // Redirect to dashboard or a success page
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to verify MFA setup');
        }
    };

    return (
        <div>
            <h2>Setup Two-Factor Authentication</h2>
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            {qrCodeUrl && secret && (
                <div>
                    <p>Scan this QR code with your authenticator app:</p>
                    <QRCode value={qrCodeUrl} size={256} level="H" />
                    <p>Or manually enter this secret key: <strong>{secret}</strong></p>

                    <div>
                        <label htmlFor="verificationCode">Enter Verification Code:</label>
                        <input
                            type="text"
                            id="verificationCode"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                        />
                    </div>
                    <button onClick={handleVerify} disabled={!verificationCode}>Verify and Enable MFA</button>
                </div>
            )}

            {!qrCodeUrl && !error && <p>Loading MFA setup...</p>}
        </div>
    );
};

export default MfaSetup;