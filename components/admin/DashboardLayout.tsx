'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Settings,
    ChefHat,
    Box,
    BarChart3,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Search,
    Bell
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SidebarItem {
    name: string;
    href: string;
    icon: any;
}

const adminItems: SidebarItem[] = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Menu', href: '/admin/menu', icon: ChefHat },
    { name: 'Inventory', href: '/admin/inventory', icon: Box },
    { name: 'Customers', href: '/admin/users', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

const staffItems: SidebarItem[] = [
    { name: 'Kitchen Board', href: '/staff', icon: ChefHat },
    { name: 'Orders', href: '/staff/orders', icon: ShoppingBag },
];

import LoadingScreen from '../ui/LoadingScreen';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const { user, logout, isLoading } = useAuth();
    const pathname = usePathname();

    const items = user?.role === 'ADMIN' ? adminItems : staffItems;

    // Protection Logic
    if (isLoading) return <LoadingScreen />;

    if (!user) {
        if (typeof window !== 'undefined') window.location.href = '/login';
        return null;
    }

    const isAdminRoute = pathname?.startsWith('/admin');
    const isStaffRoute = pathname?.startsWith('/staff');

    if (isAdminRoute && user.role !== 'ADMIN') {
        if (typeof window !== 'undefined') window.location.href = '/';
        return null;
    }

    if (isStaffRoute && user.role !== 'STAFF' && user.role !== 'ADMIN') {
        if (typeof window !== 'undefined') window.location.href = '/';
        return null;
    }


    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Sidebar */}
            <aside
                className={`${collapsed ? 'w-20' : 'w-64'
                    } transition-all duration-300 ease-in-out bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed h-full z-50`}
            >
                <div className="p-6 flex items-center justify-between">
                    {!collapsed && (
                        <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                            BS Eater
                        </span>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                    >
                        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2 py-4">
                    {items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <item.icon size={20} />
                                {!collapsed && <span className="font-medium">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                        onClick={logout}
                        className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200"
                    >
                        <LogOut size={20} />
                        {!collapsed && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`${collapsed ? 'ml-20' : 'ml-64'} flex-1 transition-all duration-300 ease-in-out`}>
                {/* Header */}
                <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full w-96 text-slate-400">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search orders, menu, customers..."
                            className="bg-transparent border-none outline-none text-slate-600 dark:text-slate-300 w-full text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                            <Bell size={22} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        </button>
                        <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-6">
                            <div className="text-right">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</p>
                                <p className="text-xs text-slate-500 uppercase tracking-wider">{user?.role}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-red-600 p-[2px]">
                                <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center font-bold text-orange-500">
                                    {user?.name?.[0]}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
