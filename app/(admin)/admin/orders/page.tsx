'use client';

import AdminOrders from '@/components/admin/AdminOrders';

export default function OrdersPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Orders</h1>
                <p className="text-slate-500">Manage and track all restaurant orders.</p>
            </div>
            <AdminOrders />
        </div>
    );
}
