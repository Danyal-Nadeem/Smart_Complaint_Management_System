import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Home, List, Mail, BarChart3, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

const AdminSidebar = ({ complaints, activeSection, onNavigate, isMobileOpen, onClose }) => {
    const { user } = useAuth();

    // Calculate stats
    const totalComplaints = complaints.length;
    const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
    const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;
    const inProgressComplaints = complaints.filter(c => c.status === 'In Progress').length;

    const menuItems = [
        { id: 'dashboard', label: 'Overview', icon: Home },
        { id: 'complaints', label: 'Manage Complaints', icon: List },
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
                    <div className="premium-card p-6 text-center bg-slate-900 border-none">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-slate-200/10 border border-slate-700">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <h3 className="text-lg font-extrabold text-white font-outfit mb-1">{user?.name}</h3>
                        <div className="flex items-center justify-center gap-2 text-slate-400 text-xs mb-3">
                            <Mail size={12} />
                            <span className="truncate">{user?.email}</span>
                        </div>
                        <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-wider border border-indigo-500/20">
                            {user?.role} Portal
                        </span>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="space-y-2">
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-3">Management</h4>
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeSection === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onNavigate(item.id);
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
        </>
    );
};

export default AdminSidebar;
