import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const AuthContext = createContext();

const SOCKET_URL = 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSystemOnline, setIsSystemOnline] = useState(true);
    const [socket, setSocket] = useState(null);

    // Axios interceptor for security
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    logout();
                }
                return Promise.reject(error);
            }
        );

        // Listen for storage changes (detect manual token removal/change in another tab or devtools)
        const handleStorageChange = (e) => {
            if (e.key === 'token') {
                if (!e.newValue) {
                    logout();
                } else {
                    fetchUser(e.newValue);
                }
            }
        };
        window.addEventListener('storage', handleStorageChange);

        return () => {
            axios.interceptors.response.eject(interceptor);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            fetchUser(token);
        } else {
            setLoading(false);
        }

        // Initialize socket connection
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        // Fetch initial system status
        fetchSystemStatus();

        newSocket.on('systemStatusUpdate', (status) => {
            console.log('System status updated via socket:', status);
            setIsSystemOnline(status);
        });

        return () => newSocket.close();
    }, []);

    const fetchSystemStatus = async () => {
        try {
            const { data } = await axios.get(`${SOCKET_URL}/api/system/status`);
            setIsSystemOnline(data.data.isSystemOnline);
        } catch (error) {
            console.error('Error fetching system status', error);
        }
    };

    const toggleSystemStatus = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.put(`${SOCKET_URL}/api/system/toggle`, {}, config);
            setIsSystemOnline(data.data.isSystemOnline);
        } catch (error) {
            console.error('Error toggling system status', error);
            throw error;
        }
    };

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
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            updateProfile,
            isSystemOnline,
            toggleSystemStatus
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
