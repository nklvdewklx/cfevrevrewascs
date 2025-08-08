import { createGenericSlice } from '../../app/createGenericSlice';
import { defaultDb } from '../../api/defaultDb';
import { storageService } from '../../services/storageService';

const persistedState = storageService.loadState();
const initialState = persistedState?.leads?.items || defaultDb.leads;

const leadsSlice = createGenericSlice({
    name: 'leads',
    initialState,
});

export const {
  addItem: addLead,
  updateItem: updateLead,
  deleteItem: deleteLead,
  setItems: setLeads,
} = leadsSlice.actions;

export default leadsSlice.reducer;