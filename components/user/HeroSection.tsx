'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PageType } from '@/types';

interface HeroSectionProps {
    setCurrentPage: (page: PageType) => void;
}

export default function HeroSection({ setCurrentPage }: HeroSectionProps) {
    return (
        <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Immersive Background Image with Darker Overlay */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&h=900&fit=crop"
                    alt="Delicious food background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black text-white mb-6 lg:mb-8 tracking-tighter drop-shadow-2xl">
                        BSquare <span className="text-orange-500">Eatery</span>
                    </h1>

                    <p className="text-xl sm:text-2xl md:text-3xl text-white font-bold mb-10 lg:mb-12 max-w-2xl mx-auto drop-shadow-lg leading-tight uppercase italic tracking-wide">
                        Premium gourmet dining<br className="hidden sm:block" />
                        <span className="text-orange-400">Order online, pick up hot & fresh</span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                        <button
                            onClick={() => setCurrentPage('menu')}
                            className="w-full sm:w-auto min-h-[56px] px-10 py-4 bg-orange-500 text-white rounded-2xl font-black text-lg sm:text-xl hover:bg-orange-600 transition-all shadow-2xl shadow-orange-500/40 transform active:scale-95"
                        >
                            Order for Pickup
                        </button>
                        <button
                            onClick={() => setCurrentPage('menu')}
                            className="w-full sm:w-auto min-h-[56px] px-10 py-4 border-2 border-white/80 text-white rounded-2xl font-black text-lg sm:text-xl hover:bg-white hover:text-orange-600 transition-all backdrop-blur-md transform active:scale-95 shadow-xl"
                        >
                            View Menu
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Content Transition Gradient */}
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
        </section>
    );
}
