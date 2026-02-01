import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';
import Link from 'next/link';

export default function AdminNav() {
    const { logout } = useAuth();

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center gap-4">
                        <div className="text-4xl">👨‍💼</div>
                        <div>
                            <h1 className="text-2xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                Admin Dashboard
                            </h1>
                            <p className="text-sm text-gray-500 font-bold">BSquare Eatery - Where hunger meets flavour</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/" className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center gap-2">
                            View Store
                        </Link>
                        <button
                            onClick={logout}
                            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
                        >
                            <LogOut size={20} />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
