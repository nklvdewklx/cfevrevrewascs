import React from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import { useTranslation } from 'react-i18next';

const SupplierReturnDetailsPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { srmaNumber } = useParams();

    const { items: supplierReturns } = useSelector((state) => state.supplierReturns);
    const { items: suppliers } = useSelector((state) => state.suppliers);
    const { items: components } = useSelector((state) => state.components);

    const supplierReturn = supplierReturns.find(sr => sr.srmaNumber === srmaNumber);

    if (!supplierReturn) {
        return <div className="text-center text-red-400">{t('supplierReturnNotFound')}</div>;
    }

    const supplier = suppliers.find(s => s.id === supplierReturn.supplierId);

    const itemHeaders = [
        { key: 'componentName', label: t('component'), sortable: false },
        { key: 'supplierLotNumber', label: t('supplierLotNumber'), sortable: false },
        { key: 'quantity', label: t('quantity'), sortable: false },
    ];

    const renderItemRow = (item) => {
        const component = components.find(c => c.id === item.componentId);
        return (
            <tr key={`${item.componentId}-${item.supplierLotNumber}`} className="border-b border-white/10 last:border-b-0">
                <td className="p-4">
                    <Link to={`/inventory/components/${item.componentId}`} className="text-blue-400 hover:underline">
                        {component?.name || 'N/A'}
                    </Link>
                </td>
                <td className="p-4 font-mono">{item.supplierLotNumber}</td>
                <td className="p-4">{item.quantity}</td>
            </tr>
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-custom-light-blue mb-4">
                    <ArrowLeft size={18} />
                    <span>{t('backToSupplierReturns')}</span>
                </button>
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white">{t('supplierReturnDetails')}: {supplierReturn.srmaNumber}</h2>
                    <span className={`status-pill ${supplierReturn.status === 'processed' ? 'status-completed' : 'status-pending'}`}>{t(supplierReturn.status)}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-custom-light-blue mb-2">{t('supplier')}</h3>
                    <Link to={`/suppliers`} className="text-xl font-bold text-white hover:underline">{supplier?.name || 'N/A'}</Link>
                    <p className="text-sm text-custom-grey">{supplier?.contactPerson}</p>
                </div>
                <div className="glass-panel p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-custom-light-blue mb-2">{t('details')}</h3>
                    <p className="text-sm"><span className="text-custom-grey">{t('date')}:</span> {supplierReturn.date}</p>
                    <p className="text-sm"><span className="text-custom-grey">{t('reason')}:</span> {supplierReturn.reason}</p>
                </div>
            </div>

            <div className="glass-panel p-4 rounded-lg">
                <h3 className="text-xl font-semibold text-custom-light-blue mb-4">{t('returnedItems')}</h3>
                <DataTable headers={itemHeaders} data={supplierReturn.items} renderRow={renderItemRow} />
            </div>
        </div>
    );
};

export default SupplierReturnDetailsPage;