import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const customersSlice = createSlice({
  name: "customers",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllCustomers.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(deleteCustomer.fulfilled, (state, action) => {
      return state.filter((item) => item._id !== action.payload._id);
    });
    builder.addCase(addCustomer.fulfilled, (state, action) => {
      return [...state, action.payload];
    });
  },
});

export const fetchAllCustomers = createAsyncThunk(
  "customers/fetchAllCustomers",
  async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:3001/api/nymphaea/customers"
      );
      console.log('Clientii au fost incarcati cu succes')
      return response.data;
    } catch (error) {
      throw new Error("Eroare la incarcarea Clientilor", error);
    }
  }
);

export const addCustomer = createAsyncThunk(
  "customers/addCustomer",
  async (customer) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:3001/api/nymphaea/customers",
        customer
      );
      console.log(response.data.success);
      return customer
    } catch (error) {
      throw new Error("Eroare la adaugarea Clientului" + customer.cod, error);
    }
  }
);

export const updateCustomer = createAsyncThunk(
  "customers/updateCustomer",
  async (customer) => {
    const updates = { ...customer };
    delete updates._id;
    try {
      const response = await axios.put(
        `http://127.0.0.1:3001/api/nymphaea/customers/${customer.cod}`,
        updates
      );
      console.log(response.data.success);
    } catch (error) {
      throw new Error("Eroare la actualizarea Clientului " + customer.cod, error);
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  "customers/deleteCustomer",
  async (customer) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:3001/api/nymphaea/customers/${customer.cod}`
      );
      console.log(response.data.success);
      return customer;
    } catch (error) {
      throw new Error("Eroare la stergerea Clientului " + customer.cod, error);
    }
  }
);

export default customersSlice.reducer;
