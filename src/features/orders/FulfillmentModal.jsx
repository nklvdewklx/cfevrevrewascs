import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Button from '../../components/common/Button';
import { useForm, useFieldArray } from 'react-hook-form';

const FulfillmentModal = ({ order, onCancel, onConfirm }) => {
    const { t } = useTranslation();
    const { items: products } = useSelector((state) => state.products);

    const { control, handleSubmit, watch, setValue } = useForm({
        defaultValues: {
            items: order.items.map(item => {
                const product = products.find(p => p.id === item.productId);
                return {
                    productId: item.productId,
                    name: product?.name,
                    quantityToFulfill: item.quantity,
                    allocations: product?.stockBatches.map(batch => ({
                        lotNumber: batch.lotNumber,
                        available: batch.quantity,
                        allocated: 0
                    })) || []
                };
            })
        }
    });

    const { fields } = useFieldArray({ control, name: "items" });
    const watchedItems = watch('items');

    const handleAutoAllocate = (itemIndex) => {
        const product = products.find(p => p.id === watchedItems[itemIndex].productId);
        const orderedQty = watchedItems[itemIndex].quantityToFulfill;
        let remainingToAllocate = orderedQty;

        const sortedBatches = [...(product.stockBatches || [])].sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

        const newAllocations = watchedItems[itemIndex].allocations.map(alloc => {
            const batch = sortedBatches.find(b => b.lotNumber === alloc.lotNumber);
            if (batch && remainingToAllocate > 0) {
                const canAllocate = Math.min(batch.quantity, remainingToAllocate);
                remainingToAllocate -= canAllocate;
                return { ...alloc, allocated: canAllocate };
            }
            return { ...alloc, allocated: 0 };
        });

        setValue(`items.${itemIndex}.allocations`, newAllocations);
    };

    return (
        <form onSubmit={handleSubmit(onConfirm)} className="space-y-6">
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2 space-y-6">
                {fields.map((field, index) => {
                    const totalAllocated = watchedItems[index].allocations.reduce((sum, alloc) => sum + Number(alloc.allocated || 0), 0);
                    const isFulfilled = totalAllocated === field.quantityToFulfill;
                    const allocationStatusColor = isFulfilled ? 'text-green-400' : 'text-yellow-400';

                    return (
                        <div key={field.id} className="glass-panel p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-3">
                                <div>
                                    <h3 className="text-lg font-bold">{field.name}</h3>
                                    <p className={`text-sm font-semibold ${allocationStatusColor}`}>
                                        {t('allocated')}: {totalAllocated} / {field.quantityToFulfill}
                                    </p>
                                </div>
                                <Button type="button" size="sm" onClick={() => handleAutoAllocate(index)}>{t('autoAllocateFEFO')}</Button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-custom-grey">{t('availableBatches')}</label>
                                {field.allocations.map((alloc, allocIndex) => (
                                    <div key={alloc.lotNumber} className="grid grid-cols-3 gap-4 items-center">
                                        <div className="text-sm">
                                            <p className="font-mono">{alloc.lotNumber}</p>
                                            <p className="text-xs text-custom-grey">{t('available')}: {alloc.available}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <input
                                                type="number"
                                                {...control.register(`items.${index}.allocations.${allocIndex}.allocated`, { valueAsNumber: true, min: 0, max: alloc.available })}
                                                className="form-input"
                                                placeholder={t('quantityToFulfill')}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="pt-4 flex justify-end space-x-4">
                <Button type="button" onClick={onCancel} variant="secondary">{t('cancel')}</Button>
                <Button type="submit" variant="primary">{t('confirmFulfillment')}</Button>
            </div>
        </form>
    );
};

export default FulfillmentModal;