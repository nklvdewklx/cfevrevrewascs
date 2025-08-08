import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { addOrder } from '../orders/ordersSlice';
import { showToast } from '../../lib/toast';

const AgentOrderForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { customerId } = location.state || {}; // Get customerId passed from previous page

    const { user } = useSelector((state) => state.auth);
    const customers = useSelector((state) => state.customers.items);
    const products = useSelector((state) => state.products.items);

    const myCustomers = customers.filter(c => c.agentId === user.id);

    const { register, control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            customerId: customerId || myCustomers[0]?.id || '',
            items: [{ productId: products[0]?.id || '', quantity: 1 }],
        }
    });

    const { fields, append, remove } = useFieldArray({ control, name: 'items' });

    const onSubmit = (data) => {
        const newOrderData = {
            ...data,
            customerId: parseInt(data.customerId),
            agentId: user.id,
            date: new Date().toISOString().split('T')[0],
            status: 'pending',
            items: data.items.map(item => ({
                ...item,
                productId: parseInt(item.productId),
                quantity: parseInt(item.quantity)
            })),
        };
        dispatch(addOrder(newOrderData));
        showToast('New order created successfully!', 'success');
        navigate('/agent/home');
    };

    return (
        <div>
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-custom-light-blue mb-4">
                <ArrowLeft size={18} />
                <span>Back</span>
            </button>
            <h2 className="text-3xl font-bold text-white mb-6">Create New Order</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block mb-2 text-sm text-gray-400">Customer</label>
                    <select {...register('customerId', { required: 'Customer is required' })} className="form-input bg-gray-800 border-gray-700">
                        {myCustomers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    {errors.customerId && <p className="text-red-400 text-xs mt-1">{errors.customerId.message}</p>}
                </div>

                <div className="space-y-3">
                    <label className="block text-sm text-gray-400">Products</label>
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center space-x-2 bg-gray-800 p-2 rounded-lg">
                            <select
                                {...register(`items.${index}.productId`, { required: 'Product is required' })}
                                className="form-select bg-gray-700 border-gray-600 flex-grow"
                            >
                                <option value="">Select a product...</option>
                                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                            <input
                                type="number"
                                {...register(`items.${index}.quantity`, { required: 'Quantity is required', valueAsNumber: true, min: { value: 1, message: 'Quantity must be at least 1' } })}
                                className="form-input bg-gray-700 border-gray-600 w-24"
                                min="1"
                            />
                            <button type="button" onClick={() => remove(index)} className="p-2 text-red-400"><Trash2 size={18} /></button>
                            {errors.items?.[index]?.productId && <p className="text-red-400 text-xs mt-1">{errors.items[index].productId.message}</p>}
                            {errors.items?.[index]?.quantity && <p className="text-red-400 text-xs mt-1">{errors.items[index].quantity.message}</p>}
                        </div>
                    ))}
                    <button type="button" onClick={() => append({ productId: products[0]?.id, quantity: 1 })} className="text-sm text-blue-400 flex items-center space-x-2"><Plus size={16} /><span>Add Product</span></button>
                </div>

                <div className="pt-4">
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-3 px-4 rounded-lg">
                        Create Order
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AgentOrderForm;