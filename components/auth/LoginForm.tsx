'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const { data } = await import('@/lib/api').then(m => m.default.post('/auth/login', { email, password }));
            login(data.token, data.user);

            if (data.user.role === 'ADMIN') {
                router.push('/admin');
            } else {
                router.push('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
            <div className="text-center">
                <h2 className="text-3xl font-black text-gray-900">Welcome Back</h2>
                <p className="mt-2 text-gray-600">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center font-semibold">
                        {error}
                    </div>
                )}

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
                    Sign In
                </button>
            </form>

            <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="font-bold text-orange-600 hover:text-red-600">
                    Sign up
                </Link>
            </p>
        </div>
    );
}
