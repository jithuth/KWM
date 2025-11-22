import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public Components
import Layout from './components/Layout';
import Home from './pages/Home';
import Tools from './pages/Tools';
import Directory from './pages/Directory';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Associations from './pages/Associations';
import Obituary from './pages/Obituary';
import Login from './pages/Login';

// Admin Components
import AdminLayout from './pages/Admin/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import ContentManager from './pages/Admin/ContentManager';
import UserManagement from './pages/Admin/UserManagement';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { session, loading } = useAuth();
    
    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!session) return <Navigate to="/login" replace />;
    
    return <>{children}</>;
};

const AppRoutes = () => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');
    const isLoginRoute = location.pathname === '/login';

    if (isLoginRoute) {
        return <Login />;
    }

    if (isAdminRoute) {
        return (
            <ProtectedRoute>
                <AdminLayout>
                    <Routes>
                        <Route path="/admin" element={<Dashboard />} />
                        <Route path="/admin/content" element={<ContentManager />} />
                        <Route path="/admin/users" element={<UserManagement />} />
                        <Route path="/admin/analytics" element={<Dashboard />} />
                    </Routes>
                </AdminLayout>
            </ProtectedRoute>
        );
    }

    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<NewsDetail />} />
                <Route path="/tools" element={<Tools />} />
                <Route path="/directory" element={<Directory />} />
                <Route path="/associations" element={<Associations />} />
                <Route path="/obituary" element={<Obituary />} />
            </Routes>
        </Layout>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppProvider>
                <Router>
                    <AppRoutes />
                </Router>
            </AppProvider>
        </AuthProvider>
    );
};

export default App;