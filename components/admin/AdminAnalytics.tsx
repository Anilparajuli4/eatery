import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

interface AnalyticsData {
    categoryBreakdown: { category: string; revenue: number; percentage: number }[];
    totalRevenue: number;
    peakHours: { hour: string; orders: number; percentage: number }[];
    customerInsights: { totalCustomers: number; newToday: number; returnRate: number; avgRating: number };
    bestDays: { day: string; revenue: number; orders: number }[];
    paymentMethods: { method: string; amount: number; percentage: number }[];
}

export default function AdminAnalytics() {
    const [timeRange, setTimeRange] = useState('all');

    const { data: analytics, isLoading, error } = useQuery<AnalyticsData>({
        queryKey: ['analytics', timeRange],
        queryFn: async () => {
            const { data } = await api.get('/admin/analytics');
            return data;
        }
    });

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading analytics...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Failed to load analytics data</div>;
    if (!analytics) return null;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-black text-gray-800">Analytics & Reports</h2>

            {/* Time Period Selector - Visual only for now as backend defaults to best relevant range */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex gap-4 flex-wrap">
                    {/* Buttons just visualized, logic can be extended later */}
                    <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold opacity-100">
                        Overview
                    </button>
                </div>
            </div>

            {/* Revenue Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-black text-gray-800 mb-6">Revenue Breakdown</h3>
                    <div className="space-y-4">
                        {analytics.categoryBreakdown.length > 0 ? (
                            analytics.categoryBreakdown.map(item => (
                                <div key={item.category}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-gray-700 capitalize">{item.category}</span>
                                        <div className="text-right">
                                            <span className="font-black text-gray-800">${item.revenue.toLocaleString()}</span>
                                            <span className="text-sm text-gray-500 ml-2">({item.percentage}%)</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">No revenue data yet.</p>
                        )}
                    </div>
                    <div className="mt-6 pt-6 border-t-2 border-gray-200">
                        <div className="flex justify-between items-center">
                            <span className="font-black text-gray-800">Total Revenue</span>
                            <span className="font-black text-3xl text-green-600">${analytics.totalRevenue.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Peak Hours */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-black text-gray-800 mb-6">Peak Hours</h3>
                    <div className="space-y-4">
                        {analytics.peakHours.length > 0 ? (
                            analytics.peakHours.map(item => (
                                <div key={item.hour}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-gray-700">{item.hour}</span>
                                        <span className="font-black text-gray-800">{item.orders} orders</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">No order data yet.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Customer Insights */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-black text-gray-800 mb-6">Customer Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-blue-50 rounded-xl">
                        <div className="text-5xl mb-3">👥</div>
                        <p className="text-3xl font-black text-gray-800">{analytics.customerInsights.totalCustomers}</p>
                        <p className="text-gray-600 font-semibold mt-2">Total Customers</p>
                        <p className="text-blue-600 text-sm font-bold mt-2">↑ {analytics.customerInsights.newToday} new today</p>
                    </div>
                    <div className="text-center p-6 bg-green-50 rounded-xl">
                        <div className="text-5xl mb-3">🔄</div>
                        <p className="text-3xl font-black text-gray-800">{analytics.customerInsights.returnRate}%</p>
                        <p className="text-gray-600 font-semibold mt-2">Return Rate</p>
                        <p className="text-green-600 text-sm font-bold mt-2">Based on order history</p>
                    </div>
                    <div className="text-center p-6 bg-yellow-50 rounded-xl">
                        <div className="text-5xl mb-3">⭐</div>
                        <p className="text-3xl font-black text-gray-800">{analytics.customerInsights.avgRating}</p>
                        <p className="text-gray-600 font-semibold mt-2">Avg Rating</p>
                        <p className="text-yellow-600 text-sm font-bold mt-2">(Coming Soon)</p>
                    </div>
                </div>
            </div>

            {/* Monthly Performance */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-black text-gray-800 mb-6">Performance & Payments</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-bold text-gray-700 mb-4">Best Performing Days (Last 30 Days)</h4>
                        <div className="space-y-3">
                            {analytics.bestDays.length > 0 ? (
                                analytics.bestDays.map(item => (
                                    <div key={item.day} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="font-bold text-gray-800">{item.day}</span>
                                        <div className="text-right">
                                            <p className="font-black text-green-600">${item.revenue.toLocaleString()}</p>
                                            <p className="text-xs text-gray-500">{item.orders} orders</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">Not enough data yet.</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-700 mb-4">Payment Methods</h4>
                        <div className="space-y-3">
                            {analytics.paymentMethods.map(item => (
                                <div key={item.method}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-gray-700">{item.method}</span>
                                        <span className="font-black text-gray-800">${item.amount.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-indigo-500 to-blue-500 h-3 rounded-full"
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
