import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addOrder } from '../orders/ordersSlice';
import { adjustStockForOrder } from '../inventory/productsSlice';
import { showToast } from '../../lib/toast';
import {
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    openTransaction,
    loadTransaction,
    setCustomerId
} from './posSlice';
import { useTranslation } from 'react-i18next';

const POSPage = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const products = useSelector((state) => state.products.items);
    const customers = useSelector((state) => state.customers.items);
    const { user } = useSelector((state) => state.auth);
    const { cart, selectedCustomerId, openTransactions } = useSelector((state) => state.pos);

    const handleAddProductToCart = (product) => {
        dispatch(addToCart({ product, quantity: 1 }));
    };

    const handleUpdateQuantity = (productId, quantity) => {
        if (quantity < 1) return;
        dispatch(updateCartItem({ productId, quantity }));
    };

    const handleRemoveItem = (productId) => {
        dispatch(removeFromCart(productId));
    };

    const handleOpenTransaction = () => {
        dispatch(openTransaction());
        showToast(t('transactionSaved'), 'info');
    };

    const handleLoadTransaction = (index) => {
        dispatch(loadTransaction(index));
        showToast(t('transactionLoaded'), 'info');
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            const product = products.find(p => p.id === item.productId);
            const price = product?.pricingTiers[0]?.price || 0;
            return total + (price * item.quantity);
        }, 0);
    };

    const handleFinalizeSale = async () => {
        if (cart.length === 0) {
            showToast(t('cartEmpty'), 'error');
            return;
        }

        const newOrderData = {
            customerId: parseInt(selectedCustomerId),
            agentId: user.id,
            date: new Date().toISOString().split('T')[0],
            status: 'completed',
            items: cart.map(({ productId, quantity }) => ({ productId, quantity })),
        };

        try {
            await dispatch(adjustStockForOrder(newOrderData)).unwrap();
            dispatch(addOrder(newOrderData));
            showToast(t('saleCompleted'), 'success');
            dispatch(clearCart());
        } catch (error) {
            showToast(t('saleFailed', { error }), 'error');
        }
    };

    return (
        <div className="grid grid-cols-3 gap-4 h-full">
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

            <div className="col-span-1 bg-gray-800/50 p-4 rounded-lg flex flex-col">
                <h2 className="text-xl font-bold mb-4">{t('currentSale')}</h2>
                <div>
                    <label className="block mb-1 text-sm text-custom-grey">{t('customer')}</label>
                    <select value={selectedCustomerId} onChange={(e) => dispatch(setCustomerId(e.target.value))} className="form-input bg-gray-700 border-gray-600">
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                <div className="flex-grow my-4 overflow-y-auto custom-scrollbar border-t border-b border-white/10">
                    {cart.length === 0 ? (
                        <p className="text-center text-gray-400 mt-8">{t('cartEmptyMessage')}</p>
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
                        <span>{t('total')}</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                    <button onClick={handleFinalizeSale} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg text-xl">
                        {t('pay')}
                    </button>
                    <button onClick={handleOpenTransaction} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 rounded-lg text-xl">
                        {t('openTransaction')}
                    </button>
                </div>
                {openTransactions.length > 0 && (
                    <div className="mt-4 border-t border-white/10 pt-4">
                        <h3 className="text-lg font-bold">{t('openTransactions')}</h3>
                        <ul className="space-y-2 mt-2">
                            {openTransactions.map((tx, index) => (
                                <li key={index} className="flex justify-between items-center bg-gray-700 p-2 rounded-lg">
                                    <span>{t('transactionItemCount', { count: tx.cart.length })}</span>
                                    <button onClick={() => handleLoadTransaction(index)} className="text-blue-400 hover:text-blue-300">
                                        {t('load')}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default POSPage;