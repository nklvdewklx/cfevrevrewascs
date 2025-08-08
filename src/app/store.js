import { configureStore } from '@reduxjs/toolkit';
import { storageService } from '../services/storageService';

// Import all of your slice reducers
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

// Load the persisted state from local storage
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
  },
  preloadedState, // Initialize the store with the persisted state
});

// Subscribe to store updates to save the state to localStorage
store.subscribe(() => {
    storageService.saveState(store.getState());
});