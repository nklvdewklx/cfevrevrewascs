import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Edit, Trash2, Plus } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import SupplierForm from './SupplierForm';
import { addSupplier, updateSupplier, deleteSupplier } from './suppliersSlice';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next';

const SuppliersPage = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const suppliers = useSelector((state) => state.suppliers.items);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);

    const handleOpenModal = (supplier = null) => {
        setEditingSupplier(supplier);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingSupplier(null);
        setIsModalOpen(false);
    };

    const handleSaveSupplier = (data) => {
        if (editingSupplier) {
            dispatch(updateSupplier({ ...data, id: editingSupplier.id }));
        } else {
            dispatch(addSupplier(data));
        }
        handleCloseModal();
    };

    const handleDelete = (supplierId) => {
        if (window.confirm(t('confirmDeleteSupplier'))) {
            dispatch(deleteSupplier(supplierId));
        }
    };

    const headers = [
        { key: 'name', label: t('companyName'), sortable: true },
        { key: 'contactPerson', label: t('contactPerson'), sortable: true },
        { key: 'email', label: t('email'), sortable: true },
        { key: 'phone', label: t('phone'), sortable: false },
        { key: 'actions', label: t('actions'), sortable: false },
    ];

    const renderRow = (supplier) => (
        <tr key={supplier.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/5">
            <td className="p-4">{supplier.name}</td>
            <td className="p-4">{supplier.contactPerson}</td>
            <td className="p-4">{supplier.email}</td>
            <td className="p-4">{supplier.phone}</td>
            <td className="p-4">
                <div className="flex space-x-4">
                    <Button onClick={() => handleOpenModal(supplier)} variant="ghost-glow" size="sm"><Edit size={16} className="text-custom-light-blue" /></Button>
                    <Button onClick={() => handleDelete(supplier.id)} variant="ghost-glow" size="sm"><Trash2 size={16} className="text-red-400" /></Button>
                </div>
            </td>
        </tr>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">{t('manageSuppliers')}</h1>
                <Button onClick={() => handleOpenModal()} variant="primary" className="flex items-center space-x-2" size="sm">
                    <Plus size={20} />
                    <span>{t('newSupplier')}</span>
                </Button>
            </div>
            <DataTable headers={headers} data={suppliers} renderRow={renderRow} />
            <Modal title={editingSupplier ? t('editSupplier') : t('addNewSupplier')} isOpen={isModalOpen} onClose={handleCloseModal} footer={<></>}>
                <SupplierForm supplier={editingSupplier} onSave={handleSaveSupplier} onCancel={handleCloseModal} />
            </Modal>
        </div>
    );
};

export default SuppliersPage;