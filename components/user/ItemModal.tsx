'use client';

import React from 'react';
import { X, Star, Clock, Heart, Plus } from 'lucide-react';
import { MenuItem } from '@/types';
import { getItemEmoji } from '@/lib/utils';

interface ItemModalProps {
    showItemModal: boolean;
    setShowItemModal: (show: boolean) => void;
    selectedItem: MenuItem | null;
    favorites: number[];
    toggleFavorite: (id: number) => void;
    addToCart: (item: MenuItem) => void;
}

export default function ItemModal({
    showItemModal,
    setShowItemModal,
    selectedItem,
    favorites,
    toggleFavorite,
    addToCart
}: ItemModalProps) {
    if (!showItemModal || !selectedItem) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowItemModal(false)}></div>
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in">
                <button
                    onClick={() => setShowItemModal(false)}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>

                <div className="relative h-72 w-full overflow-hidden bg-gray-100">
                    {selectedItem.image ? (
                        <img
                            src={selectedItem.image}
                            alt={selectedItem.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 flex items-center justify-center">
                            <div className="text-9xl">{getItemEmoji(selectedItem.category)}</div>
                        </div>
                    )}
                    {selectedItem.isPopular && (
                        <div className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl text-sm font-black uppercase tracking-wider animate-bounce">
                            <Star size={16} fill="white" />
                            Chef's Special
                        </div>
                    )}
                </div>

                <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-4xl font-black text-gray-900 tracking-tight">{selectedItem.name}</h2>
                                {selectedItem.isPopular && (
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded-full uppercase tracking-widest border border-green-200">
                                        Popular
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1.5 text-gray-500 font-medium bg-gray-100 px-3 py-1.5 rounded-xl">
                                    <Clock size={18} className="text-orange-500" />
                                    Ready in {selectedItem.prepTime} min
                                </div>
                                <div className="flex items-center gap-1.5 text-orange-600 font-bold">
                                    <Heart size={18} fill="currentColor" />
                                    100+ Favorites
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => toggleFavorite(selectedItem.id)}
                            className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center hover:bg-gray-100 transition-all border border-gray-100 group shadow-sm"
                            aria-label={favorites.includes(selectedItem.id) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                            <Heart
                                size={28}
                                className={favorites.includes(selectedItem.id) ? 'text-red-500 fill-red-500 scale-110' : 'text-gray-300 group-hover:text-red-400 transition-transform duration-300'}
                            />
                        </button>
                    </div>

                    <div className="relative mb-8">
                        <p className="text-gray-600 text-lg leading-relaxed font-medium">
                            {selectedItem.description}
                        </p>
                    </div>

                    <div className="flex items-center justify-between pt-8 border-t-2 border-dashed border-gray-100">
                        <div className="flex flex-col">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Price</span>
                            <span className="text-4xl font-black text-gray-900 italic">
                                ${selectedItem.price.toFixed(2)}
                            </span>
                        </div>
                        <button
                            onClick={() => { addToCart(selectedItem); setShowItemModal(false); }}
                            className="px-10 py-5 bg-orange-500 text-white rounded-3xl font-black text-lg hover:bg-orange-600 hover:shadow-2xl hover:shadow-orange-500/40 transition-all active:scale-95 flex items-center gap-3 group"
                        >
                            <Plus size={24} className="group-hover:rotate-90 transition-transform" />
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
