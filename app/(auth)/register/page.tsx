'use client';

import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block text-4xl mb-4">🍔</Link>
                    <h1 className="text-2xl font-bold text-gray-800">BSquare Eaton</h1>
                </div>
                <RegisterForm />
            </div>
        </div>
    );
}
