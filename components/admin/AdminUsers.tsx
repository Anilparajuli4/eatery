'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { X, Edit2, Trash2 } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
    createdAt: string;
    _count?: {
        orders: number;
    };
}

export default function AdminUsers() {
    const queryClient = useQueryClient();
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // Fetch Users
    const { data: users = [], isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const { data } = await api.get('/users');
            return data;
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (user: Partial<User>) => {
            return api.put(`/users/${user.id}`, user);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setEditingUser(null);
        },
        onError: (err) => {
            alert("Failed to update user");
            console.error(err);
        }
    });

    const handleUpdate = () => {
        if (!editingUser) return;
        updateMutation.mutate({
            id: editingUser.id,
            name: editingUser.name,
            role: editingUser.role
        });
    };

    if (isLoading) return <div className="text-center p-8 text-gray-500 font-bold">Loading users...</div>;
    if (error) return <div className="text-center p-8 text-red-500 font-bold">Failed to load users</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-black text-gray-800">User Management</h2>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-4 px-6 font-black text-gray-600">ID</th>
                                <th className="text-left py-4 px-6 font-black text-gray-600">Name</th>
                                <th className="text-left py-4 px-6 font-black text-gray-600">Email</th>
                                <th className="text-left py-4 px-6 font-black text-gray-600">Role</th>
                                <th className="text-left py-4 px-6 font-black text-gray-600">Orders</th>
                                <th className="text-left py-4 px-6 font-black text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user: User) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 font-bold text-gray-800">#{user.id}</td>
                                    <td className="py-4 px-6 text-gray-700">{user.name || 'N/A'}</td>
                                    <td className="py-4 px-6 text-gray-700">{user.email}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-gray-700 font-bold">{user._count?.orders || 0}</td>
                                    <td className="py-4 px-6">
                                        <button
                                            onClick={() => setEditingUser(user)}
                                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditingUser(null)}>
                    <div className="bg-white rounded-2xl max-w-lg w-full p-8" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-gray-800">Edit User</h2>
                            <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-bold text-gray-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={editingUser.name || ''}
                                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-gray-700 mb-2">Email</label>
                                <input
                                    type="text"
                                    value={editingUser.email}
                                    disabled
                                    className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-gray-700 mb-2">Role</label>
                                <select
                                    value={editingUser.role}
                                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as 'USER' | 'ADMIN' })}
                                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none"
                                >
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <button
                                    onClick={handleUpdate}
                                    disabled={updateMutation.isPending}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                                >
                                    {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button onClick={() => setEditingUser(null)} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all">
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
