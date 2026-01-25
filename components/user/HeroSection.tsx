'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { PageType } from '@/types';

interface HeroSectionProps {
    setCurrentPage: (page: PageType) => void;
}

export default function HeroSection({ setCurrentPage }: HeroSectionProps) {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-red-500 to-pink-600"></div>

            <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
                <div className="absolute top-20 left-10 text-8xl animate-bounce" style={{ animationDelay: '0s' }}>🍔</div>
                <div className="absolute top-40 right-20 text-6xl animate-bounce" style={{ animationDelay: '0.5s' }}>🍟</div>
                <div className="absolute bottom-20 left-1/4 text-7xl animate-bounce" style={{ animationDelay: '1s' }}>🍗</div>
                <div className="absolute bottom-40 right-1/4 text-5xl animate-bounce" style={{ animationDelay: '1.5s' }}>🥤</div>
            </div>

            <div className="absolute inset-0 bg-black/20"></div>

            <div className="relative z-10 text-center px-4 max-w-5xl">
                <div className="inline-block mb-6">
                    <div className="text-9xl animate-bounce drop-shadow-2xl">🍔</div>
                </div>

                <h1 className="text-7xl md:text-9xl font-black text-white mb-6 drop-shadow-2xl leading-tight">
                    BSquare<br />
                    <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                        Eatery
                    </span>
                </h1>

                <p className="text-3xl md:text-4xl text-white mb-4 font-bold drop-shadow-lg">
                    Where Hunger Meets Flavor
                </p>

                <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
                    <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white font-semibold border border-white/30">
                        ⚡ Fresh
                    </span>
                    <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white font-semibold border border-white/30">
                        🔥 Juicy
                    </span>
                    <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white font-semibold border border-white/30">
                        ✨ Made to Order
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-5 justify-center">
                    <button
                        onClick={() => setCurrentPage('menu')}
                        className="group px-12 py-5 bg-white text-orange-600 rounded-full font-black text-xl hover:scale-110 transition-all shadow-2xl hover:shadow-orange-300/50 flex items-center justify-center gap-3"
                    >
                        Order Now
                        <ChevronRight className="group-hover:translate-x-1 transition-transform" size={24} />
                    </button>
                    <button
                        onClick={() => setCurrentPage('menu')}
                        className="px-12 py-5 border-3 border-white text-white rounded-full font-black text-xl hover:bg-white hover:text-orange-600 transition-all shadow-2xl backdrop-blur-sm"
                    >
                        View Menu
                    </button>
                </div>

                <div className="mt-12 flex items-center justify-center gap-8 text-white/90 flex-wrap">
                    <div className="text-center">
                        <div className="text-3xl font-black">⭐ 4.8</div>
                        <div className="text-sm font-medium">Rating</div>
                    </div>
                    <div className="w-px h-12 bg-white/30 hidden sm:block"></div>
                    <div className="text-center">
                        <div className="text-3xl font-black">20 min</div>
                        <div className="text-sm font-medium">Avg. Wait</div>
                    </div>
                    <div className="w-px h-12 bg-white/30 hidden sm:block"></div>
                    <div className="text-center">
                        <div className="text-3xl font-black">500+</div>
                        <div className="text-sm font-medium">Daily Orders</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
