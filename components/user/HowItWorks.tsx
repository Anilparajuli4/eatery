'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, Timer } from 'lucide-react';

const steps = [
    {
        icon: <Search className="text-orange-500" size={40} />,
        title: 'Choose Your Food',
        description: 'Browse our extensive menu of gourmet burgers, sides, and drinks.',
        color: 'bg-orange-100'
    },
    {
        icon: <ShoppingCart className="text-blue-500" size={40} />,
        title: 'Place Order',
        description: 'Securely pay in seconds with Apple Pay, Google Pay, or Card.',
        color: 'bg-blue-100'
    },
    {
        icon: <Timer className="text-green-500" size={40} />,
        title: 'Pick Up Fresh',
        description: 'Your meal is ready in 20 minutes. Show your order number and enjoy!',
        color: 'bg-green-100'
    }
];

export default function HowItWorks() {
    return (
        <section className="py-24 bg-orange-50/30 overflow-hidden relative">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100/20 rounded-full blur-3xl -mr-48 -mt-48"></div>

            <div className="container mx-auto px-6 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-24"
                >
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight uppercase italic">
                        How It <span className="text-orange-500">Works</span>
                    </h2>
                    <div className="h-2 w-32 bg-orange-500 rounded-full mx-auto"></div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 lg:gap-16 relative">
                    {/* Decorative Connectors (Desktop only) */}
                    <div className="hidden md:block absolute top-[15%] left-0 w-full h-0.5 border-t-4 border-dashed border-gray-200 z-0 opacity-50"></div>

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.6 }}
                            className="relative z-10 flex flex-col items-center group px-4"
                        >
                            <div className={`w-28 h-28 sm:w-32 sm:h-32 ${step.color} rounded-[3rem] flex items-center justify-center mb-10 shadow-2xl shadow-gray-200/50 group-hover:scale-110 transition-transform duration-500 relative`}>
                                <div className="absolute -top-4 -right-4 w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-black text-xl shadow-lg">
                                    {index + 1}
                                </div>
                                {step.icon}
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 tracking-tight">{step.title}</h3>
                            <p className="text-gray-700 font-bold leading-relaxed text-lg max-w-xs">
                                {step.description}
                            </p>
                            <div className="mt-8 w-12 h-1.5 bg-gray-200 rounded-full group-hover:bg-orange-500 group-hover:w-24 transition-all duration-500"></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
