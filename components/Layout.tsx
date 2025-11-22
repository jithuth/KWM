import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Newspaper, Briefcase, Users, Heart, Calculator, ShieldCheck, AlertTriangle, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { isDemoMode } = useApp();
    const { language, setLanguage, t } = useLanguage();

    const navItems = [
        { name: t('nav.home'), path: '/', icon: <Home size={16} /> },
        { name: t('nav.news'), path: '/news', icon: <Newspaper size={16} /> },
        { name: t('nav.directory'), path: '/directory', icon: <Briefcase size={16} /> },
        { name: t('nav.associations'), path: '/associations', icon: <Users size={16} /> },
        { name: t('nav.obituary'), path: '/obituary', icon: <Heart size={16} /> },
        { name: t('nav.tools'), path: '/tools', icon: <Calculator size={16} /> },
    ];

    const isActive = (path: string) => location.pathname === path;

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ml' : 'en');
    };

    return (
        <div className={`min-h-screen flex flex-col bg-gray-50 ${language === 'ml' ? 'font-malayalam' : ''}`}>
            {/* Demo Mode Banner */}
            {isDemoMode && (
                <div className="bg-yellow-500 text-white text-center text-xs py-1 px-4 font-medium flex items-center justify-center">
                    <AlertTriangle size={12} className="mr-2" />
                    <span>Running in Demo Mode - Database Not Connected. Changes will be local only.</span>
                </div>
            )}

            {/* Header */}
            <header className="bg-emerald-800 text-white sticky top-0 z-50 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-14 items-center">
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center space-x-2">
                                <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-emerald-800 font-bold text-sm">K</div>
                                <span className="text-lg font-bold tracking-tight">Kuwait Malayali</span>
                            </Link>
                        </div>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center space-x-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path} // Changed key to path for uniqueness with translation
                                    to={item.path}
                                    className={`flex items-center space-x-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                        isActive(item.path) ? 'bg-emerald-700 text-white' : 'text-emerald-100 hover:bg-emerald-700'
                                    }`}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                             <Link
                                    to="/admin"
                                    className="flex items-center space-x-1.5 px-2 py-1.5 rounded-md text-xs font-medium text-yellow-300 hover:text-white transition-colors border border-emerald-600 hover:border-white"
                                >
                                    <ShieldCheck size={16} />
                                    <span>{t('nav.admin')}</span>
                                </Link>

                            {/* Language Toggle */}
                            <button 
                                onClick={toggleLanguage}
                                className="flex items-center space-x-1 px-2 py-1 rounded border border-emerald-600 hover:bg-emerald-700 text-xs font-bold"
                            >
                                <Globe size={14} />
                                <span>{language === 'en' ? 'ML' : 'EN'}</span>
                            </button>
                        </nav>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center space-x-3">
                             <button 
                                onClick={toggleLanguage}
                                className="flex items-center space-x-1 px-2 py-1 rounded border border-emerald-600 hover:bg-emerald-700 text-xs font-bold"
                            >
                                <span>{language === 'en' ? 'ML' : 'EN'}</span>
                            </button>
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 rounded-md text-emerald-200 hover:text-white focus:outline-none"
                            >
                                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center space-x-2 px-3 py-2.5 rounded-md text-sm font-medium ${
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
                                className="flex items-center space-x-2 px-3 py-2.5 rounded-md text-sm font-medium text-yellow-400 hover:bg-emerald-800"
                            >
                                <ShieldCheck size={16} />
                                <span>{t('nav.admin')}</span>
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-white text-base font-bold mb-3">Kuwait Malayali</h3>
                        <p className="text-xs leading-relaxed">{t('footer.desc')}</p>
                    </div>
                    <div>
                        <h3 className="text-white text-base font-bold mb-3">{t('footer.links')}</h3>
                        <ul className="space-y-1.5 text-xs">
                            <li><Link to="/news" className="hover:text-white">{t('nav.news')}</Link></li>
                            <li><Link to="/directory" className="hover:text-white">{t('nav.directory')}</Link></li>
                            <li><Link to="/associations" className="hover:text-white">{t('nav.associations')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white text-base font-bold mb-3">{t('footer.contact')}</h3>
                        <p className="text-xs mb-1">Email: info@kuwaitmalayali.com</p>
                        <p className="text-xs">Phone: +965 9999 9999</p>
                    </div>
                </div>
                <div className="text-center mt-8 pt-8 border-t border-gray-800 text-[10px] uppercase tracking-wider">
                    &copy; {new Date().getFullYear()} Kuwait Malayali Portal. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Layout;