'use client';

import AdminDashboard from '@/components/admin/AdminDashboard';

export default function AdminOverviewPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
                <p className="text-slate-500">A quick look at your business performance.</p>
            </div>
            <AdminDashboard />
        </div>
    );
}
