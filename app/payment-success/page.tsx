'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import OrderSuccessCard from '@/components/user/OrderSuccessCard';
import api from '@/lib/api';
import { Order } from '@/types';

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('orderId');
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(!!orderId);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) return;
            try {
                const { data } = await api.get(`/orders?ids=${orderId}`);
                if (data && data.length > 0) {
                    setOrder(data[0]);
                }
            } catch (error) {
                console.error("Failed to fetch order details", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    const handleTrackOrder = () => {
        router.push('/'); // Or specifically to orders page if possible
        // The user page handles redirection to orders if page is set
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-200 rounded-full mb-4"></div>
                    <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    // Calculate estimated time from order items
    const calculateEstimatedTime = (orderData: any) => {
        if (!orderData?.items || orderData.items.length === 0) return '15-20';

        const prepTimes = orderData.items
            .map((item: any) => item.product?.prepTime || 15);

        const maxTime = Math.max(...prepTimes);
        return (maxTime + 5).toString();
    };

    // Fallback if no order found or no orderId
    const orderDetails = order ? {
        orderId: order.id.toString(),
        total: order.total,
        pickupTime: calculateEstimatedTime(order),
        paymentMethod: (order.paymentMethod?.toLowerCase() === 'cash' ? 'cash' : 'card') as 'card' | 'cash'
    } : {
        orderId: orderId || 'Unknown',
        total: '0.00',
        pickupTime: '15-20',
        paymentMethod: 'card' as const
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-lg">
                <OrderSuccessCard
                    orderDetails={orderDetails}
                    onTrackOrder={() => router.push('/?page=orders')}
                    onContinue={() => router.push('/')}
                />
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}
