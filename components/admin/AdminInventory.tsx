import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Package, AlertTriangle, RefreshCcw, History, Settings, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { format } from 'date-fns';

interface Product {
    id: number;
    name: string;
    stock: number;
    price: number;
    category: string;
    lowStockThreshold: number;
    lastRestocked: string | null;
}

interface StockHistory {
    id: number;
    change: number;
    reason: string;
    previousStock: number;
    newStock: number;
    createdAt: string;
    notes?: string;
    orderId?: number;
}

export default function AdminInventory() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showHistory, setShowHistory] = useState(false);

    const { data: products = [], isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const { data } = await api.get('/products');
            return data;
        }
    });

    const { data: history = [], isLoading: isLoadingHistory } = useQuery({
        queryKey: ['stockHistory', selectedProduct?.id],
        queryFn: async () => {
            if (!selectedProduct) return [];
            const { data } = await api.get(`/inventory/history/${selectedProduct.id}`);
            return data;
        },
        enabled: !!selectedProduct && showHistory
    });

    const updateStockMutation = useMutation({
        mutationFn: async ({ id, stock, reason }: { id: number, stock: number, reason?: string }) => {
            // Use specific endpoint for bulk update if we want exact reason logging, 
            // or put to product if simple. 
            // Better to use the product update we just patched to include logging.
            return api.put(`/products/${id}`, { stock });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['stockHistory'] });
            showToast('Stock updated successfully', 'success');
        },
        onError: () => {
            showToast('Failed to update stock', 'error');
        }
    });

    const updateThresholdMutation = useMutation({
        mutationFn: async ({ id, threshold }: { id: number, threshold: number }) => {
            return api.put(`/products/${id}`, { lowStockThreshold: threshold });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            showToast('Threshold updated', 'success');
        },
        onError: () => {
            showToast('Failed to update threshold', 'error');
        }
    });

    const handleStockChange = (id: number, currentStock: number, delta: number) => {
        const newStock = Math.max(0, currentStock + delta);
        updateStockMutation.mutate({ id, stock: newStock });
    };

    const handleManualUpdate = (product: Product) => {
        const val = prompt(`Update stock for ${product.name}\nCurrent: ${product.stock}`, product.stock.toString());
        if (val !== null) {
            const newStock = parseInt(val);
            if (!isNaN(newStock) && newStock >= 0) {
                updateStockMutation.mutate({ id: product.id, stock: newStock });
            }
        }
    };

    const handleThresholdUpdate = (product: Product) => {
        const val = prompt(`Set low stock alert threshold for ${product.name}`, product.lowStockThreshold.toString());
        if (val !== null) {
            const newThreshold = parseInt(val);
            if (!isNaN(newThreshold) && newThreshold >= 0) {
                updateThresholdMutation.mutate({ id: product.id, threshold: newThreshold });
            }
        }
    };

    const openHistory = (product: Product) => {
        setSelectedProduct(product);
        setShowHistory(true);
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading inventory data...</div>;

    const lowStockCount = products.filter((p: Product) => p.stock <= p.lowStockThreshold).length;

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                            <Package size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Total Items</p>
                            <p className="text-3xl font-black text-slate-900 dark:text-white">{products.length}</p>
                        </div>
                    </div>
                </div>
                <div className={`bg-white dark:bg-slate-900 p-6 rounded-3xl border shadow-sm transition-colors ${lowStockCount > 0 ? 'border-red-200 bg-red-50' : 'border-slate-200'}`}>
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${lowStockCount > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Low Stock Alerts</p>
                            <p className={`text-3xl font-black ${lowStockCount > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                                {lowStockCount}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stock Level</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Restock</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {products.map((product: Product) => {
                                const isLowStock = product.stock <= product.lowStockThreshold;
                                const isOut = product.stock === 0;

                                return (
                                    <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white mb-0.5">{product.name}</p>
                                                <p className="text-xs text-slate-500 capitalize">{product.category.toLowerCase().replace(/_/g, ' ')}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {isOut ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                                    Out of Stock
                                                </span>
                                            ) : isLowStock ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                                                    Low Stock
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                    In Stock
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-500 ${isOut ? 'bg-slate-300 w-0' :
                                                                isLowStock ? 'bg-amber-500' : 'bg-green-500'
                                                            }`}
                                                        style={{ width: `${Math.min(100, (product.stock / (product.lowStockThreshold * 3)) * 100)}%` }}
                                                    />
                                                </div>
                                                <span className="font-mono font-bold text-slate-700">{product.stock}</span>
                                            </div>
                                            <div className="mt-1 text-xs text-slate-400 flex items-center gap-1">
                                                Alert at: {product.lowStockThreshold}
                                                <button
                                                    onClick={() => handleThresholdUpdate(product)}
                                                    className="opacity-0 group-hover:opacity-100 text-blue-500 hover:text-blue-700 transition-opacity"
                                                    title="Edit Threshold"
                                                >
                                                    <Settings size={12} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {product.lastRestocked ? (
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-slate-400" />
                                                    {format(new Date(product.lastRestocked), 'MMM d, yyyy')}
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 italic">Never</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleStockChange(product.id, product.stock, -1)}
                                                    disabled={updateStockMutation.isPending || product.stock === 0}
                                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed border border-transparent hover:border-slate-200"
                                                    title="Decrease Stock"
                                                >
                                                    -1
                                                </button>
                                                <button
                                                    onClick={() => handleStockChange(product.id, product.stock, 1)}
                                                    disabled={updateStockMutation.isPending}
                                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 disabled:opacity-30 border border-transparent hover:border-slate-200"
                                                    title="Increase Stock"
                                                >
                                                    +1
                                                </button>
                                                <button
                                                    onClick={() => handleManualUpdate(product)}
                                                    disabled={updateStockMutation.isPending}
                                                    className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-blue-600 disabled:opacity-30 border border-transparent hover:border-blue-200"
                                                    title="Manual Update"
                                                >
                                                    <RefreshCcw size={18} />
                                                </button>
                                                <button
                                                    onClick={() => openHistory(product)}
                                                    className="p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg text-purple-600 border border-transparent hover:border-purple-200"
                                                    title="View History"
                                                >
                                                    <History size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* History Modal */}
            {showHistory && selectedProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowHistory(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">Stock History</h3>
                                <p className="text-slate-500">{selectedProduct.name}</p>
                            </div>
                            <button
                                onClick={() => setShowHistory(false)}
                                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {isLoadingHistory ? (
                                <div className="text-center py-10">Loading history...</div>
                            ) : history.length === 0 ? (
                                <div className="text-center py-10 text-slate-500">
                                    <History size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>No history records found for this product.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {history.map((record: StockHistory) => (
                                        <div key={record.id} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                            <div className={`p-2 rounded-xl mt-1 ${record.change > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                }`}>
                                                {record.change > 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <p className="font-bold text-slate-900 dark:text-white">
                                                        {record.reason === 'SALE' ? 'Order Fulfillment' :
                                                            record.reason === 'RESTOCK' ? 'Stock Added' :
                                                                record.reason.toLowerCase().replace(/_/g, ' ')}
                                                    </p>
                                                    <span className="text-xs text-slate-400 font-mono">
                                                        {format(new Date(record.createdAt), 'PP p')}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600 mb-2">
                                                    {record.notes || (record.orderId ? `Order #${record.orderId}` : 'No notes')}
                                                </p>
                                                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg w-fit border border-slate-200">
                                                    <span>{record.previousStock}</span>
                                                    <span>→</span>
                                                    <span className={`font-bold ${record.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {record.newStock}
                                                    </span>
                                                    <span className="text-slate-400 ml-1">
                                                        ({record.change > 0 ? '+' : ''}{record.change})
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
