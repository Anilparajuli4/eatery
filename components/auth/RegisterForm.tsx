'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await import('@/lib/api').then(m => m.default.post('/auth/register', { name, email, password }));
            router.push('/login?registered=true');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
            <div className="text-center">
                <h2 className="text-3xl font-black text-gray-900">Create Account</h2>
                <p className="mt-2 text-gray-600">Join the flavor revolution</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center font-semibold">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none transition-colors"
                        placeholder="John Doe"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none transition-colors"
                        placeholder="you@example.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none transition-colors"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:shadow-lg transition-all hover:scale-[1.02]"
                >
                    Key to Flavor
                </button>
            </form>

            <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="font-bold text-orange-600 hover:text-red-600">
                    Sign In
                </Link>
            </p>
        </div>
    );
}
