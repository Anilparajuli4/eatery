'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 bg-white z-[99999] flex flex-col items-center justify-center">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                className="text-6xl mb-8"
            >
                🍔
            </motion.div>
            <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden relative">
                <motion.div
                    initial={{ left: '-100%' }}
                    animate={{ left: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-orange-500 to-red-600 rounded-full"
                />
            </div>
            <p className="mt-4 font-black text-gray-400 uppercase tracking-widest text-xs animate-pulse">
                Prepping your experience
            </p>
        </div>
    );
}
