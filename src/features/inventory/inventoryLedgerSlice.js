import { createGenericSlice } from '../../app/createGenericSlice';
import { storageService } from '../../services/storageService';

const persistedState = storageService.loadState();
const initialState = persistedState?.inventoryLedger?.items || [];

const inventoryLedgerSlice = createGenericSlice({
    name: 'inventoryLedger',
    initialState,
    reducers: {
        addEntry: (state, action) => {
            const newId = state.items.length > 0 ? Math.max(...state.items.map(i => i.id)) + 1 : 1;
            state.items.unshift({ ...action.payload, id: newId, date: new Date().toISOString() });
        }
    }
});

export const {
  addEntry: addLedgerEntry,
} = inventoryLedgerSlice.actions;

export default inventoryLedgerSlice.reducer;