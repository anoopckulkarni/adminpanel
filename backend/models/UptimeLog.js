const mongoose = require('mongoose');

const uptimeLogSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ['up', 'down'], required: true },
    responseTime: { type: Number }, // in milliseconds
    error: { type: String }
});

module.exports = mongoose.model('UptimeLog', uptimeLogSchema);