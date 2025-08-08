import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AlertTriangle, Package, ClipboardList } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LowStockWarning = () => {
    const { t } = useTranslation();
    const { items: products } = useSelector((state) => state.products);
    const { items: components } = useSelector((state) => state.components);

    const lowStockProducts = products.filter(p => {
        const totalStock = p.stockBatches?.reduce((sum, batch) => sum + batch.quantity, 0) || 0;
        // Assuming a reorder point of 0 if not specified
        return totalStock <= (p.reorderPoint || 0);
    });

    const lowStockComponents = components.filter(c => {
        const totalStock = c.stockBatches?.reduce((sum, batch) => sum + batch.quantity, 0) || 0;
        return totalStock <= c.reorderPoint;
    });

    const totalLowStockItems = lowStockProducts.length + lowStockComponents.length;

    if (totalLowStockItems === 0) {
        return null; // Don't render anything if there are no warnings
    }

    return (
        <div className="glass-panel p-6 rounded-lg border border-yellow-600/50">
            <div className="flex items-start space-x-4">
                <AlertTriangle size={24} className="text-yellow-400 mt-1" />
                <div>
                    <h3 className="text-xl font-bold text-yellow-400">{t('lowStockAlert')}</h3>
                    <p className="text-sm text-custom-grey">{t('lowStockMessage', { count: totalLowStockItems })}</p>

                    <div className="mt-4 space-y-3">
                        {lowStockProducts.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-white flex items-center space-x-2"><Package size={16} /><span>{t('finishedProducts')}</span></h4>
                                <ul className="list-disc list-inside text-sm text-gray-300 mt-1">
                                    {lowStockProducts.map(p => (
                                        <li key={p.id}>
                                            <Link to={`/inventory/${p.id}`} className="hover:underline">{p.name}</Link> - {t('currentStock', { count: p.stockBatches?.reduce((s, b) => s + b.quantity, 0) || 0 })}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {lowStockComponents.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-white flex items-center space-x-2"><ClipboardList size={16} /><span>{t('components')}</span></h4>
                                <ul className="list-disc list-inside text-sm text-gray-300 mt-1">
                                    {lowStockComponents.map(c => (
                                        <li key={c.id}>
                                            <Link to={`/inventory/components/${c.id}`} className="hover:underline">{c.name}</Link> - {t('currentStock', { count: c.stockBatches?.reduce((s, b) => s + b.quantity, 0) || 0 })}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LowStockWarning;