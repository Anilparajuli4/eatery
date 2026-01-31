'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Save, Clock, Percent, Truck } from 'lucide-react';

export default function AdminSettings() {
    const queryClient = useQueryClient();
    const [success, setSuccess] = useState(false);

    const { data: settings = [], isLoading } = useQuery({
        queryKey: ['settings'],
        queryFn: async () => {
            const { data } = await api.get('/admin/settings');
            return data;
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (updatedSettings: any[]) => {
            return api.put('/admin/settings', { settings: updatedSettings });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings'] });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const updated = Array.from(formData.entries()).map(([key, value]) => ({
            key,
            value: value.toString()
        }));
        updateMutation.mutate(updated);
    };

    if (isLoading) return <div>Loading settings...</div>;

    const getSetting = (key: string) => settings.find((s: any) => s.key === key)?.value || '';

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
                        <Clock size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Business Hours</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Opening Time</label>
                        <input name="open_time" type="time" defaultValue={getSetting('open_time')} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Closing Time</label>
                        <input name="close_time" type="time" defaultValue={getSetting('close_time')} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl" />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                        <Percent size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Fees & Taxes</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tax Rate (%)</label>
                        <input name="tax_rate" type="number" step="0.01" defaultValue={getSetting('tax_rate')} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Service Fee ($)</label>
                        <input name="service_fee" type="number" step="0.01" defaultValue={getSetting('service_fee')} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl" />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
                        <Truck size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Delivery Settings</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Min Order for Free Delivery ($)</label>
                        <input name="min_free_delivery" type="number" defaultValue={getSetting('min_free_delivery')} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Base Delivery Fee ($)</label>
                        <input name="delivery_fee" type="number" defaultValue={getSetting('delivery_fee')} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl" />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                {success && <p className="text-green-500 font-bold">Settings saved successfully!</p>}
                <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="ml-auto flex items-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-2xl font-bold hover:shadow-xl shadow-orange-500/20 transition-all active:scale-95 disabled:opacity-50"
                >
                    <Save size={20} />
                    {updateMutation.isPending ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </form>
    );
}
