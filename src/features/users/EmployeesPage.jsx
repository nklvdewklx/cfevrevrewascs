import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Edit, Trash2, Plus } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import EmployeeForm from './EmployeeForm';
import { addEmployee, updateEmployee, deleteEmployee } from './employeesSlice';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next'; // NEW: Import useTranslation

const EmployeesPage = () => {
    const { t } = useTranslation(); // NEW: Get translation function
    const dispatch = useDispatch();
    const { items: employees } = useSelector((state) => state.employees);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);

    const handleOpenModal = (employee = null) => {
        setEditingEmployee(employee);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingEmployee(null);
        setIsModalOpen(false);
    };

    const handleSaveEmployee = (data) => {
        if (editingEmployee) {
            dispatch(updateEmployee({ ...data, id: editingEmployee.id }));
        } else {
            dispatch(addEmployee(data));
        }
        handleCloseModal();
    };

    const handleDelete = (employeeId) => {
        if (window.confirm(t('confirmDeleteEmployee'))) { // NEW: Translate confirmation message
            dispatch(deleteEmployee(employeeId));
        }
    };

    const headers = [
        { key: 'name', label: t('name'), sortable: true },
        { key: 'department', label: t('department'), sortable: true },
        { key: 'role', label: t('role'), sortable: true },
        { key: 'email', label: t('email'), sortable: true },
        { key: 'actions', label: t('actions'), sortable: false },
    ];

    const renderRow = (employee) => (
        <tr key={employee.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/5">
            <td className="p-4">{employee.name}</td>
            <td className="p-4">{employee.department}</td>
            <td className="p-4">{employee.role}</td>
            <td className="p-4">{employee.email}</td>
            <td className="p-4">
                <div className="flex space-x-4">
                    <Button onClick={() => handleOpenModal(employee)} variant="ghost-glow" size="sm" className="text-custom-light-blue" title={t('edit')}><Edit size={16} /></Button>
                    <Button onClick={() => handleDelete(employee.id)} variant="ghost-glow" size="sm" className="text-red-400" title={t('delete')}><Trash2 size={16} /></Button>
                </div>
            </td>
        </tr>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">{t('manageEmployees')}</h1>
                <Button onClick={() => handleOpenModal()} variant="primary" className="flex items-center space-x-2" size="sm">
                    <Plus size={20} />
                    <span>{t('newEmployee')}</span>
                </Button>
            </div>
            <DataTable headers={headers} data={employees} renderRow={renderRow} />
            <Modal title={editingEmployee ? t('editEmployee') : t('addEmployee')} isOpen={isModalOpen} onClose={handleCloseModal} footer={<></>}>
                <EmployeeForm employee={editingEmployee} onSave={handleSaveEmployee} onCancel={handleCloseModal} />
            </Modal>
        </div>
    );
};

export default EmployeesPage;