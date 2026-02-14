'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function AboutSection() {
    return (
        <section className="py-24 bg-white overflow-hidden" id="about">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Visual Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl z-10 aspect-square md:aspect-video lg:aspect-square">
                            <img
                                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=800&fit=crop"
                                alt="Our professional kitchen"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent"></div>
                        </div>
                        {/* Decorative background shape */}
                        <div className="absolute -top-10 -left-10 w-64 h-64 bg-orange-100 rounded-full blur-3xl -z-0"></div>
                        <div className="absolute top-1/2 -right-10 w-24 h-24 bg-orange-500 rounded-2xl rotate-12 -z-0 shadow-2xl shadow-orange-500/40 hidden md:block"></div>
                    </motion.div>

                    {/* Content Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-10"
                    >
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase italic">
                                About <span className="text-orange-500">Us</span>
                            </h2>
                            <div className="h-2 w-32 bg-orange-500 rounded-full"></div>
                        </div>

                        <p className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 leading-tight tracking-tight">
                            At BSquare Eatery, we're passionate about serving fresh, quality meals.
                            <span className="text-orange-500"> Every dish is crafted with care </span>
                            using premium ingredients for you to pick up hot and ready.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <a href="tel:+15551234567" className="group">
                                <div className="p-6 sm:p-8 bg-orange-500 text-white rounded-[2rem] shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300 flex flex-col items-center text-center">
                                    <Phone size={32} className="mb-4" />
                                    <h4 className="font-black text-lg mb-1">Call Us</h4>
                                    <p className="font-bold opacity-90">+1 (555) 123-4567</p>
                                </div>
                            </a>
                            <a href="mailto:hello@bsquareeatery.com" className="group">
                                <div className="p-6 sm:p-8 bg-gray-900 text-white rounded-[2rem] shadow-xl shadow-gray-900/30 hover:shadow-gray-900/50 hover:scale-105 transition-all duration-300 flex flex-col items-center text-center">
                                    <Mail size={32} className="mb-4 text-orange-500" />
                                    <h4 className="font-black text-lg mb-1">Email Us</h4>
                                    <p className="font-bold opacity-90">hello@bsquare.com</p>
                                </div>
                            </a>
                        </div>

                        <div className="flex items-center gap-4 sm:gap-6 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg text-orange-500 shrink-0">
                                <MapPin size={32} />
                            </div>
                            <div>
                                <h4 className="font-black text-gray-900 text-lg sm:text-xl">Pick Up Location</h4>
                                <p className="font-bold text-gray-700">123 Flavour Street, Food City</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
