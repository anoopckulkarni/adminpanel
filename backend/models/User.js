const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['Super Admin', 'IT Head', 'Editor', 'Content Creator', 'Viewer'],
        default: 'Viewer'
    },
    mfaEnabled: { type: Boolean, default: false },
    mfaSecret: { type: String },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Hash the password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate MFA secret
userSchema.methods.generateMfaSecret = function() {
    const secret = speakeasy.generateSecret();
    this.mfaSecret = secret.base32;
    return secret.otpauth_url; // For generating QR code
};

// Method to verify MFA token
userSchema.methods.verifyMfaToken = function(token) {
    return speakeasy.totp.verify({
        secret: this.mfaSecret,
        encoding: 'base32',
        token: token,
        window: 1 // Check current and previous/next time steps
    });
};

module.exports = mongoose.model('User', userSchema);