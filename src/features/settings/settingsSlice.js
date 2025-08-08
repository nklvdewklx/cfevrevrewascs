import { createGenericSlice } from '../../app/createGenericSlice';
import { storageService } from '../../services/storageService';

const persistedState = storageService.loadState();
const initialState = persistedState?.settings?.items || {
    theme: 'dark', // Options: 'dark', 'light'
    language: 'en', // Options: 'en', 'ar' // UPDATED: Default language is 'en'
    currency: 'USD',
    taxRate: 0.19, // Default tax rate
};

const settingsSlice = createGenericSlice({
    name: 'settings',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.items.theme = state.items.theme === 'dark' ? 'light' : 'dark';
        },
        setLanguage: (state, action) => {
            state.items.language = action.payload;
        }
    }
});

export const {
  updateItem: updateSettings,
  toggleTheme,
  setLanguage, 
} = settingsSlice.actions;

export default settingsSlice.reducer;