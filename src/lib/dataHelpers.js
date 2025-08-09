// A reusable helper function to calculate the total price of an order
export const calculateOrderFinancials = (orderItems, products) => {
    if (!orderItems || !products) return { subtotal: 0, tax: 0, total: 0 };
    
    const subtotal = orderItems.reduce((total, item) => {
        const product = products.find(p => p.id === item.productId);
        const price = product?.pricingTiers[0]?.price || 0;
        return total + (price * item.quantity);
    }, 0);

    const tax = subtotal * 0.19; // Assuming a static 19% tax rate
    const total = subtotal + tax;

    return {
        subtotal,
        tax,
        total
    };
};

export const calculateOrderTotal = (orderItems, products) => {
    return calculateOrderFinancials(orderItems, products).total;
};