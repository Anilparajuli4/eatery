'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import socket from '@/lib/socket';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN' | 'STAFF';

}

interface AuthContextType {
    user: User | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
                socket.connect();

                // Join rooms based on role
                if (parsedUser.role === 'ADMIN') {
                    socket.emit('join_admin_room');
                }
                if (parsedUser.role === 'STAFF' || parsedUser.role === 'ADMIN') {
                    socket.emit('join_staff_room');
                }
                socket.emit('join_user_room', parsedUser.id);
            } catch (e) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setIsLoading(false);

        // Global API interceptor for Auth errors
        const interceptor = api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.status === 401 || error.status === 403) {
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.response.eject(interceptor);
        };
    }, []);

    const login = (token: string, user: User) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        socket.connect();

        if (user.role === 'ADMIN') {
            socket.emit('join_admin_room');
        }
        if (user.role === 'STAFF' || user.role === 'ADMIN') {
            socket.emit('join_staff_room');
        }
        socket.emit('join_user_room', user.id);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        socket.disconnect();
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
