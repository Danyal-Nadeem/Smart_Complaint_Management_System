import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const { name, email, password, confirmPassword } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        try {
            await register(name, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass w-full max-w-md p-8 rounded-2xl"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 premium-gradient rounded-xl flex items-center justify-center mb-4">
                        <UserPlus className="text-white" size={28} />
                    </div>
                    <h1 className="text-3xl font-bold">Create Account</h1>
                    <p className="text-slate-400 mt-2">Join our smart management system</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg flex items-center gap-2 mb-6">
                        <AlertCircle size={18} />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
                            <input
                                type="text"
                                name="name"
                                required
                                value={name}
                                onChange={onChange}
                                className="bg-slate-900/50 border border-slate-800 w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
                            <input
                                type="email"
                                name="email"
                                required
                                value={email}
                                onChange={onChange}
                                className="bg-slate-900/50 border border-slate-800 w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                placeholder="name@company.com"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={password}
                                    onChange={onChange}
                                    className="bg-slate-900/50 border border-slate-800 w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirm</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    value={confirmPassword}
                                    onChange={onChange}
                                    className="bg-slate-900/50 border border-slate-800 w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full premium-gradient py-2.5 rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </div>
                </form>

                <p className="text-center text-slate-400 mt-6 text-sm">
                    Already have an account? {' '}
                    <Link to="/login" className="text-blue-500 hover:text-blue-400 font-medium">Log in</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
