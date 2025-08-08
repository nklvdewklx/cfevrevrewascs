import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addOrder } from '../orders/ordersSlice';
import { adjustStockForOrder } from '../inventory/productsSlice';
import { showToast } from '../../lib/toast';

const POSPage = () => {
    const dispatch = useDispatch();

    const products = useSelector((state) => state.products.items);
    const customers = useSelector((state) => state.customers.items);
    const { user } = useSelector((state) => state.auth);

    const [cart, setCart] = useState([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');

    const handleAddProductToCart = (product) => {
        const existingItem = cart.find(item => item.productId === product.id);
        if (existingItem) {
            // Increase quantity if item is already in cart
            setCart(cart.map(item =>
                item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            // Add new item to cart
            setCart([...cart, { productId: product.id, name: product.name, quantity: 1, price: product.pricingTiers[0]?.price || 0 }]);
        }
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleFinalizeSale = async () => {
        if (cart.length === 0) {
            showToast('Cart is empty.', 'error');
            return;
        }

        const newOrderData = {
            customerId: parseInt(selectedCustomerId),
            agentId: user.id,
            date: new Date().toISOString().split('T')[0],
            status: 'completed', // POS sales are completed immediately
            items: cart.map(({ productId, quantity }) => ({ productId, quantity })),
        };

        try {
            // First, check if stock can be adjusted
            await dispatch(adjustStockForOrder(newOrderData)).unwrap();

            // If stock adjustment is successful, then create the order
            dispatch(addOrder(newOrderData));
            showToast('Sale completed successfully!', 'success');
            setCart([]); // Clear the cart
        } catch (error) {
            showToast(`Sale failed: ${error}`, 'error');
        }
    };

    return (
        <div className="grid grid-cols-3 gap-4 h-full">
            {/* Product Grid */}
            <div className="col-span-2 bg-gray-800/50 p-4 rounded-lg overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map(product => (
                        <button key={product.id} onClick={() => handleAddProductToCart(product)} className="bg-gray-700 aspect-square rounded-lg p-2 flex flex-col justify-between items-center text-center hover:bg-blue-600 transition-colors">
                            <span className="font-semibold text-sm">{product.name}</span>
                            <span className="text-lg font-bold">${(product.pricingTiers[0]?.price || 0).toFixed(2)}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Cart and Checkout */}
            <div className="col-span-1 bg-gray-800/50 p-4 rounded-lg flex flex-col">
                <h2 className="text-xl font-bold mb-4">Current Sale</h2>
                <div>
                    <label className="block mb-1 text-sm text-custom-grey">Customer</label>
                    <select value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)} className="form-input bg-gray-700 border-gray-600">
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                <div className="flex-grow my-4 overflow-y-auto custom-scrollbar border-t border-b border-white/10">
                    {cart.length === 0 ? (
                        <p className="text-center text-gray-400 mt-8">Cart is empty</p>
                    ) : (
                        cart.map((item, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0">
                                <div>
                                    <p>{item.name}</p>
                                    <p className="text-sm text-gray-400">${item.price.toFixed(2)} x {item.quantity}</p>
                                </div>
                                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))
                    )}
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between text-2xl font-bold">
                        <span>Total</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                    <button onClick={handleFinalizeSale} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg text-xl">
                        Pay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default POSPage;