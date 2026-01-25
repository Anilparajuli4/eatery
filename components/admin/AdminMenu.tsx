'use client';

import React, { useState } from 'react';
import { Plus, Star, Clock, X } from 'lucide-react';
import { MENU_DATA } from '@/lib/data';
import { getItemEmoji } from '@/lib/utils';
import { MenuItem } from '@/types';

export default function AdminMenu() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [showAddItemModal, setShowAddItemModal] = useState(false);
    const [newItem, setNewItem] = useState<Partial<MenuItem>>({
        name: '',
        price: 0,
        description: '',
        category: 'BEEF_BURGERS',
        rating: 4.5,
        prepTime: 15
    });

    // Fetch Menu Items
    const fetchMenu = async () => {
        try {
            const { data } = await import('@/lib/api').then(m => m.default.get('/products'));
            setMenuItems(data);
        } catch (error) {
            console.error("Failed to fetch menu", error);
        }
    };

    React.useEffect(() => {
        fetchMenu();
    }, []);

    const handleCreate = async () => {
        try {
            await import('@/lib/api').then(m => m.default.post('/products', newItem));
            setShowAddItemModal(false);
            fetchMenu();
            setNewItem({
                name: '',
                price: 0,
                description: '',
                category: 'BEEF_BURGERS',
                rating: 4.5,
                prepTime: 15
            });
        } catch (error) {
            console.error("Failed to create item", error);
            alert("Failed to create item");
        }
    };

    const handleUpdate = async () => {
        if (!editingItem) return;
        try {
            await import('@/lib/api').then(m => m.default.put(`/products/${editingItem.id}`, editingItem));
            setEditingItem(null);
            fetchMenu();
        } catch (error) {
            console.error("Failed to update item", error);
            alert("Failed to update item");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        try {
            await import('@/lib/api').then(m => m.default.delete(`/products/${id}`));
            fetchMenu();
        } catch (error) {
            console.error("Failed to delete item", error);
            alert("Failed to delete item");
        }
    };

    // Group items by category for display
    const groupedItems = React.useMemo(() => {
        const groups: Record<string, MenuItem[]> = {};
        menuItems.forEach(item => {
            if (!groups[item.category]) groups[item.category] = [];
            groups[item.category].push(item);
        });
        return groups;
    }, [menuItems]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-gray-800">Menu Management</h2>
                <button
                    onClick={() => setShowAddItemModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add New Item
                </button>
            </div>

            {/* Menu Items Grid */}
            {Object.entries(groupedItems).map(([category, items]) => (
                <div key={category} className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-black text-gray-800 mb-4 capitalize">
                        {category.replace(/_/g, ' ')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map(item => (
                            <div key={item.id} className="border-2 border-gray-100 rounded-xl p-4 hover:border-orange-300 transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800">{item.name}</h4>
                                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                                    </div>
                                    <span className="text-2xl ml-2">{getItemEmoji(item.category)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                    <span className="flex items-center gap-1">
                                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                        {item.rating}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={14} />
                                        {item.prepTime}m
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-2xl font-black text-orange-600">${item.price.toFixed(2)}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setEditingItem(item)}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold text-sm hover:bg-blue-600 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold text-sm hover:bg-red-600 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                {item.isPopular && (
                                    <div className="mt-3 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold inline-block">
                                        ⭐ Popular
                                    </div>
                                )}
                                {item.isNew && (
                                    <div className="mt-3 ml-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold inline-block">
                                        ✨ New
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Add Item Modal */}
            {showAddItemModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddItemModal(false)}>
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-gray-800">Add New Menu Item</h2>
                            <button onClick={() => setShowAddItemModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-bold text-gray-700 mb-2">Item Name</label>
                                <input
                                    type="text"
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none"
                                    placeholder="e.g., Deluxe Burger"
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={newItem.description}
                                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none resize-none"
                                    rows={3}
                                    placeholder="Describe the item..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-bold text-gray-700 mb-2">Price ($)</label>
                                    <input
                                        type="number"
                                        value={newItem.price}
                                        onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none"
                                        step="0.50"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-gray-700 mb-2">Prep Time (mins)</label>
                                    <input
                                        type="number"
                                        value={newItem.prepTime}
                                        onChange={(e) => setNewItem({ ...newItem, prepTime: parseInt(e.target.value) })}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block font-bold text-gray-700 mb-2">Category</label>
                                <select
                                    value={newItem.category}
                                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none"
                                >
                                    <option value="BEEF_BURGERS">Beef Burgers</option>
                                    <option value="CHICKEN_BURGERS">Chicken</option>
                                    <option value="SEAFOOD">Seafood</option>
                                    <option value="LOADED_FRIES">Loaded Fries</option>
                                    <option value="SIDES">Sides</option>
                                    <option value="DRINKS">Drinks</option>
                                </select>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button
                                    onClick={handleCreate}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                                >
                                    Add Item
                                </button>
                                <button onClick={() => setShowAddItemModal(false)} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Item Modal */}
            {editingItem && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditingItem(null)}>
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-gray-800">Edit Menu Item</h2>
                            <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-bold text-gray-700 mb-2">Item Name</label>
                                <input
                                    type="text"
                                    value={editingItem.name}
                                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={editingItem.description}
                                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none resize-none"
                                    rows={3}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-bold text-gray-700 mb-2">Price ($)</label>
                                    <input
                                        type="number"
                                        value={editingItem.price}
                                        onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none"
                                        step="0.50"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-gray-700 mb-2">Prep Time (mins)</label>
                                    <input
                                        type="number"
                                        value={editingItem.prepTime}
                                        onChange={(e) => setEditingItem({ ...editingItem, prepTime: parseInt(e.target.value) })}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button
                                    onClick={handleUpdate}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                                >
                                    Save Changes
                                </button>
                                <button onClick={() => setEditingItem(null)} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
