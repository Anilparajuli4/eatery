export const getItemEmoji = (category: string) => {
    if (category.includes('Beef')) return '🍔';
    if (category.includes('Chicken')) return '🍗';
    if (category.includes('Seafood')) return '🐟';
    if (category.includes('Fries')) return '🍟';
    if (category.includes('Drink')) return '🥤';
    return '🍽️';
};
