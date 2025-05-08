import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import PodcastsPage from '../pages/PodcastsPage';
import YouTubeUploadPage from '../pages/YouTubeUploadPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import ShortenerPage from '../pages/ShortenerPage';
import UsersPage from '../pages/UsersPage';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<ProtectedRoute><AdminLayout><DashboardPage /></AdminLayout></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><AdminLayout><DashboardPage /></AdminLayout></ProtectedRoute>} />
                <Route path="/podcasts" element={<ProtectedRoute><AdminLayout><PodcastsPage /></AdminLayout></ProtectedRoute>} />
                <Route path="/youtube" element={<ProtectedRoute><AdminLayout><YouTubeUploadPage /></AdminLayout></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><AdminLayout><AnalyticsPage /></AdminLayout></ProtectedRoute>} />
                <Route path="/shortener" element={<ProtectedRoute><AdminLayout><ShortenerPage /></AdminLayout></ProtectedRoute>} />
                <Route path="/users" element={<ProtectedRoute roles={['Super Admin', 'IT Head']}><AdminLayout><UsersPage /></AdminLayout></ProtectedRoute>} />
                {/* Add more routes as needed */}
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;   