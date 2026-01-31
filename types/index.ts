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
    instructions: string;
    paymentMethod: 'card' | 'cash';
    address: string;
}

export interface Order {
    id: number;
    items: any[]; // Some are CartItem, some have Product relation
    total: string;
    customerName?: string;
    customerPhone?: string;
    customerAddress?: string;
    paymentStatus?: 'PENDING' | 'PAID' | 'FAILED';
    createdAt: string;
    status: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
}

export type PageType = 'home' | 'menu' | 'about' | 'orders';
export type CategoryType = 'all' | 'beefBurgers' | 'chickenBurgers' | 'seafood' | 'fries' | 'sides' | 'drinks';
