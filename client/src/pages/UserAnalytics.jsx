import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
    Search, Filter, Menu, X, Users, BarChart3, TrendingUp,
    Clock, CheckCircle, XCircle, AlertTriangle, ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';

const UserAnalytics = () => {
    const { isSystemOnline } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sortBy, setSortBy] = useState('total'); // 'total', 'resolved', 'name'

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const [complaintsRes, usersRes] = await Promise.all([
                axios.get('http://localhost:5000/api/complaints', config),
                axios.get('http://localhost:5000/api/auth/users', config)
            ]);

            setComplaints(complaintsRes.data.data);
            setAllUsers(usersRes.data.data);
        } catch (error) {
            console.error('Error fetching data', error);
        } finally {
            setLoading(false);
        }
    };

    const userAnalytics = useMemo(() => {
        const usersMap = {};

        // Pre-fill with all users to ensure 0-complaint users are included
        allUsers.forEach(u => {
            usersMap[u._id] = {
                id: u._id,
                name: u.name,
                email: u.email,
                total: 0,
                pending: 0,
                inProgress: 0,
                resolved: 0,
                rejected: 0
            };
        });

        // Fill in complaint stats
        complaints.forEach(c => {
            const userId = c.user?._id || c.user; // Handle both populated and unpopulated
            if (!userId || !usersMap[userId]) return;

            usersMap[userId].total += 1;
            if (c.status === 'Pending') usersMap[userId].pending += 1;
            if (c.status === 'In Progress') usersMap[userId].inProgress += 1;
            if (c.status === 'Resolved') usersMap[userId].resolved += 1;
            if (c.status === 'Rejected') usersMap[userId].rejected += 1;
        });

        let result = Object.values(usersMap).filter(u =>
            (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
        );

        switch (sortBy) {
            case 'total':
                result.sort((a, b) => b.total - a.total);
                break;
            case 'resolved':
                result.sort((a, b) => b.resolved - a.resolved);
                break;
            case 'name':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                break;
        }

        return result;
    }, [complaints, searchTerm, sortBy]);

    if (loading) return <div className="flex justify-center items-center h-[60vh] animate-pulse text-indigo-500 font-bold tracking-widest uppercase">Analyzing Data...</div>;

    return (
        <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
            <AdminSidebar
                complaints={complaints}
                isMobileOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex-1 h-full overflow-y-auto lg:pl-8"
                style={{ marginLeft: '288px' }}
            >
                <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-100 px-4 py-3">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-bold transition-colors"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        <span className="text-sm">{isSidebarOpen ? 'Close Menu' : 'Open Menu'}</span>
                    </button>
                </div>

                <div className="w-full space-y-10 pr-4 lg:pr-8 py-10 pt-24">
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight font-outfit">User <span className="text-indigo-600">Analytics</span></h1>
                            <p className="text-slate-500 mt-2 font-medium">Detailed breakdown of complaint status per registered user.</p>
                        </div>
                        <div
                            className={clsx(
                                "flex items-center gap-3 p-1.5 rounded-2xl border shadow-sm transition-all",
                                isSystemOnline ? "bg-white border-slate-100 shadow-slate-100/50" : "bg-red-50 border-red-100 shadow-red-100/50"
                            )}
                        >
                            <div className={clsx(
                                "w-2.5 h-2.5 rounded-full ml-2",
                                isSystemOnline ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                            )}></div>
                            <span className={clsx(
                                "text-[11px] font-black uppercase tracking-widest mr-3",
                                isSystemOnline ? "text-slate-600" : "text-red-600"
                            )}>
                                System {isSystemOnline ? 'Online' : 'Offline'}
                            </span>
                        </div>
                    </header>

                    <div className="premium-card overflow-hidden">
                        <div className="p-6 sm:p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 font-outfit tracking-tight">User Breakdown</h3>
                                <p className="text-slate-500 text-sm font-medium mt-1">Complaint distribution across your user base.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="relative group w-full md:w-80">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        className="input-field pl-12 w-full"
                                        placeholder="Search by name or email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <Filter className="text-slate-400" size={18} />
                                    <select
                                        className="input-field !px-0 py-3 cursor-pointer min-w-[170px] appearance-auto text-center font-bold"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="total">Sort by Activity</option>
                                        <option value="resolved">Sort by Success</option>
                                        <option value="name">Sort by Name</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
                                        <th className="px-10 py-6">User Identity</th>
                                        <th className="px-10 py-6 text-center">Total</th>
                                        <th className="px-10 py-6 text-center">Pending</th>
                                        <th className="px-10 py-6 text-center">In Progress</th>
                                        <th className="px-10 py-6 text-center">Resolved</th>
                                        <th className="px-10 py-6 text-center text-red-500">Rejected</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {userAnalytics.map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm capitalize border border-indigo-100">
                                                        {u.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">{u.name}</p>
                                                        <p className="text-xs text-slate-500 font-medium">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-center">
                                                <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-900 text-xs font-black">
                                                    {u.total}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6 text-center">
                                                <span className="text-sm font-bold text-amber-500 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    {u.pending > 0 ? u.pending : '-'}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6 text-center">
                                                <span className="text-sm font-bold text-blue-500 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    {u.inProgress > 0 ? u.inProgress : '-'}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6 text-center">
                                                <span className="text-sm font-bold text-emerald-500 group-hover:scale-110 inline-block transition-transform">
                                                    {u.resolved > 0 ? u.resolved : '-'}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6 text-center">
                                                <span className="text-sm font-bold text-red-500 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    {u.rejected > 0 ? u.rejected : '-'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default UserAnalytics;
