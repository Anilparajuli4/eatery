import React from 'react';

export default function AdminAnalytics() {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-black text-gray-800">Analytics & Reports</h2>

            {/* Time Period Selector */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex gap-4 flex-wrap">
                    <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold">
                        Today
                    </button>
                    <button className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200">
                        This Week
                    </button>
                    <button className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200">
                        This Month
                    </button>
                    <button className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200">
                        Custom Range
                    </button>
                </div>
            </div>

            {/* Revenue Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-black text-gray-800 mb-6">Revenue Breakdown</h3>
                    <div className="space-y-4">
                        {[
                            { category: 'Beef Burgers', revenue: 4850, percentage: 38 },
                            { category: 'Chicken', revenue: 3200, percentage: 25 },
                            { category: 'Seafood', revenue: 2100, percentage: 17 },
                            { category: 'Loaded Fries', revenue: 1600, percentage: 13 },
                            { category: 'Sides & Drinks', revenue: 900, percentage: 7 }
                        ].map(item => (
                            <div key={item.category}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-gray-700">{item.category}</span>
                                    <div className="text-right">
                                        <span className="font-black text-gray-800">${item.revenue}</span>
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
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t-2 border-gray-200">
                        <div className="flex justify-between items-center">
                            <span className="font-black text-gray-800">Total Revenue</span>
                            <span className="font-black text-3xl text-green-600">$12,650</span>
                        </div>
                    </div>
                </div>

                {/* Peak Hours */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-black text-gray-800 mb-6">Peak Hours</h3>
                    <div className="space-y-4">
                        {[
                            { hour: '11:00 AM - 12:00 PM', orders: 24, percentage: 85 },
                            { hour: '12:00 PM - 1:00 PM', orders: 28, percentage: 100 },
                            { hour: '1:00 PM - 2:00 PM', orders: 22, percentage: 78 },
                            { hour: '6:00 PM - 7:00 PM', orders: 26, percentage: 93 },
                            { hour: '7:00 PM - 8:00 PM', orders: 20, percentage: 71 }
                        ].map(item => (
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
                        ))}
                    </div>
                </div>
            </div>

            {/* Customer Insights */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-black text-gray-800 mb-6">Customer Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-blue-50 rounded-xl">
                        <div className="text-5xl mb-3">👥</div>
                        <p className="text-3xl font-black text-gray-800">487</p>
                        <p className="text-gray-600 font-semibold mt-2">Total Customers</p>
                        <p className="text-blue-600 text-sm font-bold mt-2">↑ 23 new today</p>
                    </div>
                    <div className="text-center p-6 bg-green-50 rounded-xl">
                        <div className="text-5xl mb-3">🔄</div>
                        <p className="text-3xl font-black text-gray-800">68%</p>
                        <p className="text-gray-600 font-semibold mt-2">Return Rate</p>
                        <p className="text-green-600 text-sm font-bold mt-2">↑ 5% this month</p>
                    </div>
                    <div className="text-center p-6 bg-yellow-50 rounded-xl">
                        <div className="text-5xl mb-3">⭐</div>
                        <p className="text-3xl font-black text-gray-800">4.8</p>
                        <p className="text-gray-600 font-semibold mt-2">Avg Rating</p>
                        <p className="text-yellow-600 text-sm font-bold mt-2">234 reviews</p>
                    </div>
                </div>
            </div>

            {/* Monthly Performance */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-black text-gray-800 mb-6">Monthly Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-bold text-gray-700 mb-4">Best Performing Days</h4>
                        <div className="space-y-3">
                            {[
                                { day: 'Friday', orders: 142, revenue: 2240 },
                                { day: 'Saturday', orders: 138, revenue: 2180 },
                                { day: 'Thursday', orders: 125, revenue: 1980 }
                            ].map(item => (
                                <div key={item.day} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="font-bold text-gray-800">{item.day}</span>
                                    <div className="text-right">
                                        <p className="font-black text-green-600">${item.revenue}</p>
                                        <p className="text-xs text-gray-500">{item.orders} orders</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-700 mb-4">Payment Methods</h4>
                        <div className="space-y-3">
                            {[
                                { method: 'Card Payment', percentage: 72, amount: 9108 },
                                { method: 'Cash', percentage: 28, amount: 3542 }
                            ].map(item => (
                                <div key={item.method}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-gray-700">{item.method}</span>
                                        <span className="font-black text-gray-800">${item.amount}</span>
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
