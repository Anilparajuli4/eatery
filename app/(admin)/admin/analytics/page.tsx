'use client';

import AdminAnalytics from '@/components/admin/AdminAnalytics';

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics</h1>
                <p className="text-slate-500">View sales reports and business performance.</p>
            </div>
            <AdminAnalytics />
        </div>
    );
}
