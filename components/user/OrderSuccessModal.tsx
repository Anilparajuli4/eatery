'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OrderSuccessCard from './OrderSuccessCard';

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
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <div className="relative w-full max-w-lg max-h-[95vh] overflow-y-auto custom-scrollbar">
                        <OrderSuccessCard
                            orderDetails={orderDetails}
                            onTrackOrder={onTrackOrder}
                            onContinue={onClose}
                            showClose={true}
                            onClose={onClose}
                        />
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
}
