import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createGenericSlice } from '../../app/createGenericSlice';
import { defaultDb } from '../../api/defaultDb';
import { storageService } from '../../services/storageService';

// Thunk for creating a backorder
export const createBackorder = createAsyncThunk(
    'orders/createBackorder',
    (fulfillmentData, { getState, dispatch }) => {
        const { orders } = getState();
        const originalOrder = orders.items.find(o => o.id === fulfillmentData.orderId);
        if (!originalOrder) return;

        const shippedItems = [];
        const backorderedItems = [];

        originalOrder.items.forEach(originalItem => {
            const fulfilledAmount = fulfillmentData.fulfilledItems.find(fi => fi.productId === originalItem.productId)?.quantity || 0;
            
            if (fulfilledAmount > 0) {
                shippedItems.push({ ...originalItem, quantity: fulfilledAmount });
            }
            if (fulfilledAmount < originalItem.quantity) {
                backorderedItems.push({ ...originalItem, quantity: originalItem.quantity - fulfilledAmount });
            }
        });

        const newBackorder = {
            ...originalOrder,
            id: Math.max(...orders.items.map(o => o.id)) + 1, // Generate a new ID
            items: backorderedItems,
            status: 'backorder',
            originalOrderId: originalOrder.id,
            backorderId: null, // Clear any previous link
            fulfilledItems: [] 
        };

        // Update the original order
        dispatch(ordersSlice.actions.updateItem({ 
            ...originalOrder, 
            items: shippedItems, 
            backorderId: newBackorder.id, 
            status: 'completed' // Original order is now considered complete
        }));
        
        // Add the new backorder
        dispatch(ordersSlice.actions.addItem(newBackorder));
    }
);


const persistedState = storageService.loadState();
const initialState = persistedState?.orders?.items || defaultDb.orders;

const ordersSlice = createGenericSlice({
    name: 'orders',
    initialState,
    reducers: {
        updateFulfilledItems: (state, action) => {
            const { orderId, fulfilledItems } = action.payload;
            const order = state.items.find(o => o.id === orderId);
            if (order) {
                if (!order.fulfilledItems) {
                    order.fulfilledItems = [];
                }

                fulfilledItems.forEach(newItem => {
                    const existingItem = order.fulfilledItems.find(fi => fi.productId === newItem.productId);
                    if (existingItem) {
                        existingItem.quantity += newItem.quantity;
                    } else {
                        order.fulfilledItems.push(newItem);
                    }
                });
            }
        }
    }
});

export const {
  addItem: addOrder,
  updateItem: updateOrder,
  deleteItem: deleteOrder,
  setItems: setOrders,
  updateFulfilledItems
} = ordersSlice.actions;

export default ordersSlice.reducer;