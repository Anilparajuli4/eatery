'use client';

import AdminInventory from '@/components/admin/AdminInventory';

export default function InventoryPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Inventory Management</h1>
                <p className="text-slate-500">Track and update stock levels for all menu items.</p>
            </div>
            <AdminInventory />
        </div>
    );
}
