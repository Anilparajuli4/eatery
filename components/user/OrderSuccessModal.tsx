'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, MapPin, Receipt, ArrowRight, X } from 'lucide-react';

interface OrderSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderDetails: {
        orderId: string;
        total: string;
        pickupTime: string;
        paymentMethod: 'card' | 'cash';
    };
    onTrackOrder: () => void;
}

export default function OrderSuccessModal({ isOpen, onClose, orderDetails, onTrackOrder }: OrderSuccessModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden"
            >
                {/* Header/Banner */}
                <div className={`p-8 text-center ${orderDetails.paymentMethod === 'cash' ? 'bg-orange-500' : 'bg-green-500'} text-white relative`}>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-black/10"
                    >
                        {orderDetails.paymentMethod === 'cash' ? (
                            <span className="text-4xl">💵</span>
                        ) : (
                            <CheckCircle size={40} className="text-green-500" />
                        )}
                    </motion.div>

                    <h2 className="text-3xl font-black italic uppercase tracking-tight">Order Placed!</h2>
                    <p className="text-white/80 font-bold mt-1">Order #BS{orderDetails.orderId}</p>
                </div>

                <div className="p-8">
                    <div className="space-y-6">
                        {/* Status Message */}
                        <div className="text-center">
                            <p className="text-xl text-gray-900 font-bold mb-1">We're starting your meal!</p>
                            <p className="text-gray-500">Your order has been sent to our kitchen.</p>
                        </div>

                        {/* Order Details Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-2 text-gray-500 text-xs font-black uppercase tracking-wider mb-2">
                                    <Clock size={14} className="text-orange-500" />
                                    Pickup Time
                                </div>
                                <p className="text-gray-900 font-black tracking-tight">
                                    {orderDetails.pickupTime === 'asap' ? 'ASAP' : `${orderDetails.pickupTime} min`}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-2 text-gray-500 text-xs font-black uppercase tracking-wider mb-2">
                                    <Receipt size={14} className="text-orange-500" />
                                    Total Amount
                                </div>
                                <p className="text-gray-900 font-black tracking-tight text-xl">
                                    ${orderDetails.total}
                                </p>
                            </div>
                        </div>

                        {/* Payment Instructions for Cash */}
                        {orderDetails.paymentMethod === 'cash' && (
                            <div className="bg-orange-50 border-2 border-orange-100 p-5 rounded-2xl">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900 uppercase text-sm tracking-tight mb-1">Pay at Counter</p>
                                        <p className="text-sm text-gray-600 leading-relaxed font-medium">Please proceed to our pickup counter and provide your order number to pay in cash.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            <button
                                onClick={onTrackOrder}
                                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 group"
                            >
                                Track Your Order
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full py-4 text-gray-500 font-bold hover:text-gray-700 transition-colors"
                            >
                                Continue Browsing
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
