'use client'
import  { useState, useEffect, useMemo, useCallback } from 'react';
import { ShoppingCart, X, Clock, MapPin, Phone, Search, Plus, Minus, Trash2, ChevronRight, Check, Menu, Star, Heart, ArrowLeft, AlertCircle, Sparkles } from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  rating?: number;
  prepTime?: number;
  isPopular?: boolean;
  isNew?: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
  specialInstructions?: string;
}

interface OrderDetails {
  name: string;
  phone: string;
  pickupTime: string;
  instructions: string;
  paymentMethod: 'card' | 'cash';
}

interface Order {
  id: number;
  items: CartItem[];
  total: string;
  details: OrderDetails;
  timestamp: string;
  status: string;
}

type PageType = 'home' | 'menu' | 'about' | 'orders';
type CategoryType = 'all' | 'beefBurgers' | 'chickenBurgers' | 'seafood' | 'fries' | 'sides' | 'drinks';

const STORAGE_KEYS = {
  CART: 'bsquare-cart',
  FAVORITES: 'bsquare-favorites',
  ORDERS: 'bsquare-orders'
} as const;

const MENU_DATA = {
  beefBurgers: [
    { id: 1, name: 'Smash Cheese Burger', price: 10.00, description: 'Beef patty, American Cheese, Caramelised onion, Tomato sauce and mustard', category: 'Beef Burgers', rating: 4.8, prepTime: 12, isPopular: true },
    { id: 2, name: 'Classic Aussie', price: 13.50, description: 'Beef patty, American Cheese, Caramelised onion, Lettuce, Tomato, Beetroot, BBQ & HerbMayo', category: 'Beef Burgers', rating: 4.7, prepTime: 15 },
    { id: 3, name: 'BSquare Crunch', price: 14.50, description: 'Beef patty, Lettuce, American Cheese, Crispy Onion, Pickles & Bsquare burger sauce', category: 'Beef Burgers', rating: 4.9, prepTime: 14, isPopular: true },
    { id: 4, name: 'The Lot Stacker', price: 16.50, description: 'Beef patty, Lettuce, Tomato, Caramelised onion, Smokey Bacon, Egg, Pineapple, pickles, BBQ & Bsquare sauce', category: 'Beef Burgers', rating: 4.6, prepTime: 18 },
    { id: 5, name: 'Double Meat Stacker', price: 16.50, description: '2x Beef patty, Bacon, Cheese & Bsquare Sauce', category: 'Beef Burgers', rating: 4.8, prepTime: 16, isNew: true }
  ],
  chickenBurgers: [
    { id: 6, name: 'Classic Golden Crunch', price: 12.00, description: 'Crispy chicken, Lettuce, Mayo', category: 'Chicken', rating: 4.5, prepTime: 14 },
    { id: 7, name: 'Southern Heat', price: 13.50, description: 'Crispy chicken, Cabbage Slaw, Pickles & Bsquare mayo', category: 'Chicken', rating: 4.7, prepTime: 15, isPopular: true },
    { id: 8, name: 'Portuguese Grill', price: 15.50, description: 'Marinated Grill Chicken, Lettuce, Tomato, Onion, Cheese & Bsquare mayo', category: 'Chicken', rating: 4.8, prepTime: 16 },
    { id: 9, name: 'Loaded Grill', price: 17.50, description: 'Marinated chicken, Lettuce, Tomato, Onion, cheese, Bacon, Avo & Peri-Peri Sauce', category: 'Chicken', rating: 4.9, prepTime: 18, isNew: true },
    { id: 10, name: 'Smokey Chook', price: 14.00, description: 'Crispy chicken, Bacon, Lettuce, Cheese & Aioli', category: 'Chicken', rating: 4.6, prepTime: 14 }
  ],
  seafood: [
    { id: 11, name: 'Crispy Fish Burger', price: 14.50, description: 'Housemade Battered Fish, Lettuce, Tomato, onion & Aioli', category: 'Seafood', rating: 4.7, prepTime: 16 },
    { id: 12, name: 'Calamari Crunch', price: 14.50, description: 'Crispy Calamari, Slaw, Pickles & Sweetchilli Aioli', category: 'Seafood', rating: 4.6, prepTime: 15, isPopular: true },
    { id: 13, name: 'Battered Fish', price: 11.00, description: 'House made battered fish', category: 'Seafood', rating: 4.5, prepTime: 12 },
    { id: 14, name: 'Fish & Chips', price: 15.50, description: 'Choice of fish (Battered/Grilled) & Small Chips', category: 'Seafood', rating: 4.8, prepTime: 18 },
    { id: 15, name: 'Seafood Basket', price: 15.00, description: '2 fish bites, 2 calamari rings, 1 prawn cutlet, chips, lemon & tarter sauce', category: 'Seafood', rating: 4.7, prepTime: 20 }
  ],
  fries: [
    { id: 16, name: 'Cheese Loaded Fries', price: 12.00, description: 'Chips, Cheese Sauce & garnish', category: 'Loaded Fries', rating: 4.6, prepTime: 10, isPopular: true },
    { id: 17, name: 'BBQ Loaded Fries', price: 15.00, description: 'Chips, Beef and Bacon, BBQ and burger cheese sauce, pickles', category: 'Loaded Fries', rating: 4.8, prepTime: 14 },
    { id: 18, name: 'Peri-Peri Loaded Fries', price: 15.00, description: 'Chips, boneless chicken, Peri-peri cheese sauce, pickles', category: 'Loaded Fries', rating: 4.7, prepTime: 14, isNew: true }
  ],
  sides: [
    { id: 19, name: 'Small Chips', price: 5.50, description: 'Crispy golden fries', category: 'Sides', rating: 4.5, prepTime: 8 },
    { id: 20, name: 'Large Chips', price: 7.50, description: 'Crispy golden fries', category: 'Sides', rating: 4.5, prepTime: 8 },
    { id: 21, name: 'Chicken Nuggets', price: 6.50, description: '6 pieces of golden nuggets', category: 'Sides', rating: 4.4, prepTime: 10 },
    { id: 22, name: 'Chicken Wings', price: 7.00, description: 'BBQ, Peri-Peri or Buffalo', category: 'Sides', rating: 4.6, prepTime: 12 }
  ],
  drinks: [
    { id: 23, name: 'Vanilla Milkshake', price: 6.50, description: 'Creamy vanilla milkshake', category: 'Drinks', rating: 4.7, prepTime: 5 },
    { id: 24, name: 'Chocolate Milkshake', price: 6.50, description: 'Rich chocolate milkshake', category: 'Drinks', rating: 4.8, prepTime: 5 },
    { id: 25, name: 'Strawberry Milkshake', price: 6.50, description: 'Fresh strawberry milkshake', category: 'Drinks', rating: 4.6, prepTime: 5 },
    { id: 26, name: 'Soft Drink', price: 3.00, description: '375ml can or 600ml bottle', category: 'Drinks', rating: 4.3, prepTime: 2 }
  ]
} as const;

