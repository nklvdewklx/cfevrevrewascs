import { createGenericSlice } from '../../app/createGenericSlice';
import { defaultDb } from '../../api/defaultDb';
import { storageService } from '../../services/storageService';

const persistedState = storageService.loadState();
const initialState = persistedState?.orders?.items || defaultDb.orders;

const ordersSlice = createGenericSlice({
    name: 'orders',
    initialState,
});

export const {
  addItem: addOrder,
  updateItem: updateOrder,
  deleteItem: deleteOrder,
  setItems: setOrders,
} = ordersSlice.actions;

export default ordersSlice.reducer;