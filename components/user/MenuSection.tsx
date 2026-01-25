'use client';

import React from 'react';
import { Search, Star, Clock, Heart, Plus, Sparkles } from 'lucide-react';
import { CATEGORIES } from '@/lib/data';
import { MenuItem, CategoryType } from '@/types';
import { getItemEmoji } from '@/lib/utils';

interface MenuSectionProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedCategory: CategoryType;
    setSelectedCategory: (category: CategoryType) => void;
    filteredItems: MenuItem[];
    openItemModal: (item: MenuItem) => void;
    favorites: number[];
    toggleFavorite: (id: number) => void;
    addToCart: (item: MenuItem) => void;
}

export default function MenuSection({
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredItems,
    openItemModal,
    favorites,
    toggleFavorite,
    addToCart
}: MenuSectionProps) {

    return (
        <div className="pt-24 pb-16 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-6xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">
                        Our Menu
                    </h1>
                    <p className="text-2xl text-gray-600 font-medium">Handcrafted with passion</p>
                </div>

                <div className="max-w-2xl mx-auto mb-10">
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={22} />
                        <input
                            type="text"
                            placeholder="Search delicious food..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-orange-500 outline-none text-lg shadow-lg focus:shadow-xl transition-all bg-white"
                        />
                    </div>
                </div>

                <div className="flex overflow-x-auto gap-3 mb-10 pb-3 scrollbar-hide">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.key}
                            onClick={() => setSelectedCategory(cat.key)}
                            className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all shadow-md hover:shadow-lg ${selectedCategory === cat.key
                                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white scale-105'
                                    : 'bg-white text-gray-700 border-2 border-gray-100 hover:border-orange-300'
                                }`}
                        >
                            <span className="text-xl mr-2">{cat.emoji}</span>
                            {cat.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredItems.map(item => (
                        <div
                            key={item.id}
                            className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 overflow-hidden cursor-pointer border-2 border-transparent hover:border-orange-200"
                            onClick={() => openItemModal(item)}
                        >
                            <div className="relative bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 h-48 flex items-center justify-center overflow-hidden">
                                <div className="text-8xl group-hover:scale-110 transition-transform">
                                    {getItemEmoji(item.category)}
                                </div>

                                <div className="absolute top-3 left-3 flex gap-2">
                                    {item.isPopular && (
                                        <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                                            <Star size={12} fill="white" /> Popular
                                        </span>
                                    )}
                                    {item.isNew && (
                                        <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                                            <Sparkles size={12} /> New
                                        </span>
                                    )}
                                </div>

                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
                                    className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                                    aria-label={favorites.includes(item.id) ? 'Remove from favorites' : 'Add to favorites'}
                                >
                                    <Heart
                                        size={20}
                                        className={favorites.includes(item.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}
                                    />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-xl font-black text-gray-900 group-hover:text-orange-600 transition-colors">
                                        {item.name}
                                    </h3>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {item.description}
                                </p>

                                <div className="flex items-center gap-4 mb-4 text-sm">
                                    <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                                        <Star size={16} fill="currentColor" />
                                        {item.rating}
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-500">
                                        <Clock size={16} />
                                        {item.prepTime} min
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-3xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                        ${item.price.toFixed(2)}
                                    </span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
                                    >
                                        <Plus size={18} />
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-7xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-400 mb-2">No items found</h3>
                        <p className="text-gray-500">Try searching for something else</p>
                    </div>
                )}
            </div>
        </div>
    );
}
