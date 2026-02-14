'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: 'Sarah Johnson',
        role: 'Verified Customer',
        content: 'Amazing food! The pickup process was so smooth and my smash burger was still smoking hot when I got home. Best in town!',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop'
    },
    {
        name: 'Michael Chen',
        role: 'Verified Customer',
        content: 'Ordered for pickup and it was ready exactly on time. The Peri-Peri fries are a game changer! Super fresh and well packaged.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop'
    },
    {
        name: 'Emma Williams',
        role: 'Verified Customer',
        content: 'I love that I can just order online and swing by to pick up my salad and burger. The quality is consistent every single time.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop'
    }
];

export default function Testimonials() {
    return (
        <section className="py-24 bg-white border-y border-gray-100 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>

            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight uppercase italic">
                            Loved by <span className="text-orange-500">Diners</span>
                        </h2>
                        <div className="h-2 w-32 bg-orange-500 rounded-full mx-auto"></div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.6 }}
                            className="bg-gray-50/50 p-8 rounded-[3rem] shadow-xl shadow-gray-200/40 border border-gray-100 flex flex-col justify-between group hover:bg-white hover:shadow-orange-500/10 transition-all duration-500"
                        >
                            <div>
                                <div className="mb-6 text-orange-500 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                                    <Quote size={48} fill="currentColor" />
                                </div>
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, index) => (
                                        <Star key={index} className="text-orange-500 fill-orange-500" size={18} />
                                    ))}
                                </div>
                                <p className="text-gray-900 font-bold text-lg sm:text-xl leading-relaxed mb-10 tracking-tight italic">
                                    "{t.content}"
                                </p>
                            </div>

                            <div className="flex items-center gap-4 border-t border-gray-200 pt-6">
                                <div className="relative">
                                    <img src={t.image} alt={t.name} className="w-14 h-14 rounded-2xl object-cover ring-4 ring-orange-50" />
                                    <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-4 border-white"></div>
                                </div>
                                <div>
                                    <div className="font-black text-gray-900 text-base mb-0.5">{t.name}</div>
                                    <div className="text-[10px] text-orange-600 font-black uppercase tracking-[0.2em]">{t.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
