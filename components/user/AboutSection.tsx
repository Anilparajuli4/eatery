'use client';

import React from 'react';
import { Clock, MapPin, Phone } from 'lucide-react';

export default function AboutSection() {
    return (
        <div className="pt-24 pb-16 min-h-screen">
            <div className="max-w-5xl mx-auto px-4 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-6xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">
                        About Us
                    </h1>
                    <p className="text-2xl text-gray-600 font-medium">The story behind the flavor</p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl p-10 mb-12 border border-orange-100">
                    <div className="text-8xl text-center mb-8">🍔</div>
                    <p className="text-xl text-gray-700 mb-6 leading-relaxed text-center">
                        At <span className="font-bold text-orange-600">BSquare Eatery</span>, we're passionate about serving fresh, juicy, made-to-order meals that bring smiles to your face. From our signature smashed beef burgers to crispy fish & chips, every dish is crafted with premium ingredients and love.
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed text-center">
                        Our diverse menu features gourmet burgers, wraps, seafood delights, loaded fries, and refreshing drinks to satisfy every craving. Quality, flavor, and customer satisfaction are at the heart of everything we do.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 border border-orange-100">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Clock size={32} className="text-white" />
                        </div>
                        <h3 className="font-black text-xl mb-3 text-gray-900">Opening Hours</h3>
                        <p className="text-gray-700 font-semibold">Monday - Sunday</p>
                        <p className="text-orange-600 font-bold text-lg">10:00 AM - 9:00 PM</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 border border-orange-100">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <MapPin size={32} className="text-white" />
                        </div>
                        <h3 className="font-black text-xl mb-3 text-gray-900">Find Us</h3>
                        <p className="text-gray-700 font-semibold">123 Flavor Street</p>
                        <p className="text-orange-600 font-bold">Food District, FC 12345</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 border border-orange-100">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Phone size={32} className="text-white" />
                        </div>
                        <h3 className="font-black text-xl mb-3 text-gray-900">Contact</h3>
                        <p className="text-gray-700 font-semibold">+1 234 567 8900</p>
                        <p className="text-orange-600 font-bold">info@bsquare.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
