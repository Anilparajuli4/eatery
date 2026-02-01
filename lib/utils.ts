export const getItemEmoji = (category: string) => {
    if (category.includes('BEEF')) return '🍔';
    if (category.includes('STEAK')) return '🥩';
    if (category.includes('CHICKEN_BURGERS')) return '🍗';
    if (category.includes('CHICKEN_WINGS')) return '🍗';
    if (category.includes('FISH')) return '🐟';
    if (category.includes('SEAFOOD')) return '🦐';
    if (category.includes('VEGGIE')) return '🥗';
    if (category.includes('ROLLS')) return '🌯';
    if (category.includes('WRAPS')) return '🌮';
    if (category.includes('HOT_FOOD')) return '🍲';
    if (category.includes('SALADS')) return '🥗';
    if (category.includes('LOADED_FRIES')) return '🍟';
    if (category.includes('KIDS')) return '👶';
    if (category.includes('SIDES')) return '🍽️';
    if (category.includes('MILKSHAKES')) return '🥤';
    if (category.includes('SOFT_DRINKS')) return '🥤';
    return '🍽️';
};
