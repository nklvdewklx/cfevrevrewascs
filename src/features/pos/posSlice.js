import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
  openTransactions: [], // Array to hold multiple open sales
  selectedCustomerId: null,
  currency: 'USD',
  status: 'idle',
};

const posSlice = createSlice({
  name: 'pos',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity } = action.payload;
      const existingItem = state.cart.find(item => item.productId === product.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cart.push({
          productId: product.id,
          name: product.name,
          quantity: quantity,
          price: product.pricingTiers[0]?.price || 0,
        });
      }
    },
    updateCartItem: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.cart.find(item => item.productId === productId);
      if (item) {
        item.quantity = quantity;
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.productId !== action.payload);
    },
    clearCart: (state) => {
      state.cart = [];
    },
    // Reducers for Open Transactions
    openTransaction: (state) => {
        if (state.cart.length > 0) {
            state.openTransactions.push({
                customerId: state.selectedCustomerId,
                cart: state.cart,
            });
            state.cart = [];
        }
    },
    loadTransaction: (state, action) => {
        const transaction = state.openTransactions[action.payload];
        if (transaction) {
            state.cart = transaction.cart;
            state.selectedCustomerId = transaction.customerId;
            state.openTransactions.splice(action.payload, 1);
        }
    },
    // Reducers for Multi-currency support
    setCurrency: (state, action) => {
        state.currency = action.payload;
    },
    setCustomerId: (state, action) => {
        state.selectedCustomerId = action.payload;
    }
  },
});

export const {
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  openTransaction,
  loadTransaction,
  setCurrency,
  setCustomerId,
} = posSlice.actions;

export default posSlice.reducer;