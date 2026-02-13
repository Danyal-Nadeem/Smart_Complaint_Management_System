import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
    Search, Filter, Edit3, Menu, X, List
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import ComplaintDetailsModal from '../components/ComplaintDetailsModal';

const ManageComplaints = () => {
    const { user, isSystemOnline } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [updateForm, setUpdateForm] = useState({ status: '', resolution: '' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [sortBy, setSortBy] = useState('latest');

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get('http://localhost:5000/api/complaints', config);
            setComplaints(res.data.data);
        } catch (error) {
            console.error('Error fetching complaints', error);
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
            fetchComplaints();
        } catch (error) {
            alert('Update failed');
        }
    };

    const { displayComplaints, allComplaints } = useMemo(() => {
        const fullList = complaints || [];
        const activeList = fullList.filter(c => c.status === 'Pending' || c.status === 'In Progress');

        let result = activeList.filter(c =>
            (c.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
        );

        const priorityWeights = { 'High': 3, 'Medium': 2, 'Low': 1 };

        switch (sortBy) {
            case 'latest':
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'oldest':
                result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'priority-desc':
                result.sort((a, b) => (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0));
                break;
            case 'priority-asc':
                result.sort((a, b) => (priorityWeights[a.priority] || 0) - (priorityWeights[b.priority] || 0));
                break;
            default:
                break;
        }

        return { displayComplaints: result, allComplaints: fullList };
    }, [complaints, searchTerm, sortBy]);

    if (loading) return <div className="flex justify-center items-center h-[60vh] animate-pulse text-blue-500">Loading Complaints...</div>;

    return (
        <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
            <AdminSidebar
                complaints={allComplaints}
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
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 scroll-mt-24">
                        <div>
                            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight font-outfit">Manage <span className="text-indigo-600">Complaints</span></h1>
                            <p className="text-slate-500 mt-2 font-medium">Handle and resolve user complaints across the system.</p>
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

                    <div id="complaints" className="premium-card overflow-hidden scroll-mt-24">
                        <div className="p-6 sm:p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 font-outfit tracking-tight">Active Complaints</h3>
                                <p className="text-slate-500 text-sm font-medium mt-1">Update status and provide resolutions.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="relative group w-full md:w-80">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        className="input-field pl-12 w-full"
                                        placeholder="Search user or title..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <Filter className="text-slate-400" size={18} />
                                    <select
                                        className="input-field !px-0 py-3 cursor-pointer min-w-[170px] appearance-auto text-center"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="latest">Latest</option>
                                        <option value="oldest">Oldest</option>
                                        <option value="priority-desc">High Priority</option>
                                        <option value="priority-asc">Low Priority</option>
                                    </select>
                                </div>
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
                                    {displayComplaints.map((c) => (
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
                                                        className="input-field !px-0 py-2 text-xs font-bold w-[120px] cursor-pointer text-center"
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
            </motion.div>

            <ComplaintDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                complaint={selectedComplaint}
            />
        </div>
    );
};

export default ManageComplaints;
