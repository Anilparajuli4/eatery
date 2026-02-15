'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MENU_DATA } from '@/lib/data';
import { MenuItem, CartItem, OrderDetails, Order, PageType, CategoryType } from '@/types';
import UserNavbar from '@/components/user/UserNavbar';
import HeroSection from '@/components/user/HeroSection';
import MenuSection from '@/components/user/MenuSection';
import CategoryGrid from '@/components/user/CategoryGrid';
import FeaturedItems from '@/components/user/FeaturedItems';
import HowItWorks from '@/components/user/HowItWorks';
import PickupInfo from '@/components/user/PickupInfo';
import Testimonials from '@/components/user/Testimonials';
import AboutSection from '@/components/user/AboutSection';
import Footer from '@/components/user/Footer';
import OrderHistory from '@/components/user/OrderHistory';
import CartSidebar from '@/components/user/CartSidebar';
import ItemModal from '@/components/user/ItemModal';
import OrderSuccessModal from '@/components/user/OrderSuccessModal';
import { useAuth } from '@/context/AuthContext';
import PaymentProcess from '@/components/payment/PaymentProcess';
import { useToast } from '@/context/ToastContext';

const STORAGE_KEYS = {
    CART: 'bsquare-cart',
    FAVORITES: 'bsquare-favorites',
    ORDERS: 'bsquare-orders'
} as const;

