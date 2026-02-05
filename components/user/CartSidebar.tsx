'use client';

import React from 'react';
import { X, Clock, ShoppingCart, Check, Minus, Plus, Trash2, ArrowLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { CartItem, OrderDetails } from '@/types';
import { getItemEmoji } from '@/lib/utils';

interface CartSidebarProps {
    showCart: boolean;
    setShowCart: (show: boolean) => void;
    cart: CartItem[];
    getEstimatedTime: number;
    orderPlaced: boolean;
    checkoutStep: number;
    setCheckoutStep: React.Dispatch<React.SetStateAction<number>>; // using Dispatch for setCheckoutStep
    setCurrentPage: (page: any) => void;
    updateQuantity: (id: number, change: number) => void;
    removeItem: (id: number) => void;
    orderDetails: OrderDetails;
    setOrderDetails: (details: OrderDetails) => void;
    getTotalItems: number;
    getTotal: string;
    handleCheckout: () => void;
    isCheckoutDisabled: boolean;
    isPaymentLoading: boolean;
    isPhoneValid: boolean;
}

export default function CartSidebar({
    showCart,
    setShowCart,
    cart,
    getEstimatedTime,
    orderPlaced,
    checkoutStep,
    setCheckoutStep,
    setCurrentPage,
    updateQuantity,
    removeItem,
    orderDetails,
    setOrderDetails,
    getTotalItems,
    getTotal,
    handleCheckout,
    isCheckoutDisabled,
    isPaymentLoading,
    isPhoneValid
}: CartSidebarProps) {
    return (
        <div className={`fixed inset-0 z-50 ${showCart ? '' : 'pointer-events-none'}`}>
            <div
                className={`absolute inset-0 bg-black transition-opacity duration-300 ${showCart ? 'opacity-50' : 'opacity-0'}`}
                onClick={() => setShowCart(false)}
            ></div>

            <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ${showCart ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
                <div className="flex flex-col h-full overflow-hidden">
                    <div className="p-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white flex-shrink-0">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-3xl font-black">Your Order</h2>
                            <button
                                onClick={() => setShowCart(false)}
                                className="hover:bg-white/20 p-2 rounded-full transition-colors"
                                aria-label="Close cart"
                            >
                                <X size={28} />
                            </button>
                        </div>
                        {cart.length > 0 && (
                            <div className="flex items-center gap-3 text-white/90">
                                <Clock size={18} />
                                <span className="font-semibold">Ready in ~{getEstimatedTime} mins</span>
                            </div>
                        )}
                    </div>

                    {cart.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                            <ShoppingCart size={80} className="mb-6 text-gray-300" />
                            <h3 className="text-2xl font-bold text-gray-400 mb-3">Your cart is empty</h3>
                            <p className="text-gray-500 mb-8">Add some delicious items to get started!</p>
                            <button
                                onClick={() => { setShowCart(false); setCurrentPage('menu'); }}
                                className="px-10 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold hover:shadow-xl transition-all"
                            >
                                Browse Menu
                            </button>
                        </div>
                    ) : orderPlaced ? (
                        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-2xl">
                                <Check size={50} className="text-white" />
                            </div>
                            <h3 className="text-4xl font-black text-gray-900 mb-3">Order Placed!</h3>
                            <p className="text-xl text-gray-600 mb-2">We're preparing your meal</p>
                            <p className="text-orange-600 font-bold text-lg mb-4">Ready in {getEstimatedTime} minutes</p>
                            <p className="text-gray-500 mb-6">Order #BS{Math.floor(Math.random() * 10000)}</p>
                            <div className="w-full bg-orange-100 rounded-2xl p-4">
                                <p className="text-sm text-gray-700">📱 We'll send you updates via SMS</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto p-6">
                                {checkoutStep === 1 && (
                                    <div className="space-y-4">
                                        {cart.map(item => (
                                            <div key={item.id} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-5 border-2 border-orange-100">
                                                <div className="flex gap-4">
                                                    <div className="text-5xl flex-shrink-0">{getItemEmoji(item.category)}</div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{item.name}</h3>
                                                        <p className="text-orange-600 font-black text-lg">${item.price.toFixed(2)}</p>
                                                        {item.quantity >= item.stock && (
                                                            <p className="text-red-500 text-xs font-bold mt-1">Max stock reached!</p>
                                                        )}
                                                        <div className="flex items-center gap-4 mt-3">
                                                            <div className="flex items-center gap-3 bg-white rounded-full p-1 shadow-md">
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, -1)}
                                                                    className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
                                                                    aria-label="Decrease quantity"
                                                                >
                                                                    <Minus size={16} />
                                                                </button>
                                                                <span className="font-bold text-lg px-2">{item.quantity}</span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, 1)}
                                                                    disabled={item.quantity >= item.stock}
                                                                    className={`w-8 h-8 text-white rounded-full flex items-center justify-center transition-colors ${item.quantity >= item.stock ? 'bg-gray-300 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}`}
                                                                    aria-label="Increase quantity"
                                                                >
                                                                    <Plus size={16} />
                                                                </button>
                                                            </div>
                                                            <button
                                                                onClick={() => removeItem(item.id)}
                                                                className="ml-auto text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
                                                                aria-label="Remove item"
                                                            >
                                                                <Trash2 size={20} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {checkoutStep === 2 && (
                                    <div className="space-y-5">
                                        <h3 className="text-2xl font-black mb-4 text-gray-900">Pickup Details</h3>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Your Name *</label>
                                            <input
                                                type="text"
                                                placeholder="John Doe"
                                                value={orderDetails.name}
                                                onChange={e => setOrderDetails({ ...orderDetails, name: e.target.value })}
                                                className={`w-full p-4 border-2 rounded-xl outline-none transition-colors ${orderDetails.name.trim().length === 0 ? 'border-gray-200' : 'border-green-200'}`}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number (10 digits) *</label>
                                            <input
                                                type="tel"
                                                placeholder="1234567890"
                                                maxLength={10}
                                                value={orderDetails.phone}
                                                onChange={e => setOrderDetails({ ...orderDetails, phone: e.target.value.replace(/[^0-9]/g, '') })}
                                                className={`w-full p-4 border-2 rounded-xl outline-none transition-colors ${orderDetails.phone.length > 0 && !isPhoneValid ? 'border-red-400 bg-red-50' :
                                                    isPhoneValid ? 'border-green-400' : 'border-gray-200'
                                                    }`}
                                                required
                                            />
                                            {orderDetails.phone.length > 0 && !isPhoneValid && (
                                                <p className="text-red-500 text-xs font-bold mt-1">Must be exactly 10 digits</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Pickup Time</label>
                                            <select
                                                value={orderDetails.pickupTime}
                                                onChange={e => setOrderDetails({ ...orderDetails, pickupTime: e.target.value })}
                                                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none transition-colors"
                                            >
                                                <option value="asap">ASAP ({getEstimatedTime} mins)</option>
                                                <option value="30">30 minutes</option>
                                                <option value="60">1 hour</option>
                                                <option value="90">1.5 hours</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Special Instructions</label>
                                            <textarea
                                                placeholder="Extra sauce, no onions, etc..."
                                                rows={4}
                                                value={orderDetails.instructions}
                                                onChange={e => setOrderDetails({ ...orderDetails, instructions: e.target.value })}
                                                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none transition-colors resize-none"
                                            ></textarea>
                                        </div>
                                    </div>
                                )}

                                {checkoutStep === 3 && (
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-black mb-4 text-gray-900">Payment Method</h3>
                                        <button
                                            onClick={() => setOrderDetails({ ...orderDetails, paymentMethod: 'card' })}
                                            className={`w-full p-5 border-2 rounded-2xl font-semibold flex items-center justify-between transition-all ${orderDetails.paymentMethod === 'card'
                                                ? 'border-orange-500 bg-orange-50'
                                                : 'border-gray-200 hover:border-orange-300'
                                                }`}
                                        >
                                            <span className="flex items-center gap-3">
                                                <span className="text-2xl">💳</span>
                                                <span>Card Payment</span>
                                            </span>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${orderDetails.paymentMethod === 'card' ? 'border-orange-500' : 'border-gray-300'
                                                }`}>
                                                {orderDetails.paymentMethod === 'card' && (
                                                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                                )}
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => setOrderDetails({ ...orderDetails, paymentMethod: 'cash' })}
                                            className={`w-full p-5 border-2 rounded-2xl font-semibold flex items-center justify-between transition-all ${orderDetails.paymentMethod === 'cash'
                                                ? 'border-orange-500 bg-orange-50'
                                                : 'border-gray-200 hover:border-orange-300'
                                                }`}
                                        >
                                            <span className="flex items-center gap-3">
                                                <span className="text-2xl">💵</span>
                                                <span>Cash on Pickup</span>
                                            </span>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${orderDetails.paymentMethod === 'cash' ? 'border-orange-500' : 'border-gray-300'
                                                }`}>
                                                {orderDetails.paymentMethod === 'cash' && (
                                                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                                )}
                                            </div>
                                        </button>

                                        <div className="mt-8 p-5 bg-blue-50 rounded-2xl border-2 border-blue-200">
                                            <div className="flex gap-3">
                                                <AlertCircle className="text-blue-600 flex-shrink-0" size={24} />
                                                <div>
                                                    <p className="font-bold text-blue-900 mb-1">Order Summary</p>
                                                    <p className="text-sm text-blue-700">Name: {orderDetails.name || 'Not provided'}</p>
                                                    <p className="text-sm text-blue-700">Phone: {orderDetails.phone || 'Not provided'}</p>
                                                    <p className="text-sm text-blue-700">Pickup: {orderDetails.pickupTime === 'asap' ? `ASAP (${getEstimatedTime} mins)` : `${orderDetails.pickupTime} minutes`}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t-2 border-gray-100 bg-gradient-to-br from-gray-50 to-orange-50 flex-shrink-0">
                                {checkoutStep > 1 && (
                                    <button
                                        onClick={() => setCheckoutStep(prev => prev - 1)}
                                        className="mb-4 text-orange-600 font-bold flex items-center gap-2 hover:gap-3 transition-all"
                                    >
                                        <ArrowLeft size={20} /> Back
                                    </button>
                                )}

                                <div className="flex justify-between items-center mb-5">
                                    <div>
                                        <p className="text-sm text-gray-600">Total ({getTotalItems} items)</p>
                                        <p className="text-4xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                            ${getTotal}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={isCheckoutDisabled || isPaymentLoading}
                                    className="w-full py-5 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white rounded-2xl font-black text-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    {isPaymentLoading ? (
                                        <>
                                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                            Initializing Payment...
                                        </>
                                    ) : (
                                        <>
                                            {checkoutStep === 3 ? '🎉 Place Order' : 'Continue'}
                                            <ChevronRight size={24} />
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-xs text-gray-500 mt-3">
                                    Step {checkoutStep} of 3: {checkoutStep === 1 ? 'Review your order' : checkoutStep === 2 ? 'Enter pickup details' : 'Confirm payment'}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
