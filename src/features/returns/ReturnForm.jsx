import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/common/Button';

// UPDATED: Destructure 'returns' from props
const ReturnForm = ({ onSave, onCancel, orders, customers, products, returns }) => {
    const { t } = useTranslation();
    const [selectedOrder, setSelectedOrder] = useState(null);

    const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            orderId: '',
            items: [],
            reason: '',
        }
    });

    const { fields, remove } = useFieldArray({ control, name: 'items' });
    const watchedOrderId = watch('orderId');

    useEffect(() => {
        const order = orders.find(o => o.id === parseInt(watchedOrderId));
        setSelectedOrder(order);

        if (order) {
            const newItems = order.items.map(item => {
                const product = products.find(p => p.id === item.productId);
                return {
                    productId: item.productId,
                    name: product?.name,
                    maxQuantity: item.quantity,
                    quantity: item.quantity,
                };
            });
            setValue('items', newItems);
        } else {
            setValue('items', []);
        }
    }, [watchedOrderId, orders, products, setValue]);

    const customerForOrder = selectedOrder ? customers.find(c => c.id === selectedOrder.customerId) : null;

    // UPDATED: Create a list of order IDs that already have a return
    const returnedOrderIds = new Set(returns.map(r => r.orderId));
    const availableOrders = orders.filter(o =>
        (o.status === 'completed' || o.status === 'shipped') && !returnedOrderIds.has(o.id)
    );

    return (
        <form onSubmit={handleSubmit(onSave)} className="space-y-6">
            <div>
                <label className="block mb-1 text-sm text-custom-grey">{t('originalOrder')}</label>
                <select
                    {...register('orderId', { required: t('orderRequired') })}
                    className="form-select"
                >
                    <option value="">{t('selectOrder')}</option>
                    {/* UPDATED: Use the filtered list of available orders */}
                    {availableOrders.map(o => (
                        <option key={o.id} value={o.id}>#{o.id}</option>
                    ))}
                </select>
                {errors.orderId && <p className="text-red-400 text-xs mt-1">{errors.orderId.message}</p>}
                {availableOrders.length === 0 && <p className="text-yellow-400 text-xs mt-1">{t('noEligibleOrdersForReturn')}</p>}
            </div>

            {selectedOrder && (
                <>
                    <div className="text-sm text-custom-grey">{t('customer')}: <span className="font-semibold text-white">{customerForOrder?.name || ''}</span></div>
                    <div className="space-y-3 pt-4 border-t border-white/10">
                        <label className="block text-md font-semibold text-custom-light-blue">{t('itemsToReturn')}</label>
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex items-center space-x-4 p-2 bg-gray-900/50 rounded-lg">
                                <span className="flex-grow text-white">{field.name}</span>
                                <input
                                    type="number"
                                    {...register(`items.${index}.quantity`, {
                                        required: t('quantityRequired'),
                                        valueAsNumber: true,
                                        min: { value: 1, message: t('quantityAtLeastOne') },
                                        max: { value: field.maxQuantity, message: t('cannotReturnMoreThanOrdered', { max: field.maxQuantity }) }
                                    })}
                                    className="form-input w-24"
                                />
                                <Button type="button" onClick={() => remove(index)} variant="ghost" size="sm" className="text-red-400">
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        ))}
                        {errors.items && <p className="text-red-400 text-xs mt-1">{t('checkReturnedItems')}</p>}
                    </div>
                </>
            )}
            <div>
                <label className="block mb-1 text-sm text-custom-grey">{t('reasonForReturn')}</label>
                <textarea
                    {...register('reason', { required: t('reasonIsRequired') })}
                    className="form-input"
                    rows="3"
                    placeholder={t('e.g., Damaged goods, wrong item, etc.')}
                ></textarea>
                {errors.reason && <p className="text-red-400 text-xs mt-1">{errors.reason.message}</p>}
            </div>

            <div className="pt-4 flex justify-end space-x-4">
                <Button type="button" onClick={onCancel} variant="secondary">{t('cancel')}</Button>
                <Button type="submit" variant="primary">{t('createReturnRequest')}</Button>
            </div>
        </form>
    );
};

export default ReturnForm;