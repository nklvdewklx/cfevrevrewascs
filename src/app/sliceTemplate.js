import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Define the initial state for the slice
const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// --- Thunks for Async Operations ---
// Example: createAsyncThunk for fetching data
export const fetchItems = createAsyncThunk(
    'sliceName/fetchItems',
    async (_, { rejectWithValue }) => {
        try {
            // Replace with your actual API call
            const response = await fetch('/api/items');
            if (!response.ok) {
                throw new Error('Server error');
            }
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// --- The Slice Itself ---
const sliceNameSlice = createSlice({
    name: 'sliceName',
    initialState,
    reducers: {
        // Standard CRUD reducers
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
        // A reducer to handle specific updates (e.g., status change)
        updateStatus: (state, action) => {
            const { id, newStatus } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (item) {
                item.status = newStatus;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchItems.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchItems.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { addItem, updateItem, deleteItem, updateStatus } = sliceNameSlice.actions;
export default sliceNameSlice.reducer;