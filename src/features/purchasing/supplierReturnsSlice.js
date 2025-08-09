import { createGenericSlice } from '../../app/createGenericSlice';
import { storageService } from '../../services/storageService';

const persistedState = storageService.loadState();
const initialState = persistedState?.supplierReturns?.items || [];

const supplierReturnsSlice = createGenericSlice({
    name: 'supplierReturns',
    initialState,
    reducers: {}
});

export const {
  addItem: addSupplierReturn,
  updateItem: updateSupplierReturn,
  deleteItem: deleteSupplierReturn,
} = supplierReturnsSlice.actions;

export default supplierReturnsSlice.reducer;