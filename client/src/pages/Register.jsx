import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const { name, email, password, confirmPassword } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return setError('Please enter a valid email address');
        }

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        try {
            const data = await register(name, email, password);

            // If the response contains a token, the account was auto-approved (regular user)
            if (data.token) {
                navigate('/dashboard');
                return;
            }

            // Otherwise show the pending approval success state (for admins accidentally registering here)
            setIsSuccess(true);
        } catch (err) {
            console.error('Registration Error:', err);
            if (!err.response) {
                setError('Server is not reachable. Is the backend running?');
            } else if (err.response.status === 400 && err.response.data?.message?.includes('E11000')) {
                setError('Email is already registered');
            } else {
                setError(err.response?.data?.message || 'Registration failed. Check if MongoDB is running.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-bg px-4 py-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[420px]"
            >
                <div className="mb-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm transition-all group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Portal
                    </Link>
                </div>

                <div className="premium-card p-6 sm:p-8">
                    {isSuccess ? (
                        <div className="py-10 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8"
                            >
                                <CheckCircle className="text-emerald-500" size={40} />
                            </motion.div>
                            <h2 className="text-3xl font-black text-slate-900 font-outfit mb-4">Registration Sent!</h2>
                            <p className="text-slate-500 font-medium leading-relaxed mb-10">
                                Your account has been created and is now <span className="text-indigo-600 font-bold">pending admin approval</span>.
                                We've notified the super admin to review your request.
                            </p>
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-[11px] hover:gap-3 transition-all"
                            >
                                Back to Login <ArrowLeft size={16} className="rotate-180" />
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col items-center mb-8 sm:mb-10">
                                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <User className="text-indigo-600" size={32} />
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-outfit text-slate-900 text-center">Create Account</h1>
                                <p className="text-slate-500 mt-2 font-medium text-sm sm:text-base text-center">Join our smart management system</p>
                            </div>

                            {error && (
                                <div className="bg-red-50/50 border border-red-100 text-red-600 px-4 py-3.5 rounded-2xl flex items-center gap-3 mb-8 animate-pulse">
                                    <AlertCircle size={20} />
                                    <span className="text-sm font-semibold">{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={name}
                                            onChange={onChange}
                                            className="input-field"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={email}
                                            onChange={onChange}
                                            className="input-field"
                                            placeholder="name@company.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                            <input
                                                type="password"
                                                name="password"
                                                required
                                                value={password}
                                                onChange={onChange}
                                                className="input-field"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Confirm</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                required
                                                value={confirmPassword}
                                                onChange={onChange}
                                                className="input-field"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full premium-gradient py-4 rounded-2xl font-extrabold text-white premium-shadow hover:opacity-95 transition-all active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {loading ? 'Creating account...' : 'Create Account'}
                                    </button>
                                </div>
                            </form>

                            <p className="text-center text-slate-500 mt-8 text-sm font-medium">
                                Already have an account? {' '}
                                <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-bold decoration-2 underline-offset-4 hover:underline transition-all">Log in</Link>
                            </p>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
