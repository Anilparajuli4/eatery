'use client';

import AdminMenu from '@/components/admin/AdminMenu';

export default function MenuPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Menu Management</h1>
                <p className="text-slate-500">Create, edit, and manage your menu items.</p>
            </div>
            <AdminMenu />
        </div>
    );
}
