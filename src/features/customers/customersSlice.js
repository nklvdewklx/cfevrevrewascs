import { createGenericSlice } from '../../app/createGenericSlice';
import { defaultDb } from '../../api/defaultDb';
import { storageService } from '../../services/storageService';

const persistedState = storageService.loadState();
const initialState = persistedState?.customers?.items || defaultDb.customers;

const customersSlice = createGenericSlice({
    name: 'customers',
    initialState,
});

export const {
  addItem: addCustomer,
  updateItem: updateCustomer,
  deleteItem: deleteCustomer,
  setItems: setCustomers,
} = customersSlice.actions;

export default customersSlice.reducer;