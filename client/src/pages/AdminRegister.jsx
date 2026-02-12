import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            // Pass 'admin' as the role specifically for this page
            await register(formData.name, formData.email, formData.password, 'admin');
            setIsSuccess(true);
            toast.success('Registration request sent');
            // navigate('/admin-dashboard'); // Removed direct navigation
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-bg px-4 py-20">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[420px]"
            >
                <div className="mb-8 flex items-center justify-between">
                    <Link to="/admin/login" className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm transition-all group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Login
                    </Link>
                </div>

                <div className="premium-card p-6 sm:p-8 relative overflow-hidden">
                    {isSuccess ? (
                        <div className="py-10 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8"
                            >
                                <CheckCircle className="text-emerald-500" size={40} />
                            </motion.div>
                            <h2 className="text-3xl font-black text-slate-900 font-outfit mb-4">Request Sent!</h2>
                            <p className="text-slate-500 font-medium leading-relaxed mb-10">
                                Your admin account application is now <span className="text-indigo-600 font-bold">pending super admin approval</span>.
                                A notification has been sent to the system owner.
                            </p>
                            <Link
                                to="/admin/login"
                                className="inline-flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-[11px] hover:gap-3 transition-all"
                            >
                                Back to Admin Login <ArrowLeft size={16} className="rotate-180" />
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col items-center mb-8 sm:mb-10">
                                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="text-white" size={32} />
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-outfit text-slate-900 text-center">Admin Setup</h1>
                                <p className="text-slate-500 mt-2 font-medium text-sm sm:text-base text-center">Create your management account</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                        <input
                                            type="text" required
                                            className="input-field pl-12"
                                            placeholder="Admin Name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Work Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                        <input
                                            type="email" required
                                            className="input-field pl-12"
                                            placeholder="admin@company.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                        <input
                                            type="password" required
                                            className="input-field pl-12"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-slate-900 py-4 rounded-2xl font-extrabold text-white shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        {loading ? 'Creating Account...' : (
                                            <>
                                                Register Admin <ArrowRight size={20} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            <p className="text-center text-slate-500 mt-10 text-sm font-medium">
                                Already have an admin account? {' '}
                                <Link to="/admin/login" className="text-indigo-600 hover:text-indigo-700 font-bold decoration-2 underline-offset-4 hover:underline transition-all">Log Settings</Link>
                            </p>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default AdminRegister;
