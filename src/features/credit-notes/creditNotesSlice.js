import { createGenericSlice } from '../../app/createGenericSlice';
import { storageService } from '../../services/storageService';

const persistedState = storageService.loadState();
const initialState = persistedState?.creditNotes?.items || [];

const creditNotesSlice = createGenericSlice({
    name: 'creditNotes',
    initialState,
    reducers: {
        // MODIFIED: Enhanced reducer to track remaining credit
        applyCreditNote: (state, action) => {
            const { creditNoteId, invoiceId, amountApplied } = action.payload;
            const creditNote = state.items.find(cn => cn.id === creditNoteId);
            if (creditNote) {
                creditNote.amount -= amountApplied;
                if(creditNote.amount <= 0) {
                    creditNote.status = 'applied';
                }
                if (!creditNote.applications) {
                    creditNote.applications = [];
                }
                creditNote.applications.push({
                    invoiceId,
                    amount: amountApplied,
                    date: new Date().toISOString().split('T')[0]
                });
            }
        }
    }
});

export const {
  addItem: addCreditNote,
  updateItem: updateCreditNote,
  deleteItem: deleteCreditNote,
  applyCreditNote
} = creditNotesSlice.actions;

export default creditNotesSlice.reducer;