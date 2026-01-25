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

                <div className="bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 h-64 flex items-center justify-center">
                    <div className="text-9xl">{getItemEmoji(selectedItem.category)}</div>
                </div>

                <div className="p-8">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 mb-2">{selectedItem.name}</h2>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                                    <Star size={18} fill="currentColor" />
                                    {selectedItem.rating}
                                </div>
                                <div className="flex items-center gap-1 text-gray-500">
                                    <Clock size={18} />
                                    {selectedItem.prepTime} min
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => toggleFavorite(selectedItem.id)}
                            className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                            aria-label={favorites.includes(selectedItem.id) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                            <Heart
                                size={24}
                                className={favorites.includes(selectedItem.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}
                            />
                        </button>
                    </div>

                    <p className="text-gray-700 mb-6 leading-relaxed">{selectedItem.description}</p>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                        <span className="text-4xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            ${selectedItem.price.toFixed(2)}
                        </span>
                        <button
                            onClick={() => { addToCart(selectedItem); setShowItemModal(false); }}
                            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold hover:shadow-xl transition-all flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
