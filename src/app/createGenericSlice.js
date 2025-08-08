import { createSlice } from '@reduxjs/toolkit';

export const createGenericSlice = ({ name, initialState, reducers, extraReducers }) => {
  return createSlice({
    name,
    // The initial state is now passed in directly
    initialState: {
      items: initialState,
      status: 'idle',
      error: null,
    },
    // The generic reducers are now passed in
    reducers: {
      addItem: (state, action) => {
        const newId = state.items.length > 0 ? Math.max(...state.items.map(i => i.id)) + 1 : 1;
        state.items.push({ ...action.payload, id: newId });
      },
      updateItem: (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
      },
      deleteItem: (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      },
      setItems: (state, action) => {
        state.items = action.payload;
      },
      ...reducers, // Include any custom reducers
    },
    extraReducers, // The extraReducers function is now part of the config
  });
};