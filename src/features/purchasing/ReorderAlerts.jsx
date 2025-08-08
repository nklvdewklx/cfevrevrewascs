import React from 'react';
import { useSelector } from 'react-redux';
import { AlertCircle } from 'lucide-react';

const ReorderAlerts = () => {
    const components = useSelector((state) => state.components.items);

    // Calculate total stock and find components below reorder point
    const alerts = components
        .map(c => {
            const totalStock = c.stockBatches.reduce((sum, batch) => sum + batch.quantity, 0);
            return {
                ...c,
                totalStock,
                needsReorder: totalStock <= (c.reorderPoint || 0)
            };
        })
        .filter(c => c.needsReorder)
        .sort((a, b) => a.totalStock - b.totalStock);

    if (alerts.length === 0) {
        return null; // Don't render if there are no alerts
    }

    return (
        <div className="bg-red-900/50 p-4 rounded-lg border border-red-700 space-y-2">
            <div className="flex items-center space-x-2 text-red-300">
                <AlertCircle size={20} />
                <h3 className="font-semibold text-lg">Reorder Alerts ({alerts.length})</h3>
            </div>
            <p className="text-sm text-red-200">The following components are below their reorder point and need to be replenished:</p>
            <ul className="text-sm text-white space-y-1">
                {alerts.map(c => (
                    <li key={c.id}>
                        <span className="font-semibold">{c.name}</span>: Current Stock {c.totalStock} / Reorder Point {c.reorderPoint}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReorderAlerts;