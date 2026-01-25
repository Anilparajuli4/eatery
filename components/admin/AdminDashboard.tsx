import React from 'react';

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-semibold">Today's Revenue</p>
                            <p className="text-3xl font-black text-gray-800 mt-2">$1,247.50</p>
                            <p className="text-green-600 text-sm font-bold mt-2">↑ 12.5% vs yesterday</p>
                        </div>
                        <div className="text-5xl">💰</div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-semibold">Total Orders</p>
                            <p className="text-3xl font-black text-gray-800 mt-2">87</p>
                            <p className="text-blue-600 text-sm font-bold mt-2">23 pending</p>
                        </div>
                        <div className="text-5xl">📦</div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-semibold">Avg Order Value</p>
                            <p className="text-3xl font-black text-gray-800 mt-2">$14.34</p>
                            <p className="text-purple-600 text-sm font-bold mt-2">↑ 5.2% this week</p>
                        </div>
                        <div className="text-5xl">💵</div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-semibold">Menu Items</p>
                            <p className="text-3xl font-black text-gray-800 mt-2">26</p>
                            <p className="text-orange-600 text-sm font-bold mt-2">3 new this month</p>
                        </div>
                        <div className="text-5xl">🍔</div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-black text-gray-800 mb-6">Weekly Sales</h3>
                    <div className="space-y-4">
                        {[
                            { day: 'Mon', amount: 980, percentage: 70 },
                            { day: 'Tue', amount: 1150, percentage: 82 },
                            { day: 'Wed', amount: 890, percentage: 63 },
                            { day: 'Thu', amount: 1340, percentage: 96 },
                            { day: 'Fri', amount: 1580, percentage: 100 },
                            { day: 'Sat', amount: 1420, percentage: 90 },
                            { day: 'Sun', amount: 1247, percentage: 79 }
                        ].map(item => (
                            <div key={item.day}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-gray-700">{item.day}</span>
                                    <span className="font-black text-gray-800">${item.amount}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500"
                                        style={{ width: `${item.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Selling Items */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-black text-gray-800 mb-6">Top Selling Items</h3>
                    <div className="space-y-4">
                        {[
                            { name: 'BSquare Crunch', sold: 156, revenue: 2262, emoji: '🍔' },
                            { name: 'Southern Heat', sold: 134, revenue: 1809, emoji: '🍗' },
                            { name: 'Smash Cheese Burger', sold: 128, revenue: 1280, emoji: '🍔' },
                            { name: 'Cheese Loaded Fries', sold: 98, revenue: 1176, emoji: '🍟' },
                            { name: 'Calamari Crunch', sold: 87, revenue: 1261, emoji: '🐟' }
                        ].map((item, index) => (
                            <div key={item.name} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <div className="text-3xl">{item.emoji}</div>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-800">{item.name}</p>
                                    <p className="text-sm text-gray-500">{item.sold} sold</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-green-600">${item.revenue}</p>
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
                                <th className="text-left py-4 px-4 font-black text-gray-600">Items</th>
                                <th className="text-left py-4 px-4 font-black text-gray-600">Total</th>
                                <th className="text-left py-4 px-4 font-black text-gray-600">Status</th>
                                <th className="text-left py-4 px-4 font-black text-gray-600">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { id: 'BS1234', customer: 'John Smith', items: 3, total: 42.50, status: 'completed', time: '10 mins ago' },
                                { id: 'BS1235', customer: 'Sarah Johnson', items: 2, total: 28.00, status: 'preparing', time: '15 mins ago' },
                                { id: 'BS1236', customer: 'Mike Davis', items: 5, total: 67.50, status: 'pending', time: '18 mins ago' },
                                { id: 'BS1237', customer: 'Emily Brown', items: 1, total: 14.50, status: 'completed', time: '25 mins ago' },
                                { id: 'BS1238', customer: 'David Wilson', items: 4, total: 55.00, status: 'preparing', time: '32 mins ago' }
                            ].map(order => (
                                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-4 font-bold text-gray-800">{order.id}</td>
                                    <td className="py-4 px-4 text-gray-700">{order.customer}</td>
                                    <td className="py-4 px-4 text-gray-700">{order.items} items</td>
                                    <td className="py-4 px-4 font-bold text-gray-800">${order.total.toFixed(2)}</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                order.status === 'preparing' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-gray-500 text-sm">{order.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
