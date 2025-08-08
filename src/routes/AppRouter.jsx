import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layouts and Pages
import MainLayout from '../components/layout/MainLayout';
import AgentLayout from '../components/layout/AgentLayout';
import POSLayout from '../components/layout/POSLayout';

import LoginPage from '../features/authentication/LoginPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import UnauthorizedPage from '../features/authentication/UnauthorizedPage';
import CustomersPage from '../features/customers/CustomersPage';
import OrdersPage from '../features/orders/OrdersPage';
import InvoicesPage from '../features/orders/InvoicesPage';
import ProductsPage from '../features/inventory/ProductsPage';
import ComponentsPage from '../features/inventory/ComponentsPage';
import SuppliersPage from '../features/purchasing/SuppliersPage';
import PurchaseOrdersPage from '../features/purchasing/PurchaseOrdersPage';
import ProductionOrdersPage from '../features/production/ProductionOrdersPage';
import ReportsPage from '../features/reports/ReportsPage';
import AgentsPage from '../features/users/AgentsPage';
import EmployeesPage from '../features/users/EmployeesPage';
import LeadsPage from '../features/sales/LeadsPage';
import QuotesPage from '../features/sales/QuotesPage';
import AgentHomePage from '../features/agent/AgentHomePage';
import AgentRoutePage from '../features/agent/AgentRoutePage';
import AgentOrderForm from '../features/agent/AgentOrderForm';
import AgentCustomersPage from '../features/agent/AgentCustomersPage';
import AgentCustomerDetailPage from '../features/agent/AgentCustomerDetailPage';
import POSPage from '../features/pos/POSPage';
import CustomerDetailsPage from '../features/customers/CustomerDetailsPage';
import AgentDetailsPage from '../features/users/AgentDetailsPage';
import OrderDetailPage from '../features/orders/OrderDetailPage';
import ProductionOrderDetailsPage from '../features/production/ProductionOrderDetailsPage';
import InvoiceDetailsPage from '../features/orders/InvoiceDetailsPage';
import SettingsPage from '../features/settings/SettingsPage';
import ProductDetailsPage from '../features/inventory/ProductDetailsPage';
import ComponentDetailsPage from '../features/inventory/ComponentDetailsPage'; // NEW: Import ComponentDetailsPage

import ProtectedRoute from './ProtectedRoute';

const AppRouter = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            <Route path="/pos" element={
                <ProtectedRoute roles={['admin', 'sales']}>
                    <POSLayout />
                </ProtectedRoute>
            }>
                <Route index element={<POSPage />} />
            </Route>

            <Route path="/" element={<ProtectedRoute roles={['admin', 'inventory', 'finance', 'sales']}><MainLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/dashboard" />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="leads" element={<LeadsPage />} />
                <Route path="quotes" element={<QuotesPage />} />
                <Route path="customers" element={<CustomersPage />} />
                <Route path="customers/:customerId" element={<CustomerDetailsPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="orders/:orderId" element={<OrderDetailPage />} />
                <Route path="invoices" element={<InvoicesPage />} />
                <Route path="invoices/:invoiceNumber" element={<InvoiceDetailsPage />} />
                <Route path="inventory" element={<ProductsPage />} />
                <Route path="inventory/components" element={<ComponentsPage />} />
                <Route path="inventory/components/:componentId" element={<ComponentDetailsPage />} /> {/* NEW: Component Details Route */}
                <Route path="inventory/:productId" element={<ProductDetailsPage />} />
                <Route path="suppliers" element={<SuppliersPage />} />
                <Route path="purchase-orders" element={<PurchaseOrdersPage />} />
                <Route path="production-orders" element={<ProductionOrdersPage />} />
                <Route path="production-orders/:productionOrderId" element={<ProductionOrderDetailsPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="agents" element={<ProtectedRoute roles={['admin']}><AgentsPage /></ProtectedRoute>} />
                <Route path="agents/:agentId" element={<ProtectedRoute roles={['admin']}><AgentDetailsPage /></ProtectedRoute>} />
                <Route path="employees" element={<ProtectedRoute roles={['admin']}><EmployeesPage /></ProtectedRoute>} />
                <Route path="settings" element={<ProtectedRoute roles={['admin']}><SettingsPage /></ProtectedRoute>} />
            </Route>

            <Route path="/agent" element={<ProtectedRoute roles={['sales']}><AgentLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/agent/home" />} />
                <Route path="home" element={<AgentHomePage />} />
                <Route path="route" element={<AgentRoutePage />} />
                <Route path="customers" element={<AgentCustomersPage />} />
                <Route path="customer/:customerId" element={<AgentCustomerDetailPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="new-order" element={<AgentOrderForm />} />
            </Route>

            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
    );
};

export default AppRouter;