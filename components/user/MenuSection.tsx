'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Search, Star, Clock, Heart, Plus, Sparkles, AlertCircle, Loader2, ChevronDown, ArrowUpDown } from 'lucide-react';
import { CATEGORIES } from '@/lib/data';
import { MenuItem, CategoryType, PaginatedResponse } from '@/types';
import { getItemEmoji } from '@/lib/utils';
import Skeleton from '../ui/Skeleton';
import { getMediaUrl } from '@/lib/config';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Image from 'next/image';

type SortOption = 'createdAt' | 'price' | 'prepTime';
type SortOrder = 'asc' | 'desc';

interface MenuSectionProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedCategory: CategoryType;
    setSelectedCategory: (category: CategoryType) => void;
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
    openItemModal,
    favorites,
    toggleFavorite,
    addToCart
}: MenuSectionProps) {
    const [sortBy, setSortBy] = useState<SortOption>('createdAt');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    const { data: categoriesData = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await api.get('/products/categories');
            return data;
        },
        staleTime: 5 * 60 * 1000 // 5 minutes
    });

    // Map backend categories to our UI structure
    const dynamicCategories = useMemo(() => [
        {
            key: 'all' as CategoryType,
            label: 'All Items',
            emoji: '🍽️',
            count: categoriesData.reduce((acc: number, curr: any) => acc + curr.count, 0)
        },
        ...categoriesData.map((cat: any) => {
            const mapped = CATEGORIES.find(c => c.key === cat.key);
            return {
                key: cat.key as CategoryType,
                label: mapped?.label || cat.key.replace(/_/g, ' ').toLowerCase(),
                emoji: mapped?.emoji || '🍔',
                count: cat.count
            };
        })
    ], [categoriesData]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status: queryStatus,
        isLoading: isInitialLoading
    } = useInfiniteQuery({
        queryKey: ['products', selectedCategory, searchQuery, sortBy, sortOrder],
        queryFn: async ({ pageParam = 1 }) => {
            const params = new URLSearchParams({
                page: pageParam.toString(),
                limit: '12',
                category: selectedCategory,
                search: searchQuery,
                sortBy,
                sortOrder
            });
            const { data } = await api.get<PaginatedResponse<MenuItem>>(`/products?${params.toString()}`);
            return data;
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.meta.currentPage < lastPage.meta.totalPages) {
                return lastPage.meta.currentPage + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
        staleTime: 2 * 60 * 1000 // 2 minutes
    });

    const items = useMemo(() => data?.pages.flatMap(page => page.items) || [], [data]);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastItemRef = useCallback((node: HTMLDivElement | null) => {
        if (isInitialLoading || isFetchingNextPage) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        });

        if (node) observer.current.observe(node);
    }, [isInitialLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

    const isFetchingMore = isFetchingNextPage;

    return (
        <div className="pt-24 pb-16 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-6xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">
                        Our Menu
                    </h1>
                    <p className="text-2xl text-gray-600 font-medium">Handcrafted with passion</p>
                </div>

                <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md -mx-4 px-4 py-4 mb-10 border-b border-gray-100 shadow-sm">
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search delicious food..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-6 py-3.5 rounded-2xl border-2 border-gray-100 focus:border-orange-500 outline-none text-lg shadow-sm focus:shadow-md transition-all bg-white"
                            />
                        </div>

                        <div className="flex gap-2">
                            <div className="relative group">
                                <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 pointer-events-none" size={18} />
                                <select
                                    value={`${sortBy}-${sortOrder}`}
                                    onChange={(e) => {
                                        const [newSort, newOrder] = e.target.value.split('-') as [SortOption, SortOrder];
                                        setSortBy(newSort);
                                        setSortOrder(newOrder);
                                    }}
                                    className="pl-11 pr-10 py-3.5 rounded-2xl border-2 border-gray-100 focus:border-orange-500 outline-none bg-white font-bold text-gray-700 shadow-sm cursor-pointer appearance-none min-w-[180px]"
                                >
                                    <option value="createdAt-desc">Newest First</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    <option value="prepTime-asc">Fastest First</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                            </div>
                        </div>
                    </div>

                    <div className="flex overflow-x-auto gap-3 mt-6 pb-2 scrollbar-hide max-w-7xl mx-auto">
                        {dynamicCategories.map(cat => (
                            <button
                                key={cat.key}
                                onClick={() => setSelectedCategory(cat.key)}
                                className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all shadow-sm relative group/btn capitalize flex items-center gap-2 ${selectedCategory === cat.key
                                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white scale-105 shadow-orange-200 shadow-lg ring-4 ring-orange-500/20'
                                    : 'bg-white text-gray-600 border-2 border-gray-100 hover:border-orange-200 hover:text-orange-600'
                                    }`}
                            >
                                <span className={`text-xl transition-transform group-hover/btn:scale-125 duration-300`}>
                                    {cat.emoji}
                                </span>
                                <span className="flex items-center gap-2">
                                    {cat.label}
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${selectedCategory === cat.key
                                        ? 'bg-white/20 text-white'
                                        : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        {cat.count}
                                    </span>
                                </span>
                                {selectedCategory === cat.key && (
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isInitialLoading ? (
                        [1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-3xl shadow-lg border-2 border-gray-100 overflow-hidden">
                                <Skeleton className="h-48 w-full rounded-none" />
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-7 w-2/3" />
                                    </div>
                                    <Skeleton className="h-4 w-full" />
                                    <div className="flex gap-4">
                                        <Skeleton className="h-4 w-12" />
                                        <Skeleton className="h-4 w-12" />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <Skeleton className="h-10 w-20" />
                                        <Skeleton className="h-12 w-24 rounded-2xl" />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        items.map((item, index) => (
                            <div
                                key={`${item.id}-${index}`}
                                ref={index === items.length - 1 ? lastItemRef : null}
                                className={`group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 overflow-hidden cursor-pointer border-2 border-transparent hover:border-orange-200 ${!item.isAvailable || item.stock === 0 ? 'opacity-75 grayscale-[0.5]' : ''}`}
                                onClick={() => openItemModal(item)}
                            >
                                <div className="relative bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 h-48 flex items-center justify-center overflow-hidden">
                                    {item.image ? (
                                        <Image
                                            src={getMediaUrl(item.image)}
                                            alt={item.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="text-8xl group-hover:scale-110 transition-transform">
                                            {getItemEmoji(item.category)}
                                        </div>
                                    )}

                                    {/* Stock overlay */}
                                    {(!item.isAvailable || item.stock === 0) && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-10">
                                            <span className="px-4 py-2 bg-red-600 text-white font-black text-xl rounded-xl rotate-12 shadow-lg border-2 border-white">
                                                SOLD OUT
                                            </span>
                                        </div>
                                    )}

                                    <div className="absolute top-3 left-3 flex gap-2 z-20">
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
                                        className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-20"
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

                                    {/* Low stock warning */}
                                    {item.isAvailable && item.stock > 0 && item.stock <= 5 && (
                                        <div className="mb-3 text-red-500 text-xs font-bold flex items-center gap-1 animate-pulse">
                                            <AlertCircle size={12} />
                                            Only {item.stock} left!
                                        </div>
                                    )}

                                    <div className="mb-4">
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
                                            disabled={!item.isAvailable || item.stock === 0}
                                            className={`px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 ${!item.isAvailable || item.stock === 0
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-xl hover:scale-105'
                                                }`}
                                        >
                                            {!item.isAvailable || item.stock === 0 ? (
                                                'Sold Out'
                                            ) : (
                                                <>
                                                    <Plus size={18} />
                                                    Add
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {isFetchingMore && (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                    </div>
                )}

                {!isInitialLoading && items.length === 0 && (
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
