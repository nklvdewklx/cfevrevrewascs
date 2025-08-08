import { createGenericSlice } from '../../app/createGenericSlice';
import { storageService } from '../../services/storageService';

const persistedState = storageService.loadState();
const initialState = persistedState?.creditNotes?.items || [];

const creditNotesSlice = createGenericSlice({
    name: 'creditNotes',
    initialState,
    reducers: {}
});

export const {
  addItem: addCreditNote,
  updateItem: updateCreditNote,
  deleteItem: deleteCreditNote,
} = creditNotesSlice.actions;

export default creditNotesSlice.reducer;