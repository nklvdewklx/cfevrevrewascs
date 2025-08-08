import { configureStore } from '@reduxjs/toolkit';
import { storageService } from '../services/storageService';

import authReducer from '../features/authentication/authSlice';
import agentsReducer from '../features/users/agentsSlice';
import employeesReducer from '../features/users/employeesSlice';
import customersReducer from '../features/customers/customersSlice';
import productsReducer from '../features/inventory/productsSlice';
import componentsReducer from '../features/inventory/componentsSlice';
import ordersReducer from '../features/orders/ordersSlice';
import quotesReducer from '../features/orders/quotesSlice';
import invoicesReducer from '../features/orders/invoicesSlice';
import suppliersReducer from '../features/purchasing/suppliersSlice';
import purchaseOrdersReducer from '../features/purchasing/purchaseOrdersSlice';
import productionOrdersReducer from '../features/production/productionOrdersSlice';
import leadsReducer from '../features/sales/leadsSlice';
import approvalsReducer from '../features/approvals/approvalsSlice';
import posReducer from '../features/pos/posSlice'; 
import settingsReducer from '../features/settings/settingsSlice';
import inventoryLedgerReducer from '../features/inventory/inventoryLedgerSlice'; // UPDATED: Import the new ledger slice

const preloadedState = storageService.loadState();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    agents: agentsReducer,
    employees: employeesReducer,
    customers: customersReducer,
    products: productsReducer,
    components: componentsReducer,
    orders: ordersReducer,
    quotes: quotesReducer,
    invoices: invoicesReducer,
    suppliers: suppliersReducer,
    purchaseOrders: purchaseOrdersReducer,
    productionOrders: productionOrdersReducer,
    leads: leadsReducer,
    approvals: approvalsReducer,
    pos: posReducer, 
    settings: settingsReducer,
    inventoryLedger: inventoryLedgerReducer, // UPDATED: Add the new ledger reducer
  },
  preloadedState,
});

store.subscribe(() => {
    storageService.saveState(store.getState());
});