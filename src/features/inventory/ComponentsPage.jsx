import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Edit, Trash2, Plus } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ComponentForm from './ComponentForm';
import { addComponent, updateComponent, deleteComponent } from './componentsSlice';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'; // NEW: Import Link

const ComponentsPage = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { items: components } = useSelector((state) => state.components);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingComponent, setEditingComponent] = useState(null);

    const handleOpenModal = (component = null) => {
        setEditingComponent(component);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingComponent(null);
        setIsModalOpen(false);
    };

    const handleSaveComponent = (data) => {
        if (editingComponent) {
            dispatch(updateComponent({ ...data, id: editingComponent.id }));
        } else {
            dispatch(addComponent({ ...data, stockBatches: [] }));
        }
        handleCloseModal();
    };

    const handleDelete = (componentId) => {
        if (window.confirm(t('confirmDeleteComponent'))) {
            dispatch(deleteComponent(componentId));
        }
    };

    const headers = [
        { key: 'name', label: t('componentName'), sortable: true },
        { key: 'cost', label: t('cost'), sortable: true },
        { key: 'totalStock', label: t('totalStock'), sortable: true },
        { key: 'reorderPoint', label: t('reorderPoint'), sortable: true },
        { key: 'actions', label: t('actions'), sortable: false },
    ];

    const renderRow = (component) => {
        const totalStock = component.stockBatches?.reduce((sum, batch) => sum + batch.quantity, 0) || 0;
        return (
            <tr key={component.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/5">
                <td className="p-4">
                    {/* UPDATED: Link to component detail page */}
                    <Link to={`/inventory/components/${component.id}`} className="text-blue-400 hover:underline">
                        {component.name}
                    </Link>
                </td>
                <td className="p-4">${component.cost.toFixed(2)}</td>
                <td className="p-4 font-semibold">{totalStock}</td>
                <td className="p-4">{component.reorderPoint}</td>
                <td className="p-4">
                    <div className="flex space-x-4">
                        <Button onClick={() => handleOpenModal(component)} variant="ghost-glow" size="sm" className="text-custom-light-blue" title={t('edit')}><Edit size={16} /></Button>
                        <Button onClick={() => handleDelete(component.id)} variant="ghost-glow" size="sm" className="text-red-400" title={t('delete')}><Trash2 size={16} /></Button>
                    </div>
                </td>
            </tr>
        );
    };

    const componentsWithStock = components.map(c => ({
        ...c,
        totalStock: c.stockBatches?.reduce((sum, batch) => sum + batch.quantity, 0) || 0,
    }));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">{t('manageComponents')}</h1>
                <Button onClick={() => handleOpenModal()} variant="primary" className="flex items-center space-x-2" size="sm">
                    <Plus size={20} />
                    <span>{t('newComponent')}</span>
                </Button>
            </div>
            <DataTable headers={headers} data={componentsWithStock} renderRow={renderRow} />
            <Modal title={editingComponent ? t('editComponent') : t('newComponent')} isOpen={isModalOpen} onClose={handleCloseModal} footer={<></>}>
                <ComponentForm component={editingComponent} onSave={handleSaveComponent} onCancel={handleCloseModal} />
            </Modal>
        </div>
    );
};

export default ComponentsPage;