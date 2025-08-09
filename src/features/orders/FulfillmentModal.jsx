import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Button from '../../components/common/Button';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { AlertTriangle, CheckCircle, LucideSplit } from 'lucide-react';

const FulfillmentModal = ({ order, onCancel, onConfirm }) => {
    const { t } = useTranslation();
    const { items: products } = useSelector((state) => state.products);
    const [fulfillmentStrategy, setFulfillmentStrategy] = useState('fulfill-all');

    const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            items: order.items.map(item => {
                const product = products.find(p => p.id === item.productId);
                const alreadyFulfilled = order.fulfilledItems?.find(fi => fi.productId === item.productId)?.quantity || 0;
                const remainingToFulfill = item.quantity - alreadyFulfilled;

                return {
                    productId: item.productId,
                    name: product?.name,
                    quantityToFulfill: remainingToFulfill,
                    totalAvailable: product?.stockBatches.reduce((sum, b) => sum + b.quantity, 0) || 0,
                    allocations: product?.stockBatches.map(batch => ({
                        lotNumber: batch.lotNumber,
                        available: batch.quantity,
                        allocated: 0
                    })) || []
                };
            }).filter(item => item.quantityToFulfill > 0)
        }
    });

    const { fields } = useFieldArray({ control, name: "items" });
    const watchedItems = watch('items');

    const handleAutoAllocate = (itemIndex) => {
        const product = products.find(p => p.id === watchedItems[itemIndex].productId);
        const qtyToAllocate = Math.min(watchedItems[itemIndex].quantityToFulfill, watchedItems[itemIndex].totalAvailable);
        let remainingToAllocate = qtyToAllocate;

        const sortedBatches = [...(product.stockBatches || [])].sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

        const newAllocations = watchedItems[itemIndex].allocations.map(alloc => {
            const batchInOrder = sortedBatches.find(b => b.lotNumber === alloc.lotNumber);
            if (batchInOrder && remainingToAllocate > 0) {
                const canAllocate = Math.min(batchInOrder.quantity, remainingToAllocate);
                remainingToAllocate -= canAllocate;
                return { ...alloc, allocated: canAllocate };
            }
            return { ...alloc, allocated: 0 };
        });

        setValue(`items.${itemIndex}.allocations`, newAllocations, { shouldValidate: true });
    };

    const isOrderFullyAllocatable = watchedItems.every(item => item.totalAvailable >= item.quantityToFulfill);

    const canConfirm = watchedItems.some(item => item.allocations.some(a => (a.allocated || 0) > 0));

    const handleFormSubmit = (data) => {
        onConfirm({ ...data, strategy: isOrderFullyAllocatable ? 'fulfill-all' : fulfillmentStrategy });
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2 space-y-6">

                {!isOrderFullyAllocatable && (
                    <div className="glass-panel p-4 rounded-lg border-l-4 border-yellow-400">
                        <h3 className="text-md font-bold text-yellow-400 flex items-center space-x-2">
                            <LucideSplit size={20} />
                            <span>{t('fulfillmentOptions')}</span>
                        </h3>
                        <p className="text-sm text-custom-grey mt-1 mb-3">{t('insufficientStockDetected')}</p>
                        <div className="flex space-x-2">
                            <Button type="button" onClick={() => setFulfillmentStrategy('backorder')} variant={fulfillmentStrategy === 'backorder' ? 'primary' : 'secondary'}>
                                {t('shipAvailableCreateBackorder')}
                            </Button>
                        </div>
                    </div>
                )}

                {fields.length > 0 ? fields.map((field, index) => {
                    const totalAllocated = watchedItems[index].allocations.reduce((sum, alloc) => sum + Number(alloc.allocated || 0), 0);
                    const isFulfilled = totalAllocated === field.quantityToFulfill;
                    const isOverAllocated = totalAllocated > field.quantityToFulfill;

                    let statusIcon;
                    if (field.totalAvailable < field.quantityToFulfill) {
                        statusIcon = <AlertTriangle size={16} className="text-red-400" />;
                    } else if (isFulfilled) {
                        statusIcon = <CheckCircle size={16} className="text-green-400" />;
                    } else {
                        statusIcon = <AlertTriangle size={16} className="text-yellow-400" />;
                    }

                    return (
                        <div key={field.id} className="glass-panel p-4 rounded-lg border-l-4 border-white/10">
                            <div className="flex justify-between items-center mb-3">
                                <div>
                                    <h3 className="text-lg font-bold">{field.name}</h3>
                                    <div className="flex items-center space-x-2 text-sm font-semibold">
                                        {statusIcon}
                                        <span>
                                            {t('allocating')}: {totalAllocated} / {field.quantityToFulfill}
                                        </span>
                                    </div>
                                    {field.totalAvailable < field.quantityToFulfill && <p className="text-xs text-red-400 mt-1">{t('insufficientStockToFulfill')}</p>}
                                </div>
                                <Button type="button" size="sm" onClick={() => handleAutoAllocate(index)}>{t('autoAllocateFEFO')}</Button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-custom-grey">{t('availableBatches')}</label>
                                {field.allocations.length > 0 ? field.allocations.map((alloc, allocIndex) => (
                                    <div key={alloc.lotNumber} className="grid grid-cols-3 gap-4 items-center">
                                        <div className="text-sm">
                                            <p className="font-mono">{alloc.lotNumber}</p>
                                            <p className="text-xs text-custom-grey">{t('available')}: {alloc.available}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <Controller
                                                control={control}
                                                name={`items.${index}.allocations.${allocIndex}.allocated`}
                                                rules={{
                                                    valueAsNumber: true,
                                                    min: 0,
                                                    max: { value: alloc.available, message: t('cannotAllocateMoreThanAvailable') },
                                                    validate: () => !isOverAllocated || t('totalAllocationExceedsOrder')
                                                }}
                                                render={({ field }) => (
                                                    <input
                                                        type="number"
                                                        {...field}
                                                        className={`form-input ${errors.items?.[index]?.allocations?.[allocIndex]?.allocated ? 'border-red-500' : ''}`}
                                                        placeholder={t('quantity')}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                )) : <p className="text-xs text-custom-grey">{t('noStockBatchesAvailable')}</p>}
                                {errors.items?.[index]?.allocations && <p className="text-red-400 text-xs mt-1">{t('checkAllocationQuantities')}</p>}
                            </div>
                        </div>
                    );
                }) : <p className="text-center text-custom-grey">{t('orderIsFullyFulfilled')}</p>}
            </div>

            <div className="pt-4 flex justify-end space-x-4">
                <Button type="button" onClick={onCancel} variant="secondary">{t('cancel')}</Button>
                <Button type="submit" variant="primary" disabled={!canConfirm}>
                    {t('confirmFulfillment')}
                </Button>
            </div>
        </form>
    );
};

export default FulfillmentModal;