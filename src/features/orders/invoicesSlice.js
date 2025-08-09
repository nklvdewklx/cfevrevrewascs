import { createAsyncThunk } from '@reduxjs/toolkit';
import { createGenericSlice } from '../../app/createGenericSlice';
import { defaultDb } from '../../api/defaultDb';
import { storageService } from '../../services/storageService';

// Thunk to generate a new invoice from an order
export const generateInvoiceForOrder = createAsyncThunk(
    'invoices/generateForOrder',
    (order, { getState, rejectWithValue }) => {
        // MODIFIED: Invoice is now based on fulfilled items
        const itemsToInvoice = order.fulfilledItems || order.items;
        
        if (!itemsToInvoice || itemsToInvoice.length === 0) {
            return rejectWithValue('Cannot generate an invoice for an order with no fulfilled items.');
        }
        
        const { invoices, products } = getState();
        
        const existingInvoice = invoices.items.find(inv => inv.orderId === order.id);
        if (existingInvoice) {
            return rejectWithValue(`Invoice #${existingInvoice.invoiceNumber} already exists for this order.`);
        }

        // MODIFIED: Calculate total based on fulfilled items
        const total = itemsToInvoice.reduce((sum, item) => {
            const product = products.items.find(p => p.id === item.productId);
            const price = product?.pricingTiers[0]?.price || 0;
            const quantity = item.quantityToFulfill || item.quantity; // Use quantity from fulfillment if available
            return sum + (price * quantity);
        }, 0);

        const invoiceCount = invoices.items.length + 1;
        const newInvoice = {
            orderId: order.id,
            customerId: order.customerId,
            issueDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
            total: total,
            status: 'sent',
            invoiceNumber: `INV-2025-${String(invoiceCount).padStart(3, '0')}`,
            appliedCredits: []
        };

        return newInvoice;
    }
);

const persistedState = storageService.loadState();
const initialState = persistedState?.invoices?.items || defaultDb.invoices;

const invoicesSlice = createGenericSlice({
    name: 'invoices',
    initialState: initialState,
    reducers: {
        applyCreditToInvoice: (state, action) => {
            const { invoiceId, creditAmount, creditNoteNumber } = action.payload;
            const invoice = state.items.find(inv => inv.id === invoiceId);
            if(invoice) {
                const amountToApply = Math.min(invoice.total, creditAmount);
                invoice.total -= amountToApply;

                if (!invoice.appliedCredits) {
                    invoice.appliedCredits = [];
                }
                invoice.appliedCredits.push({
                    creditNoteNumber,
                    amount: amountToApply,
                    date: new Date().toISOString().split('T')[0]
                });

                if (invoice.total <= 0) {
                    invoice.status = 'paid';
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(generateInvoiceForOrder.fulfilled, (state, action) => {
            const newId = state.items.length > 0 ? Math.max(...state.items.map(i => i.id)) + 1 : 1;
            state.items.push({ ...action.payload, id: newId });
        });
    }
});

export const {
  addItem: addInvoice,
  updateItem: updateInvoice,
  deleteItem: deleteInvoice,
  setItems: setInvoices,
  applyCreditToInvoice
} = invoicesSlice.actions;

export default invoicesSlice.reducer;