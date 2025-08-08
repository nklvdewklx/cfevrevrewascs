import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const OrderForm = ({ order, onSave, onCancel, customers, products }) => {
    const { t } = useTranslation();
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
        const validItems = data.items.filter(item => item.productId).map(item => ({
            productId: parseInt(item.productId),
            quantity: parseInt(item.quantity)
        }));

        if (validItems.length === 0) {
            alert(t('addAtLeastOneProduct'));
            return;
        }

        onSave({ customerId: parseInt(data.customerId), items: validItems });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label className="block mb-1 text-sm text-custom-grey">{t('customer')}</label>
                <select
                    {...register('customerId', { required: t('customerRequired') })}
                    className="form-select"
                >
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.customerId && <p className="text-red-400 text-xs mt-1">{errors.customerId.message}</p>}
            </div>

            <div className="space-y-3">
                <label className="block text-sm text-custom-grey">{t('products')}</label>
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-2">
                        <select
                            {...register(`items.${index}.productId`, { required: t('productRequired') })}
                            className="form-select flex-grow"
                        >
                            <option value="">{t('selectProduct')}</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <input
                            type="number"
                            {...register(`items.${index}.quantity`, { required: t('quantityRequired'), valueAsNumber: true, min: { value: 1, message: t('quantityAtLeastOne') } })}
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
                    <span>{t('addProduct')}</span>
                </button>
            </div>

            <div className="pt-4 flex justify-end space-x-4">
                <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg">
                    {t('cancel')}
                </button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                    {t('saveOrder')}
                </button>
            </div>
        </form>
    );
};

export default OrderForm;