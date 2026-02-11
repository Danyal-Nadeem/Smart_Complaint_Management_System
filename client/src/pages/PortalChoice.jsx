import React from 'react';
import { motion } from 'framer-motion';
import { User, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PortalChoice = () => {
    return (
        <div className="container mx-auto px-4 min-h-[80vh] flex items-center justify-center py-16 pt-32">
            <div className="max-w-3xl w-full">
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl sm:text-5xl font-black text-slate-900 font-outfit tracking-tight mb-4"
                    >
                        Welcome to <span className="text-indigo-600">CMS Pro</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 font-medium"
                    >
                        Please select your access portal to continue
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* User Portal Card */}
                    <motion.div
                        whileHover={{ y: -6 }}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Link to="/login" className="premium-card p-8 block group hover:border-indigo-200 transition-all">
                            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <User className="text-indigo-600" size={32} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 font-outfit mb-3">User Portal</h2>
                            <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed">
                                Submit complaints, track resolutions, and manage your tickets in a clean, intuitive interface.
                            </p>
                            <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-[11px]">
                                Enter Portal <ArrowRight size={16} />
                            </div>
                        </Link>
                    </motion.div>

                    {/* Admin Portal Card */}
                    <motion.div
                        whileHover={{ y: -6 }}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Link to="/admin/login" className="premium-card p-8 block group hover:border-indigo-200 transition-all">
                            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="text-white" size={32} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 font-outfit mb-3">Admin Portal</h2>
                            <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed">
                                Oversee system statistics, manage all complaints, update status, and provide official resolutions.
                            </p>
                            <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-[11px]">
                                Management Entry <ArrowRight size={16} />
                            </div>
                        </Link>
                    </motion.div>
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center mt-12 text-slate-400 text-sm font-bold uppercase tracking-widest"
                >
                    Secure • Smart • Professional
                </motion.p>
            </div>
        </div>
    );
};

export default PortalChoice;
