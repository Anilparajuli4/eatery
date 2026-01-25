'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { MENU_DATA } from '@/lib/data';
import { MenuItem, CartItem, OrderDetails, Order, PageType, CategoryType } from '@/types';
import UserNavbar from '@/components/user/UserNavbar';
import HeroSection from '@/components/user/HeroSection';
import MenuSection from '@/components/user/MenuSection';
import AboutSection from '@/components/user/AboutSection';
import OrderHistory from '@/components/user/OrderHistory';
import CartSidebar from '@/components/user/CartSidebar';
import ItemModal from '@/components/user/ItemModal';

const STORAGE_KEYS = {
    CART: 'bsquare-cart',
    FAVORITES: 'bsquare-favorites',
    ORDERS: 'bsquare-orders'
} as const;

export default function BSquareEatery() {
    const [currentPage, setCurrentPage] = useState<PageType>('home');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [showCart, setShowCart] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [checkoutStep, setCheckoutStep] = useState(1);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [orderDetails, setOrderDetails] = useState<OrderDetails>({
        name: '',
        phone: '',
        pickupTime: 'asap',
        instructions: '',
        paymentMethod: 'card'
    });
    const [orderHistory, setOrderHistory] = useState<Order[]>([]);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [showItemModal, setShowItemModal] = useState(false);

    // Close mobile menu when page changes
    useEffect(() => {
        setMobileMenu(false);
    }, [currentPage]);

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (showCart || showItemModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showCart, showItemModal]);

    const addToCart = useCallback((item: MenuItem) => {
        setCart(prevCart => {
            const existing = prevCart.find(i => i.id === item.id);
            if (existing) {
                return prevCart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
    }, []);

    const toggleFavorite = useCallback((id: number) => {
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
        );
    }, []);

    const updateQuantity = useCallback((id: number, change: number) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
            ).filter(item => item.quantity > 0)
        );
    }, []);

    const removeItem = useCallback((id: number) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    }, []);

    const getTotal = useMemo(() => {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
    }, [cart]);

    const getTotalItems = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    }, [cart]);

    const getEstimatedTime = useMemo(() => {
        if (cart.length === 0) return 0;
        const maxTime = Math.max(...cart.map(item => item.prepTime || 15));
        return maxTime + 5;
    }, [cart]);

    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

    // Fetch Menu Items
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                // Determine if we should mock for now or fetch
                // For integration, we try fetch, fallback to empty or handle error
                const { data } = await import('@/lib/api').then(m => m.default.get('/products'));
                setMenuItems(data);
            } catch (error) {
                console.error("Failed to fetch menu", error);
                // Fallback to static data if API fails (optional, for safety during transition)
                setMenuItems(Object.values(MENU_DATA).flat());
            }
        };
        fetchMenu();
    }, []);

    const getAllItems = useCallback(() => {
        return menuItems;
    }, [menuItems]);

    const getFilteredItems = useMemo(() => {
        let items = selectedCategory === 'all' ? getAllItems() : menuItems.filter(i => i.category === selectedCategory);

        // Mapping category names if they differ from API enum
        // API uses: BEEF_BURGERS, CHICKEN_BURGERS (uppercase)
        // Frontend uses: beefBurgers, chickenBurgers (camelCase)
        // We might need a mapper or normalize data. 
        // For simplicity, let's assume we map frontend category to match API or vice versa.
        // Quick fix: normalize logic here or in data handling.

        // Actually, let's rely on the API returning compatible strings OR normalize here.
        // If API returns "BEEF_BURGERS", and selectedCategory is "beefBurgers".

        if (selectedCategory !== 'all') {
            // Simple mapping helper
            const categoryMap: Record<string, string> = {
                'beefBurgers': 'BEEF_BURGERS',
                'chickenBurgers': 'CHICKEN_BURGERS',
                'seafood': 'SEAFOOD',
                'fries': 'LOADED_FRIES',
                'sides': 'SIDES',
                'drinks': 'DRINKS'
            };
            const targetCat = categoryMap[selectedCategory] || selectedCategory;
            items = menuItems.filter(i => i.category === targetCat);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            items = items.filter(i =>
                i.name.toLowerCase().includes(query) ||
                i.description.toLowerCase().includes(query)
            );
        }
        return items;
    }, [selectedCategory, searchQuery, getAllItems, menuItems]);

    const handleCheckout = useCallback(async () => {
        if (checkoutStep === 3) {
            try {
                // Prepare payload
                const payload = {
                    items: cart.map(item => ({
                        productId: item.id,
                        quantity: item.quantity
                    }))
                };

                await import('@/lib/api').then(m => m.default.post('/orders', payload));

                setOrderPlaced(true);
                setTimeout(() => {
                    setCart([]);
                    setShowCart(false);
                    setCheckoutStep(1);
                    setOrderPlaced(false);
                    setCurrentPage('home');
                    setOrderDetails({
                        name: '',
                        phone: '',
                        pickupTime: 'asap',
                        instructions: '',
                        paymentMethod: 'card'
                    });
                }, 4000);
            } catch (error) {
                console.error("Checkout failed", error);
                alert("Failed to place order. Please try again.");
            }
        } else {
            setCheckoutStep(prev => prev + 1);
        }
    }, [checkoutStep, cart, orderDetails]);

    // Fetch Order History & Socket Setup
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Only fetch if we have a way to identify user (e.g., token).
                // If no auth, maybe we don't fetch or we fetch from local for guest?
                // Since we implemented AuthContext, we SHOULD rely on it, but here we are in Page.tsx.
                // For simplicity in this refactor, let's assume we try to fetch if token exists.
                const token = localStorage.getItem('token');
                if (token) {
                    const { data } = await import('@/lib/api').then(m => m.default.get('/orders'));
                    setOrderHistory(data);
                }
            } catch (error) {
                console.error("Failed to fetch orders", error);
            }
        };

        fetchOrders();

        // Socket Listeners
        const socket = require('@/lib/socket').default;
        socket.connect();

        const handleStatusUpdate = (updatedOrder: any) => {
            setOrderHistory(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
        };

        // In a real app, join a user-specific room.
        // socket.emit('join_user_room', userId);
        // socket.on('order_status', handleStatusUpdate);

        return () => {
            socket.off('order_status', handleStatusUpdate);
        };
    }, []);

    const openItemModal = useCallback((item: MenuItem) => {
        setSelectedItem(item);
        setShowItemModal(true);
    }, []);

    const isCheckoutDisabled = checkoutStep === 2 && (!orderDetails.name.trim() || !orderDetails.phone.trim());

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
            <UserNavbar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                showCart={showCart}
                setShowCart={setShowCart}
                totalItems={getTotalItems}
                mobileMenu={mobileMenu}
                setMobileMenu={setMobileMenu}
            />

            {currentPage === 'home' && <HeroSection setCurrentPage={setCurrentPage} />}

            {currentPage === 'menu' && (
                <MenuSection
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    filteredItems={getFilteredItems}
                    openItemModal={openItemModal}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                    addToCart={addToCart}
                />
            )}

            {currentPage === 'about' && <AboutSection />}

            {currentPage === 'orders' && (
                <OrderHistory
                    orderHistory={orderHistory}
                    setCurrentPage={setCurrentPage}
                />
            )}

            <CartSidebar
                showCart={showCart}
                setShowCart={setShowCart}
                cart={cart}
                getEstimatedTime={getEstimatedTime}
                orderPlaced={orderPlaced}
                checkoutStep={checkoutStep}
                setCheckoutStep={setCheckoutStep}
                setCurrentPage={setCurrentPage}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
                orderDetails={orderDetails}
                setOrderDetails={setOrderDetails}
                getTotalItems={getTotalItems}
                getTotal={getTotal}
                handleCheckout={handleCheckout}
                isCheckoutDisabled={isCheckoutDisabled}
            />

            <ItemModal
                showItemModal={showItemModal}
                setShowItemModal={setShowItemModal}
                selectedItem={selectedItem}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                addToCart={addToCart}
            />
        </div>
    );
}
