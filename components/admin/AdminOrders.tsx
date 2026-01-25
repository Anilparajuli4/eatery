'use client';

import React, { useState, useEffect } from 'react';
import socket from '@/lib/socket';

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);

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
            // Add new order to top
            setOrders(prev => [newOrder, ...prev]);
        });

        return () => {
            socket.off('new_order');
        };
    }, []);

    const updateStatus = async (id: number, status: string) => {
        try {
            await import('@/lib/api').then(m => m.default.patch(`/orders/${id}/status`, { status }));
            // Optimistic update
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status");
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
                                <h3 className="text-xl font-black text-gray-800">Order #{order.id}</h3>
                                <p className="text-gray-600 font-semibold mt-1">User #{order.userId || 'Guest'}</p>
                            </div>
                            <div className="text-right">
                                <span className={`px-4 py-2 rounded-xl text-sm font-bold ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                        order.status === 'PREPARING' ? 'bg-blue-100 text-blue-700' :
                                            order.status === 'READY' ? 'bg-green-100 text-green-700' :
                                                'bg-gray-100 text-gray-700'
                                    }`}>
                                    {order.status}
                                </span>
                                <p className="text-gray-400 text-sm mt-2">{new Date(order.createdAt).toLocaleTimeString()}</p>
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
                                        className="px-6 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
                                    >
                                        Start Preparing
                                    </button>
                                )}
                                {order.status === 'PREPARING' && (
                                    <button
                                        onClick={() => updateStatus(order.id, 'READY')}
                                        className="px-6 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors"
                                    >
                                        Mark Ready
                                    </button>
                                )}
                                {order.status === 'READY' && (
                                    <button
                                        onClick={() => updateStatus(order.id, 'COMPLETED')}
                                        className="px-6 py-2 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-900 transition-colors"
                                    >
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
