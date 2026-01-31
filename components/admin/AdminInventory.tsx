'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Package, AlertTriangle, RefreshCcw } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface Product {
    id: number;
    name: string;
    stock: number;
    price: number;
    category: string;
}

export default function AdminInventory() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const { data: products = [], isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const { data } = await api.get('/products');
            return data;
        }
    });

    const updateStockMutation = useMutation({
        mutationFn: async ({ id, stock }: { id: number, stock: number }) => {
            return api.put(`/products/${id}`, { stock });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            showToast('Stock updated successfully', 'success');
        },
        onError: () => {
            showToast('Failed to update stock', 'error');
        }
    });

    const handleStockChange = (id: number, currentStock: number, delta: number) => {
        const newStock = Math.max(0, currentStock + delta);
        updateStockMutation.mutate({ id, stock: newStock });
    };

    if (isLoading) return <div>Loading inventory...</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                            <Package size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Total Items</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{products.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Low Stock</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {products.filter((p: Product) => p.stock < 10).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                            <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase">Product</th>
                            <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase">Category</th>
                            <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase">Current Stock</th>
                            <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {products.map((product: Product) => (
                            <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{product.name}</td>
                                <td className="px-6 py-4 text-slate-500 capitalize">{product.category.toLowerCase().replace(/_/g, ' ')}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${product.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                                        }`}>
                                        {product.stock} units
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleStockChange(product.id, product.stock, -1)}
                                            disabled={updateStockMutation.isPending}
                                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 disabled:opacity-50"
                                        >
                                            -1
                                        </button>
                                        <button
                                            onClick={() => handleStockChange(product.id, product.stock, 1)}
                                            disabled={updateStockMutation.isPending}
                                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 disabled:opacity-50"
                                        >
                                            +1
                                        </button>
                                        <button
                                            onClick={() => {
                                                const val = prompt('Enter manual stock count:', product.stock.toString());
                                                if (val !== null) updateStockMutation.mutate({ id: product.id, stock: parseInt(val) });
                                            }}
                                            disabled={updateStockMutation.isPending}
                                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-blue-500 disabled:opacity-50"
                                        >
                                            {updateStockMutation.isPending ? (
                                                <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                                            ) : (
                                                <RefreshCcw size={16} />
                                            )}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
