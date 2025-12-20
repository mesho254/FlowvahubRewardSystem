import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userDetails, setUserDetails] = useState({ email: '', points: 0, display_name: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUserDetails();
            setUser(true);
        }
        setLoading(false);
    }, []);

    const fetchUserDetails = async () => {
        try {
            const res = await axios.get('https://flowvahub-reward-system.vercel.app/api/rewards/profile');
            setUserDetails(res.data);
        } catch (err) {
            console.error('Failed to fetch user details');
        }
    };

    const login = async (email, password) => {
        try {
            const res = await axios.post('https://flowvahub-reward-system.vercel.app/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.session.access_token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.session.access_token}`;
            await fetchUserDetails();
            setUser(true);
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const signup = async (email, password, redirectTo) => {
        try {
            await axios.post('https://flowvahub-reward-system.vercel.app/api/auth/signup', { email, password, redirectTo });
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const logout = async () => {
        try {
            await axios.post('https://flowvahub-reward-system.vercel.app/api/auth/logout');
        } catch (err) {
            console.error(err);
        } finally {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
            setUserDetails({ email: '', points: 0, display_name: '' });
        }
    };

    const refreshSession = async (access_token, refresh_token) => {
        try {
            const res = await axios.post('https://flowvahub-reward-system.vercel.app/api/auth/refresh', { refresh_token });
            localStorage.setItem('token', res.data.session.access_token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.session.access_token}`;
            await fetchUserDetails();
            setUser(true);
        } catch (err) {
            console.error('Session refresh failed', err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, userDetails, fetchUserDetails, login, signup, logout, refreshSession }}>
            {children}
        </AuthContext.Provider>
    );
};