'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, X, Plus, AlertCircle, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { MenuItem } from '@/types';
import { useToast } from '@/context/ToastContext';
import { getMediaUrl } from '@/lib/config';
import Skeleton from '../ui/Skeleton';

export default function ChefSpecials() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    // Fetch all products to pick from
    const { data: allProducts = [], isLoading: isLoadingProducts } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const { data } = await api.get('/products?limit=100');
            return data.items || [];
        }
    });

    // Derived featured products
    const featuredProducts = allProducts.filter((p: MenuItem) => p.isPopular);

    const updateMutation = useMutation({
        mutationFn: async ({ id, isPopular }: { id: number, isPopular: boolean }) => {
            return api.put(`/products/${id}`, { isPopular });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            showToast('Chef\'s Specials updated', 'success');
        },
        onError: () => {
            showToast('Failed to update specials', 'error');
        }
    });

    if (isLoadingProducts) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
                            <Skeleton className="h-40 w-full rounded-xl mb-4" />
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-full mb-4" />
                            <Skeleton className="h-10 w-full rounded-xl" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const handleRemove = (id: number) => {
        updateMutation.mutate({ id, isPopular: false });
    };

    const handleAdd = (id: number) => {
        if (featuredProducts.length >= 4) {
            showToast('You can only have up to 4 specials. Remove one first.', 'error');
            return;
        }
        updateMutation.mutate({ id, isPopular: true });
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-800 flex items-center gap-3">
                        <Star className="text-orange-500 fill-orange-500" />
                        Chef's Specials
                    </h2>
                    <p className="text-gray-500 font-bold mt-1">Manage featured items on the homepage (Max 4)</p>
                </div>
                <div className={`px-4 py-2 rounded-full font-black text-sm ${featuredProducts.length >= 4 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                    {featuredProducts.length} / 4 Items Selected
                </div>
            </div>

            {/* Current Specials */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product: MenuItem) => (
                    <div key={product.id} className="bg-white rounded-[2rem] p-6 shadow-xl border-2 border-orange-100 relative group animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={() => handleRemove(product.id)}
                            className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110 active:scale-95"
                        >
                            <X size={18} />
                        </button>
                        <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-100">
                            {product.image ? (
                                <img src={getMediaUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-5xl">🍔</div>
                            )}
                        </div>
                        <h3 className="font-black text-xl text-gray-800 truncate mb-1">{product.name}</h3>
                        <p className="text-orange-500 font-black text-lg">${product.price.toFixed(2)}</p>
                    </div>
                ))}

                {featuredProducts.length < 4 && (
                    <div className="border-4 border-dashed border-gray-200 rounded-[2rem] p-6 flex flex-col items-center justify-center gap-4 min-h-[300px] text-gray-400">
                        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                            <Plus size={32} />
                        </div>
                        <p className="font-bold text-center">Select more items from the menu below</p>
                    </div>
                )}
            </div>

            <hr className="border-gray-100" />

            {/* Menu Picker */}
            <div>
                <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                    Add to Specials
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {allProducts
                        .filter((p: MenuItem) => !p.isPopular)
                        .map((product: MenuItem) => (
                            <div key={product.id} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:border-orange-300 transition-all flex flex-col h-full">
                                <div className="flex gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100">
                                        {product.image ? (
                                            <img src={getMediaUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl">🍔</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-gray-800 truncate">{product.name}</h4>
                                        <p className="text-sm text-gray-400 capitalize">{product.category.replace(/_/g, ' ').toLowerCase()}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleAdd(product.id)}
                                    disabled={featuredProducts.length >= 4 || updateMutation.isPending}
                                    className="mt-auto w-full py-3 bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-600 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Plus size={18} />
                                    Add to Specials
                                </button>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}
