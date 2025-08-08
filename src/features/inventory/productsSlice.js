import { createAsyncThunk } from '@reduxjs/toolkit';
import { createGenericSlice } from '../../app/createGenericSlice';
import { defaultDb } from '../../api/defaultDb';
import { storageService } from '../../services/storageService';
import { addLedgerEntry } from './inventoryLedgerSlice';

// A dedicated thunk for simple sales (like POS) that uses automated FEFO depletion.
export const adjustStockForSale = createAsyncThunk(
    'inventory/adjustStockForSale',
    async (order, { getState, dispatch, rejectWithValue }) => {
        const { products, auth } = getState();
        const userId = auth.user?.id;
        const productsToUpdate = [];

        for (const item of order.items) {
            const product = products.items.find(p => p.id === item.productId);
            if (!product) return rejectWithValue(`Product with ID ${item.productId} not found.`);

            let quantityToFulfill = item.quantity;
            const totalStock = product.stockBatches?.reduce((sum, batch) => sum + batch.quantity, 0) || 0;
            if (totalStock < quantityToFulfill) return rejectWithValue(`Not enough stock for ${product.name}.`);

            const updatedProduct = JSON.parse(JSON.stringify(product));
            const sortedBatches = updatedProduct.stockBatches.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

            for (const batch of sortedBatches) {
                if (quantityToFulfill <= 0) break;
                const amountToTake = Math.min(quantityToFulfill, batch.quantity);
                batch.quantity -= amountToTake;
                quantityToFulfill -= amountToTake;

                dispatch(addLedgerEntry({
                    itemType: 'product',
                    itemId: item.productId,
                    quantityChange: -amountToTake,
                    reason: `Sale - Order #${order.id || 'POS'} (Batch: ${batch.lotNumber})`,
                    userId
                }));
            }
            updatedProduct.stockBatches = sortedBatches.filter(batch => batch.quantity > 0);
            productsToUpdate.push(updatedProduct);
        }
        return productsToUpdate;
    }
);

export const fulfillOrderWithSpecificBatches = createAsyncThunk(
    'inventory/fulfillOrderWithSpecificBatches',
    async ({ order, fulfillmentData }, { getState, dispatch, rejectWithValue }) => {
        const { products, auth } = getState();
        const userId = auth.user?.id;
        const productsToUpdate = [];

        for (const fulfilledItem of fulfillmentData.items) {
            const product = products.items.find(p => p.id === fulfilledItem.productId);
            if (!product) return rejectWithValue(`Product with ID ${fulfilledItem.productId} not found.`);

            const updatedProduct = JSON.parse(JSON.stringify(product));

            for (const allocation of fulfilledItem.allocations) {
                if (allocation.allocated > 0) {
                    const batch = updatedProduct.stockBatches.find(b => b.lotNumber === allocation.lotNumber);
                    if (!batch || batch.quantity < allocation.allocated) {
                        return rejectWithValue(`Insufficient stock in batch ${allocation.lotNumber} for ${product.name}.`);
                    }
                    
                    batch.quantity -= allocation.allocated;

                    dispatch(addLedgerEntry({
                        itemType: 'product',
                        itemId: fulfilledItem.productId,
                        quantityChange: -allocation.allocated,
                        reason: `Sale - Order #${order.id} (Batch: ${allocation.lotNumber})`,
                        userId
                    }));
                }
            }
            updatedProduct.stockBatches = updatedProduct.stockBatches.filter(batch => batch.quantity > 0);
            productsToUpdate.push(updatedProduct);
        }
        
        return productsToUpdate;
    }
);

const persistedState = storageService.loadState();
// CORRECTED: Point to defaultDb.inventory instead of the non-existent defaultDb.products
const initialState = persistedState?.products?.items || defaultDb.inventory; 

const productsSlice = createGenericSlice({
    name: 'products',
    initialState: initialState,
    reducers: {
        archiveProduct: (state, action) => {
            const { id, isArchived } = action.payload;
            const product = state.items.find(p => p.id === id);
            if (product) {
                product.status = isArchived ? 'archived' : 'active';
            }
        },
        addItem: (state, action) => {
            const newId = state.items.length > 0 ? Math.max(...state.items.map(i => i.id)) + 1 : 1;
            state.items.push({ ...action.payload, id: newId, status: 'active', reorderPoint: 0 });
        },
        addProductBatch: (state, action) => {
            const { productId, newBatch } = action.payload;
            const product = state.items.find(p => p.id === productId);
            if (product) {
                if (!product.stockBatches) {
                    product.stockBatches = [];
                }
                product.stockBatches.push(newBatch);
            }
        },
        updateStockBatch: (state, action) => {
            const { productId, lotNumber, updates } = action.payload;
            const product = state.items.find(p => p.id === productId);
            if (product && product.stockBatches) {
                const batchIndex = product.stockBatches.findIndex(b => b.lotNumber === lotNumber);
                if (batchIndex !== -1) {
                    product.stockBatches[batchIndex] = { ...product.stockBatches[batchIndex], ...updates };
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fulfillOrderWithSpecificBatches.fulfilled, (state, action) => {
                state.status = 'succeeded';
                action.payload.forEach(updatedProduct => {
                    const index = state.items.findIndex(p => p.id === updatedProduct.id);
                    if (index !== -1) {
                        state.items[index] = updatedProduct;
                    }
                });
            })
            .addCase(adjustStockForSale.fulfilled, (state, action) => {
                state.status = 'succeeded';
                action.payload.forEach(updatedProduct => {
                    const index = state.items.findIndex(p => p.id === updatedProduct.id);
                    if (index !== -1) {
                        state.items[index] = updatedProduct;
                    }
                });
            })
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => { state.status = 'loading'; }
            )
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.status = 'failed';
                    state.error = action.payload;
                }
            );
    }
});

export const {
  addItem: addProduct,
  updateItem: updateProduct,
  deleteItem: deleteProduct,
  archiveProduct,
  setItems: setProducts,
  addProductBatch,
  updateStockBatch,
} = productsSlice.actions;

export default productsSlice.reducer;