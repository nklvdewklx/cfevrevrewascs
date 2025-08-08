import { createGenericSlice } from '../../app/createGenericSlice';
import { storageService } from '../../services/storageService';

const persistedState = storageService.loadState();
const initialState = persistedState?.approvals?.items || [];

const approvalsSlice = createGenericSlice({
    name: 'approvals',
    initialState,
});

export const {
  addItem: addApproval,
  updateItem: updateApproval,
  deleteItem: deleteApproval,
  setItems: setApprovals,
} = approvalsSlice.actions;

export default approvalsSlice.reducer;