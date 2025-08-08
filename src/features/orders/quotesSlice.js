import { createGenericSlice } from '../../app/createGenericSlice';
import { defaultDb } from '../../api/defaultDb';
import { storageService } from '../../services/storageService';

const persistedState = storageService.loadState();
const initialState = persistedState?.quotes?.items || defaultDb.quotes;

const quotesSlice = createGenericSlice({
    name: 'quotes',
    initialState,
});

export const {
  addItem: addQuote,
  updateItem: updateQuote,
  deleteItem: deleteQuote,
  setItems: setQuotes,
} = quotesSlice.actions;

export default quotesSlice.reducer;