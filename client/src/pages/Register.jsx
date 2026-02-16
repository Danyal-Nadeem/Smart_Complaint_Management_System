import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, AlertCircle, ArrowLeft, CheckCircle, Shield } from 'lucide-react';

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
        <div className="h-screen w-full flex bg-slate-50 overflow-hidden pt-16">
            {/* Left Side: Brand Panel (Desktop Only) */}
            <div className="hidden lg:flex lg:w-[45%] h-full bg-blue-900 relative overflow-hidden items-center justify-center p-12 shrink-0">
                {/* Sky Arctic Glowing Accents */}
                <div className="absolute inset-0">
                    <div className="absolute top-[-15%] left-[-5%] w-[80%] h-[70%] bg-sky-400/40 rounded-full blur-[140px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] right-[0%] w-[60%] h-[60%] bg-blue-500/25 rounded-full blur-[120px]"></div>
                    {/* Subtle Mesh Grid */}
                    <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                    {/* Large Background Logo Decoration */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.06] pointer-events-none">
                        <UserPlus size={600} className="text-white -rotate-12" />
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
                    <div className="w-28 h-28 bg-white/10 backdrop-blur-2xl rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-3xl border border-white/20 -rotate-3 hover:rotate-0 transition-transform duration-500">
                        <UserPlus className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" size={56} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-6xl font-black text-white font-outfit mb-6 tracking-tight">
                        CMS <span className="text-cyan-400">Pro</span>
                    </h2>
                    <p className="text-blue-50 text-xl font-medium max-w-sm mx-auto leading-relaxed">
                        Join our elite network of <br /> secure management.
                    </p>
                </motion.div>
            </div>

            {/* Right Side: Auth Form */}
            <div className="flex-1 h-full overflow-y-auto flex flex-col items-center py-20 p-4 sm:p-8 relative">
                {/* Background Decorations for Mobile/Context */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
                    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-50 rounded-full blur-3xl opacity-50"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-[340px] relative z-10"
                >
                    <div className="mb-4 flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm transition-all group">
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Portal
                        </Link>
                    </div>

                    <div className="premium-card p-5 sm:p-6">
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
                                <div className="flex flex-col items-center mb-8 sm:mb-10 lg:hidden">
                                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                                        <Shield className="text-indigo-600" size={32} />
                                    </div>
                                </div>

                                <div className="flex flex-col items-center mb-6 sm:mb-8">
                                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-outfit text-slate-900 text-center">Create Account</h1>
                                    <p className="text-slate-500 mt-1.5 font-medium text-xs sm:text-sm text-center">Join our smart management system</p>
                                </div>

                                {error && (
                                    <div className="bg-red-50/50 border border-red-100 text-red-600 px-4 py-3.5 rounded-2xl flex items-center gap-3 mb-8 animate-pulse">
                                        <AlertCircle size={20} />
                                        <span className="text-sm font-semibold">{error}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
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
        </div>
    );
};

export default Register;
