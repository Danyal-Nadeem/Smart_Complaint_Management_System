import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, MessageSquare, Tag, AlertCircle, Clock, Calendar, Shield, Hash } from 'lucide-react';
import { clsx } from 'clsx';

const ComplaintDetailsModal = ({ isOpen, onClose, complaint }) => {
    if (!complaint) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex justify-end">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="relative bg-white w-full max-w-xl h-full shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={clsx(
                                    "p-3 rounded-2xl shadow-sm",
                                    complaint.priority === 'High' ? "bg-red-50 text-red-600" :
                                        complaint.priority === 'Medium' ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                                )}>
                                    <AlertCircle size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 font-outfit uppercase tracking-tight">
                                        Complaint #{complaint._id?.slice(-6).toUpperCase()}
                                    </h3>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="hidden sm:flex flex-col items-end gap-1.5">
                                    <span className={clsx(
                                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                                        complaint.status === 'Resolved' ? "bg-emerald-100 text-emerald-700" :
                                            complaint.status === 'In Progress' ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                                    )}>
                                        {complaint.status}
                                    </span>
                                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest px-1">
                                        {complaint.category}
                                    </span>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white transition-all shadow-sm border border-transparent hover:border-slate-100"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                            <div className="flex flex-col gap-8">
                                {/* Left Side: User Info & Metadata */}
                                <div className="space-y-6">
                                    <section>
                                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Complainant Info</h4>
                                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
                                                    <User size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 leading-none mb-1">Full Name</p>
                                                    <p className="text-sm font-bold text-slate-900">{complaint.user?.name || 'Unknown User'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
                                                    <Mail size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 leading-none mb-1">Email Address</p>
                                                    <p className="text-sm font-bold text-slate-900 truncate">{complaint.user?.email || 'No Email'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Tracking Details</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Calendar size={14} className="text-slate-400" />
                                                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Date Filed</span>
                                                </div>
                                                <p className="text-xs font-bold text-slate-900">
                                                    {new Date(complaint.createdAt).toLocaleDateString(undefined, {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Hash size={14} className="text-slate-400" />
                                                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Priority Level</span>
                                                </div>
                                                <p className={clsx(
                                                    "text-xs font-black uppercase tracking-tight",
                                                    complaint.priority === 'High' ? "text-red-600" :
                                                        complaint.priority === 'Medium' ? "text-amber-600" : "text-emerald-600"
                                                )}>
                                                    {complaint.priority}
                                                </p>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                {/* Right Side: Complaint Content */}
                                <div className="space-y-6">
                                    <section>
                                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Subject & Issue</h4>
                                        <div className="space-y-4">
                                            <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100/50">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <MessageSquare size={16} className="text-indigo-600" />
                                                    <span className="text-[10px] uppercase tracking-wider font-black text-indigo-600/60">Title</span>
                                                </div>
                                                <h5 className="text-base font-black text-slate-900 leading-tight">{complaint.title}</h5>
                                            </div>

                                            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Shield size={16} className="text-slate-400" />
                                                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Description</span>
                                                </div>
                                                <p className="text-sm font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">
                                                    {complaint.description}
                                                </p>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>

                        {/* Footer / Actions */}
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-8 py-3 rounded-2xl bg-slate-900 text-white font-black text-sm premium-shadow hover:bg-slate-800 transition-all active:scale-[0.98]"
                            >
                                Close View
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ComplaintDetailsModal;
