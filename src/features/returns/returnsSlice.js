import { createGenericSlice } from '../../app/createGenericSlice';
import { storageService } from '../../services/storageService';

// Attempt to load from localStorage, default to an empty array
const persistedState = storageService.loadState();
const initialState = persistedState?.returns?.items || [];

const returnsSlice = createGenericSlice({
    name: 'returns',
    initialState,
    reducers: {
        // We can add custom reducers here if needed in the future
    }
});

export const {
  addItem: addReturn,
  updateItem: updateReturn,
  deleteItem: deleteReturn,
  setItems: setReturns,
} = returnsSlice.actions;

export default returnsSlice.reducer;