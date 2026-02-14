'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Skeleton from '../ui/Skeleton';
import { Sparkles, ArrowRight, Flame } from 'lucide-react';

const categoryMappings: Record<string, { name: string, image: string, tagline: string }> = {
    'BEEF_BURGERS': {
        name: 'Beef Burgers',
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=800&fit=crop',
        tagline: '100% Angus Beef'
    },
    'CHICKEN_BURGERS': {
        name: 'Chicken Burgers',
        image: 'https://images.unsplash.com/photo-1626700051175-656a4335c1a7?w=800&h=800&fit=crop',
        tagline: 'Crispy & Golden'
    },
    'STEAK_SANDWICHES': {
        name: 'Steak Sandwiches',
        image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&h=800&fit=crop',
        tagline: 'Premium Ribeye'
    },
    'LOADED_FRIES': {
        name: 'Loaded Fries',
        image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=800&h=800&fit=crop',
        tagline: 'Cheesy Goodness'
    },
    'CHICKEN_WINGS': {
        name: 'Chicken Wings',
        image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&h=800&fit=crop',
        tagline: 'Buffalo or BBQ'
    },
    'SEAFOOD': {
        name: 'Seafood',
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&h=800&fit=crop',
        tagline: 'Ocean Fresh'
    },
    'MILKSHAKES': {
        name: 'Milkshakes',
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&h=800&fit=crop',
        tagline: 'Thick & Creamy'
    },
    'SIDES': {
        name: 'Sides',
        image: 'https://images.unsplash.com/photo-1573806119324-da17cc86c63d?w=800&h=800&fit=crop',
        tagline: 'Perfect Pairings'
    }
};

export default function CategoryGrid({ onSelectCategory }: { onSelectCategory: (cat: any) => void }) {
    const { data: categoriesData = [], isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await api.get('/products/categories');
            return data; // Array of { key: string, count: number }
        }
    });

    // Sort categories by item count to show the most popular ones first
    const featuredCategories = categoriesData
        .filter((cat: any) => categoryMappings[cat.key])
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, 6)
        .map((cat: any) => ({
            key: cat.key,
            count: cat.count,
            ...categoryMappings[cat.key]
        }));

    return (
        <section className="py-32 bg-gray-50 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-20 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <Flame size={14} className="fill-orange-600" />
                                Trending Now
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none uppercase italic mb-6">
                            Popular <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Categories</span>
                        </h2>
                        <div className="flex gap-4 items-center">
                            <div className="h-2 w-24 bg-orange-500 rounded-full"></div>
                            <div className="h-2 w-8 bg-orange-200 rounded-full"></div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="max-w-md bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 relative group"
                    >
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-colors duration-500"></div>
                        <p className="text-gray-900 font-black text-2xl mb-4 leading-tight italic">
                            "Fresh gourmet deals, <br />
                            <span className="text-orange-500 font-black">made with heart."</span>
                        </p>
                        <p className="text-gray-600 font-bold text-lg leading-relaxed">
                            Discover the categories that our foodies love the most. Handcrafted, fresh, and served hot.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {isLoading ? (
                            [1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-96 rounded-[3rem] overflow-hidden shadow-2xl">
                                    <Skeleton className="w-full h-full" />
                                </div>
                            ))
                        ) : featuredCategories.map((category: any, index: number) => (
                            <motion.div
                                key={category.key}
                                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.8, type: 'spring', bounce: 0.3 }}
                                whileHover={{ y: -15 }}
                                onClick={() => onSelectCategory(category.key)}
                                className="group relative h-96 rounded-[3.5rem] overflow-hidden cursor-pointer shadow-2xl transition-all duration-500 border-4 border-white hover:border-orange-500/30"
                            >
                                {/* Category Image with Zoom Effect */}
                                <div className="absolute inset-0 overflow-hidden">
                                    <motion.img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-[2000ms] ease-out select-none"
                                    />
                                    {/* Multi-layered Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black/90 group-hover:via-black/40 transition-colors duration-500"></div>
                                </div>

                                {/* Floating Badge */}
                                <div className="absolute top-6 left-6 z-20">
                                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 px-4 py-2 rounded-2xl">
                                        <Sparkles size={14} className="text-orange-400 fill-orange-400" />
                                        <span className="text-white text-xs font-black uppercase tracking-widest">
                                            {category.count} Items
                                        </span>
                                    </div>
                                </div>

                                {/* Content Layer */}
                                <div className="absolute inset-0 z-10 flex flex-col justify-end p-10">
                                    <motion.div
                                        initial={false}
                                        className="transform group-hover:translate-y-[-10px] transition-transform duration-500"
                                    >
                                        <p className="text-orange-400 font-black text-sm uppercase tracking-[0.3em] mb-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                            {category.tagline}
                                        </p>
                                        <h3 className="text-white text-4xl md:text-5xl font-black tracking-tighter leading-none mb-6 drop-shadow-2xl">
                                            {category.name}
                                        </h3>

                                        <div className="flex items-center justify-between overflow-hidden h-0 group-hover:h-12 transition-all duration-700 ease-in-out">
                                            <div className="flex items-center gap-3 bg-orange-500 text-white px-6 py-2.5 rounded-full font-black text-sm shadow-xl items-center group/btn active:scale-95 transition-all">
                                                Explore Menu
                                                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Hover Border Glow */}
                                <div className="absolute inset-0 border-[10px] border-orange-500 opacity-0 group-hover:opacity-20 transition-opacity duration-700 rounded-[3.5rem]"></div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-24 text-center"
                >
                    <button
                        onClick={() => onSelectCategory('all')}
                        className="group inline-flex items-center gap-4 bg-gray-900 text-white px-10 py-5 rounded-full font-black text-xl hover:bg-orange-600 transition-all shadow-2xl hover:shadow-orange-500/40"
                    >
                        View Full Menu
                        <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </button>
                    <p className="mt-8 text-gray-500 font-bold flex items-center justify-center gap-2">
                        <Sparkles size={16} className="text-orange-500" />
                        Explore over 100+ gourmet items
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
