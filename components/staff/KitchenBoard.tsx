'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import socket from '@/lib/socket';
import {
    Clock,
    CheckCircle2,
    Timer,
    Receipt,
    ChefHat,
    ShoppingBag,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Order {
    id: number;
    status: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
    total: number;
    createdAt: string;
    items: any[];
}

const statusColors = {
    PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
    PREPARING: 'bg-blue-100 text-blue-700 border-blue-200',
    READY: 'bg-green-100 text-green-700 border-green-200',
    COMPLETED: 'bg-slate-100 text-slate-700 border-slate-200',
    CANCELLED: 'bg-red-100 text-red-700 border-red-200',
};

export default function KitchenBoard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/staff/orders');
            setOrders(res.data.filter((o: Order) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED'));
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();

        if (!socket.connected) {
            socket.connect();
        }

        socket.emit('join_staff_room');

        const handleNewOrder = (order: Order) => {
            setOrders(prev => {
                const exists = prev.find(o => o.id === order.id);
                if (exists) return prev;
                return [order, ...prev];
            });
        };

        const handleOrderUpdate = (order: Order) => {
            setOrders(prev => {
                if (order.status === 'COMPLETED' || order.status === 'CANCELLED') {
                    return prev.filter(o => o.id !== order.id);
                }
                const exists = prev.find(o => o.id === order.id);
                if (exists) {
                    return prev.map(o => o.id === order.id ? order : o);
                }
                return [order, ...prev];
            });
        };

        socket.on('new_order', handleNewOrder);
        socket.on('order_updated', handleOrderUpdate);

        return () => {
            socket.off('new_order', handleNewOrder);
            socket.off('order_updated', handleOrderUpdate);
        };
    }, []);

    const updateStatus = async (id: number, status: string) => {
        try {
            await api.patch(`/staff/orders/${id}/status`, { status });
            // local state will be updated via 'order_updated' socket event
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) return (
        <div className="flex h-[60vh] items-center justify-center">
            <Loader2 className="animate-spin text-orange-500" size={48} />
        </div>
    );

    const columns = [
        { title: 'Incoming', status: 'PENDING', icon: Clock, color: 'text-amber-500' },
        { title: 'Preparing', status: 'PREPARING', icon: ChefHat, color: 'text-blue-500' },
        { title: 'Ready', status: 'READY', icon: CheckCircle2, color: 'text-green-500' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
            {columns.map(col => (
                <div key={col.status} className="flex flex-col gap-4 bg-slate-100/50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl bg-white dark:bg-slate-900 shadow-sm ${col.color}`}>
                                <col.icon size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{col.title}</h2>
                        </div>
                        <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-bold">
                            {orders.filter(o => o.status === col.status).length}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        <AnimatePresence>
                            {orders.filter(o => o.status === col.status).map(order => (
                                <motion.div
                                    key={order.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase">Order #{order.id}</p>
                                            <div className="flex items-center gap-1 text-slate-500 mt-1">
                                                <Timer size={14} />
                                                <span className="text-xs font-medium">
                                                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                            <Receipt size={16} className="text-slate-400" />
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        {order.items.map((item: any) => (
                                            <div key={item.id} className="flex justify-between items-center text-sm">
                                                <span className="text-slate-600 dark:text-slate-300 font-medium">
                                                    <span className="text-orange-500 font-bold mr-2">{item.quantity}x</span>
                                                    {item.product.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-2">
                                        {col.status === 'PENDING' && (
                                            <button
                                                onClick={() => updateStatus(order.id, 'PREPARING')}
                                                className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-bold transition-colors"
                                            >
                                                Start Preparing
                                            </button>
                                        )}
                                        {col.status === 'PREPARING' && (
                                            <button
                                                onClick={() => updateStatus(order.id, 'READY')}
                                                className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold transition-colors"
                                            >
                                                Mark Ready
                                            </button>
                                        )}
                                        {col.status === 'READY' && (
                                            <button
                                                onClick={() => updateStatus(order.id, 'COMPLETED')}
                                                className="flex-1 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl text-sm font-bold transition-colors"
                                            >
                                                Completed
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            ))}
        </div>
    );
}
