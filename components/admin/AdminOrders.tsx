'use client';

import React, { useState, useEffect } from 'react';
import socket from '@/lib/socket';
import { useToast } from '@/context/ToastContext';

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const { showToast } = useToast();

    const fetchOrders = async () => {
        try {
            const { data } = await import('@/lib/api').then(m => m.default.get('/orders'));
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        }
    };

    useEffect(() => {
        fetchOrders();

        socket.connect();

        // Listen for new orders
        socket.on('new_order', (newOrder: any) => {
            setOrders(prev => {
                const exists = prev.find(o => o.id === newOrder.id);
                if (exists) {
                    return prev.map(o => o.id === newOrder.id ? newOrder : o);
                }
                return [newOrder, ...prev];
            });
        });

        // Listen for status updates from other staff/admins
        socket.on('order_updated', (updatedOrder: any) => {
            setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
        });

        return () => {
            socket.off('new_order');
            socket.off('order_updated');
        };
    }, []);

    const [updatingOrders, setUpdatingOrders] = useState<Set<number>>(new Set());

    const updateStatus = async (id: number, status: string) => {
        setUpdatingOrders(prev => new Set(prev).add(id));
        try {
            await import('@/lib/api').then(m => m.default.patch(`/orders/${id}/status`, { status }));
            // Optimistic update
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
            showToast(`Order status updated to ${status}`, 'success');
        } catch (error) {
            console.error("Failed to update status", error);
            showToast("Failed to update status", "error");
        } finally {
            setUpdatingOrders(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-black text-gray-800">Order Management</h2>

            {/* Order Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex gap-4 flex-wrap">
                    {['All Orders', 'Pending', 'Preparing', 'Ready', 'Completed'].map(status => (
                        <button
                            key={status}
                            className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                        >
                            {status} ({
                                status === 'All Orders' ? orders.length : orders.filter(o => o.status === status.toUpperCase()).length
                            })
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {orders.map(order => (
                    <div key={order.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-black text-gray-800 flex items-center gap-2">
                                    Order #{order.id}
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${order.paymentStatus === 'PAID' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'
                                        }`}>
                                        {order.paymentStatus}
                                    </span>
                                </h3>
                                <div className="mt-2 space-y-1">
                                    <p className="text-gray-900 font-bold flex items-center gap-2 text-lg">
                                        <span className="bg-orange-100 p-1.5 rounded-lg text-sm">👤</span> {order.customerName}
                                    </p>
                                    <p className="text-gray-700 font-semibold flex items-center gap-2">
                                        <span className="bg-orange-50 p-1.5 rounded-lg text-sm">📞</span> {order.customerPhone}
                                    </p>
                                    <p className="text-gray-600 flex items-center gap-2">
                                        <span className="bg-orange-50 p-1.5 rounded-lg text-sm">📍</span> {order.customerAddress}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-400 text-sm mb-2">{new Date(order.createdAt).toLocaleString()}</p>
                                <span className={`px-4 py-2 rounded-xl text-sm font-black ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                    order.status === 'PREPARING' ? 'bg-blue-100 text-blue-700' :
                                        order.status === 'READY' ? 'bg-green-100 text-green-700' :
                                            'bg-gray-100 text-gray-700'
                                    }`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 mb-4">
                            {order.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center py-2">
                                    <span className="text-gray-700">
                                        <span className="font-bold text-orange-600">{item.quantity}x</span> {item.product?.name || 'Item'}
                                    </span>
                                    <span className="font-bold text-gray-800">${item.price?.toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="border-t-2 border-gray-200 pt-3 mt-3 flex justify-between items-center">
                                <span className="font-black text-gray-800">Total</span>
                                <span className="font-black text-2xl text-orange-600">${parseFloat(order.total).toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex gap-3 items-center justify-between flex-wrap">
                            <div className="text-sm text-gray-600">
                                <span className="font-bold">🕐 Status: </span> {order.status}
                            </div>
                            <div className="flex gap-2">
                                {order.status === 'PENDING' && (
                                    <button
                                        onClick={() => updateStatus(order.id, 'PREPARING')}
                                        disabled={updatingOrders.has(order.id)}
                                        className="px-6 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {updatingOrders.has(order.id) && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                        Start Preparing
                                    </button>
                                )}
                                {order.status === 'PREPARING' && (
                                    <button
                                        onClick={() => updateStatus(order.id, 'READY')}
                                        disabled={updatingOrders.has(order.id)}
                                        className="px-6 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {updatingOrders.has(order.id) && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                        Mark Ready
                                    </button>
                                )}
                                {order.status === 'READY' && (
                                    <button
                                        onClick={() => updateStatus(order.id, 'COMPLETED')}
                                        disabled={updatingOrders.has(order.id)}
                                        className="px-6 py-2 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-900 transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {updatingOrders.has(order.id) && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                        Complete
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
