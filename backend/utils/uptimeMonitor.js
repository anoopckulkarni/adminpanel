const fetch = require('node-fetch');
const UptimeLog = require('../models/UptimeLog');

const websiteUrl = process.env.WEBSITE_URL || 'http://localhost:3000'; // Replace with your actual URL

async function checkUptime() {
    try {
        const startTime = Date.now();
        const response = await fetch(websiteUrl);
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        if (response.ok) {
            await UptimeLog.create({ status: 'up', responseTime });
            console.log(`Uptime check successful (${websiteUrl}): Status ${response.status}, Response Time ${responseTime}ms`);
        } else {
            await UptimeLog.create({ status: 'down', responseTime, error: `HTTP Status ${response.status}` });
            console.error(`Uptime check failed (${websiteUrl}): Status ${response.status}`);
        }
    } catch (error) {
        await UptimeLog.create({ status: 'down', error: error.message });
        console.error(`Uptime check error (${websiteUrl}):`, error.message);
    }
}

// Schedule the uptime check to run periodically (e.g., every 5 minutes)
const cron = require('cron');
const uptimeCronJob = cron.schedule('*/5 * * * *', checkUptime);

module.exports = {
    startMonitoring: () => uptimeCronJob.start(),
    stopMonitoring: () => uptimeCronJob.stop()
};