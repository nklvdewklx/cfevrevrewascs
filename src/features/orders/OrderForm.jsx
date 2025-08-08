import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const OrderForm = ({ order, onSave, onCancel, customers, products }) => {
    const [customerId, setCustomerId] = useState('');
    const [items, setItems] = useState([{ productId: '', quantity: 1 }]);

    useEffect(() => {
        if (order) {
            setCustomerId(order.customerId || '');
            setItems(order.items && order.items.length > 0 ? order.items : [{ productId: '', quantity: 1 }]);
        } else {
            // Reset form for new order
            setCustomerId(customers[0]?.id || '');
            setItems([{ productId: products[0]?.id || '', quantity: 1 }]);
        }
    }, [order, customers, products]);

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleAddItem = () => {
        setItems([...items, { productId: products[0]?.id || '', quantity: 1 }]);
    };

    const handleRemoveItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Filter out any line items that might not have a product selected
        const validItems = items.filter(item => item.productId).map(item => ({
            productId: parseInt(item.productId),
            quantity: parseInt(item.quantity)
        }));

        if (validItems.length === 0) {
            alert('Please add at least one product to the order.');
            return;
        }

        onSave({ customerId: parseInt(customerId), items: validItems });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block mb-1 text-sm text-custom-grey">Customer</label>
                <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="form-select" required>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>

            <div className="space-y-3">
                <label className="block text-sm text-custom-grey">Products</label>
                {items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <select
                            value={item.productId}
                            onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                            className="form-select flex-grow"
                        >
                            <option value="">Select a product...</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            className="form-input w-24"
                            min="1"
                            required
                        />
                        <button type="button" onClick={() => handleRemoveItem(index)} className="p-2 text-red-400 hover:text-red-300">
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
                <button type="button" onClick={handleAddItem} className="text-sm text-blue-400 hover:text-blue-300 flex items-center space-x-2">
                    <Plus size={16} />
                    <span>Add Product</span>
                </button>
            </div>

            <div className="pt-4 flex justify-end space-x-4">
                <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg">
                    Cancel
                </button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                    Save Order
                </button>
            </div>
        </form>
    );
};

export default OrderForm;