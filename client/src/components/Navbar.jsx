import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LogOut, LayoutDashboard, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white">
                    <Shield className="text-blue-500" />
                    <span>CMS <span className="text-blue-500">Pro</span></span>
                </Link>

                <div className="flex items-center gap-6">
                    {user ? (
                        <>
                            <div className="flex items-center gap-2 text-slate-300">
                                <User size={18} />
                                <span className="text-sm font-medium">{user.name}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 capitalize">
                                    {user.role}
                                </span>
                            </div>

                            {user.role === 'admin' && (
                                <Link
                                    to="/admin"
                                    className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
                                >
                                    <LayoutDashboard size={18} />
                                    <span className="text-sm">Admin Panel</span>
                                </Link>
                            )}

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors"
                            >
                                <LogOut size={18} />
                                <span className="text-sm ml-1">Sign Out</span>
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-4">
                            <Link to="/login" className="text-slate-300 hover:text-white text-sm">Login</Link>
                            <Link
                                to="/register"
                                className="premium-gradient px-4 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
