import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            fetchUser(token);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async (token) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get('http://localhost:5000/api/auth/me', config);
            setUser(data.data);
        } catch (error) {
            sessionStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        sessionStorage.setItem('token', data.token);
        setUser(data.user);
        return data;
    };

    const register = async (name, email, password, role = 'user') => {
        const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });

        // Only set token and user if account is not pending (i.e. if token is provided)
        if (data.token) {
            sessionStorage.setItem('token', data.token);
            setUser(data.user);
        }
        return data;
    };

    const updateProfile = async (name) => {
        const token = sessionStorage.getItem('token');
        const { data } = await axios.put('http://localhost:5000/api/auth/update-profile',
            { name },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(data.data);
        return data;
    };

    const logout = () => {
        sessionStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
