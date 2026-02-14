'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Info, Car, Clock } from 'lucide-react';

export default function PickupInfo() {
    return (
        <section className="py-20 pt-32 min-h-screen bg-gray-900 text-white overflow-hidden relative">
            {/* Background Decorative Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-transparent"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight uppercase italic">
                            Pickup <span className="text-orange-500">Information</span>
                        </h2>
                        <div className="h-1.5 w-24 bg-orange-500 rounded-full mx-auto"></div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Location */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10"
                    >
                        <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-orange-500/20">
                            <MapPin size={28} />
                        </div>
                        <h3 className="text-2xl font-black mb-4 uppercase italic">Where to find us</h3>
                        <p className="text-gray-400 font-bold text-lg">
                            123 Flavour Street, Food City. <br />
                            Main entrance is located on the East Side near the fountain.
                        </p>
                    </motion.div>

                    {/* How to Pick Up */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10"
                    >
                        <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20">
                            <Info size={28} />
                        </div>
                        <h3 className="text-2xl font-black mb-4 uppercase italic">How to pick up</h3>
                        <p className="text-gray-400 font-bold text-lg">
                            Provide your order number at the designated "Pickup Counter". Your meal will be ready in 15-20 minutes.
                        </p>
                    </motion.div>

                    {/* Parking & Hours */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10"
                    >
                        <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-green-500/20">
                            <Car size={28} />
                        </div>
                        <h3 className="text-2xl font-black mb-4 uppercase italic">Parking & Hours</h3>
                        <p className="text-gray-400 font-bold text-lg">
                            Free designated parking for pickup customers. <br />
                            <span className="text-white">Daily: 11:00 AM - 10:00 PM</span>
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
