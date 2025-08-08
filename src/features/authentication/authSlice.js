import { createSlice } from '@reduxjs/toolkit';
import { storageService } from '../../services/storageService';

// Attempt to load the user from localStorage on initial load
const storedState = storageService.loadState();
const initialState = {
  user: storedState?.currentUser || null,
  isAuthenticated: !!storedState?.currentUser,
  loading: false, // Will be true when we add async logic
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Reducer to handle successful login
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      // We also need to save this to local storage
      storageService.saveState({ currentUser: action.payload });
    },
    // Reducer to handle logout
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      storageService.clearState();
    },
    // Reducer to handle login failure
    loginFailure: (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
    }
  },
});

// Export the actions so we can use them in our components
export const { loginSuccess, logout, loginFailure } = authSlice.actions;

// Export the reducer to be added to our store
export default authSlice.reducer;