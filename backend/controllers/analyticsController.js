const UptimeLog = require('../models/UptimeLog');

exports.getUptimeAnalytics = async (req, res) => {
    try {
        const { period = '24h' } = req.query;
        let startDate;

        switch (period) {
            case '1h':
                startDate = new Date(Date.now() - 60 * 60 * 1000);
                break;
            case '6h':
                startDate = new Date(Date.now() - 6 * 60 * 60 * 1000);
                break;
            case '24h':
                startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
                break;
            case '7d':
                startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
        }

        const logs = await UptimeLog.find({ timestamp: { $gte: startDate } }).sort({ timestamp: -1 });
        const totalChecks = logs.length;
        const upCount = logs.filter(log => log.status === 'up').length;
        const downCount = totalChecks - upCount;
        const uptimePercentage = totalChecks > 0 ? (upCount / totalChecks) * 100 : 0;

        // Calculate average response time (only for 'up' statuses)
        const totalResponseTime = logs.filter(log => log.status === 'up').reduce((sum, log) => sum + log.responseTime, 0);
        const averageResponseTime = upCount > 0 ? totalResponseTime / upCount : 0;

        res.status(200).json({
            uptimePercentage: parseFloat(uptimePercentage.toFixed(2)),
            upCount,
            downCount,
            totalChecks,
            averageResponseTime: parseFloat(averageResponseTime.toFixed(2)),
            logs
        });
    } catch (error) {
        console.error('Error fetching uptime analytics:', error);
        res.status(500).json({ message: 'Error fetching uptime analytics' });
    }
};