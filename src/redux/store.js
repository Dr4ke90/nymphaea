import { configureStore } from '@reduxjs/toolkit';
import employeesSlice from './slices/employeesSlice';
import servicesSlice from './slices/servicesSlice';
import inventorySlice from './slices/inventorySlice';
import customersSlice from './slices/customersSlice';
import appointmentsSlice from './slices/appointmentsSlice';



const store = configureStore({
    reducer: {
     angajati: employeesSlice,
     servicii:servicesSlice,
     stocuri: inventorySlice,
     clienti: customersSlice,
     programari: appointmentsSlice
    },
  });
  
  export default store;