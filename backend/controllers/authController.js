const User = require('../models/User');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode'); // For generating QR code

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Signup Controller
exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        const newUser = new User({ username, email, password });
        await newUser.save();
        const token = generateToken(newUser._id);
        res.status(201).json({ token, user: { id: newUser._id, username: newUser.username, email: newUser.email, role: newUser.role, mfaEnabled: newUser.mfaEnabled } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user' });
    }
};

// Login Controller
exports.login = async (req, res) => {
    try {
        const { identifier, password } = req.body; // Identifier can be username or email
        const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] }).select('+password +mfaSecret');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (user.mfaEnabled) {
            // Send a response indicating MFA is required
            return res.status(200).json({ mfaRequired: true, userId: user._id });
        }
        const token = generateToken(user._id);
        res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role, mfaEnabled: user.mfaEnabled } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in' });
    }
};

// Enable MFA Controller
exports.enableMfa = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you have authentication middleware
        const user = await User.findById(userId).select('+mfaSecret');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { otpauth_url, base32 } = speakeasy.generateSecret();
        user.mfaSecret = base32;
        user.mfaEnabled = true;
        await user.save();
        QRCode.toDataURL(otpauth_url, (err, data_url) => {
            if (err) {
                console.error('Error generating QR code:', err);
                return res.status(500).json({ message: 'Error generating QR code' });
            }
            res.status(200).json({ mfaEnabled: true, qrCodeUrl: data_url, mfaSecret: base32 });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error enabling MFA' });
    }
};

// Verify MFA Token Controller
exports.verifyMfaToken = async (req, res) => {
    try {
        const { userId, token } = req.body;
        const user = await User.findById(userId).select('+mfaSecret');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isTokenValid = user.verifyMfaToken(token);
        if (isTokenValid) {
            const jwtToken = generateToken(user._id);
            return res.status(200).json({ token: jwtToken, user: { id: user._id, username: user.username, email: user.email, role: user.role, mfaEnabled: user.mfaEnabled } });
        } else {
            return res.status(401).json({ message: 'Invalid MFA token' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error verifying MFA token' });
    }
};

// Disable MFA Controller
exports.disableMfa = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you have authentication middleware
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.mfaEnabled = false;
        user.mfaSecret = undefined;
        await user.save();
        res.status(200).json({ mfaEnabled: false, message: 'MFA disabled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error disabling MFA' });
    }
};