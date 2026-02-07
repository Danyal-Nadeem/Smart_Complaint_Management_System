import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, List, Clock, CheckCircle, XCircle, FileText, Send, Filter, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

const UserDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [filter, setFilter] = useState('All');

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
            const token = localStorage.getItem('token');
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
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/complaints', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsFormOpen(false);
            setFormData({ title: '', category: 'General', priority: 'Medium', description: '' });
            fetchComplaints();
        } catch (error) {
            alert('Failed to submit complaint');
        }
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

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Your Complaints</h1>
                    <p className="text-slate-400 mt-1">Submit new complaints and track their resolution status.</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="flex items-center gap-2 premium-gradient px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-transform"
                >
                    <PlusCircle size={20} />
                    Submit Complaint
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
                        <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl grid md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 flex items-center justify-between mb-2">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <FileText className="text-blue-500" />
                                    New Complaint Details
                                </h2>
                                <button type="button" onClick={() => setIsFormOpen(false)} className="text-slate-500 hover:text-white">Cancel</button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Complaint Title</label>
                                <input
                                    type="text" required
                                    className="bg-slate-900 border border-slate-800 w-full px-4 py-2.5 rounded-xl focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
                                    placeholder="e.g. WiFi issue in Hostel Wing B"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Category</label>
                                    <select
                                        className="bg-slate-900 border border-slate-800 w-full px-4 py-2.5 rounded-xl focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option>General</option>
                                        <option>Technical</option>
                                        <option>Hostel</option>
                                        <option>Academic</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Priority</label>
                                    <select
                                        className="bg-slate-900 border border-slate-800 w-full px-4 py-2.5 rounded-xl focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    >
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                    </select>
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-medium text-slate-300">Description</label>
                                <textarea
                                    required rows="4"
                                    className="bg-slate-900 border border-slate-800 w-full px-4 py-2.5 rounded-xl focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all resize-none"
                                    placeholder="Provide detailed information about your issue..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="md:col-span-2 flex justify-end">
                                <button type="submit" className="premium-gradient px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
                                    <Send size={18} />
                                    Submit Ticket
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-800 pb-4 overflow-x-auto">
                    <Filter size={18} className="text-slate-500 shrink-0" />
                    {['All', 'Pending', 'In Progress', 'Resolved', 'Rejected'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={clsx(
                                "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                                filter === status ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "text-slate-500 hover:text-white"
                            )}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary-500"></div>
                    </div>
                ) : filteredComplaints.length === 0 ? (
                    <div className="glass p-12 rounded-3xl flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4">
                            <List className="text-slate-600" size={32} />
                        </div>
                        <h3 className="text-xl font-bold">No complaints found</h3>
                        <p className="text-slate-500 mt-1 max-w-xs">You haven't submitted any complaints matching this filter yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredComplaints.map((complaint) => (
                            <motion.div
                                layout
                                key={complaint._id}
                                className="glass p-6 rounded-2xl hover:border-slate-700 transition-colors group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Shield size={64} />
                                </div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className={clsx(
                                        "px-2.5 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider",
                                        complaint.priority === 'High' ? "bg-red-500/20 text-red-500" :
                                            complaint.priority === 'Medium' ? "bg-yellow-500/20 text-yellow-500" : "bg-green-500/20 text-green-500"
                                    )}>
                                        {complaint.priority} Priority
                                    </span>
                                    <div className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded bg-slate-900 border border-slate-800">
                                        {statusIcons[complaint.status]}
                                        {complaint.status}
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{complaint.title}</h3>
                                <p className="text-slate-400 text-sm mb-4 line-clamp-3 leading-relaxed">{complaint.description}</p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                                    <span className="text-xs text-slate-500">{new Date(complaint.createdAt).toLocaleDateString()}</span>
                                    <span className="text-xs font-medium px-2 py-1 bg-slate-800 rounded-lg text-slate-300">{complaint.category}</span>
                                </div>

                                {complaint.resolution && (
                                    <div className="mt-4 p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                                        <p className="text-[11px] font-bold text-green-500 uppercase mb-1">Official Response:</p>
                                        <p className="text-xs text-green-500/80 italic">{complaint.resolution}</p>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
