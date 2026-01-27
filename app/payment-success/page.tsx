'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, Home } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function PaymentSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    // We can get payment_intent_client_secret from URL if redirected
    const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center space-y-6 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-xl">
                    <Check size={50} className="text-white" />
                </div>

                <div>
                    <h1 className="text-4xl font-black text-gray-900 mb-2">Payment Successful!</h1>
                    <p className="text-gray-500">Thank you for your order, {user?.name || 'Guest'}!</p>
                </div>

                <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                    <p className="text-lg font-bold text-green-800 mb-2">Order Confirmed</p>
                    <p className="text-green-600 text-sm">
                        We have received your payment and the kitchen has started preparing your delicious meal.
                    </p>
                </div>

                <div className="pt-4">
                    <Link
                        href="/"
                        className="block w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
