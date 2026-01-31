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
                    <div className="grid gap-8">
                        {orderHistory.map(order => {
                            const statusSteps = [
                                { key: 'PENDING', label: 'Order Placed', emoji: '📝' },
                                { key: 'PREPARING', label: 'In Kitchen', emoji: '🧑‍🍳' },
                                { key: 'READY', label: 'Ready!', emoji: '🥡' },
                                { key: 'COMPLETED', label: 'Delivered', emoji: '✨' }
                            ];

                            const currentStepIndex = statusSteps.findIndex(s => s.key === order.status);

                            return (
                                <div key={order.id} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-orange-100 hover:shadow-2xl transition-all">
                                    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 border-b border-orange-100 flex justify-between items-center">
                                        <div>
                                            <h3 className="text-2xl font-black text-gray-800">Order #{order.id}</h3>
                                            <p className="text-gray-500 font-bold mt-1">
                                                {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-6 py-2 rounded-2xl text-sm font-black uppercase tracking-wider ${order.status === 'READY' ? 'bg-green-500 text-white animate-bounce' :
                                                order.status === 'PREPARING' ? 'bg-blue-500 text-white' :
                                                    order.status === 'PENDING' ? 'bg-yellow-500 text-white' :
                                                        'bg-gray-800 text-white'
                                                }`}>
                                                {order.status === 'READY' ? '🔥 READY FOR PICKUP' : order.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-8">
                                        {/* Status Timeline */}
                                        <div className="relative flex justify-between mb-12">
                                            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 z-0" />
                                            <div
                                                className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-orange-500 to-red-500 -translate-y-1/2 z-0 transition-all duration-1000"
                                                style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                                            />

                                            {statusSteps.map((step, idx) => {
                                                const isCompleted = idx <= currentStepIndex;
                                                const isActive = idx === currentStepIndex;

                                                return (
                                                    <div key={step.key} className="relative z-10 flex flex-col items-center">
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg transition-all duration-500 ${isCompleted ? 'bg-white scale-110' : 'bg-gray-100 grayscale'
                                                            }`}>
                                                            {step.emoji}
                                                            {isCompleted && !isActive && (
                                                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-[10px] text-white border-2 border-white">
                                                                    ✓
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className={`text-xs font-black mt-3 uppercase tracking-tighter ${isActive ? 'text-orange-600 font-bold' : isCompleted ? 'text-gray-700' : 'text-gray-300'
                                                            }`}>
                                                            {step.label}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8">
                                            {/* Items List */}
                                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                                <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Items Ordered</h4>
                                                <div className="space-y-4">
                                                    {order.items.map((item: any, idx: number) => (
                                                        <div key={idx} className="flex justify-between items-center group">
                                                            <div className="flex items-center gap-3">
                                                                <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center font-black text-sm">
                                                                    {item.quantity}
                                                                </span>
                                                                <span className="font-bold text-gray-700 group-hover:text-orange-600 transition-colors">
                                                                    {item.product?.name || item.name}
                                                                </span>
                                                            </div>
                                                            <span className="font-black text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-200 flex justify-between items-center">
                                                    <span className="font-black text-gray-400 uppercase text-xs">Total Amount</span>
                                                    <span className="text-3xl font-black text-orange-600">${parseFloat(order.total).toFixed(2)}</span>
                                                </div>
                                            </div>

                                            {/* Delivery/Order Info */}
                                            <div className="space-y-6">
                                                <div className="bg-orange-50/50 rounded-2xl p-6 border border-orange-100">
                                                    <h4 className="text-sm font-black text-orange-400 uppercase tracking-widest mb-4">Pickup Details</h4>
                                                    <div className="space-y-3">
                                                        <p className="text-gray-900 font-bold flex items-center gap-3 text-lg">
                                                            <span className="bg-orange-100 p-2 rounded-xl">👤</span> {order.customerName}
                                                        </p>
                                                        <p className="text-gray-700 font-semibold flex items-center gap-3">
                                                            <span className="bg-orange-50 p-2 rounded-xl">📞</span> {order.customerPhone}
                                                        </p>
                                                        <p className="text-gray-600 flex items-center gap-3 italic">
                                                            <span className="bg-orange-50 p-2 rounded-xl">📍</span> {order.customerAddress}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="bg-orange-50/50 rounded-2xl p-6 border border-orange-100">
                                                    <h4 className="text-sm font-black text-orange-400 uppercase tracking-widest mb-3">Order Progress</h4>
                                                    <p className="text-gray-700 font-bold">
                                                        {order.status === 'PENDING' && "We've received your order! Hanging tight."}
                                                        {order.status === 'PREPARING' && "Our chefs are working their magic 👨‍🍳"}
                                                        {order.status === 'READY' && "Deliciousness is ready! Come grab it! 🥡"}
                                                        {order.status === 'COMPLETED' && "Order completed. Hope you enjoyed it! ✨"}
                                                    </p>
                                                </div>

                                                {/* Re-order button or Feedback */}
                                                <button
                                                    onClick={() => setCurrentPage('menu')}
                                                    className="w-full py-4 bg-gray-800 text-white rounded-2xl font-black hover:bg-black transition-all shadow-lg hover:shadow-xl"
                                                >
                                                    Order Something Else
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
