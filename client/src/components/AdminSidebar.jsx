import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, List, Mail, BarChart3, Clock, CheckCircle, AlertTriangle, ChevronDown, UserCircle, Edit2, History } from 'lucide-react';
import { clsx } from 'clsx';
import ProfileModal from './ProfileModal';

const AdminSidebar = ({ complaints, isMobileOpen, onClose }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [profileModal, setProfileModal] = useState({ isOpen: false, view: 'view' });

    // Calculate stats
    const totalComplaints = complaints.length;
    const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
    const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;
    const inProgressComplaints = complaints.filter(c => c.status === 'In Progress').length;

    const menuItems = [
        { id: 'dashboard', label: 'Overview', icon: Home, path: '/admin-dashboard' },
        { id: 'complaints', label: 'Manage Complaints', icon: List, path: '/admin/complaints' },
        { id: 'history', label: 'Complaint History', icon: History, path: '/admin/history' },
        { id: 'analytics', label: 'User Analytics', icon: BarChart3, path: '/admin/analytics' },
    ];

    const stats = [
        { label: 'Total', value: totalComplaints, icon: BarChart3, color: 'indigo' },
        { label: 'Pending', value: pendingComplaints, icon: Clock, color: 'yellow' },
        { label: 'In Progress', value: inProgressComplaints, icon: AlertTriangle, color: 'blue' },
        { label: 'Resolved', value: resolvedComplaints, icon: CheckCircle, color: 'green' }
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={clsx(
                    "fixed top-16 left-0 h-[calc(100vh-4rem)] w-72 bg-white z-40",
                    "transition-transform duration-300 ease-in-out overflow-y-auto border-r border-slate-100",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                <div className="space-y-8 p-6">
                    {/* Admin Profile Section */}
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="w-full premium-card p-6 text-center bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200/50 hover:border-indigo-200 transition-all group relative"
                        >
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 text-2xl font-black shadow-sm border border-slate-200 group-hover:scale-105 transition-transform">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <h3 className="text-lg font-extrabold text-slate-900 font-outfit">{user?.name}</h3>
                                <ChevronDown size={14} className={clsx("text-slate-400 transition-transform", isProfileOpen && "rotate-180")} />
                            </div>
                            <div className="flex items-center justify-center gap-2 text-slate-500 text-xs mb-3">
                                <Mail size={12} />
                                <span className="truncate">{user?.email}</span>
                            </div>
                            <span className="inline-block px-4 py-1.5 rounded-full bg-slate-900/10 text-slate-900 text-[10px] font-black uppercase tracking-wider border border-slate-900/10">
                                {user?.role} Portal
                            </span>
                        </button>

                        <AnimatePresence>
                            {isProfileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    className="absolute left-0 right-0 mt-2 bg-white rounded-2xl premium-shadow border border-slate-100 overflow-hidden z-[50]"
                                >
                                    <div className="p-2 space-y-1">
                                        <button
                                            onClick={() => {
                                                setProfileModal({ isOpen: true, view: 'view' });
                                                setIsProfileOpen(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all text-left"
                                        >
                                            <UserCircle size={18} /> View Profile
                                        </button>
                                        <button
                                            onClick={() => {
                                                setProfileModal({ isOpen: true, view: 'edit' });
                                                setIsProfileOpen(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all text-left"
                                        >
                                            <Edit2 size={18} /> Edit Name
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="space-y-2">
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-3">Management</h4>
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        navigate(item.path);
                                        if (isMobileOpen) onClose();
                                    }}
                                    className={clsx(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all text-left",
                                        isActive
                                            ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                >
                                    <Icon size={18} />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Quick Stats */}
                    <div className="space-y-3">
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-3">System Stats</h4>
                        {stats.map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={stat.label}
                                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 border border-slate-100"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={clsx(
                                            "w-8 h-8 rounded-lg flex items-center justify-center",
                                            stat.color === 'indigo' && "bg-indigo-100 text-indigo-600",
                                            stat.color === 'yellow' && "bg-yellow-100 text-yellow-600",
                                            stat.color === 'blue' && "bg-blue-100 text-blue-600",
                                            stat.color === 'green' && "bg-green-100 text-green-600"
                                        )}>
                                            <Icon size={16} />
                                        </div>
                                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{stat.label}</span>
                                    </div>
                                    <span className="text-sm font-black text-slate-900">{stat.value}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </aside>

            {/* Profile Modal */}
            <ProfileModal
                isOpen={profileModal.isOpen}
                onClose={() => setProfileModal({ ...profileModal, isOpen: false })}
                initialView={profileModal.view}
            />
        </>
    );
};

export default AdminSidebar;
