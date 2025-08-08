import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Edit, Trash2, Plus } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import EmployeeForm from './EmployeeForm';
import { addEmployee, updateEmployee, deleteEmployee } from './employeesSlice';

const EmployeesPage = () => {
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
        if (window.confirm('Are you sure you want to delete this employee record?')) {
            dispatch(deleteEmployee(employeeId));
        }
    };

    const headers = ['Name', 'Department', 'Role', 'Email', 'Actions'];

    const renderRow = (employee) => (
        <tr key={employee.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/5">
            <td className="p-4">{employee.name}</td>
            <td className="p-4">{employee.department}</td>
            <td className="p-4">{employee.role}</td>
            <td className="p-4">{employee.email}</td>
            <td className="p-4">
                <div className="flex space-x-4">
                    <button onClick={() => handleOpenModal(employee)} className="text-custom-light-blue hover:text-white"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(employee.id)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                </div>
            </td>
        </tr>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Manage Employees</h1>
                <button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2">
                    <Plus size={20} />
                    <span>New Employee</span>
                </button>
            </div>
            <DataTable headers={headers} data={employees} renderRow={renderRow} />
            <Modal title={editingEmployee ? 'Edit Employee' : 'Add New Employee'} isOpen={isModalOpen} onClose={handleCloseModal} footer={<></>}>
                <EmployeeForm employee={editingEmployee} onSave={handleSaveEmployee} onCancel={handleCloseModal} />
            </Modal>
        </div>
    );
};

export default EmployeesPage;