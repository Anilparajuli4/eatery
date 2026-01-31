'use client';

import AdminSettings from '@/components/admin/AdminSettings';

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Business Settings</h1>
                <p className="text-slate-500">Configure business hours, taxes, and fees.</p>
            </div>
            <AdminSettings />
        </div>
    );
}
