'use client';

import AdminUsers from '@/components/admin/AdminUsers';

export default function UsersPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Customers</h1>
                <p className="text-slate-500">View and manage your customer database.</p>
            </div>
            <AdminUsers />
        </div>
    );
}
