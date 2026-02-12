import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
    Users, MessageSquare, AlertCircle, CheckCircle2,
    BarChart3, PieChart as PieChartIcon, ArrowRight,
    Search, Filter, MoreHorizontal, Edit3, XCircle, Menu, X
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import ComplaintDetailsModal from '../components/ComplaintDetailsModal';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [updateForm, setUpdateForm] = useState({ status: '', resolution: '' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [isSystemOnline, setIsSystemOnline] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    // Process complaints data for the weekly analytics sparkline
    const processAnalyticsData = (allComplaints) => {
        const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        const today = new Date();

        // Initialize counts for the last 7 days
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            last7Days.push({
                fullDate: d.toDateString(),
                day: days[d.getDay()],
                value: 0
            });
        }

        // Count complaints for each of those days
        allComplaints.forEach(complaint => {
            const complaintDate = new Date(complaint.createdAt).toDateString();
            const dayIndex = last7Days.findIndex(d => d.fullDate === complaintDate);
            if (dayIndex !== -1) {
                last7Days[dayIndex].value += 1;
            }
        });

        return last7Days;
    };

    const analyticsData = useMemo(() => processAnalyticsData(complaints), [complaints]);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const token = sessionStorage.getItem('token');
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
            const token = sessionStorage.getItem('token');
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
        <div className="flex min-h-screen w-full bg-slate-50">
            {/* Sidebar */}
            <AdminSidebar
                complaints={complaints}
                activeSection={activeSection}
                onNavigate={(section) => {
                    setActiveSection(section);
                    const element = document.getElementById(section);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }}
                isMobileOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content */}
            <div className="flex-1 w-full lg:pl-8" style={{ marginLeft: '288px' }}>
                {/* Mobile Menu Toggle */}
                <div className="lg:hidden sticky top-16 z-30 bg-white border-b border-slate-100 px-4 py-3">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-bold transition-colors"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        <span className="text-sm">{isSidebarOpen ? 'Close Menu' : 'Open Menu'}</span>
                    </button>
                </div>

                <div className="w-full space-y-10 pr-4 lg:pr-8 py-10 pt-24">
                    <header id="dashboard" className="flex flex-col md:flex-row md:items-end justify-between gap-6 scroll-mt-24">
                        <div>
                            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight font-outfit">Admin <span className="text-indigo-600">{user?.name}</span></h1>
                            <p className="text-slate-500 mt-2 font-medium">Comprehensive system overview and complaint life-cycle management.</p>
                        </div>
                        <button
                            onClick={() => setIsSystemOnline(!isSystemOnline)}
                            className={clsx(
                                "flex items-center gap-3 p-1.5 rounded-2xl border shadow-sm transition-all hover:scale-105 active:scale-95",
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
                        </button>
                    </header>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { label: 'Total Complaints', val: complaints.length, icon: MessageSquare, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            { label: 'Pending Review', val: complaints.filter(c => c.status === 'Pending').length, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
                            { label: 'In Progress', val: complaints.filter(c => c.status === 'In Progress').length, icon: Edit3, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { label: 'Resolved', val: complaints.filter(c => c.status === 'Resolved').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        ].map((stat, i) => (
                            <div key={i} className="premium-card p-6 flex items-center gap-4 group hover:scale-[1.03]">
                                <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:rotate-6 shrink-0`}>
                                    <stat.icon size={24} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 leading-tight">{stat.label}</p>
                                    <p className="text-2xl font-black text-slate-900 font-outfit">{stat.val}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Charts Section */}
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="premium-card p-6 h-[350px]">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 rounded-xl">
                                        <BarChart3 className="text-indigo-600" size={18} />
                                    </div>
                                    <h3 className="font-extrabold text-slate-900 font-outfit uppercase tracking-tighter text-sm">Category Distribution</h3>
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height="80%">
                                <BarChart data={stats?.category || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vert={false} />
                                    <XAxis dataKey="_id" stroke="#94a3b8" fontSize={10} fontWeight={700} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={10} fontWeight={700} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                        itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                                        cursor={{ fill: '#f8fafc' }}
                                    />
                                    <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={30}>
                                        {(stats?.category || []).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="premium-card p-6 h-[350px]">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 rounded-xl">
                                        <PieChartIcon className="text-indigo-600" size={18} />
                                    </div>
                                    <h3 className="font-extrabold text-slate-900 font-outfit uppercase tracking-tighter text-sm">Priority Status</h3>
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height="80%">
                                <PieChart>
                                    <Pie
                                        data={stats?.priority || []}
                                        cx="50%" cy="50%"
                                        innerRadius={55}
                                        outerRadius={80}
                                        paddingAngle={6}
                                        dataKey="count"
                                        nameKey="_id"
                                        stroke="none"
                                    >
                                        {stats?.priority.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="premium-card p-8 h-[350px] relative overflow-hidden flex flex-col justify-between">
                            <div>
                                <h3 className="font-extrabold text-slate-900 text-lg font-outfit">Complaint Analytics</h3>
                                <div className="flex items-baseline gap-2 mt-4">
                                    <span className="text-5xl font-black text-slate-900">{complaints.filter(c => c.status === 'Resolved').length}</span>
                                    <span className="text-2xl font-bold text-slate-400">/ {complaints.length}</span>
                                </div>
                                <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest mt-1">Resolved</p>
                            </div>

                            <div className="absolute top-20 right-8 bg-white border-2 border-indigo-500 rounded-lg px-2 py-1 text-[10px] font-black text-indigo-600 shadow-lg z-10">
                                {complaints.length > 0 ? Math.round((complaints.filter(c => c.status === 'Resolved').length / complaints.length) * 100) : 0}%
                                <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-2 h-2 bg-indigo-500 rotate-45"></div>
                            </div>

                            <div className="h-32 w-full mt-auto -mx-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={analyticsData}>
                                        <defs>
                                            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis
                                            dataKey="day"
                                            axisLine={false}
                                            tickLine={false}
                                            stroke="#818cf8"
                                            fontSize={10}
                                            fontWeight={900}
                                            padding={{ left: 20, right: 20 }}
                                        />
                                        <Tooltip headerStyle={{ display: 'none' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#818cf8"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorVal)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Management Table */}
                    <div id="complaints" className="premium-card overflow-hidden scroll-mt-24">
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
                                        <tr
                                            key={c._id}
                                            onClick={() => {
                                                setSelectedComplaint(c);
                                                setIsDetailsModalOpen(true);
                                            }}
                                            className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                                        >
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
                                                        onClick={(e) => e.stopPropagation()}
                                                        onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="In Progress">In Progress</option>
                                                        <option value="Resolved">Resolved</option>
                                                        <option value="Rejected">Rejected</option>
                                                    </select>
                                                ) : (
                                                    <span className={clsx(
                                                        "text-[10px] font-black px-4 py-2 rounded-xl border uppercase tracking-widest shadow-sm shadow-slate-100/50 whitespace-nowrap",
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
                                                {!isSystemOnline ? (
                                                    <span className="text-[10px] font-bold text-slate-400 italic">Management Disabled</span>
                                                ) : editingId === c._id ? (
                                                    <div className="flex items-center justify-end gap-3" onClick={(e) => e.stopPropagation()}>
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
                                                        onClick={(e) => {
                                                            e.stopPropagation();
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
            </div>

            {/* Complaint Details Modal */}
            <ComplaintDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                complaint={selectedComplaint}
            />
        </div>
    );
};

export default AdminDashboard;
