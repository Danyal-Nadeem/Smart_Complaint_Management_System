import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, List, Clock, CheckCircle, XCircle, FileText, Send, Filter, AlertTriangle, Shield, Menu, X, Trash2, Pencil } from 'lucide-react';
import { clsx } from 'clsx';
import UserSidebar from '../components/UserSidebar';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import CountdownTimer from '../components/CountdownTimer';
import CustomDropdown from '../components/CustomDropdown';

const UserDashboard = () => {
    const { isSystemOnline } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingComplaint, setEditingComplaint] = useState(null);
    const [filter, setFilter] = useState('All');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('dashboard');

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        category: 'General',
        priority: 'Medium',
        description: ''
    });

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const { data } = await axios.get('http://localhost:5000/api/complaints', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComplaints(data.data);
        } catch (error) {
            console.error('Error fetching complaints', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = sessionStorage.getItem('token');
            if (editingComplaint) {
                await axios.put(`http://localhost:5000/api/complaints/${editingComplaint._id}/update`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Complaint updated successfully');
            } else {
                await axios.post('http://localhost:5000/api/complaints', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Complaint submitted successfully');
            }
            setIsFormOpen(false);
            setEditingComplaint(null);
            setFormData({ title: '', category: 'General', priority: 'Medium', description: '' });
            fetchComplaints();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this complaint?')) return;
        try {
            const token = sessionStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/complaints/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Complaint deleted');
            fetchComplaints();
        } catch (error) {
            toast.error('Failed to delete complaint');
        }
    };

    const handleEdit = (complaint) => {
        if (complaint.status !== 'Pending') {
            toast.error('Only pending complaints can be edited');
            return;
        }
        setEditingComplaint(complaint);
        setFormData({
            title: complaint.title,
            category: complaint.category,
            priority: complaint.priority,
            description: complaint.description
        });
        setIsFormOpen(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingComplaint(null);
        setFormData({ title: '', category: 'General', priority: 'Medium', description: '' });
        setIsFormOpen(false);
    };

    const statusIcons = {
        'Pending': <Clock className="text-yellow-500" size={16} />,
        'In Progress': <AlertTriangle className="text-blue-500" size={16} />,
        'Resolved': <CheckCircle className="text-green-500" size={16} />,
        'Rejected': <XCircle className="text-red-500" size={16} />
    };

    const filteredComplaints = filter === 'All'
        ? complaints
        : complaints.filter(c => c.status === filter);

    const handleNavigate = (section) => {
        setActiveSection(section);

        let targetId = section;
        if (section === 'submit') {
            setIsFormOpen(true);
            targetId = 'new-complaint';
        } else if (section === 'complaints') {
            targetId = 'my-complaints';
        }

        // Delay scroll slightly to allow the form to open if needed
        setTimeout(() => {
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    return (
        <div className="flex min-h-screen w-full bg-slate-50">
            {/* Sidebar */}
            <UserSidebar
                complaints={complaints}
                activeSection={activeSection}
                onNavigate={handleNavigate}
                isMobileOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content */}
            <div className="flex-1 w-full lg:ml-72 lg:pl-8 px-4">
                {/* Mobile Menu Toggle */}
                <div className="lg:hidden sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 -mx-4 px-4 py-3 mb-6">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-bold transition-colors"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        <span className="text-sm">{isSidebarOpen ? 'Close Menu' : 'Open Menu'}</span>
                    </button>
                </div>

                <div className="w-full space-y-10 pr-4 lg:pr-8 py-10 pt-24">
                    {!isSystemOnline && (
                        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-4 text-red-600 font-bold animate-pulse">
                            <AlertTriangle size={20} />
                            <span>System is currently OFFLINE. Some features may be restricted.</span>
                        </div>
                    )}
                    <div id="dashboard" className="flex flex-col md:flex-row md:items-center justify-between gap-6 scroll-mt-24">
                        <div>
                            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight font-outfit">Your Complaints</h1>
                            <p className="text-slate-500 mt-2 font-medium">Submit new complaints and track their resolution status in real-time.</p>
                        </div>
                        <button
                            onClick={() => isSystemOnline ? setIsFormOpen(!isFormOpen) : toast.error('System is currently offline for maintenance')}
                            disabled={!isSystemOnline}
                            className={clsx(
                                "flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-white text-sm shadow-lg transition-all",
                                isSystemOnline
                                    ? "premium-gradient shadow-indigo-100 hover:scale-[1.02] active:scale-95"
                                    : "bg-slate-300 cursor-not-allowed opacity-70 shadow-none"
                            )}
                        >
                            <PlusCircle size={16} />
                            {isSystemOnline ? 'Submit Complaint' : 'System Offline'}
                        </button>
                    </div>

                    <AnimatePresence>
                        {isFormOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <form id="new-complaint" onSubmit={handleSubmit} className="premium-card p-6 sm:p-10 grid md:grid-cols-2 gap-8 mb-10 scroll-mt-24">
                                    <div className="md:col-span-2 flex items-center justify-between mb-2">
                                        <h2 className="text-2xl font-bold font-outfit text-slate-900 flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 rounded-xl">
                                                {editingComplaint ? <Pencil className="text-indigo-600" size={24} /> : <FileText className="text-indigo-600" size={24} />}
                                            </div>
                                            {editingComplaint ? 'Update Complaint' : 'New Complaint Details'}
                                        </h2>
                                        <button type="button" onClick={handleCancelEdit} className="text-slate-400 hover:text-red-500 font-bold transition-colors">Cancel</button>
                                    </div>

                                    <div className="space-y-2.5">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Complaint Title</label>
                                        <div className="relative group">
                                            <input
                                                type="text" required
                                                className="input-field pl-5"
                                                placeholder="e.g. WiFi issue in Hostel Wing B"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
                                            <CustomDropdown
                                                options={['General', 'Technical', 'Hostel', 'Academic', 'Other']}
                                                value={formData.category}
                                                onChange={(val) => setFormData({ ...formData, category: val })}
                                            />
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Priority</label>
                                            <CustomDropdown
                                                options={['Low', 'Medium', 'High']}
                                                value={formData.priority}
                                                onChange={(val) => setFormData({ ...formData, priority: val })}
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-2.5">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                        <textarea
                                            required rows="5"
                                            className="input-field pl-5 resize-none h-40"
                                            placeholder="Provide detailed information about your issue..."
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        ></textarea>
                                    </div>

                                    <div className="md:col-span-2 flex justify-end">
                                        <button type="submit" className="premium-gradient px-6 py-2.5 rounded-xl font-bold text-white text-sm flex items-center gap-2 premium-shadow hover:opacity-95 transition-all active:scale-95">
                                            {editingComplaint ? <CheckCircle size={18} /> : <Send size={18} />}
                                            {editingComplaint ? 'Update Ticket' : 'Submit Ticket'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div id="my-complaints" className="space-y-8 scroll-mt-24">
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-5 overflow-x-auto scrollbar-hide">
                            <div className="bg-slate-100 p-2 rounded-xl">
                                <Filter size={18} className="text-slate-500 shrink-0" />
                            </div>
                            {['All', 'Pending', 'In Progress', 'Resolved', 'Rejected'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={clsx(
                                        "px-6 py-2 rounded-2xl text-sm font-bold whitespace-nowrap transition-all",
                                        filter === status
                                            ? "bg-white text-indigo-600 border border-indigo-100 shadow-sm shadow-indigo-100/50 scale-105"
                                            : "text-slate-500 hover:text-slate-900 border border-transparent"
                                    )}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-100 border-t-indigo-600"></div>
                            </div>
                        ) : filteredComplaints.length === 0 ? (
                            <div className="premium-card p-20 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
                                    <List className="text-slate-300" size={40} />
                                </div>
                                <h3 className="text-2xl font-bold font-outfit text-slate-900">No complaints found</h3>
                                <p className="text-slate-500 mt-2 max-w-xs font-medium">You haven't submitted any complaints matching this filter yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {filteredComplaints.map((complaint) => (
                                    <motion.div
                                        layout
                                        key={complaint._id}
                                        className="premium-card p-5 group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                                            <Shield size={60} className="text-indigo-600" />
                                        </div>
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={clsx(
                                                "px-2.5 py-1 rounded-lg text-[9px] uppercase font-black tracking-widest border",
                                                complaint.priority === 'High' ? "bg-red-50 text-red-600 border-red-100" :
                                                    complaint.priority === 'Medium' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                            )}>
                                                {complaint.priority}
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                {complaint.status === 'Pending' && (
                                                    <button
                                                        onClick={() => handleEdit(complaint)}
                                                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                        title="Edit Complaint"
                                                    >
                                                        <Pencil size={15} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(complaint._id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete Complaint"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-lg bg-white border border-slate-100 shadow-sm shadow-slate-100/50">
                                                    {statusIcons[complaint.status]}
                                                    <span className="text-slate-700 uppercase tracking-tighter whitespace-nowrap">{complaint.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-extrabold mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight font-outfit text-slate-900">{complaint.title}</h3>
                                        <p className="text-slate-500 text-[13px] mb-4 line-clamp-2 leading-relaxed font-medium">{complaint.description}</p>
                                        {complaint.status === 'In Progress' && (
                                            <div className="mb-4 flex justify-center scale-90 origin-center">
                                                {complaint.estimatedCompletionDate ? (
                                                    <CountdownTimer targetDate={complaint.estimatedCompletionDate} />
                                                ) : (
                                                    <div className="px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-1.5">
                                                        <Clock size={12} className="text-slate-400" />
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Resolution Time Pending</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold">
                                                <Clock size={12} />
                                                {new Date(complaint.createdAt).toLocaleDateString()}
                                            </div>
                                            <span className="text-[10px] font-black px-2.5 py-1 bg-indigo-50/50 rounded-lg text-indigo-600 border border-indigo-50 uppercase tracking-widest">{complaint.category}</span>
                                        </div>
                                        {complaint.resolution && (
                                            <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100 shadow-inner">
                                                <div className="flex items-center gap-1.5 mb-1">
                                                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.1em]">Response</p>
                                                </div>
                                                <p className="text-[11px] text-emerald-700 font-medium leading-relaxed italic">"{complaint.resolution}"</p>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
