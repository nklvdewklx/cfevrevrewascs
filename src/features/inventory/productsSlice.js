import { createAsyncThunk } from '@reduxjs/toolkit';
import { createGenericSlice } from '../../app/createGenericSlice';
import { defaultDb } from '../../api/defaultDb';
import { storageService } from '../../services/storageService';

// Thunk for adjusting stock.
export const adjustStockForOrder = createAsyncThunk(
    'inventory/adjustStockForOrder',
    async (order, { getState, rejectWithValue }) => {
        const { products } = getState(); // Corrected to get 'products' slice
        const productsToUpdate = [];
        
        for (const item of order.items) {
            const product = products.items.find(p => p.id === item.productId);
            if (!product) {
                return rejectWithValue(`Product with ID ${item.productId} not found.`);
            }

            let quantityToFulfill = item.quantity;
            const totalStock = product.stockBatches?.reduce((sum, batch) => sum + batch.quantity, 0) || 0;

            if (totalStock < quantityToFulfill) {
                return rejectWithValue(`Not enough stock for ${product.name}.`);
            }

            const updatedProduct = JSON.parse(JSON.stringify(product));
            
            const sortedBatches = updatedProduct.stockBatches.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

            for (const batch of sortedBatches) {
                if (quantityToFulfill <= 0) break;
                const amountToTake = Math.min(quantityToFulfill, batch.quantity);
                batch.quantity -= amountToTake;
                quantityToFulfill -= amountToTake;
            }
            updatedProduct.stockBatches = sortedBatches.filter(batch => batch.quantity > 0);
            productsToUpdate.push(updatedProduct);
        }
        
        return productsToUpdate;
    }
);

const persistedState = storageService.loadState();
const initialState = persistedState?.products?.items || defaultDb.inventory;

const productsSlice = createGenericSlice({
    name: 'products',
    initialState: initialState,
    extraReducers: (builder) => {
        builder
            .addCase(adjustStockForOrder.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(adjustStockForOrder.fulfilled, (state, action) => {
                state.status = 'succeeded';
                action.payload.forEach(updatedProduct => {
                    const index = state.items.findIndex(p => p.id === updatedProduct.id);
                    if (index !== -1) {
                        state.items[index] = updatedProduct;
                    }
                });
            })
            .addCase(adjustStockForOrder.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const {
  addItem: addProduct,
  updateItem: updateProduct,
  deleteItem: deleteProduct,
  setItems: setProducts,
} = productsSlice.actions;

export default productsSlice.reducer;