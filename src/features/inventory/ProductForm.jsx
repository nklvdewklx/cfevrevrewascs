import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';

const ProductForm = ({ product, onSave, onCancel, components }) => {
    const { register, control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: product || {
            name: '',
            sku: '',
            cost: 0,
            shelfLifeDays: 90,
            pricingTiers: [{ minQty: 1, price: 0 }],
            bom: [],
        }
    });

    const { fields: pricingFields, append: appendPricing, remove: removePricing } = useFieldArray({
        control,
        name: 'pricingTiers'
    });

    const { fields: bomFields, append: appendBom, remove: removeBom } = useFieldArray({
        control,
        name: 'bom'
    });

    const onSubmit = (data) => {
        // Convert numbers from strings before saving
        const dataToSave = {
            ...data,
            cost: parseFloat(data.cost),
            shelfLifeDays: parseInt(data.shelfLifeDays),
            pricingTiers: data.pricingTiers.map(t => ({
                minQty: parseInt(t.minQty),
                price: parseFloat(t.price)
            })),
            bom: data.bom.map(b => ({
                componentId: parseInt(b.componentId),
                quantity: parseInt(b.quantity)
            })),
        };
        onSave(dataToSave);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div>
                <label className="block mb-1 text-sm text-custom-grey">Product Name</label>
                <input
                    type="text"
                    {...register('name', { required: 'Product name is required' })}
                    className="form-input"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
                <label className="block mb-1 text-sm text-custom-grey">SKU</label>
                <input
                    type="text"
                    {...register('sku', { required: 'SKU is required' })}
                    className="form-input"
                />
                {errors.sku && <p className="text-red-400 text-xs mt-1">{errors.sku.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block mb-1 text-sm text-custom-grey">Cost</label>
                    <input
                        type="number"
                        step="0.01"
                        {...register('cost', { required: 'Cost is required', valueAsNumber: true })}
                        className="form-input"
                    />
                    {errors.cost && <p className="text-red-400 text-xs mt-1">{errors.cost.message}</p>}
                </div>
                <div>
                    <label className="block mb-1 text-sm text-custom-grey">Shelf Life (Days)</label>
                    <input
                        type="number"
                        {...register('shelfLifeDays', { required: 'Shelf life is required', valueAsNumber: true, min: { value: 1, message: 'Must be at least 1 day' } })}
                        className="form-input"
                    />
                    {errors.shelfLifeDays && <p className="text-red-400 text-xs mt-1">{errors.shelfLifeDays.message}</p>}
                </div>
            </div>

            {/* Pricing Tiers */}
            <div className="space-y-3 pt-4 border-t border-white/10">
                <label className="block text-md font-semibold text-custom-light-blue">Pricing Tiers</label>
                {pricingFields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-2">
                        <input
                            type="number"
                            placeholder="Min Qty"
                            {...register(`pricingTiers.${index}.minQty`, { required: true, valueAsNumber: true, min: 1 })}
                            className="form-input w-1/3"
                            min="1"
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            step="0.01"
                            {...register(`pricingTiers.${index}.price`, { required: true, valueAsNumber: true, min: 0 })}
                            className="form-input flex-grow"
                        />
                        <button type="button" onClick={() => removePricing(index)} className="p-2 text-red-400"><Trash2 size={18} /></button>
                    </div>
                ))}
                <button type="button" onClick={() => appendPricing({ minQty: 1, price: 0 })} className="text-sm text-blue-400 flex items-center space-x-2"><Plus size={16} /><span>Add Tier</span></button>
            </div>

            {/* Bill of Materials */}
            <div className="space-y-3 pt-4 border-t border-white/10">
                <label className="block text-md font-semibold text-custom-light-blue">Bill of Materials (BOM)</label>
                {bomFields.map((item, index) => (
                    <div key={item.id} className="flex items-center space-x-2">
                        <select
                            {...register(`bom.${index}.componentId`, { required: true })}
                            className="form-select flex-grow"
                        >
                            {components.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <input
                            type="number"
                            placeholder="Qty"
                            {...register(`bom.${index}.quantity`, { required: true, valueAsNumber: true, min: 1 })}
                            className="form-input w-24"
                            min="1"
                        />
                        <button type="button" onClick={() => removeBom(index)} className="p-2 text-red-400"><Trash2 size={18} /></button>
                    </div>
                ))}
                <button type="button" onClick={() => appendBom({ componentId: components[0]?.id || '', quantity: 1 })} className="text-sm text-blue-400 flex items-center space-x-2"><Plus size={16} /><span>Add Component</span></button>
            </div>

            <div className="pt-4 flex justify-end space-x-4">
                <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-700 font-bold py-2 px-4 rounded-lg">Cancel</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 font-bold py-2 px-4 rounded-lg">Save Product</button>
            </div>
        </form>
    );
};

export default ProductForm;