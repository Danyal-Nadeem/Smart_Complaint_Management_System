import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, User, AlertCircle, ArrowLeft } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, logout } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await login(email, password);
            if (data.user.role === 'admin') {
                logout();
                setError('This is the User Portal. Administrators should login at the Admin Portal.');
                return;
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid login credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 flex items-center justify-center min-h-[85vh] py-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm"
            >
                <div className="mb-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm transition-all group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Portal
                    </Link>
                </div>

                <div className="premium-card p-6 sm:p-8">
                    <div className="flex flex-col items-center mb-8 sm:mb-10">
                        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <User className="text-indigo-600" size={32} />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-outfit text-slate-900 text-center">Welcome Back</h1>
                        <p className="text-slate-500 mt-2 font-medium text-sm sm:text-base text-center">Enter your credentials to access CMS</p>
                    </div>

                    {error && (
                        <div className="bg-red-50/50 border border-red-100 text-red-600 px-4 py-3.5 rounded-2xl flex items-center gap-3 mb-8 animate-pulse">
                            <AlertCircle size={20} />
                            <span className="text-sm font-semibold">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full premium-gradient py-4 rounded-2xl font-extrabold text-white premium-shadow hover:opacity-95 transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-slate-500 mt-8 text-sm font-medium">
                        Don't have an account? {' '}
                        <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-bold decoration-2 underline-offset-4 hover:underline transition-all">Create one</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
