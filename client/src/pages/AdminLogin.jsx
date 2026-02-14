import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, logout } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await login(email, password);
            if (data.user.role !== 'admin') {
                logout();
                toast.error('This is the Admin Portal. Regular users should login at the User Portal.');
                return;
            }
            toast.success('Admin authenticated successfully');
            navigate('/admin-dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex bg-slate-50 overflow-hidden pt-16">
            {/* Left Side: Brand Panel (Desktop Only) */}
            <div className="hidden lg:flex lg:w-[45%] h-full bg-blue-900 relative overflow-hidden items-center justify-center p-12 shrink-0">
                {/* Sky Arctic Glowing Accents */}
                <div className="absolute inset-0">
                    <div className="absolute top-[-15%] left-[-5%] w-[80%] h-[70%] bg-indigo-500/40 rounded-full blur-[160px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] right-[0%] w-[60%] h-[60%] bg-sky-400/25 rounded-full blur-[120px]"></div>
                    {/* Subtle Mesh Grid */}
                    <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                    {/* Large Background Logo Decoration */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.06] pointer-events-none">
                        <ShieldCheck size={600} className="text-white rotate-6" />
                    </div>
                </div>

                {/* Organic Wave Separator */}
                <div className="absolute top-0 bottom-0 -right-1 w-24 z-20 pointer-events-none">
                    <svg className="h-full w-full" viewBox="0 0 100 1000" preserveAspectRatio="none" fill="currentColor">
                        <path
                            className="text-slate-50"
                            d="M100,0 C100,0 20,150 20,300 C20,450 80,550 80,700 C80,850 0,1000 0,1000 L100,1000 Z"
                        />
                    </svg>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-30 text-center"
                >
                    <div className="w-28 h-28 bg-white/10 backdrop-blur-2xl rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-3xl border border-white/20 rotate-6 hover:rotate-0 transition-transform duration-500">
                        <ShieldCheck className="text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]" size={56} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-6xl font-black text-white font-outfit mb-6 tracking-tight">
                        CMS <span className="text-cyan-400">Admin</span>
                    </h2>
                    <p className="text-blue-50 text-xl font-medium max-w-sm mx-auto leading-relaxed">
                        Control center for smart <br /> management & oversight.
                    </p>
                </motion.div>
            </div>

            {/* Right Side: Auth Form */}
            <div className="flex-1 h-full overflow-y-auto flex flex-col items-center py-12 p-4 sm:p-8 relative">
                {/* Background Decorations for Mobile/Context */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
                    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-slate-100 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-sm relative z-10"
                >
                    <div className="mb-8 flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm transition-all group">
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Portal
                        </Link>
                    </div>

                    <div className="premium-card p-6 sm:p-8 relative overflow-hidden">
                        <div className="flex flex-col items-center mb-8 sm:mb-10 lg:hidden">
                            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6">
                                <ShieldCheck className="text-white" size={32} />
                            </div>
                        </div>

                        <div className="flex flex-col items-center mb-8 sm:mb-10">
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-outfit text-slate-900 text-center">Admin Access</h1>
                            <p className="text-slate-500 mt-2 font-medium text-sm sm:text-base text-center">Management portal authentication</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Admin Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                    <input
                                        type="email" required
                                        className="input-field pl-12"
                                        placeholder="admin@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Security Key</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                    <input
                                        type="password" required
                                        className="input-field pl-12"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-slate-900 py-4 rounded-2xl font-extrabold text-white shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {loading ? 'Authenticating...' : (
                                        <>
                                            Sign In as Admin <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        <p className="text-center text-slate-500 mt-10 text-sm font-medium">
                            New Administrator? {' '}
                            <Link to="/admin/register" className="text-indigo-600 hover:text-indigo-700 font-bold decoration-2 underline-offset-4 hover:underline transition-all">Create Admin Account</Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminLogin;
