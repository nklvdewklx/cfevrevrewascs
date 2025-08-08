import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const BillOfMaterials = ({ product, components, onBomChange, onAddBomItem, onRemoveBomItem }) => {

    // Helper function to calculate the total cost of a product based on its BOM
    const calculateProductCost = () => {
        if (!product || !product.bom || product.bom.length === 0) {
            return 0;
        }

        return product.bom.reduce((totalCost, bomItem) => {
            const component = components.find(c => c.id === bomItem.componentId);
            if (component) {
                return totalCost + (component.cost * bomItem.quantity);
            }
            return totalCost;
        }, 0);
    };

    return (
        <div className="space-y-3">
            <h3 className="text-md font-semibold text-custom-light-blue">Bill of Materials (BOM)</h3>
            <div className="bg-gray-800/50 p-4 rounded-lg">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b-2 border-white/20 text-left">
                            <th className="py-2">Component</th>
                            <th className="py-2">Quantity</th>
                            <th className="py-2 text-right">Cost</th>
                            <th className="py-2 text-right">Total</th>
                            <th className="py-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {product?.bom?.length > 0 ? (
                            product.bom.map((item, index) => {
                                const component = components.find(c => c.id === item.componentId);
                                const itemCost = (component?.cost || 0) * item.quantity;
                                return (
                                    <tr key={index} className="border-b border-white/10 last:border-b-0">
                                        <td className="py-2">
                                            <select
                                                value={item.componentId}
                                                onChange={(e) => onBomChange(index, 'componentId', e.target.value)}
                                                className="form-select bg-gray-700 border-gray-600"
                                            >
                                                {components.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </td>
                                        <td className="py-2">
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => onBomChange(index, 'quantity', e.target.value)}
                                                className="form-input bg-gray-700 border-gray-600 w-24"
                                                min="1"
                                            />
                                        </td>
                                        <td className="py-2 text-right text-custom-grey">${(component?.cost || 0).toFixed(2)}</td>
                                        <td className="py-2 text-right font-semibold">${itemCost.toFixed(2)}</td>
                                        <td className="py-2 text-right">
                                            <button type="button" onClick={() => onRemoveBomItem(index)} className="p-2 text-red-400"><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-custom-grey">No components in this BOM.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <button type="button" onClick={onAddBomItem} className="mt-4 text-sm text-blue-400 flex items-center space-x-2"><Plus size={16} /><span>Add Component</span></button>
            </div>
            {product?.bom?.length > 0 && (
                <div className="flex justify-end pt-2">
                    <div className="text-right">
                        <span className="text-custom-grey">Total BOM Cost:</span>
                        <span className="text-lg font-bold text-white ml-2">${calculateProductCost().toFixed(2)}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillOfMaterials;