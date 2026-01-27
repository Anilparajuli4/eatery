export interface MenuItem {
    id: number;
    name: string;
    price: number;
    description: string;
    category: string;
    rating?: number;
    prepTime?: number;
    isPopular?: boolean;
    isNew?: boolean;
    image?: string;
}

export interface CartItem extends MenuItem {
    quantity: number;
    specialInstructions?: string;
}

export interface OrderDetails {
    name: string;
    phone: string;
    pickupTime: string;
    pickupTime: string;
    instructions: string;
    paymentMethod: 'card' | 'cash';
    address: string;
}

export interface Order {
    id: number;
    items: CartItem[];
    total: string;
    details: OrderDetails;
    timestamp: string;
    status: string;
}

export type PageType = 'home' | 'menu' | 'about' | 'orders';
export type CategoryType = 'all' | 'beefBurgers' | 'chickenBurgers' | 'seafood' | 'fries' | 'sides' | 'drinks';
