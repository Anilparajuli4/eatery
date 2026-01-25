import React from 'react';

export default function AdminNav() {
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
                            <p className="text-sm text-gray-500 font-medium">BSquare Eatery Management</p>
                        </div>
                    </div>
                    <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                        Back to Store
                    </button>
                </div>
            </div>
        </nav>
    );
}
