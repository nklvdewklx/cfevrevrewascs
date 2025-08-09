import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, CheckSquare, XSquare } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import SupplierReturnForm from './SupplierReturnForm';
import { addSupplierReturn, updateSupplierReturn } from './supplierReturnsSlice';
import { processSupplierReturn } from '../inventory/componentsSlice';
import { showToast } from '../../lib/toast';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'; // NEW

const SupplierReturnsPage = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { items: supplierReturns } = useSelector((state) => state.supplierReturns);
    const { items: suppliers } = useSelector((state) => state.suppliers);
    const { items: components } = useSelector((state) => state.components);
    const { user } = useSelector((state) => state.auth);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleSaveReturn = (returnData) => {
        const returnCount = supplierReturns.length + 1;
        const newReturn = {
            ...returnData,
            supplierId: parseInt(returnData.supplierId, 10),
            srmaNumber: `SRMA-${new Date().getFullYear()}-${String(returnCount).padStart(4, '0')}`,
            status: 'pending',
            date: new Date().toISOString().split('T')[0],
            requestedBy: user.id,
        };
        dispatch(addSupplierReturn(newReturn));
        showToast(t('supplierReturnRequestCreated'), 'success');
        handleCloseModal();
    };

    const handleProcessReturn = (srma) => {
        if (window.confirm(t('confirmProcessSupplierReturn', { srmaNumber: srma.srmaNumber }))) {
            try {
                dispatch(processSupplierReturn({ supplierReturn: srma, userId: user.id })).unwrap();
                showToast(t('supplierReturnProcessed'), 'success');
            } catch (error) {
                showToast(t('supplierReturnFailed', { error: error.message }), 'error');
            }
        }
    };

    const headers = [
        { key: 'srmaNumber', label: t('srmaNumber'), sortable: true },
        { key: 'supplier', label: t('supplier'), sortable: true },
        { key: 'date', label: t('date'), sortable: true },
        { key: 'status', label: t('status'), sortable: true },
        { key: 'actions', label: t('actions'), sortable: false },
    ];

    const renderRow = (srma) => {
        const supplier = suppliers.find(s => s.id === srma.supplierId);
        const statusColors = { pending: 'status-pending', processed: 'status-completed', rejected: 'status-cancelled' };
        return (
            <tr key={srma.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/5">
                <td className="p-4 font-mono">
                    {/* MODIFIED */}
                    <Link to={`/supplier-returns/${srma.srmaNumber}`} className="text-blue-400 hover:underline">
                        {srma.srmaNumber}
                    </Link>
                </td>
                <td className="p-4">{supplier?.name || 'N/A'}</td>
                <td className="p-4">{srma.date}</td>
                <td className="p-4"><span className={`status-pill ${statusColors[srma.status]}`}>{t(srma.status)}</span></td>
                <td className="p-4">
                    <div className="flex space-x-2">
                        {srma.status === 'pending' && (
                            <Button onClick={() => handleProcessReturn(srma)} variant="ghost-glow" size="sm" className="text-green-400" title={t('processReturn')}>
                                <CheckSquare size={16} />
                            </Button>
                        )}
                    </div>
                </td>
            </tr>
        );
    };

    const returnsWithSupplier = supplierReturns.map(srma => {
        const supplier = suppliers.find(s => s.id === srma.supplierId);
        return { ...srma, supplier: supplier?.name || 'N/A' };
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">{t('manageSupplierReturns')}</h1>
                <Button onClick={handleOpenModal} variant="primary" className="flex items-center space-x-2">
                    <Plus size={20} />
                    <span>{t('newSupplierReturn')}</span>
                </Button>
            </div>

            <DataTable headers={headers} data={returnsWithSupplier} renderRow={renderRow} />

            <Modal title={t('newSupplierReturn')} isOpen={isModalOpen} onClose={handleCloseModal} footer={<></>}>
                <SupplierReturnForm
                    onSave={handleSaveReturn}
                    onCancel={handleCloseModal}
                    suppliers={suppliers}
                    components={components}
                />
            </Modal>
        </div>
    );
};

export default SupplierReturnsPage;