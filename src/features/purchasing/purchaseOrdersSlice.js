import { createGenericSlice } from '../../app/createGenericSlice';
import { defaultDb } from '../../api/defaultDb';
import { storageService } from '../../services/storageService';

const persistedState = storageService.loadState();
const initialState = persistedState?.purchaseOrders?.items || defaultDb.purchaseOrders;

const purchaseOrdersSlice = createGenericSlice({
    name: 'purchaseOrders',
    initialState,
    // NEW: Add a custom `addItem` reducer to handle P.O. number generation
    reducers: {
        addItem: (state, action) => {
            const poCount = state.items.length + 1;
            const poNumber = `PO-${new Date().getFullYear()}-${String(poCount).padStart(3, '0')}`;
            const newId = state.items.length > 0 ? Math.max(...state.items.map(i => i.id)) + 1 : 1;
            state.items.push({ ...action.payload, id: newId, poNumber });
        },
    }
});

export const {
  addItem: addPurchaseOrder,
  updateItem: updatePurchaseOrder,
  deleteItem: deletePurchaseOrder,
  setItems: setPurchaseOrders,
} = purchaseOrdersSlice.actions;

export default purchaseOrdersSlice.reducer;