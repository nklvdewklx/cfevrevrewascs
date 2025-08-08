import { createAsyncThunk } from '@reduxjs/toolkit';
import { createGenericSlice } from '../../app/createGenericSlice';
import { defaultDb } from '../../api/defaultDb';
import { storageService } from '../../services/storageService';
import { updatePurchaseOrder } from '../purchasing/purchaseOrdersSlice';
import { addLedgerEntry } from './inventoryLedgerSlice';

export const receiveStockForPO = createAsyncThunk(
    'components/receiveStock',
    async ({ purchaseOrder, receivedItems }, { dispatch, getState }) => {
        const { auth } = getState();
        const userId = auth.user?.id;

        receivedItems.forEach(item => {
            const newBatch = {
                quantity: item.quantity,
                supplierLotNumber: item.supplierLotNumber,
                receivedDate: new Date().toISOString().split('T')[0]
            };
            dispatch(addComponentBatch({ componentId: item.componentId, newBatch }));
            
            // NEW: Log this action to the inventory ledger
            dispatch(addLedgerEntry({
                itemType: 'component',
                itemId: item.componentId,
                quantityChange: item.quantity,
                reason: `Received from PO #${purchaseOrder.poNumber}`,
                userId
            }));
        });
        dispatch(updatePurchaseOrder({ ...purchaseOrder, status: 'fulfilled' }));
    }
);

export const manuallyAdjustComponentStock = createAsyncThunk(
    'components/manualAdjustStock',
    (adjustmentData, { dispatch }) => {
        dispatch(addLedgerEntry({
            itemType: 'component',
            itemId: adjustmentData.componentId,
            quantityChange: adjustmentData.adjustmentType === 'add' ? adjustmentData.quantity : -adjustmentData.quantity,
            reason: `Manual Adjustment: ${adjustmentData.reason}`,
            userId: adjustmentData.userId
        }));
        dispatch(applyStockAdjustment(adjustmentData));
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
                if (!component.stockBatches) component.stockBatches = [];
                component.stockBatches.push(newBatch);
            }
        },
        applyStockAdjustment: (state, action) => {
            const { componentId, batchLotNumber, adjustmentType, quantity } = action.payload;
            const component = state.items.find(c => c.id === componentId);
            if (component) {
                const batch = component.stockBatches.find(b => b.supplierLotNumber === batchLotNumber);
                if (batch) {
                    batch.quantity += (adjustmentType === 'add' ? quantity : -quantity);
                }
            }
        }
    }
});

export const {
  addComponentBatch,
  applyStockAdjustment,
  addItem: addComponent,
  updateItem: updateComponent,
  deleteItem: deleteComponent,
  setItems: setComponents,
} = componentsSlice.actions;

export default componentsSlice.reducer;