const CATEGORIES = [
  { key: 'all' as CategoryType, label: 'All Items', emoji: '🍽️' },
  { key: 'beefBurgers' as CategoryType, label: 'Beef Burgers', emoji: '🍔' },
  { key: 'chickenBurgers' as CategoryType, label: 'Chicken', emoji: '🍗' },
  { key: 'seafood' as CategoryType, label: 'Seafood', emoji: '🐟' },
  { key: 'fries' as CategoryType, label: 'Loaded Fries', emoji: '🍟' },
  { key: 'sides' as CategoryType, label: 'Sides', emoji: '🥤' },
  { key: 'drinks' as CategoryType, label: 'Drinks', emoji: '🥤' }
] as const;

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

  // Load persisted data on mount
  useEffect(() => {
    try {
      const savedCart = window.storage?.getItem?.(STORAGE_KEYS.CART);
      const savedFavorites = window.storage?.getItem?.(STORAGE_KEYS.FAVORITES);
      const savedOrders = window.storage?.getItem?.(STORAGE_KEYS.ORDERS);
      
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
      if (savedOrders) setOrderHistory(JSON.parse(savedOrders));
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, []);

  // Persist cart changes
  useEffect(() => {
    try {
      window.storage?.setItem?.(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, [cart]);

  // Persist favorites changes
  useEffect(() => {
    try {
      window.storage?.setItem?.(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, [favorites]);

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

  const getAllItems = useCallback(() => {
    return Object.values(MENU_DATA).flat();
  }, []);

  const getFilteredItems = useMemo(() => {
    let items = selectedCategory === 'all' ? getAllItems() : MENU_DATA[selectedCategory] || [];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(i => 
        i.name.toLowerCase().includes(query) ||
        i.description.toLowerCase().includes(query)
      );
    }
    return items;
  }, [selectedCategory, searchQuery, getAllItems]);

  const handleCheckout = useCallback(() => {
    if (checkoutStep === 3) {
      const order: Order = {
        id: Date.now(),
        items: cart,
        total: getTotal,
        details: orderDetails,
        timestamp: new Date().toISOString(),
        status: 'pending'
      };
      
      const newHistory = [order, ...orderHistory];
      setOrderHistory(newHistory);
      
      try {
        window.storage?.setItem?.(STORAGE_KEYS.ORDERS, JSON.stringify(newHistory));
      } catch (error) {
        console.error('Error saving order:', error);
      }
      
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
    } else {
      setCheckoutStep(prev => prev + 1);
    }
  }, [checkoutStep, cart, getTotal, orderDetails, orderHistory]);

  const getItemEmoji = useCallback((category: string) => {
    if (category.includes('Beef')) return '🍔';
    if (category.includes('Chicken')) return '🍗';
    if (category.includes('Seafood')) return '🐟';
    if (category.includes('Fries')) return '🍟';
    if (category.includes('Drink')) return '🥤';
    return '🍽️';
  }, []);

  const openItemModal = useCallback((item: MenuItem) => {
    setSelectedItem(item);
    setShowItemModal(true);
  }, []);

  const isCheckoutDisabled = checkoutStep === 2 && (!orderDetails.name.trim() || !orderDetails.phone.trim());

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-red-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-white/80 shadow-lg border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button onClick={() => setCurrentPage('home')} className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-linear-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">
                🍔
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-black `bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  BSquare Eatery
                </span>
                <p className="text-xs text-gray-500 font-medium">Fresh & Delicious</p>
              </div>
            </button>
            
            <div className="hidden md:flex gap-8">
              {(['home', 'menu', 'about', 'orders'] as PageType[]).map(page => (
                <button 
                  key={page} 
                  onClick={() => setCurrentPage(page)} 
                  className={`font-bold capitalize transition-all relative ${
                    currentPage === page 
                      ? 'text-orange-600' 
                      : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  {page}
                  {currentPage === page && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-linear-to-br from-orange-500 to-red-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowCart(true)} 
                className="relative p-3 bg-linear-to-br from-orange-500 to-red-600 text-white rounded-2xl hover:shadow-xl transition-all hover:scale-105"
                aria-label="Shopping cart"
              >
                <ShoppingCart size={20} />
                {getTotalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full text-xs flex items-center justify-center font-bold shadow-lg">
                    {getTotalItems}
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
              {(['home', 'menu', 'about', 'orders'] as PageType[]).map(page => (
                <button 
                  key={page} 
                  onClick={() => setCurrentPage(page)} 
                  className={`block w-full text-left py-3 px-4 font-bold capitalize rounded-xl transition-all ${
                    currentPage === page 
                      ? 'bg-linear-to-br from-orange-500 to-red-500 text-white' 
                      : 'text-gray-600 hover:bg-orange-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      {currentPage === 'home' && (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-orange-400 via-red-500 to-pink-600"></div>
          
          <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
            <div className="absolute top-20 left-10 text-8xl animate-bounce" style={{ animationDelay: '0s' }}>🍔</div>
            <div className="absolute top-40 right-20 text-6xl animate-bounce" style={{ animationDelay: '0.5s' }}>🍟</div>
            <div className="absolute bottom-20 left-1/4 text-7xl animate-bounce" style={{ animationDelay: '1s' }}>🍗</div>
            <div className="absolute bottom-40 right-1/4 text-5xl animate-bounce" style={{ animationDelay: '1.5s' }}>🥤</div>
          </div>
          
          <div className="absolute inset-0 bg-black/20"></div>
          
          <div className="relative z-10 text-center px-4 max-w-5xl">
            <div className="inline-block mb-6">
              <div className="text-9xl animate-bounce drop-shadow-2xl">🍔</div>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-black text-white mb-6 drop-shadow-2xl leading-tight">
              BSquare<br/>
              <span className="bg-linear-to-br from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Eatery
              </span>
            </h1>
            
            <p className="text-3xl md:text-4xl text-white mb-4 font-bold drop-shadow-lg">
              Where Hunger Meets Flavor
            </p>
            
            <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white font-semibold border border-white/30">
                ⚡ Fresh
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white font-semibold border border-white/30">
                🔥 Juicy
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white font-semibold border border-white/30">
                ✨ Made to Order
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <button 
                onClick={() => setCurrentPage('menu')} 
                className="group px-12 py-5 bg-white text-orange-600 rounded-full font-black text-xl hover:scale-110 transition-all shadow-2xl hover:shadow-orange-300/50 flex items-center justify-center gap-3"
              >
                Order Now
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={24} />
              </button>
              <button 
                onClick={() => setCurrentPage('menu')} 
                className="px-12 py-5 border-3 border-white text-white rounded-full font-black text-xl hover:bg-white hover:text-orange-600 transition-all shadow-2xl backdrop-blur-sm"
              >
                View Menu
              </button>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-8 text-white/90 flex-wrap">
              <div className="text-center">
                <div className="text-3xl font-black">⭐ 4.8</div>
                <div className="text-sm font-medium">Rating</div>
              </div>
              <div className="w-px h-12 bg-white/30 hidden sm:block"></div>
              <div className="text-center">
                <div className="text-3xl font-black">20 min</div>
                <div className="text-sm font-medium">Avg. Wait</div>
              </div>
              <div className="w-px h-12 bg-white/30 hidden sm:block"></div>
              <div className="text-center">
                <div className="text-3xl font-black">500+</div>
                <div className="text-sm font-medium">Daily Orders</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menu Page */}
      {currentPage === 'menu' && (
        <div className="pt-24 pb-16 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center mb-12">
              <h1 className="text-6xl font-black bg-linear-to-br from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">
                Our Menu
              </h1>
              <p className="text-2xl text-gray-600 font-medium">Handcrafted with passion</p>
            </div>

            <div className="max-w-2xl mx-auto mb-10">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={22} />
                <input 
                  type="text" 
                  placeholder="Search delicious food..." 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                  className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-orange-500 outline-none text-lg shadow-lg focus:shadow-xl transition-all bg-white"
                />
              </div>
            </div>

            <div className="flex overflow-x-auto gap-3 mb-10 pb-3 scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat.key} 
                  onClick={() => setSelectedCategory(cat.key)} 
                  className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all shadow-md hover:shadow-lg ${
                    selectedCategory === cat.key 
                      ? 'bg-linear-to-br from-orange-500 to-red-500 text-white scale-105' 
                      : 'bg-white text-gray-700 border-2 border-gray-100 hover:border-orange-300'
                  }`}
                >
                  <span className="text-xl mr-2">{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {getFilteredItems.map(item => (
                <div 
                  key={item.id} 
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 overflow-hidden cursor-pointer border-2 border-transparent hover:border-orange-200"
                  onClick={() => openItemModal(item)}
                >
                  <div className="relative bg-linear-to-br from-orange-400 via-red-400 to-pink-400 h-48 flex items-center justify-center overflow-hidden">
                    <div className="text-8xl group-hover:scale-110 transition-transform">
                      {getItemEmoji(item.category)}
                    </div>
                    
                    <div className="absolute top-3 left-3 flex gap-2">
                      {item.isPopular && (
                        <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                          <Star size={12} fill="white" /> Popular
                        </span>
                      )}
                      {item.isNew && (
                        <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                          <Sparkles size={12} /> New
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
                      className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                      aria-label={favorites.includes(item.id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart 
                        size={20} 
                        className={favorites.includes(item.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}
                      />
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-black text-gray-900 group-hover:text-orange-600 transition-colors">
                        {item.name}
                      </h3>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                        <Star size={16} fill="currentColor" />
                        {item.rating}
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock size={16} />
                        {item.prepTime} min
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-black bg-linear-to-br from-orange-600 to-red-600 bg-clip-text text-transparent">
                        ${item.price.toFixed(2)}
                      </span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); addToCart(item); }} 
                        className="px-6 py-3 bg-linear-to-br from-orange-500 to-red-500 text-white rounded-2xl font-bold hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
                      >
                        <Plus size={18} />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {getFilteredItems.length === 0 && (
              <div className="text-center py-20">
                <div className="text-7xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-400 mb-2">No items found</h3>
                <p className="text-gray-500">Try searching for something else</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* About Page */}
      {currentPage === 'about' && (
        <div className="pt-24 pb-16 min-h-screen">
          <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="text-center mb-16">
              <h1 className="text-6xl font-black bg-linear-to-br from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">
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
              <div className="bg-linear-to-br from-orange-50 to-red-50 rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 border border-orange-100">
                <div className="w-16 h-16 bg-linear-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Clock size={32} className="text-white" />
                </div>
                <h3 className="font-black text-xl mb-3 text-gray-900">Opening Hours</h3>
                <p className="text-gray-700 font-semibold">Monday - Sunday</p>
                <p className="text-orange-600 font-bold text-lg">10:00 AM - 9:00 PM</p>
              </div>
              
              <div className="bg-linear-to-br from-orange-50 to-red-50 rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 border border-orange-100">
                <div className="w-16 h-16 bg-linear-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MapPin size={32} className="text-white" />
                </div>
                <h3 className="font-black text-xl mb-3 text-gray-900">Find Us</h3>
                <p className="text-gray-700 font-semibold">123 Flavor Street</p>
                <p className="text-orange-600 font-bold">Food District, FC 12345</p>
              </div>
              
              <div className="bg-linear-to-br from-orange-50 to-red-50 rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 border border-orange-100">
                <div className="w-16 h-16 bg-linear-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Phone size={32} className="text-white" />
                </div>
                <h3 className="font-black text-xl mb-3 text-gray-900">Contact</h3>
                <p className="text-gray-700 font-semibold">+1 234 567 8900</p>
                <p className="text-orange-600 font-bold">info@bsquare.com</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders History Page */}
      {currentPage === 'orders' && (
        <div className="pt-24 pb-16 min-h-screen">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center mb-12">
              <h1 className="text-6xl font-black bg-linear-to-br from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">
                Order History
              </h1>
              <p className="text-xl text-gray-600">Track your delicious journeys</p>
            </div>

            {orderHistory.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-8xl mb-6">📦</div>
                <h3 className="text-3xl font-bold text-gray-400 mb-4">No orders yet</h3>
                <p className="text-gray-500 mb-8">Start your culinary adventure!</p>
                <button 
                  onClick={() => setCurrentPage('menu')} 
                  className="px-8 py-4 bg-linear-to-br from-orange-500 to-red-500 text-white rounded-2xl font-bold hover:shadow-xl transition-all"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orderHistory.map(order => (
                  <div key={order.id} className="bg-white rounded-3xl shadow-lg p-6 border-2 border-orange-100">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Order #{order.id.toString().slice(-4)}</h3>
                        <p className="text-sm text-gray-500">{new Date(order.timestamp).toLocaleString()}</p>
                      </div>
                      <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                        Completed
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      {order.items.map((item: CartItem) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-700">{item.quantity}x {item.name}</span>
                          <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                      <span className="font-bold text-gray-700">Total</span>
                      <span className="text-2xl font-black text-orange-600">${order.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      <div className={`fixed inset-0 z-50 ${showCart ? '' : 'pointer-events-none'}`}>
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${showCart ? 'opacity-50' : 'opacity-0'}`} 
          onClick={() => setShowCart(false)}
        ></div>
        
        <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ${showCart ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
          <div className="flex flex-col h-full overflow-hidden">
            <div className="p-6 bg-linear-to-br from-orange-500 via-red-500 to-pink-500 text-white shrink-0">
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
                  className="px-10 py-4 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold hover:shadow-xl transition-all"
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
                        <div key={item.id} className="bg-linear-to-br from-orange-50 to-red-50 rounded-2xl p-5 border-2 border-orange-100">
                          <div className="flex gap-4">
                            <div className="text-5xl shrink-0">{getItemEmoji(item.category)}</div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{item.name}</h3>
                              <p className="text-orange-600 font-black text-lg">${item.price.toFixed(2)}</p>
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
                                    className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
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
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                        <input 
                          type="tel" 
                          placeholder="+1 234 567 8900" 
                          value={orderDetails.phone}
                          onChange={e => setOrderDetails({ ...orderDetails, phone: e.target.value })}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none transition-colors"
                          required
                        />
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
                        className={`w-full p-5 border-2 rounded-2xl font-semibold flex items-center justify-between transition-all ${
                          orderDetails.paymentMethod === 'card' 
                            ? 'border-orange-500 bg-orange-50' 
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="text-2xl">💳</span>
                          <span>Card Payment</span>
                        </span>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          orderDetails.paymentMethod === 'card' ? 'border-orange-500' : 'border-gray-300'
                        }`}>
                          {orderDetails.paymentMethod === 'card' && (
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          )}
                        </div>
                      </button>
                      <button 
                        onClick={() => setOrderDetails({ ...orderDetails, paymentMethod: 'cash' })}
                        className={`w-full p-5 border-2 rounded-2xl font-semibold flex items-center justify-between transition-all ${
                          orderDetails.paymentMethod === 'cash' 
                            ? 'border-orange-500 bg-orange-50' 
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="text-2xl">💵</span>
                          <span>Cash on Pickup</span>
                        </span>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          orderDetails.paymentMethod === 'cash' ? 'border-orange-500' : 'border-gray-300'
                        }`}>
                          {orderDetails.paymentMethod === 'cash' && (
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          )}
                        </div>
                      </button>
                      
                      <div className="mt-8 p-5 bg-blue-50 rounded-2xl border-2 border-blue-200">
                        <div className="flex gap-3">
                          <AlertCircle className="text-blue-600 shrink-0" size={24} />
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

                <div className="p-6 border-t-2 border-gray-100 bg-linear-to-br from-gray-50 to-orange-50 shrink-0">
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
                      <p className="text-4xl font-black bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        ${getTotal}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleCheckout} 
                    disabled={isCheckoutDisabled}
                    className="w-full py-5 bg-linear-to-r from-orange-500 via-red-500 to-pink-500 text-white rounded-2xl font-black text-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {checkoutStep === 3 ? '🎉 Place Order' : 'Continue'}
                    <ChevronRight size={24} />
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

      {/* Item Detail Modal */}
      {showItemModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowItemModal(false)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in">
            <button 
              onClick={() => setShowItemModal(false)} 
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            
            <div className="bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 h-64 flex items-center justify-center">
              <div className="text-9xl">{getItemEmoji(selectedItem.category)}</div>
            </div>
            
            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">{selectedItem.name}</h2>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                      <Star size={18} fill="currentColor" />
                      {selectedItem.rating}
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock size={18} />
                      {selectedItem.prepTime} min
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(selectedItem.id)}
                  className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  aria-label={favorites.includes(selectedItem.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart 
                    size={24} 
                    className={favorites.includes(selectedItem.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}
                  />
                </button>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">{selectedItem.description}</p>
              
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <span className="text-4xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  ${selectedItem.price.toFixed(2)}
                </span>
                <button 
                  onClick={() => { addToCart(selectedItem); setShowItemModal(false); }} 
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}