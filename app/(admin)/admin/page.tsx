'use client';

import React, { useState } from 'react';
import AdminNav from '@/components/admin/AdminNav';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminMenu from '@/components/admin/AdminMenu';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import AdminUsers from '@/components/admin/AdminUsers';

export default function AdminPage() {
    const [adminTab, setAdminTab] = useState<'dashboard' | 'menu' | 'orders' | 'users' | 'analytics'>('dashboard');

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNav />

            {/* Admin Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-2 py-4 overflow-x-auto">
                        {[
                            { key: 'dashboard' as const, label: '📊 Dashboard' },
                            { key: 'menu' as const, label: '🍔 Menu Items' },
                            { key: 'orders' as const, label: '📦 Orders' },
                            { key: 'users' as const, label: '👥 Users' },
                            { key: 'analytics' as const, label: '📈 Analytics' }
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setAdminTab(tab.key)}
                                className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${adminTab === tab.key
                                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Admin Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {adminTab === 'dashboard' && <AdminDashboard />}
                {adminTab === 'menu' && <AdminMenu />}
                {adminTab === 'orders' && <AdminOrders />}
                {adminTab === 'users' && <AdminUsers />}
                {adminTab === 'analytics' && <AdminAnalytics />}
            </div>
        </div>
    );
}
