import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, BarChart3, Settings, LogOut, Globe } from 'lucide-react';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white hidden md:flex flex-col fixed h-full">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-bold">KMP Admin</h1>
                    <p className="text-xs text-gray-500 mt-1">Management Portal</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link 
                        to="/admin" 
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin') ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link 
                        to="/admin/content" 
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/content') ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                    >
                        <FileText size={20} />
                        <span>Content Manager</span>
                    </Link>
                    <Link 
                        to="/admin/users" 
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/users') ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                    >
                        <Users size={20} />
                        <span>User Management</span>
                    </Link>
                    <Link 
                        to="/admin/analytics" 
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/analytics') ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                    >
                        <BarChart3 size={20} />
                        <span>Analytics</span>
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-800 space-y-1">
                    <Link to="/" className="flex items-center space-x-3 text-emerald-400 hover:text-emerald-300 hover:bg-gray-800 w-full px-4 py-3 rounded-lg transition-colors">
                        <Globe size={20} />
                        <span>View Website</span>
                    </Link>
                    <button className="flex items-center space-x-3 text-red-400 hover:text-red-300 hover:bg-gray-800 w-full px-4 py-3 rounded-lg transition-colors">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 md:ml-64 p-8">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;