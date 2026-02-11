import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
    Users, MessageSquare, AlertCircle, CheckCircle2,
    BarChart3, PieChart as PieChartIcon, ArrowRight,
    Search, Filter, MoreHorizontal, Edit3, XCircle
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { clsx } from 'clsx';

const AdminDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [updateForm, setUpdateForm] = useState({ status: '', resolution: '' });

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const [complaintsRes, statsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/complaints', config),
                axios.get('http://localhost:5000/api/complaints/stats', config)
            ]);

            setComplaints(complaintsRes.data.data);
            setStats(statsRes.data.data);
        } catch (error) {
            console.error('Error fetching admin data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/complaints/${id}`, updateForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditingId(null);
            fetchAdminData();
        } catch (error) {
            alert('Update failed');
        }
    };

    const statusColors = {
        'Pending': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        'In Progress': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        'Resolved': 'bg-green-500/10 text-green-500 border-green-500/20',
        'Rejected': 'bg-red-500/10 text-red-500 border-red-500/20'
    };

    const COLORS = ['#0ea5e9', '#6366f1', '#f59e0b', '#ef4444', '#10b981'];

    if (loading) return <div className="flex justify-center items-center h-[60vh] animate-pulse text-blue-500">Loading Dashboard...</div>;

    const filteredComplaints = complaints.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight font-outfit">Admin <span className="text-indigo-600">Dashboard</span></h1>
                    <p className="text-slate-500 mt-2 font-medium">Comprehensive system overview and complaint life-cycle management.</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm shadow-slate-100/50">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse ml-2"></div>
                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest mr-3">System Online</span>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Total Complaints', val: complaints.length, icon: MessageSquare, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Pending Review', val: complaints.filter(c => c.status === 'Pending').length, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'In Progress', val: complaints.filter(c => c.status === 'In Progress').length, icon: Edit3, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Resolved', val: complaints.filter(c => c.status === 'Resolved').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                ].map((stat, i) => (
                    <div key={i} className="premium-card p-8 flex items-center gap-6 group hover:scale-[1.03]">
                        <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:rotate-6`}>
                            <stat.icon size={28} />
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                            <p className="text-3xl font-black text-slate-900 font-outfit">{stat.val}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid md:grid-cols-2 gap-10">
                <div className="premium-card p-6 sm:p-10 h-[450px]">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-xl">
                                <BarChart3 className="text-indigo-600" size={20} />
                            </div>
                            <h3 className="font-extrabold text-slate-900 font-outfit uppercase tracking-tighter">Category Distribution</h3>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={stats?.category || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vert={false} />
                            <XAxis dataKey="_id" stroke="#94a3b8" fontSize={11} fontWeight={700} axisLine={false} tickLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={11} fontWeight={700} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                                cursor={{ fill: '#f8fafc' }}
                            />
                            <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="premium-card p-6 sm:p-10 h-[450px]">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-xl">
                                <PieChartIcon className="text-indigo-600" size={20} />
                            </div>
                            <h3 className="font-extrabold text-slate-900 font-outfit uppercase tracking-tighter">Priority Status</h3>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height="85%">
                        <PieChart>
                            <Pie
                                data={stats?.priority || []}
                                cx="50%" cy="50%"
                                innerRadius={70}
                                outerRadius={100}
                                paddingAngle={8}
                                dataKey="count"
                                nameKey="_id"
                                stroke="none"
                            >
                                {stats?.priority.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Management Table */}
            <div className="premium-card overflow-hidden">
                <div className="p-6 sm:p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 font-outfit tracking-tight">Manage Complaints</h3>
                        <p className="text-slate-500 text-sm font-medium mt-1">Update status and provide resolutions.</p>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input
                            type="text"
                            className="input-field pl-12 w-full md:w-80"
                            placeholder="Search user or title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
                                <th className="px-10 py-6">Submitted By</th>
                                <th className="px-10 py-6">Complaint Details</th>
                                <th className="px-10 py-6">Priority</th>
                                <th className="px-10 py-6">Status</th>
                                <th className="px-10 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredComplaints.map((c) => (
                                <tr key={c._id} className="hover:bg-slate-50/30 transition-colors group">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-lg capitalize border border-indigo-100">
                                                {c.user?.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 leading-tight">{c.user?.name}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{c.user?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <p className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">{c.title}</p>
                                        <p className="text-xs text-slate-500 line-clamp-1 mt-1 font-medium">{c.description}</p>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className={clsx(
                                            "text-[10px] font-black px-3 py-1.5 rounded-xl border uppercase tracking-widest",
                                            c.priority === 'High' ? "text-red-600 bg-red-50 border-red-100" :
                                                c.priority === 'Medium' ? "text-amber-600 bg-amber-50 border-amber-100" : "text-emerald-600 bg-emerald-50 border-emerald-100"
                                        )}>
                                            {c.priority}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8">
                                        {editingId === c._id ? (
                                            <select
                                                className="bg-white border border-indigo-200 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:ring-4 focus:ring-indigo-100"
                                                value={updateForm.status}
                                                onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Resolved">Resolved</option>
                                                <option value="Rejected">Rejected</option>
                                            </select>
                                        ) : (
                                            <span className={clsx(
                                                "text-[10px] font-black px-4 py-2 rounded-xl border uppercase tracking-widest shadow-sm shadow-slate-100/50",
                                                c.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                    c.status === 'In Progress' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                        c.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                            'bg-red-50 text-red-600 border-red-100'
                                            )}>
                                                {c.status}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        {editingId === c._id ? (
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => handleUpdate(c._id)}
                                                    className="px-5 py-2.5 text-xs bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="px-5 py-2.5 text-xs bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setEditingId(c._id);
                                                    setUpdateForm({ status: c.status, resolution: c.resolution || '' });
                                                }}
                                                className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all border border-transparent hover:border-indigo-100"
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
