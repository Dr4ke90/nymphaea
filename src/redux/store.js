import { configureStore } from '@reduxjs/toolkit';
import employeesSlice from './slices/employeesSlice';
import servicesSlice from './slices/servicesSlice';
import inventorySlice from './slices/inventorySlice';
import customersSlice from './slices/customersSlice';
import appointmentsSlice from './slices/appointmentsSlice';
import invoicesSlice from './slices/invoicesSlice';
import cashRegisterSlice from './slices/cashRegisterSlice';



const store = configureStore({
    reducer: {
     angajati: employeesSlice,
     servicii:servicesSlice,
     stocuri: inventorySlice,
     clienti: customersSlice,
     programari: appointmentsSlice,
     facturi:invoicesSlice,
     casa: cashRegisterSlice
    },
  });
  
  export default store;