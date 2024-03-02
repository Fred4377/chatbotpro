import React, { useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import LandingPage from './pages/LandingPage';
import DemoPage from './pages/DemoPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardHome from './pages/dashboard/DashboardHome';
import ConfigurePage from './pages/dashboard/ConfigurePage';
import ConversationsPage from './pages/dashboard/ConversationsPage';
import EmbedPage from './pages/dashboard/EmbedPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0D1117' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#1E90FF' }}></i>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/demo" element={<DemoPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Dashboard Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardHome />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/configure" element={
              <ProtectedRoute>
                <ConfigurePage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/conversations" element={
              <ProtectedRoute>
                <ConversationsPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/embed" element={
              <ProtectedRoute>
                <EmbedPage />
              </ProtectedRoute>
            } />

            {/* Fallback Catch-All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#161B22',
            color: '#E6EDF3',
            border: '1px solid #30363D'
          }
        }} />
      </Router>
    </AuthProvider>
  );
}

export default App;
