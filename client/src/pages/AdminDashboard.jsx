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
        <div className="space-y-8 max-w-7xl mx-auto">
            <header>
                <h1 className="text-3xl font-bold">Admin <span className="text-blue-500">Dashboard</span></h1>
                <p className="text-slate-400">System overview and complaint management</p>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Complaints', val: complaints.length, icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Pending Review', val: complaints.filter(c => c.status === 'Pending').length, icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                    { label: 'In Progress', val: complaints.filter(c => c.status === 'In Progress').length, icon: Edit3, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                    { label: 'Resolved', val: complaints.filter(c => c.status === 'Resolved').length, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
                ].map((stat, i) => (
                    <div key={i} className="glass p-6 rounded-2xl flex items-center gap-4 hover:border-slate-700 transition-colors">
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                            <p className="text-2xl font-bold">{stat.val}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid md:grid-cols-2 gap-8">
                <div className="glass p-6 rounded-3xl h-[400px]">
                    <div className="flex items-center gap-2 mb-6">
                        <BarChart3 className="text-blue-500" size={20} />
                        <h3 className="font-bold">Category Distribution</h3>
                    </div>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={stats?.category || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vert={false} />
                            <XAxis dataKey="_id" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="glass p-6 rounded-3xl h-[400px]">
                    <div className="flex items-center gap-2 mb-6">
                        <PieChartIcon className="text-indigo-500" size={20} />
                        <h3 className="font-bold">Priority Status</h3>
                    </div>
                    <ResponsiveContainer width="100%" height="90%">
                        <PieChart>
                            <Pie
                                data={stats?.priority || []}
                                cx="50%" cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="count"
                                nameKey="_id"
                            >
                                {stats?.priority.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Management Table */}
            <div className="glass rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-xl font-bold">Manage Complaints</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            className="bg-slate-900 border border-slate-800 pl-10 pr-4 py-2 rounded-xl text-sm w-full md:w-64 focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="Search user or title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-widest">
                                <th className="px-6 py-4 font-semibold">Submitted By</th>
                                <th className="px-6 py-4 font-semibold">Complaint Details</th>
                                <th className="px-6 py-4 font-semibold">Priority</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredComplaints.map((c) => (
                                <tr key={c._id} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold text-sm capitalize">
                                                {c.user?.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white leading-tight">{c.user?.name}</p>
                                                <p className="text-[11px] text-slate-500">{c.user?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm font-medium text-slate-200 line-clamp-1">{c.title}</p>
                                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{c.description}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={clsx(
                                            "text-[10px] font-bold px-2 py-0.5 rounded",
                                            c.priority === 'High' ? "text-red-500 bg-red-500/10" :
                                                c.priority === 'Medium' ? "text-yellow-500 bg-yellow-500/10" : "text-green-500 bg-green-500/10"
                                        )}>
                                            {c.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        {editingId === c._id ? (
                                            <select
                                                className="bg-slate-900 border border-slate-700 text-xs rounded px-2 py-1 outline-none"
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
                                                "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                                                statusColors[c.status]
                                            )}>
                                                {c.status}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        {editingId === c._id ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleUpdate(c._id)}
                                                    className="p-1 px-3 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="p-1 px-3 text-xs bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors"
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
                                                className="p-2 text-slate-500 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
                                            >
                                                <Edit3 size={16} />
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
