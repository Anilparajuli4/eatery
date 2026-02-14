'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, ArrowRight, Plus } from 'lucide-react';

import { MenuItem } from '@/types';

interface FeaturedItemsProps {
    setCurrentPage: (page: any) => void;
    products: MenuItem[];
}

export default function FeaturedItems({ setCurrentPage, products }: FeaturedItemsProps) {
    // Only show products marked as isPopular or a slice if none marked
    const displayedProducts = products.filter(p => p.isPopular).slice(0, 4);
    // If no popular items yet, just show first 4 available ones
    const finalProducts = displayedProducts.length > 0 ? displayedProducts : products.slice(0, 4);

    if (finalProducts.length === 0) {
        return null;
    }

    return (
        <section className="py-24 bg-gray-50 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-none uppercase italic">
                            Chef's <span className="text-orange-500">Specials</span>
                        </h2>
                        <div className="h-2 w-32 bg-orange-500 rounded-full"></div>
                    </div>
                    <button
                        onClick={() => setCurrentPage('menu')}
                        className="flex items-center gap-3 px-8 py-4 bg-orange-500 text-white rounded-2xl font-black text-lg hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-500/30 transition-all group w-fit"
                    >
                        View Full Menu <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                    {finalProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200/50 group border border-gray-100/50 relative"
                        >
                            <div className="relative h-72 overflow-hidden">
                                {product.image && (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                    />
                                )}
                                <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg text-xs font-black">
                                    <Clock size={14} />
                                    {product.prepTime} min
                                </div>

                                {/* Quick Add Button on Hover */}
                                <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/80 to-transparent">
                                    <button
                                        onClick={() => setCurrentPage('menu')}
                                        className="w-full flex items-center justify-center gap-3 py-4 bg-orange-500 text-white rounded-2xl font-black hover:bg-orange-600 transition-colors shadow-xl shadow-orange-500/40 active:scale-95 transform"
                                    >
                                        <Plus size={20} />
                                        Order for Pickup
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 text-center flex flex-col items-center">
                                <h3 className="text-xl font-black text-gray-900 mb-2 truncate w-full tracking-tight">
                                    {product.name}
                                </h3>
                                <div className="text-2xl font-black text-orange-500 mb-6 drop-shadow-sm">
                                    ${product.price.toFixed(2)}
                                </div>
                                <button
                                    onClick={() => setCurrentPage('menu')}
                                    className="w-full py-4 bg-gray-50 text-gray-900 rounded-2xl font-black transition-all group-hover:bg-orange-50 group-hover:text-orange-600 border border-transparent group-hover:border-orange-100"
                                >
                                    Explore Item
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
