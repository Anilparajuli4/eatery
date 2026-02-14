'use client';

import React from 'react';
import { ShoppingCart, Menu, Home, Utensils, Info, MapPin, ClipboardList } from 'lucide-react';
import { PageType } from '@/types';

interface UserNavbarProps {
    currentPage: PageType;
    setCurrentPage: (page: PageType) => void;
    showCart: boolean;
    setShowCart: (show: boolean) => void;
    totalItems: number;
    mobileMenu: boolean;
    setMobileMenu: (show: boolean) => void;
}

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { LogOut, User as UserIcon } from 'lucide-react';

export default function UserNavbar({
    currentPage,
    setCurrentPage,
    setShowCart,
    totalItems,
    mobileMenu,
    setMobileMenu
}: UserNavbarProps) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        // Return user to the app home page instead of login
        setCurrentPage('home');
        setMobileMenu(false);
        router.push('/');
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-xl py-2'
            : 'bg-transparent py-4'
            }`}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between">
                    <button onClick={() => setCurrentPage('home')} className="flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">
                            🍔
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-lg sm:text-xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent uppercase italic">
                                BSquare Eatery
                            </span>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Order Online • Pick Up Fresh</p>
                        </div>
                    </button>

                    <div className="hidden md:flex gap-8">
                        {(['home', 'menu', 'about', 'location', 'orders'] as PageType[]).map(page => (
                            <button
                                key={page}
                                onClick={() => {
                                    setCurrentPage(page);
                                }}
                                className={`font-black capitalize transition-all relative text-sm tracking-widest uppercase ${currentPage === page
                                    ? 'text-orange-600'
                                    : 'text-gray-600 hover:text-orange-600'
                                    }`}
                            >
                                {page}
                                {currentPage === page && (
                                    <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Auth Buttons */}
                        {user ? (
                            <div className="hidden md:flex items-center gap-2">
                                <span className="text-sm font-bold text-gray-700 hidden lg:block">Hi, {user.name}</span>
                                {user.role === 'ADMIN' && (
                                    <button
                                        onClick={() => router.push('/admin')}
                                        className="px-3 py-1.5 bg-gray-800 text-white rounded-lg text-xs font-bold hover:bg-black transition-colors"
                                    >
                                        Admin
                                    </button>
                                )}
                                {user.role === 'STAFF' && (
                                    <button
                                        onClick={() => router.push('/staff')}
                                        className="px-3 py-1.5 bg-gray-800 text-white rounded-lg text-xs font-bold hover:bg-black transition-colors"
                                    >
                                        Kitchen
                                    </button>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="hidden md:flex gap-2">
                                <button
                                    onClick={() => router.push('/login')}
                                    className="px-4 py-2 text-orange-600 font-bold hover:bg-orange-50 rounded-xl transition-colors"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => router.push('/register')}
                                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                                >
                                    Sign Up
                                </button>
                            </div>
                        )}

                        <button
                            onClick={() => setShowCart(true)}
                            className="relative p-3 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-2xl hover:shadow-xl transition-all hover:scale-105"
                            aria-label="Shopping cart"
                        >
                            <ShoppingCart size={20} />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full text-xs flex items-center justify-center font-bold shadow-lg">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setMobileMenu(!mobileMenu)}
                            className="md:hidden p-2.5 hover:bg-orange-50 rounded-xl transition-colors"
                            aria-label="Menu"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </div>

            {mobileMenu && (
                <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-orange-100 animate-in slide-in-from-top">
                    <div className="p-4 space-y-2">
                        {user ? (
                            <div className="flex items-center justify-between p-2 border-b border-gray-100 mb-2">
                                <span className="font-bold text-gray-700">{user.name}</span>
                                <button onClick={handleLogout} className="text-red-500 font-bold text-sm">Logout</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                <button
                                    onClick={() => router.push('/login')}
                                    className="py-2 text-center text-orange-600 font-bold bg-orange-50 rounded-xl"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => router.push('/register')}
                                    className="py-2 text-center bg-orange-500 text-white font-bold rounded-xl"
                                >
                                    Sign Up
                                </button>
                            </div>
                        )}

                        {(['home', 'menu', 'about', 'location', 'orders'] as PageType[]).map((page, idx) => {
                            const icons = {
                                home: <Home size={20} />,
                                menu: <Utensils size={20} />,
                                about: <Info size={20} />,
                                location: <MapPin size={20} />,
                                orders: <ClipboardList size={20} />
                            };

                            return (
                                <React.Fragment key={page}>
                                    <button
                                        onClick={() => {
                                            setCurrentPage(page);
                                            setMobileMenu(false);
                                        }}
                                        className={`flex items-center gap-4 w-full text-left py-4 px-6 font-black uppercase text-sm tracking-widest transition-all rounded-xl ${currentPage === page
                                            ? 'text-orange-600 bg-orange-50/80 border-l-4 border-orange-500 shadow-sm'
                                            : 'text-slate-800 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className={currentPage === page ? 'text-orange-500' : 'text-slate-400'}>
                                            {icons[page]}
                                        </span>
                                        {page}
                                    </button>
                                    {idx < 4 && <div className="h-px bg-gray-100 mx-6 my-1" />}
                                </React.Fragment>
                            );
                        })}

                        {user && (
                            <>
                                <div className="h-px bg-gray-200 my-4 shadow-sm" />
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-4 w-full text-left py-4 px-6 font-black uppercase text-sm tracking-widest text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <LogOut size={20} />
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
