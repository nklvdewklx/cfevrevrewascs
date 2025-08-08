import { createGenericSlice } from '../../app/createGenericSlice';
import { defaultDb } from '../../api/defaultDb';
import { storageService } from '../../services/storageService';

const persistedState = storageService.loadState();
const initialState = persistedState?.agents?.items || defaultDb.agents;

const agentsSlice = createGenericSlice({
    name: 'agents',
    initialState,
});

export const {
  addItem: addAgent,
  updateItem: updateAgent,
  deleteItem: deleteAgent,
  setItems: setAgents,
} = agentsSlice.actions;

export default agentsSlice.reducer;