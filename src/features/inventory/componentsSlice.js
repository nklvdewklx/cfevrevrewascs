import { createAsyncThunk } from '@reduxjs/toolkit';
import { createGenericSlice } from '../../app/createGenericSlice';
import { defaultDb } from '../../api/defaultDb';
import { storageService } from '../../services/storageService';
import { updatePurchaseOrder } from '../purchasing/purchaseOrdersSlice';

// NEW THUNK for receiving stock
export const receiveStockForPO = createAsyncThunk(
    'components/receiveStock',
    async ({ purchaseOrder, receivedItems }, { dispatch }) => {
        // Step 1: Update each component with a new stock batch
        receivedItems.forEach(item => {
            const newBatch = {
                quantity: item.quantity,
                supplierLotNumber: item.supplierLotNumber,
                receivedDate: new Date().toISOString().split('T')[0]
            };
            dispatch(addComponentBatch({ componentId: item.componentId, newBatch }));
        });

        // Step 2: Mark the Purchase Order as fulfilled
        dispatch(updatePurchaseOrder({ ...purchaseOrder, status: 'fulfilled' }));

        return; 
    }
);

const persistedState = storageService.loadState();
const initialState = persistedState?.components?.items || defaultDb.components;

const componentsSlice = createGenericSlice({
    name: 'components',
    initialState: initialState,
    reducers: {
        addComponentBatch: (state, action) => {
            const { componentId, newBatch } = action.payload;
            const component = state.items.find(c => c.id === componentId);
            if (component) {
                if (!component.stockBatches) {
                    component.stockBatches = [];
                }
                component.stockBatches.push(newBatch);
            }
        },
        // NEW: Reducer for manual stock adjustment
        adjustComponentStock: (state, action) => {
            const { componentId, batchLotNumber, adjustmentType, quantity, reason } = action.payload;
            const component = state.items.find(c => c.id === componentId);
            if (component) {
                const batch = component.stockBatches.find(b => b.supplierLotNumber === batchLotNumber);
                if (batch) {
                    if (adjustmentType === 'add') {
                        batch.quantity += quantity;
                    } else {
                        batch.quantity -= quantity;
                    }
                    // Optional: Log the adjustment reason somewhere if needed in the future
                }
            }
        }
    }
});

export const {
  addComponentBatch,
  adjustComponentStock, // Export the new reducer
  addItem: addComponent,
  updateItem: updateComponent,
  deleteItem: deleteComponent,
  setItems: setComponents,
} = componentsSlice.actions;

export default componentsSlice.reducer;