import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Edit, Trash2, Plus } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import SupplierForm from './SupplierForm';
import { addSupplier, updateSupplier, deleteSupplier } from './suppliersSlice';

const SuppliersPage = () => {
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
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            dispatch(deleteSupplier(supplierId));
        }
    };

    const headers = ['Company Name', 'Contact Person', 'Email', 'Phone', 'Actions'];

    const renderRow = (supplier) => (
        <tr key={supplier.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/5">
            <td className="p-4">{supplier.name}</td>
            <td className="p-4">{supplier.contactPerson}</td>
            <td className="p-4">{supplier.email}</td>
            <td className="p-4">{supplier.phone}</td>
            <td className="p-4">
                <div className="flex space-x-4">
                    <button onClick={() => handleOpenModal(supplier)} className="text-custom-light-blue hover:text-white"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(supplier.id)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                </div>
            </td>
        </tr>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Manage Suppliers</h1>
                <button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2">
                    <Plus size={20} />
                    <span>New Supplier</span>
                </button>
            </div>
            <DataTable headers={headers} data={suppliers} renderRow={renderRow} />
            <Modal title={editingSupplier ? 'Edit Supplier' : 'Add New Supplier'} isOpen={isModalOpen} onClose={handleCloseModal} footer={<></>}>
                <SupplierForm supplier={editingSupplier} onSave={handleSaveSupplier} onCancel={handleCloseModal} />
            </Modal>
        </div>
    );
};

export default SuppliersPage;