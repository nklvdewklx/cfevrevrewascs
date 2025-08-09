import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk to perform the search across all relevant data
export const performSearch = createAsyncThunk(
    'search/performSearch',
    async (query, { getState }) => {
        const { products, components, customers, orders, suppliers } = getState();
        const lowerCaseQuery = query.toLowerCase();
        
        const results = {
            products: products.items.filter(p => p.name.toLowerCase().includes(lowerCaseQuery) || p.sku.toLowerCase().includes(lowerCaseQuery)),
            components: components.items.filter(c => c.name.toLowerCase().includes(lowerCaseQuery)),
            customers: customers.items.filter(c => c.name.toLowerCase().includes(lowerCaseQuery) || c.company.toLowerCase().includes(lowerCaseQuery)),
            orders: orders.items.filter(o => String(o.id).includes(lowerCaseQuery)),
            suppliers: suppliers.items.filter(s => s.name.toLowerCase().includes(lowerCaseQuery)),
        };

        return results;
    }
);

const initialState = {
  query: '',
  results: {
      products: [],
      components: [],
      customers: [],
      orders: [],
      suppliers: [],
  },
  isOpen: false,
  status: 'idle',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.query = action.payload;
    },
    openSearch: (state) => {
      state.isOpen = true;
    },
    closeSearch: (state) => {
      state.isOpen = false;
      state.query = '';
      state.results = initialState.results;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(performSearch.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(performSearch.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.results = action.payload;
      });
  },
});

export const { setSearchQuery, openSearch, closeSearch } = searchSlice.actions;

export default searchSlice.reducer;