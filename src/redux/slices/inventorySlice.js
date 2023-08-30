import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const inventorySlice = createSlice({
  name: "inventory",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllInventory.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      return state.filter((item) => item.fisa !== action.payload.fisa);
    });
  },
});

export const fetchAllInventory = createAsyncThunk(
  "inventory/fetchAllInventory",
  async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/nymphaea/inventory"
      );
      return response.data;
    } catch (error) {
      throw new Error("Eroare la incarcarea stocurilor", error);
    }
  }
);

export const addProduct = createAsyncThunk(
  "inventory/addProduct",
  async (product) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/nymphaea/inventory",
        product
      );
      return response.data;
    } catch (error) {
      throw new Error("Eroare la incarcarea adaugarea produsului", error);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "inventory/updateProduct",
  async (product) => {
    const updates = { ...product };
    delete updates._id;
    try {
      const response = await axios.put(
        `http://localhost:3000/api/nympahea/inventory/${product._id}`,
        updates
      );
      console.log(response.data);
    } catch (error) {
      throw new Error("Eroare la actualizarea Produsului ", product._id, error);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "inventory/deleteProduct",
  async (product) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/nymphaea/inventory/${product._id}`
      );
      console.log(response.data);
      return product;
    } catch (error) {
      throw new Error("Eroare la stergerea Produsului ", product._id, error);
    }
  }
);

export default inventorySlice.reducer;
