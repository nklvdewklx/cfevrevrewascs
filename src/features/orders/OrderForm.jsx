import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';

const OrderForm = ({ order, onSave, onCancel, customers, products }) => {
    const { register, control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: order || {
            customerId: customers[0]?.id || '',
            items: [{ productId: products[0]?.id || '', quantity: 1 }],
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items'
    });

    const onSubmit = (data) => {
        // Filter out any line items that might not have a product selected
        const validItems = data.items.filter(item => item.productId).map(item => ({
            productId: parseInt(item.productId),
            quantity: parseInt(item.quantity)
        }));

        if (validItems.length === 0) {
            alert('Please add at least one product to the order.');
            return;
        }

        onSave({ customerId: parseInt(data.customerId), items: validItems });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label className="block mb-1 text-sm text-custom-grey">Customer</label>
                <select
                    {...register('customerId', { required: 'Customer is required' })}
                    className="form-select"
                >
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.customerId && <p className="text-red-400 text-xs mt-1">{errors.customerId.message}</p>}
            </div>

            <div className="space-y-3">
                <label className="block text-sm text-custom-grey">Products</label>
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-2">
                        <select
                            {...register(`items.${index}.productId`, { required: 'Product is required' })}
                            className="form-select flex-grow"
                        >
                            <option value="">Select a product...</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <input
                            type="number"
                            {...register(`items.${index}.quantity`, { required: 'Quantity is required', valueAsNumber: true, min: { value: 1, message: 'Quantity must be at least 1' } })}
                            className="form-input w-24"
                            min="1"
                        />
                        <button type="button" onClick={() => remove(index)} className="p-2 text-red-400 hover:text-red-300">
                            <Trash2 size={18} />
                        </button>
                        {errors.items?.[index]?.productId && <p className="text-red-400 text-xs mt-1">{errors.items[index].productId.message}</p>}
                        {errors.items?.[index]?.quantity && <p className="text-red-400 text-xs mt-1">{errors.items[index].quantity.message}</p>}
                    </div>
                ))}
                <button type="button" onClick={() => append({ productId: products[0]?.id || '', quantity: 1 })} className="text-sm text-blue-400 hover:text-blue-300 flex items-center space-x-2">
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