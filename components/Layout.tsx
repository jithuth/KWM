import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Newspaper, Briefcase, Users, Heart, Calculator, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { isDemoMode } = useApp();

    const navItems = [
        { name: 'Home', path: '/', icon: <Home size={18} /> },
        { name: 'News', path: '/news', icon: <Newspaper size={18} /> },
        { name: 'Directory', path: '/directory', icon: <Briefcase size={18} /> },
        { name: 'Associations', path: '/associations', icon: <Users size={18} /> },
        { name: 'Obituary', path: '/obituary', icon: <Heart size={18} /> },
        { name: 'Tools', path: '/tools', icon: <Calculator size={18} /> },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Demo Mode Banner */}
            {isDemoMode && (
                <div className="bg-yellow-500 text-white text-center text-xs py-1 px-4 font-medium flex items-center justify-center">
                    <AlertTriangle size={14} className="mr-2" />
                    <span>Running in Demo Mode - Database Not Connected. Changes will be local only.</span>
                </div>
            )}

            {/* Header */}
            <header className="bg-emerald-800 text-white sticky top-0 z-50 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-emerald-800 font-bold">K</div>
                                <span className="text-xl font-bold tracking-tight">Kuwait Malayali</span>
                            </Link>
                        </div>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex space-x-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        isActive(item.path) ? 'bg-emerald-700 text-white' : 'text-emerald-100 hover:bg-emerald-700'
                                    }`}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                             <Link
                                    to="/admin"
                                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-yellow-300 hover:text-white transition-colors border border-emerald-600 hover:border-white"
                                >
                                    <ShieldCheck size={18} />
                                    <span>Admin</span>
                                </Link>
                        </nav>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 rounded-md text-emerald-200 hover:text-white focus:outline-none"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-emerald-900 pb-4">
                        <div className="px-2 pt-2 space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center space-x-2 px-3 py-3 rounded-md text-base font-medium ${
                                        isActive(item.path) ? 'bg-emerald-800 text-white' : 'text-emerald-100 hover:bg-emerald-800'
                                    }`}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                             <Link
                                key="admin"
                                to="/admin"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center space-x-2 px-3 py-3 rounded-md text-base font-medium text-yellow-400 hover:bg-emerald-800"
                            >
                                <ShieldCheck size={18} />
                                <span>Admin Panel</span>
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">Kuwait Malayali</h3>
                        <p className="text-sm">Connecting the Malayali community in Kuwait since 2023. Your one-stop destination for news, directory, and events.</p>
                    </div>
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/news" className="hover:text-white">Latest News</Link></li>
                            <li><Link to="/directory" className="hover:text-white">Business Directory</Link></li>
                            <li><Link to="/associations" className="hover:text-white">Associations</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">Contact Us</h3>
                        <p className="text-sm">Email: info@kuwaitmalayali.com</p>
                        <p className="text-sm">Phone: +965 9999 9999</p>
                    </div>
                </div>
                <div className="text-center mt-8 pt-8 border-t border-gray-800 text-xs">
                    &copy; {new Date().getFullYear()} Kuwait Malayali Portal. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Layout;