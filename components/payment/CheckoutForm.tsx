'use client';

import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';

interface CheckoutFormProps {
    orderId: number;
    amount: number;
    customerName: string;
    customerAddress: string;
    onSuccess: () => void;
}

export default function CheckoutForm({ orderId, amount, customerName, customerAddress, onSuccess }: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        // 1. Confirm Payment
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required', // Avoid redirect if possible, easier for SPA
            confirmParams: {
                return_url: `${window.location.origin}/payment-success`, // Fallback
                payment_method_data: {
                    billing_details: {
                        name: customerName || 'Guest User',
                        address: {
                            line1: customerAddress,
                            country: 'IN', // Assuming India based on the error "Indian regulations"
                        }
                    }
                }
            },
        });

        if (error) {
            setErrorMessage(error.message ?? 'An unknown error occurred');
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            // 2. Verify with Backend
            try {
                await api.post(`/orders/${orderId}/verify-payment`);
                // onSuccess(); // Old handler
                window.location.href = '/payment-success'; // Hard redirect to ensure full state reset/clean view
            } catch (err) {
                console.error("Verification failed", err);
                setErrorMessage("Payment successful but verification failed. Please contact support.");
            }
            setIsProcessing(false);
        } else {
            setErrorMessage("Payment status: " + (paymentIntent?.status || 'unknown'));
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
            {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}
            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
            </button>
        </form>
    );
}
