'use client';

import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

// Replace with publishable key from env or constants
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentProcessProps {
    clientSecret: string;
    orderId: number;
    amount: number;
    customerName: string;
    customerAddress: string;
    customerCity: string;
    customerState: string;
    customerPostalCode: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function PaymentProcess({
    clientSecret,
    orderId,
    amount,
    customerName,
    customerAddress,
    customerCity,
    customerState,
    customerPostalCode,
    onSuccess,
    onCancel
}: PaymentProcessProps) {
    const options = {
        clientSecret,
        appearance: {
            theme: 'stripe' as const,
            variables: {
                colorPrimary: '#f97316', // orange-500
            },
        },
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-300">
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    ✕
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-black text-gray-800">Complete Payment</h2>
                    <p className="text-gray-500 mt-2">Enter your payment details below</p>
                </div>

                <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm
                        orderId={orderId}
                        amount={amount}
                        customerName={customerName}
                        customerAddress={customerAddress}
                        customerCity={customerCity}
                        customerState={customerState}
                        customerPostalCode={customerPostalCode}
                        onSuccess={onSuccess}
                    />
                </Elements>
            </div>
        </div>
    );
}
