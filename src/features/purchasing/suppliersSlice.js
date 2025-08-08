import { createGenericSlice } from '../../app/createGenericSlice';
import { defaultDb } from '../../api/defaultDb';
import { storageService } from '../../services/storageService';

const persistedState = storageService.loadState();
const initialState = persistedState?.suppliers?.items || defaultDb.suppliers;

const suppliersSlice = createGenericSlice({
    name: 'suppliers',
    initialState,
});

export const {
  addItem: addSupplier,
  updateItem: updateSupplier,
  deleteItem: deleteSupplier,
  setItems: setSuppliers,
} = suppliersSlice.actions;

export default suppliersSlice.reducer;