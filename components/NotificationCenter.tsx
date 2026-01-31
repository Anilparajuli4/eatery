'use client';

import React, { useEffect, useState } from 'react';
import socket from '@/lib/socket';
import { useAuth } from '@/context/AuthContext';
import { Bell, X } from 'lucide-react';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
}

export default function NotificationCenter() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        if (user) {
            // Join specific rooms based on role
            if (user.role === 'ADMIN') {
                socket.emit('join_admin_room');
            }
            if (user.role === 'STAFF' || user.role === 'ADMIN') {
                socket.emit('join_staff_room');
            }
            socket.emit('join_user_room', user.id);
        }

        const handleNotification = (notif: any) => {
            const id = Math.random().toString(36).substr(2, 9);
            const newNotif = { ...notif, id };
            setNotifications(prev => [...prev, newNotif]);

            // Play sound alert
            try {
                const audio = new Audio('/notification.mp3');
                audio.play().catch(e => console.log('Audio play blocked'));
            } catch (e) { }

            // Auto-remove after 5 seconds
            setTimeout(() => {
                removeNotification(id);
            }, 5000);
        };

        socket.on('notification', handleNotification);

        return () => {
            socket.off('notification', handleNotification);
        };
    }, [user]);

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    if (notifications.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[9999] space-y-3 max-w-sm w-full">
            {notifications.map((notif) => (
                <div
                    key={notif.id}
                    className="bg-white rounded-2xl p-4 shadow-2xl border-2 border-orange-100 flex gap-4 animate-in slide-in-from-right"
                >
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 flex-shrink-0">
                        <Bell size={24} />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-gray-800">{notif.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                    </div>
                    <button
                        onClick={() => removeNotification(notif.id)}
                        className="text-gray-400 hover:text-gray-600 self-start p-1"
                    >
                        <X size={18} />
                    </button>
                </div>
            ))}
        </div>
    );
}
