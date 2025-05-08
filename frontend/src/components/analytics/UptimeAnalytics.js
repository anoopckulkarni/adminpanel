import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const UptimeAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [period, setPeriod] = useState('24h');

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await api.get(`/api/analytics/uptime?period=${period}`);
                setAnalytics(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch uptime analytics');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [period]);

    const handlePeriodChange = (e) => {
        setPeriod(e.target.value);
    };

    if (loading) {
        return <div>Loading uptime analytics...</div>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (!analytics) {
        return <p>No uptime data available.</p>;
    }

    return (
        <div>
            <h2>Uptime Analytics</h2>
            <div>
                <label htmlFor="period">Period:</label>
                <select id="period" value={period} onChange={handlePeriodChange}>
                    <option value="1h">Last 1 Hour</option>
                    <option value="6h">Last 6 Hours</option>
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                </select>
            </div>
            <p>Uptime Percentage: {analytics.uptimePercentage}%</p>
            <p>Total Checks: {analytics.totalChecks}</p>
            <p>Up Count: {analytics.upCount}</p>
            <p>Down Count: {analytics.downCount}</p>
            <p>Average Response Time: {analytics.averageResponseTime} ms</p>
            {analytics.logs && analytics.logs.length > 0 && (
                <div>
                    <h3>Uptime Logs</h3>
                    <ul>
                        {analytics.logs.map((log) => (
                            <li key={log._id}>
                                {new Date(log.timestamp).toLocaleString()} - Status: {log.status.toUpperCase()}
                                {log.responseTime && ` - Response Time: ${log.responseTime}ms`}
                                {log.error && ` - Error: ${log.error}`}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UptimeAnalytics;