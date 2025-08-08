const STORAGE_KEY = 'roctecERPState';

export const storageService = {
    saveState(state) {
        try {
            const serializedState = JSON.stringify(state);
            localStorage.setItem(STORAGE_KEY, serializedState);
        } catch (e) {
            console.error("Could not save state to localStorage", e);
        }
    },

    loadState() {
        try {
            const serializedState = localStorage.getItem(STORAGE_KEY);
            if (serializedState === null) {
                return undefined;
            }
            return JSON.parse(serializedState);
        } catch (e) {
            console.error("Could not load state from localStorage", e);
            return undefined;
        }
    },

    clearState() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
            console.error("Could not clear state from localStorage", e);
        }
    }
};