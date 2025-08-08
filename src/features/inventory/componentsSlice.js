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
            // Dispatch a special reducer to add a batch to a component
            dispatch(addComponentBatch({ componentId: item.componentId, newBatch }));
        });

        // Step 2: Mark the Purchase Order as fulfilled
        dispatch(updatePurchaseOrder({ ...purchaseOrder, status: 'fulfilled' }));

        return; // No value needs to be returned to the reducer
    }
);

const persistedState = storageService.loadState();
const initialState = persistedState?.components?.items || defaultDb.components;

const componentsSlice = createGenericSlice({
    name: 'components',
    initialState: initialState,
    // Add a new custom reducer to handle adding a stock batch
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
        }
    }
});

export const {
  addComponentBatch, // Export the new reducer
  addItem: addComponent,
  updateItem: updateComponent,
  deleteItem: deleteComponent,
  setItems: setComponents,
} = componentsSlice.actions;

export default componentsSlice.reducer;