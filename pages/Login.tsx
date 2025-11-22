import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, Mail, AlertCircle, Info } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login } = useAuth();
    const { isDemoMode } = useApp();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await login(email, password);
            if (error) throw new Error(error);
            navigate('/admin');
        } catch (err: any) {
            setError(err.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-emerald-900 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-full mb-3 text-emerald-800">
                        <ShieldCheck size={28} />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
                    <p className="text-gray-500 mt-1 text-xs">Sign in to manage the platform</p>
                </div>

                {isDemoMode && (
                     <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-lg flex items-start mb-5 text-xs">
                        <Info size={16} className="mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold">Demo Mode Active</p>
                            <p>Use <strong>admin@kmp.com</strong> / <strong>admin</strong> to login.</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg flex items-center mb-5">
                        <AlertCircle size={16} className="mr-2" />
                        <span className="text-xs">{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                placeholder="admin@kmp.com"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full py-2.5 rounded-lg font-bold text-sm text-white transition-colors ${
                            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-800 hover:bg-emerald-900'
                        }`}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a href="/" className="text-xs text-gray-500 hover:text-emerald-600">Back to Website</a>
                </div>
            </div>
        </div>
    );
};

export default Login;