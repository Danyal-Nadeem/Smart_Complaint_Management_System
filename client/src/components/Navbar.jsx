import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LogOut, LayoutDashboard, User, Menu, X, ChevronDown, Edit2, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import ProfileModal from './ProfileModal';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [profileModal, setProfileModal] = useState({ isOpen: false, view: 'view' });

    const handleLogout = () => {
        logout();
        setIsLogoutConfirmOpen(false);
        setIsMenuOpen(false);
        setIsProfileOpen(false);
        navigate('/');
    };

    const isGateway = location.pathname === '/';
    const isAuthPage = location.pathname.includes('/login') || location.pathname.includes('/register');
    const isAdminPortal = location.pathname.includes('/admin');
    const isUserPortal = !isGateway && !isAdminPortal;

    useEffect(() => {
        if (!user) return;

        // Condition to trigger back button interception - only on dashboards
        const isDashboardPage = location.pathname === '/dashboard' || location.pathname === '/admin-dashboard';

        if (isDashboardPage) {
            // Push a fake state to the history stack to capture the back button event
            window.history.pushState(null, '', window.location.href);

            const handlePopState = (event) => {
                // When back button is clicked, show confirmation modal
                setIsLogoutConfirmOpen(true);
                // Push the state again to keep the user on the current page while modal is open
                window.history.pushState(null, '', window.location.href);
            };

            window.addEventListener('popstate', handlePopState);

            return () => {
                window.removeEventListener('popstate', handlePopState);
            };
        }
    }, [user, location.pathname]);

    const NavLinks = () => (
        <>
            {user && !isGateway && !isAuthPage ? (
                <>
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2 text-slate-600 px-4 py-2 hover:bg-slate-50 md:bg-transparent rounded-xl transition-all group"
                        >
                            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100 group-hover:border-indigo-200 transition-colors">
                                <User size={16} className="text-indigo-600" />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-sm font-bold leading-none mb-0.5">{user.name}</span>
                                <span className="text-[10px] w-fit px-1.5 py-0 rounded-full bg-slate-100 text-slate-500 font-bold uppercase tracking-wider border border-slate-200 leading-tight">
                                    {user.role}
                                </span>
                            </div>
                            <ChevronDown size={14} className={clsx("text-slate-400 transition-transform", isProfileOpen && "rotate-180")} />
                        </button>

                        <AnimatePresence>
                            {isProfileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-2 w-48 bg-white rounded-2xl premium-shadow border border-slate-100 overflow-hidden z-[60]"
                                >
                                    <div className="p-2 space-y-1">
                                        <button
                                            onClick={() => {
                                                setProfileModal({ isOpen: true, view: 'view' });
                                                setIsProfileOpen(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                                        >
                                            <UserCircle size={18} /> View Profile
                                        </button>
                                        <button
                                            onClick={() => {
                                                setProfileModal({ isOpen: true, view: 'edit' });
                                                setIsProfileOpen(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                                        >
                                            <Edit2 size={18} /> Edit Name
                                        </button>
                                        <div className="h-px bg-slate-100 mx-2 !my-1" />
                                        <button
                                            onClick={() => {
                                                setIsLogoutConfirmOpen(true);
                                                setIsProfileOpen(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
                                        >
                                            <LogOut size={18} /> Sign Out
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </>
            ) : (
                !isGateway && (
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 px-4 md:px-0 py-2 md:py-0">
                        <Link to={isAdminPortal ? "/admin/login" : "/login"} onClick={() => setIsMenuOpen(false)} className="text-slate-600 hover:text-indigo-600 text-sm font-semibold transition-colors">Login</Link>
                        <Link
                            to={isAdminPortal ? "/admin/register" : "/register"}
                            onClick={() => setIsMenuOpen(false)}
                            className="premium-gradient px-6 py-2 rounded-2xl text-sm font-bold text-white premium-shadow hover:opacity-90 transition-all active:scale-95 text-center"
                        >
                            Get Started
                        </Link>
                    </div>
                )
            )}
        </>
    );

    return (
        <>
            <nav className="glass fixed top-0 left-0 right-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-2xl font-black text-slate-900 tracking-tight">
                        <div className="relative">
                            <Shield className="text-indigo-600 fill-indigo-50" size={32} strokeWidth={2.5} />
                        </div>
                        <span className="font-outfit flex items-baseline gap-2">
                            <span>CMS <span className="text-indigo-600">Pro</span></span>
                            {isUserPortal && <span className="text-slate-400 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] font-sans">User</span>}
                            {isAdminPortal && <span className="text-slate-400 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] font-sans">Admin</span>}
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        <NavLinks />
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-slate-100 bg-white/80 backdrop-blur-xl overflow-hidden"
                        >
                            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
                                <NavLinks />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {isLogoutConfirmOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsLogoutConfirmOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white rounded-3xl p-8 premium-shadow max-w-sm w-full text-center"
                        >
                            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <LogOut className="text-red-500" size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 font-outfit mb-2">Sign Out?</h3>
                            <p className="text-slate-500 font-medium mb-8">Are you sure you want to log out of your account?</p>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setIsLogoutConfirmOpen(false)}
                                    className="px-6 py-3 rounded-xl border border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="px-6 py-3 rounded-xl bg-red-500 text-white font-bold premium-shadow hover:bg-red-600 transition-all active:scale-95"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Profile Modal */}
            <ProfileModal
                isOpen={profileModal.isOpen}
                onClose={() => setProfileModal({ ...profileModal, isOpen: false })}
                initialView={profileModal.view}
            />
        </>
    );
};

export default Navbar;
