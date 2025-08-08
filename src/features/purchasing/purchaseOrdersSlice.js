import { createGenericSlice } from '../../app/createGenericSlice';
import { defaultDb } from '../../api/defaultDb';
import { storageService } from '../../services/storageService';

const persistedState = storageService.loadState();
const initialState = persistedState?.purchaseOrders?.items || defaultDb.purchaseOrders;

const purchaseOrdersSlice = createGenericSlice({
    name: 'purchaseOrders',
    initialState,
});

export const {
  addItem: addPurchaseOrder,
  updateItem: updatePurchaseOrder,
  deleteItem: deletePurchaseOrder,
  setItems: setPurchaseOrders,
} = purchaseOrdersSlice.actions;

export default purchaseOrdersSlice.reducer;