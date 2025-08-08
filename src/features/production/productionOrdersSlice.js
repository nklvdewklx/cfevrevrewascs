import { createAsyncThunk } from '@reduxjs/toolkit';
import { createGenericSlice } from '../../app/createGenericSlice';
import { defaultDb } from '../../api/defaultDb';
import { storageService } from '../../services/storageService';
import { updateProduct } from '../inventory/productsSlice';
import { updateComponent } from '../inventory/componentsSlice';
import { addLedgerEntry } from '../inventory/inventoryLedgerSlice';

export const executeProductionOrder = createAsyncThunk(
    'production/execute',
    async ({ productId, quantityToProduce }, { getState, dispatch, rejectWithValue }) => {
        const { products, components, productionOrders, auth } = getState();
        const userId = auth.user?.id;
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
        const dateString = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
        
        // UPDATED: Smarter LOT Number Generation Logic
        const dailySequence = productionOrders.items.filter(po => 
            po.productId === productId && po.date === today.toISOString().split('T')[0]
        ).length + 1;
        
        const lotNumber = `${product.sku}-${dateString}-${String(dailySequence).padStart(3, '0')}`;
        
        const reason = `Production Order for ${quantityToProduce}x ${product.name} (Lot: ${lotNumber})`;

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
            
            dispatch(addLedgerEntry({
                itemType: 'component',
                itemId: bomItem.componentId,
                quantityChange: -(bomItem.quantity * quantityToProduce),
                reason,
                userId
            }));
        }

        const expiryDate = new Date();
        expiryDate.setDate(today.getDate() + (product.shelfLifeDays || 90));
        const newBatch = {
            lotNumber,
            quantity: quantityToProduce,
            expiryDate: expiryDate.toISOString().split('T')[0]
        };
        const updatedProduct = JSON.parse(JSON.stringify(product));
        if (!updatedProduct.stockBatches) updatedProduct.stockBatches = [];
        updatedProduct.stockBatches.push(newBatch);
        dispatch(updateProduct(updatedProduct));
        
        dispatch(addLedgerEntry({
            itemType: 'product',
            itemId: product.id,
            quantityChange: quantityToProduce,
            reason,
            userId
        }));

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