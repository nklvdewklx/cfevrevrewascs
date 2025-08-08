import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';

const QuoteForm = ({ quote, onSave, onCancel, customers, leads, products }) => {
    const { register, control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: quote || {
            customerId: '',
            leadId: '',
            status: 'draft',
            date: new Date().toISOString().split('T')[0],
            expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
            items: [{ productId: products[0]?.id || '', quantity: 1 }],
        }
    });

    const { fields, append, remove } = useFieldArray({ control, name: 'items' });
    const quoteStatuses = ['draft', 'sent', 'accepted', 'rejected', 'converted'];

    return (
        <form onSubmit={handleSubmit(onSave)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div><label className="block mb-1 text-sm text-custom-grey">Quote Date</label><input type="date" {...register('date')} className="form-input" /></div>
                <div><label className="block mb-1 text-sm text-custom-grey">Expiry Date</label><input type="date" {...register('expiryDate')} className="form-input" /></div>
            </div>
            <div>
                <label className="block mb-1 text-sm text-custom-grey">Status</label>
                <select {...register('status')} className="form-select capitalize">
                    {quoteStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div className="pt-4 border-t border-white/10">
                <label className="block mb-2 font-semibold text-custom-light-blue">Recipient</label>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-sm text-custom-grey">Link to Customer</label>
                        <select {...register('customerId')} className="form-select">
                            <option value="">None</option>
                            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1 text-sm text-custom-grey">Link to Lead</label>
                        <select {...register('leadId')} className="form-select">
                            <option value="">None</option>
                            {leads.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>
            <div className="space-y-3 pt-4 border-t border-white/10">
                <label className="block text-md font-semibold text-custom-light-blue">Products</label>
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-2">
                        <select
                            {...register(`items.${index}.productId`, { required: 'Product is required' })}
                            className="form-select flex-grow"
                        >
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <input
                            type="number"
                            {...register(`items.${index}.quantity`, { valueAsNumber: true, min: { value: 1, message: 'Quantity must be at least 1' } })}
                            className="form-input w-24"
                            min="1"
                        />
                        <button type="button" onClick={() => remove(index)} className="p-2 text-red-400"><Trash2 size={18} /></button>
                        {errors.items?.[index]?.quantity && <p className="text-red-400 text-xs mt-1">{errors.items[index].quantity.message}</p>}
                    </div>
                ))}
                <button type="button" onClick={() => append({ productId: products[0]?.id, quantity: 1 })} className="text-sm text-blue-400 flex items-center space-x-2"><Plus size={16} /><span>Add Product</span></button>
            </div>
            <div className="pt-4 flex justify-end space-x-4">
                <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-700 font-bold py-2 px-4 rounded-lg">Cancel</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 font-bold py-2 px-4 rounded-lg">Save Quote</button>
            </div>
        </form>
    );
};

export default QuoteForm;