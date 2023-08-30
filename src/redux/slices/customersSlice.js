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
  },
});

export const fetchAllCustomers = createAsyncThunk(
  "customers/fetchAllCustomers",
  async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/nympahea/customers"
      );
      console.log(response.data.succes)
      return response.data.response;
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
        "http://localhost:3000/api/nymphaea/customers",
        customer
      );
      console.log(response.data.succes);
    } catch (error) {
      throw new Error("Eroare la adaugarea Clientului" + customer._id, error);
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
        `http://localhost:3000/coral/it/predare/${customer._id}`,
        updates
      );
      console.log(response.data.succes);
    } catch (error) {
      throw new Error("Eroare la actualizarea Clientului " + customer._id, error);
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  "customers/deleteCustomer",
  async (customer) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/nymphaea/customers/` + customer._id
      );
      console.log(response.data.succes);
      return customer;
    } catch (error) {
      throw new Error("Eroare la stergerea Clientului " + customer._id, error);
    }
  }
);

export default customersSlice.reducer;
