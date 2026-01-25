import { MenuItem, CategoryType } from '@/types';

export const MENU_DATA: Record<string, MenuItem[]> = {
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
};

export const CATEGORIES = [
    { key: 'all' as CategoryType, label: 'All Items', emoji: '🍽️' },
    { key: 'beefBurgers' as CategoryType, label: 'Beef Burgers', emoji: '🍔' },
    { key: 'chickenBurgers' as CategoryType, label: 'Chicken', emoji: '🍗' },
    { key: 'seafood' as CategoryType, label: 'Seafood', emoji: '🐟' },
    { key: 'fries' as CategoryType, label: 'Loaded Fries', emoji: '🍟' },
    { key: 'sides' as CategoryType, label: 'Sides', emoji: '🥤' },
    { key: 'drinks' as CategoryType, label: 'Drinks', emoji: '🥤' }
] as const;
