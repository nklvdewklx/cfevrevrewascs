import { createGenericSlice } from '../../app/createGenericSlice';
import { defaultDb } from '../../api/defaultDb';
import { storageService } from '../../services/storageService';

const persistedState = storageService.loadState();
const initialState = persistedState?.employees?.items || defaultDb.employees;

const employeesSlice = createGenericSlice({
    name: 'employees',
    initialState,
});

export const {
  addItem: addEmployee,
  updateItem: updateEmployee,
  deleteItem: deleteEmployee,
  setItems: setEmployees,
} = employeesSlice.actions;

export default employeesSlice.reducer;