'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, MapPin, Receipt, ArrowRight } from 'lucide-react';

export interface OrderSuccessCardProps {
    orderDetails: {
        orderId: string;
        total: string;
        pickupTime: string;
        paymentMethod: 'card' | 'cash';
    };
    onTrackOrder: () => void;
    onContinue?: () => void;
    showClose?: boolean;
    onClose?: () => void;
}

export default function OrderSuccessCard({
    orderDetails,
    onTrackOrder,
    onContinue,
    showClose = false,
    onClose
}: OrderSuccessCardProps) {
    const isCash = orderDetails.paymentMethod === 'cash';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden"
        >
            {/* Header/Banner */}
            <div className={`p-6 md:p-8 text-center ${isCash ? 'bg-orange-500' : 'bg-green-500'} text-white relative`}>
                {showClose && onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <span className="sr-only">Close</span>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}

                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-black/10"
                >
                    {isCash ? (
                        <span className="text-3xl md:text-4xl text-orange-500">💵</span>
                    ) : (
                        <CheckCircle size={32} className="md:w-10 md:h-10 text-green-500" />
                    )}
                </motion.div>

                <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tight leading-tight">
                    {isCash ? 'Order Received!' : 'Payment Success!'}
                </h2>
                <p className="text-white/80 font-bold mt-1 text-sm md:text-base">Order #BS{orderDetails.orderId}</p>
            </div>

            <div className="p-6 md:p-8">
                <div className="space-y-6">
                    {/* Status Message */}
                    <div className="text-center">
                        <p className="text-lg md:text-xl text-gray-900 font-bold mb-1">
                            {isCash ? "We're starting your meal!" : "Your payment is confirmed!"}
                        </p>
                        <p className="text-gray-500 text-sm md:text-base">
                            {isCash
                                ? "Your order has been sent to our kitchen."
                                : "The kitchen is already preparing your delicious meal."}
                        </p>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div className="bg-gray-50 p-3 md:p-4 rounded-2xl border border-gray-100 flex flex-col justify-center">
                            <div className="flex items-center gap-2 text-gray-500 text-[10px] md:text-xs font-black uppercase tracking-wider mb-1 md:mb-2">
                                <Clock size={12} className="text-orange-500 md:w-[14px] md:h-[14px]" />
                                Pickup Time
                            </div>
                            <p className="text-gray-900 font-black tracking-tight text-sm md:text-base">
                                {orderDetails.pickupTime === 'asap' ? 'ASAP' : `${orderDetails.pickupTime} min`}
                            </p>
                        </div>
                        <div className="bg-gray-50 p-3 md:p-4 rounded-2xl border border-gray-100 flex flex-col justify-center">
                            <div className="flex items-center gap-2 text-gray-500 text-[10px] md:text-xs font-black uppercase tracking-wider mb-1 md:mb-2">
                                <Receipt size={12} className="text-orange-500 md:w-[14px] md:h-[14px]" />
                                Total Amount
                            </div>
                            <p className="text-gray-900 font-black tracking-tight text-lg md:text-xl">
                                ${orderDetails.total}
                            </p>
                        </div>
                    </div>

                    {/* Payment Instructions for Cash */}
                    {isCash && (
                        <div className="bg-orange-50 border-2 border-orange-100 p-4 md:p-5 rounded-2xl">
                            <div className="flex gap-3 md:gap-4">
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-500 text-white rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20">
                                    <MapPin size={16} className="md:w-5 md:h-5" />
                                </div>
                                <div>
                                    <p className="font-black text-gray-900 uppercase text-xs md:text-sm tracking-tight mb-1 md:mb-1">Pay at Counter</p>
                                    <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-medium">Please proceed to our pickup counter and provide your order number to pay.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {!isCash && (
                        <div className="bg-green-50 border-2 border-green-100 p-4 md:p-5 rounded-2xl">
                            <div className="flex gap-3 md:gap-4">
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-green-500 text-white rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/20">
                                    <CheckCircle size={16} className="md:w-5 md:h-5" />
                                </div>
                                <div>
                                    <p className="font-black text-gray-900 uppercase text-xs md:text-sm tracking-tight mb-1">Paid Online</p>
                                    <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-medium">Your payment has been verified. You can collect your order at the pickup counter.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3 pt-2">
                        <button
                            onClick={onTrackOrder}
                            className="w-full py-3.5 md:py-4 bg-gray-900 text-white rounded-xl md:rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 group active:scale-[0.98]"
                        >
                            <span className="text-sm md:text-base">Track Your Order</span>
                            <ArrowRight size={16} className="md:w-[18px] md:h-[18px] group-hover:translate-x-1 transition-transform" />
                        </button>
                        {onContinue && (
                            <button
                                onClick={onContinue}
                                className="w-full py-3 md:py-4 text-gray-500 font-bold hover:text-gray-700 transition-colors text-sm md:text-base active:scale-[0.98]"
                            >
                                Continue Browsing
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
