import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export default function AdminDashboard() {
    const { data: stats, isLoading, error } = useQuery({
        queryKey: ['adminStats'],
        queryFn: async () => {
            const { data } = await api.get('/stats');
            return data;
        }
    });

    if (isLoading) return <div className="p-8 text-center text-gray-500 font-bold">Loading dashboard stats...</div>;
    if (error) return <div className="p-8 text-center text-red-500 font-bold">Failed to load stats</div>;

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-semibold">Total Revenue</p>
                            <p className="text-3xl font-black text-gray-800 mt-2">${stats.revenue.toFixed(2)}</p>
                            {/* <p className="text-green-600 text-sm font-bold mt-2">↑ 12.5% vs yesterday</p> */}
                        </div>
                        <div className="text-5xl">💰</div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-semibold">Total Orders</p>
                            <p className="text-3xl font-black text-gray-800 mt-2">{stats.totalOrders}</p>
                            <p className="text-blue-600 text-sm font-bold mt-2">{stats.pendingOrders} pending</p>
                        </div>
                        <div className="text-5xl">📦</div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-semibold">Avg Order Value</p>
                            <p className="text-3xl font-black text-gray-800 mt-2">${stats.avgOrderValue.toFixed(2)}</p>
                            {/* <p className="text-purple-600 text-sm font-bold mt-2">↑ 5.2% this week</p> */}
                        </div>
                        <div className="text-5xl">💵</div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-semibold">Menu Items</p>
                            <p className="text-3xl font-black text-gray-800 mt-2">{stats.menuItems}</p>
                            <p className="text-orange-600 text-sm font-bold mt-2">{stats.newMenuItems} new this month</p>
                        </div>
                        <div className="text-5xl">🍔</div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-black text-gray-800 mb-6">Weekly Turnovers</h3>
                    <div className="space-y-4">
                        {stats.weeklySales.map((item: any) => {
                            // simplistic max value for bar scaling, aiming for ~1000ish as max or max of dataset
                            const max = Math.max(...stats.weeklySales.map((s: any) => s.amount), 100);
                            const percentage = Math.min((item.amount / max) * 100, 100);

                            return (
                                <div key={item.day}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-gray-700">{item.day}</span>
                                        <span className="font-black text-gray-800">${item.amount.toFixed(2)}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Top Selling Items */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-black text-gray-800 mb-6">Top Selling Items</h3>
                    <div className="space-y-4">
                        {stats.topSellingItems.map((item: any, index: number) => (
                            <div key={item.name} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                {/* <div className="text-3xl">{item.emoji}</div> */}
                                <div className="flex-1">
                                    <p className="font-bold text-gray-800">{item.name}</p>
                                    <p className="text-sm text-gray-500">{item.sold} sold</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-green-600">${item.revenue.toFixed(2)}</p>
                                    <p className="text-xs text-gray-400">#{index + 1}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-black text-gray-800 mb-6">Recent Orders</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="text-left py-4 px-4 font-black text-gray-600">Order ID</th>
                                <th className="text-left py-4 px-4 font-black text-gray-600">Customer</th>
                                {/* <th className="text-left py-4 px-4 font-black text-gray-600">Items</th> */}
                                <th className="text-left py-4 px-4 font-black text-gray-600">Total</th>
                                <th className="text-left py-4 px-4 font-black text-gray-600">Status</th>
                                <th className="text-left py-4 px-4 font-black text-gray-600">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentOrders.map((order: any) => (
                                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-4 font-bold text-gray-800">#{order.id}</td>
                                    <td className="py-4 px-4 text-gray-700">{order.user?.name || order.user?.email || 'Guest'}</td>
                                    {/* <td className="py-4 px-4 text-gray-700">{order.items} items</td> */}
                                    <td className="py-4 px-4 font-bold text-gray-800">${order.total.toFixed(2)}</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                            order.status === 'PREPARING' ? 'bg-blue-100 text-blue-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-gray-500 text-sm">{new Date(order.createdAt).toLocaleTimeString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
