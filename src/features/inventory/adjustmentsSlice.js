import { createGenericSlice } from '../../app/createGenericSlice';
import { storageService } from '../../services/storageService';

const persistedState = storageService.loadState();
const initialState = persistedState?.adjustments?.items || [];

const adjustmentsSlice = createGenericSlice({
    name: 'adjustments',
    initialState,
    // No special reducers needed, the generic ones are enough.
});

export const {
  addItem: addAdjustment,
  setItems: setAdjustments,
} = adjustmentsSlice.actions;

export default adjustmentsSlice.reducer;