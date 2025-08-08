import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const ProductForm = ({ product, onSave, onCancel, components }) => {
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        cost: 0,
        shelfLifeDays: 90,
        pricingTiers: [{ minQty: 1, price: 0 }],
        bom: [],
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                sku: product.sku || '',
                cost: product.cost || 0,
                shelfLifeDays: product.shelfLifeDays || 90,
                pricingTiers: product.pricingTiers?.length ? product.pricingTiers : [{ minQty: 1, price: 0 }],
                bom: product.bom?.length ? product.bom : [],
            });
        }
    }, [product]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- Pricing Tier Handlers ---
    const handleTierChange = (index, field, value) => {
        const newTiers = [...formData.pricingTiers];
        newTiers[index][field] = value;
        setFormData(prev => ({ ...prev, pricingTiers: newTiers }));
    };
    const addTier = () => {
        setFormData(prev => ({ ...prev, pricingTiers: [...prev.pricingTiers, { minQty: 1, price: 0 }] }));
    };
    const removeTier = (index) => {
        setFormData(prev => ({ ...prev, pricingTiers: prev.pricingTiers.filter((_, i) => i !== index) }));
    };

    // --- Bill of Materials (BOM) Handlers ---
    const handleBomChange = (index, field, value) => {
        const newBom = [...formData.bom];
        newBom[index][field] = value;
        setFormData(prev => ({ ...prev, bom: newBom }));
    };
    const addBomItem = () => {
        setFormData(prev => ({ ...prev, bom: [...prev.bom, { componentId: components[0]?.id || '', quantity: 1 }] }));
    };
    const removeBomItem = (index) => {
        setFormData(prev => ({ ...prev, bom: prev.bom.filter((_, i) => i !== index) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Convert numbers from strings before saving
        const dataToSave = {
            ...formData,
            cost: parseFloat(formData.cost),
            shelfLifeDays: parseInt(formData.shelfLifeDays),
            pricingTiers: formData.pricingTiers.map(t => ({ minQty: parseInt(t.minQty), price: parseFloat(t.price) })),
            bom: formData.bom.map(b => ({ componentId: parseInt(b.componentId), quantity: parseInt(b.quantity) })),
        }
        onSave(dataToSave);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div><label className="block mb-1 text-sm text-custom-grey">Product Name</label><input type="text" name="name" value={formData.name} onChange={handleFormChange} className="form-input" required /></div>
            <div><label className="block mb-1 text-sm text-custom-grey">SKU</label><input type="text" name="sku" value={formData.sku} onChange={handleFormChange} className="form-input" required /></div>
            <div className="grid grid-cols-2 gap-4">
                <div><label className="block mb-1 text-sm text-custom-grey">Cost</label><input type="number" name="cost" step="0.01" value={formData.cost} onChange={handleFormChange} className="form-input" required /></div>
                <div><label className="block mb-1 text-sm text-custom-grey">Shelf Life (Days)</label><input type="number" name="shelfLifeDays" value={formData.shelfLifeDays} onChange={handleFormChange} className="form-input" required /></div>
            </div>

            {/* Pricing Tiers */}
            <div className="space-y-3 pt-4 border-t border-white/10">
                <label className="block text-md font-semibold text-custom-light-blue">Pricing Tiers</label>
                {formData.pricingTiers.map((tier, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <input type="number" placeholder="Min Qty" value={tier.minQty} onChange={(e) => handleTierChange(index, 'minQty', e.target.value)} className="form-input w-1/3" min="1" />
                        <input type="number" placeholder="Price" step="0.01" value={tier.price} onChange={(e) => handleTierChange(index, 'price', e.target.value)} className="form-input flex-grow" />
                        <button type="button" onClick={() => removeTier(index)} className="p-2 text-red-400"><Trash2 size={18} /></button>
                    </div>
                ))}
                <button type="button" onClick={addTier} className="text-sm text-blue-400 flex items-center space-x-2"><Plus size={16} /><span>Add Tier</span></button>
            </div>

            {/* Bill of Materials */}
            <div className="space-y-3 pt-4 border-t border-white/10">
                <label className="block text-md font-semibold text-custom-light-blue">Bill of Materials (BOM)</label>
                {formData.bom.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <select value={item.componentId} onChange={(e) => handleBomChange(index, 'componentId', e.target.value)} className="form-select flex-grow">
                            {components.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => handleBomChange(index, 'quantity', e.target.value)} className="form-input w-24" min="1" />
                        <button type="button" onClick={() => removeBomItem(index)} className="p-2 text-red-400"><Trash2 size={18} /></button>
                    </div>
                ))}
                <button type="button" onClick={addBomItem} className="text-sm text-blue-400 flex items-center space-x-2"><Plus size={16} /><span>Add Component</span></button>
            </div>

            <div className="pt-4 flex justify-end space-x-4">
                <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-700 font-bold py-2 px-4 rounded-lg">Cancel</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 font-bold py-2 px-4 rounded-lg">Save Product</button>
            </div>
        </form>
    );
};

export default ProductForm;