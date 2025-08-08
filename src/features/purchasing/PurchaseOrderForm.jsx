import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import Button from '../../components/common/Button';

const PurchaseOrderForm = ({ po, onSave, onCancel, suppliers, components }) => {
    const { register, control, handleSubmit } = useForm({
        defaultValues: po || {
            supplierId: suppliers[0]?.id || '',
            status: 'draft',
            items: [{ componentId: components[0]?.id || '', quantity: 1 }],
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items'
    });

    return (
        <form onSubmit={handleSubmit(onSave)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block mb-1 text-sm text-custom-grey">Supplier</label>
                    <select {...register('supplierId')} className="form-select">
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block mb-1 text-sm text-custom-grey">Status</label>
                    <select {...register('status')} className="form-select">
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                    </select>
                </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
                <label className="block text-md font-semibold text-custom-light-blue">Components to Order</label>
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-2">
                        <select {...register(`items.${index}.componentId`)} className="form-select flex-grow">
                            {components.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <input type="number" {...register(`items.${index}.quantity`, { valueAsNumber: true, min: 1 })} className="form-input w-24" min="1" />
                        <Button type="button" onClick={() => remove(index)} variant="ghost-glow" size="sm" className="text-red-400"><Trash2 size={18} /></Button>
                    </div>
                ))}
                <Button type="button" onClick={() => append({ componentId: components[0]?.id, quantity: 1 })} variant="ghost" className="text-blue-400 flex items-center space-x-2" size="sm">
                    <Plus size={16} />
                    <span>Add Component</span>
                </Button>
            </div>

            <div className="pt-4 flex justify-end space-x-4">
                <Button type="button" onClick={onCancel} variant="secondary">Cancel</Button>
                <Button type="submit" variant="primary">Save Purchase Order</Button>
            </div>
        </form>
    );
};

export default PurchaseOrderForm;