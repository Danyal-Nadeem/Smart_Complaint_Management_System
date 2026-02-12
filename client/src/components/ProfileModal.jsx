import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Shield, Check, Edit2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProfileModal = ({ isOpen, onClose, initialView = 'view' }) => {
    const { user, updateProfile } = useAuth();
    const [view, setView] = useState(initialView); // 'view' or 'edit'
    const [name, setName] = useState(user?.name || '');
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!name.trim()) return toast.error('Name cannot be empty');
        if (name === user.name) return setView('view');

        setLoading(true);
        try {
            await updateProfile(name);
            toast.success('Profile updated successfully');
            setView('view');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-white rounded-3xl p-8 premium-shadow max-w-sm w-full"
                    >
                        <button
                            onClick={onClose}
                            className="absolute right-6 top-6 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-all"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center mb-8">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 text-3xl font-black shadow-sm border border-slate-200">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 font-outfit">
                                {view === 'view' ? 'Your Profile' : 'Edit Profile'}
                            </h3>
                            <p className="text-slate-500 font-medium text-sm">Manage your account details</p>
                        </div>

                        {view === 'view' ? (
                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 leading-none mb-1">Full Name</p>
                                            <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400">
                                            <Mail size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 leading-none mb-1">Email Address</p>
                                            <p className="text-sm font-bold text-slate-900">{user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400">
                                            <Shield size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 leading-none mb-1">Account Role</p>
                                            <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">{user?.role}</p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setView('edit')}
                                    className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-900 text-white font-bold premium-shadow hover:bg-slate-800 transition-all active:scale-[0.98]"
                                >
                                    <Edit2 size={18} /> Edit Profile
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">New Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                        <input
                                            type="text"
                                            required
                                            autoFocus
                                            className="input-field pl-12"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setView('view')}
                                        className="py-3 rounded-xl border border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="py-3 rounded-xl bg-indigo-600 text-white font-bold premium-shadow hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loading ? 'Saving...' : <><Check size={18} /> Save</>}
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProfileModal;
