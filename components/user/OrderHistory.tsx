'use client';

import React from 'react';
import { PageType, Order, CartItem } from '@/types';

interface OrderHistoryProps {
    orderHistory: Order[];
    setCurrentPage: (page: PageType) => void;
}

export default function OrderHistory({ orderHistory, setCurrentPage }: OrderHistoryProps) {
    return (
        <div className="pt-24 pb-16 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-6xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">
                        Order History
                    </h1>
                    <p className="text-xl text-gray-600">Track your delicious journeys</p>
                </div>

                {orderHistory.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-8xl mb-6">📦</div>
                        <h3 className="text-3xl font-bold text-gray-400 mb-4">No orders yet</h3>
                        <p className="text-gray-500 mb-8">Start your culinary adventure!</p>
                        <button
                            onClick={() => setCurrentPage('menu')}
                            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold hover:shadow-xl transition-all"
                        >
                            Browse Menu
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orderHistory.map(order => (
                            <div key={order.id} className="bg-white rounded-3xl shadow-lg p-6 border-2 border-orange-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Order #{order.id.toString().slice(-4)}</h3>
                                        <p className="text-sm text-gray-500">{new Date(order.timestamp).toLocaleString()}</p>
                                    </div>
                                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                                        Completed
                                    </span>
                                </div>
                                <div className="space-y-2 mb-4">
                                    {order.items.map((item: CartItem) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span className="text-gray-700">{item.quantity}x {item.name}</span>
                                            <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                                    <span className="font-bold text-gray-700">Total</span>
                                    <span className="text-2xl font-black text-orange-600">${order.total}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
