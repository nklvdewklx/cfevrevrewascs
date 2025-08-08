// A reusable helper function to calculate the total price of an order
export const calculateOrderTotal = (orderItems, products) => {
    if (!orderItems || !products) return 0;
    return orderItems.reduce((total, item) => {
        const product = products.find(p => p.id === item.productId);
        const price = product?.pricingTiers[0]?.price || 0;
        return total + (price * item.quantity);
    }, 0);
};