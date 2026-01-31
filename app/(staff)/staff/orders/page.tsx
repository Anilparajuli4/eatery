'use client';

import AdminOrders from '@/components/admin/AdminOrders';

export default function StaffOrdersPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Orders List</h1>
                <p className="text-slate-500">Full history of orders for staff review.</p>
            </div>
            <AdminOrders />
        </div>
    );
}
