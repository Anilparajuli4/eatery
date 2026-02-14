'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Send, MapPin, Phone, Mail, Clock, Car } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 pt-24 pb-12 text-white overflow-hidden relative">
            {/* Top Border Accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 opacity-50"></div>

            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
                    {/* Brand Section */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-3xl shadow-2xl shadow-orange-500/20">
                                🍔
                            </div>
                            <span className="text-3xl font-black tracking-tighter uppercase italic">
                                BSquare <span className="text-orange-500">Eatery</span>
                            </span>
                        </div>
                        <p className="text-gray-400 font-bold leading-relaxed text-lg">
                            Serving the finest gourmet burgers and meals in town. Fresh ingredients, passionate chefs, and hot & ready for pickup.
                        </p>
                        <div className="flex gap-6">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-orange-500 hover:scale-110 transition-all duration-300 shadow-lg">
                                    <Icon size={24} className="text-white" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Info */}
                    <div>
                        <h4 className="text-xl font-black mb-10 uppercase tracking-widest text-orange-500 italic">Pickup Hours</h4>
                        <ul className="space-y-6 text-gray-400 font-black text-lg">
                            <li className="flex items-start gap-4">
                                <Clock size={24} className="text-orange-500 shrink-0" />
                                <div>
                                    <p className="text-white">Daily</p>
                                    <p className="text-sm">11:00 AM - 10:00 PM</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <Car size={24} className="text-orange-500 shrink-0" />
                                <div>
                                    <p className="text-white">Parking</p>
                                    <p className="text-sm">Free customer parking available</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-xl font-black mb-10 uppercase tracking-widest text-orange-500 italic">Contact Info</h4>
                        <ul className="space-y-6 text-gray-400 font-bold text-lg">
                            <li className="flex items-start gap-4">
                                <MapPin size={24} className="text-orange-500 shrink-0" />
                                123 Flavour Street, Food City, FC 56789
                            </li>
                            <li className="flex items-center gap-4">
                                <Phone size={24} className="text-orange-500 shrink-0" />
                                +1 (555) 123-4567
                            </li>
                            <li className="flex items-center gap-4">
                                <Mail size={24} className="text-orange-500 shrink-0" />
                                hello@bsquareeatery.com
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-xl font-black mb-10 uppercase tracking-widest text-orange-500 italic">Newsletter</h4>
                        <p className="text-gray-400 font-bold mb-8 text-lg">
                            Subscribe to get special offers and seasonal menu updates.
                        </p>
                        <form className="relative space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div className="relative group">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="w-full bg-white/5 border-2 border-white/20 rounded-[1.5rem] py-5 px-8 focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all font-black text-lg placeholder:text-gray-500 shadow-2xl"
                                />
                                <button className="absolute right-3 top-2 bottom-2 px-6 bg-orange-500 rounded-[1rem] flex items-center justify-center hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 active:scale-95">
                                    <Send size={24} className="text-white" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 text-sm font-black uppercase tracking-widest">
                    <p>© 2026 BSquare Eatery. All rights reserved.</p>
                    <div className="flex gap-10">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