export default function BSquareEatery() {
    const { logout } = useAuth();
    const { showToast } = useToast();
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
        paymentMethod: 'card',
        address: ''
    });
    const [orderHistory, setOrderHistory] = useState<Order[]>([]);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [showItemModal, setShowItemModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Close mobile menu when page changes
    useEffect(() => {
        setMobileMenu(false);
    }, [currentPage]);

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (showCart || showItemModal || showSuccessModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showCart, showItemModal, showSuccessModal]);

    const addToCart = useCallback((item: MenuItem) => {
        setCart(prevCart => {
            const existing = prevCart.find(i => i.id === item.id);
            if (existing) {
                return prevCart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
        showToast(`${item.name} added to cart!`, 'success');
    }, [showToast]);

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
    const [popularItems, setPopularItems] = useState<MenuItem[]>([]);
    const [isMenuLoading, setIsMenuLoading] = useState(true);

    // Fetch Menu Items & Popular Items
    useEffect(() => {
        const fetchData = async () => {
            setIsMenuLoading(true);
            try {
                // Fetch main menu (paginated default)
                const menuRes = await import('@/lib/api').then(m => m.default.get('/products?limit=100'));
                setMenuItems(menuRes.data.items || []);

                // Fetch popular items explicitly
                const popularRes = await import('@/lib/api').then(m => m.default.get('/products?isPopular=true&limit=8'));
                setPopularItems(popularRes.data.items || []);
            } catch (error) {
                console.error("Failed to fetch menu data", error);
                // Fallback
                const allItems = Object.values(MENU_DATA).flat();
                setMenuItems(allItems);
                setPopularItems(allItems.filter(i => i.isPopular));
            } finally {
                setIsMenuLoading(false);
            }
        };
        fetchData();
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
                'steakSandwiches': 'STEAK_SANDWICHES',
                'chickenBurgers': 'CHICKEN_BURGERS',
                'fishBurgers': 'FISH_BURGERS',
                'veggieBurgers': 'VEGGIE_BURGERS',
                'rolls': 'ROLLS',
                'wraps': 'WRAPS',
                'hotFood': 'HOT_FOOD',
                'salads': 'SALADS',
                'seafood': 'SEAFOOD',
                'loadedFries': 'LOADED_FRIES',
                'fries': 'LOADED_FRIES',
                'chickenWings': 'CHICKEN_WINGS',
                'kidsMenu': 'KIDS_MENU',
                'sides': 'SIDES',
                'milkshakes': 'MILKSHAKES',
                'softDrinks': 'SOFT_DRINKS',
                'drinks': 'SOFT_DRINKS'
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

    const [clientSecret, setClientSecret] = useState('');
    const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);

    const handlePaymentSuccess = useCallback(() => {
        setClientSecret('');
        // setCurrentOrderId(null); // Keep currentOrderId for the modal
        setShowSuccessModal(true);
    }, []);

    const handleCloseSuccessModal = useCallback(() => {
        setShowSuccessModal(false);
        setCurrentOrderId(null);
        setCart([]);
        setShowCart(false);
        setCheckoutStep(1);
        setOrderPlaced(false);
        setCurrentPage('orders'); // Redirect to orders to track status
        setOrderDetails({
            name: '',
            phone: '',
            pickupTime: 'asap',
            instructions: '',
            paymentMethod: 'card',
            address: ''
        });
    }, []);

    const handleCheckout = useCallback(async () => {
        if (checkoutStep === 3) {
            setIsPaymentLoading(true);
            try {
                const payload: any = {
                    items: cart.map(item => ({
                        productId: item.id,
                        quantity: item.quantity
                    })),
                    customerName: orderDetails.name,
                    customerPhone: orderDetails.phone,
                    specialInstruction: orderDetails.instructions,
                    paymentMethod: orderDetails.paymentMethod
                };

                if (orderDetails.address && orderDetails.address.trim().length > 0) {
                    payload.customerAddress = orderDetails.address;
                }

                const { data } = await import('@/lib/api').then(m => m.default.post('/orders', payload));

                // Save order ID to localStorage to track status later (especially for guests)
                const localOrders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
                if (!localOrders.includes(data.order.id)) {
                    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([data.order.id, ...localOrders]));
                }

                // data contains { order, clientSecret }
                if (data.clientSecret) {
                    setClientSecret(data.clientSecret);
                    setCurrentOrderId(data.order.id);
                    // PaymentProcess modal will show up because clientSecret is set
                } else {
                    // Non-card orders (e.g., Cash on Pickup) — treat as success
                    setCurrentOrderId(data.order.id);
                    handlePaymentSuccess();
                }

            } catch (error: any) {
                console.error("Checkout failed", error);
                const msg = error.message || "Failed to place order. Please try again.";
                alert(msg);
            } finally {
                setIsPaymentLoading(false);
            }
        } else {
            setCheckoutStep(prev => prev + 1);
        }
    }, [checkoutStep, cart, orderDetails, handlePaymentSuccess]);

    // Fetch Order History & Socket Setup
    useEffect(() => {
        const socket = require('@/lib/socket').default;
        socket.connect();

        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const localOrderIds = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');

                if (!token && localOrderIds.length === 0) {
                    setOrderHistory([]);
                    return;
                }

                const endpoint = localOrderIds.length > 0
                    ? `/orders?ids=${localOrderIds.join(',')}`
                    : '/orders';

                const { data } = await import('@/lib/api').then(m => m.default.get(endpoint));
                setOrderHistory(data);
                data.forEach((o: any) => socket.emit('join_order_room', o.id));
            } catch (error: any) {
                console.error("Failed to fetch orders", error);
            }
        };

        fetchOrders();

        const token = localStorage.getItem('token');
        const userJson = localStorage.getItem('user');
        if (token && userJson) {
            try {
                const userData = JSON.parse(userJson);
                socket.emit('join_user_room', userData.id);
            } catch (e) {
                console.error("Failed to parse user data", e);
            }
        }

        const handleStatusUpdate = (updatedOrder: any) => {
            console.log('Received order update via socket:', updatedOrder.id, updatedOrder.status);
            setOrderHistory(prev => {
                const exists = prev.find(o => o.id === updatedOrder.id);
                if (exists) {
                    return prev.map(o => o.id === updatedOrder.id ? updatedOrder : o);
                }
                // If it's a new order that belongs to guest or user, add it
                return [updatedOrder, ...prev];
            });
        };

        socket.on('order_status_update', handleStatusUpdate);

        return () => {
            socket.off('order_status_update', handleStatusUpdate);
        };
    }, [currentPage]);

    const openItemModal = useCallback((item: MenuItem) => {
        setSelectedItem(item);
        setShowItemModal(true);
    }, []);

    const isPhoneValid = useMemo(() => /^[0-9]{10}$/.test(orderDetails.phone.trim()), [orderDetails.phone]);
    const isNameValid = useMemo(() => orderDetails.name.trim().length >= 1, [orderDetails.name]);

    // Address is not required for pickup; only name and phone are required
    const isCheckoutDisabled = checkoutStep === 2 && (!isNameValid || !isPhoneValid);

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

            {currentPage === 'home' && (
                <div className="flex flex-col min-h-screen">
                    <HeroSection setCurrentPage={setCurrentPage} />

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <CategoryGrid
                            onSelectCategory={(categoryId) => {
                                setSelectedCategory(categoryId);
                                setCurrentPage('menu');
                            }}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <FeaturedItems
                            setCurrentPage={setCurrentPage}
                            products={popularItems}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <HowItWorks />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <Testimonials />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <AboutSection />
                    </motion.div>

                    <Footer />
                </div>
            )}

            {currentPage === 'menu' && (
                <MenuSection
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    openItemModal={openItemModal}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                    addToCart={addToCart}
                />
            )}

            {currentPage === 'about' && <AboutSection />}

            {currentPage === 'location' && <PickupInfo />}

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
                isCheckoutDisabled={isCheckoutDisabled || isPaymentLoading}
                isPaymentLoading={isPaymentLoading}
                isPhoneValid={isPhoneValid}
            />

            <ItemModal
                showItemModal={showItemModal}
                setShowItemModal={setShowItemModal}
                selectedItem={selectedItem}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                addToCart={addToCart}
            />

            {clientSecret && currentOrderId && (
                <PaymentProcess
                    clientSecret={clientSecret}
                    orderId={currentOrderId}
                    amount={Number(getTotal)}
                    customerName={orderDetails.name}
                    customerAddress={orderDetails.address}
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setClientSecret('')}
                />
            )}

            {currentOrderId && (
                <OrderSuccessModal
                    isOpen={showSuccessModal}
                    onClose={handleCloseSuccessModal}
                    onTrackOrder={handleCloseSuccessModal}
                    orderDetails={{
                        orderId: currentOrderId.toString(),
                        total: getTotal,
                        pickupTime: orderDetails.pickupTime,
                        paymentMethod: orderDetails.paymentMethod as 'card' | 'cash'
                    }}
                />
            )}
        </div>
    );
}
