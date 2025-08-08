import { createAsyncThunk } from '@reduxjs/toolkit';
import { createGenericSlice } from '../../app/createGenericSlice';
import { defaultDb } from '../../api/defaultDb';
import { storageService } from '../../services/storageService';
import { updateProduct } from '../inventory/productsSlice';
import { updateComponent } from '../inventory/componentsSlice';

export const executeProductionOrder = createAsyncThunk(
    'production/execute',
    async ({ productId, quantityToProduce }, { getState, dispatch, rejectWithValue }) => {
        const { products, components, productionOrders } = getState();
        const product = products.items.find(p => p.id === productId);

        if (!product || !product.bom || product.bom.length === 0) {
            return rejectWithValue('Product has no Bill of Materials.');
        }

        for (const bomItem of product.bom) {
            const component = components.items.find(c => c.id === bomItem.componentId);
            const requiredStock = bomItem.quantity * quantityToProduce;
            const totalStock = component.stockBatches?.reduce((sum, batch) => sum + batch.quantity, 0) || 0;
            if (totalStock < requiredStock) {
                return rejectWithValue(`Not enough ${component.name} in stock.`);
            }
        }

        const today = new Date();
        const newProdId = productionOrders.items.length + 1;

        const componentsUsedLog = [];
        for (const bomItem of product.bom) {
            const component = components.items.find(c => c.id === bomItem.componentId);
            let quantityToDeduct = bomItem.quantity * quantityToProduce;
            const updatedComponent = JSON.parse(JSON.stringify(component));
            
            for (const batch of updatedComponent.stockBatches) {
                if (quantityToDeduct <= 0) break;
                const amountToTake = Math.min(quantityToDeduct, batch.quantity);
                componentsUsedLog.push({ componentId: component.id, quantityUsed: amountToTake, supplierLotNumber: batch.supplierLotNumber });
                batch.quantity -= amountToTake;
                quantityToDeduct -= amountToTake;
            }
            updatedComponent.stockBatches = updatedComponent.stockBatches.filter(b => b.quantity > 0);
            dispatch(updateComponent(updatedComponent));
        }

        const expiryDate = new Date();
        expiryDate.setDate(today.getDate() + (product.shelfLifeDays || 90));
        const newBatch = {
            lotNumber: `LOT-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}-${newProdId}`,
            quantity: quantityToProduce,
            expiryDate: expiryDate.toISOString().split('T')[0]
        };
        const updatedProduct = JSON.parse(JSON.stringify(product));
        if (!updatedProduct.stockBatches) updatedProduct.stockBatches = [];
        updatedProduct.stockBatches.push(newBatch);
        dispatch(updateProduct(updatedProduct));

        return {
            productId: product.id,
            lotNumber: newBatch.lotNumber,
            quantityProduced: quantityToProduce,
            date: today.toISOString().split('T')[0],
            componentsUsed: componentsUsedLog
        };
    }
);

const persistedState = storageService.loadState();
const initialState = persistedState?.productionOrders?.items || defaultDb.productionOrders;

const productionOrdersSlice = createGenericSlice({
    name: 'productionOrders',
    initialState: initialState,
    extraReducers: (builder) => {
        builder.addCase(executeProductionOrder.fulfilled, (state, action) => {
            const newId = state.items.length > 0 ? Math.max(...state.items.map(i => i.id)) + 1 : 1;
            state.items.push({ ...action.payload, id: newId });
        });
    }
});

export const {
  addItem: addProductionOrder,
  updateItem: updateProductionOrder,
  deleteItem: deleteProductionOrder,
  setItems: setProductionOrders,
} = productionOrdersSlice.actions;

export default productionOrdersSlice.reducer;