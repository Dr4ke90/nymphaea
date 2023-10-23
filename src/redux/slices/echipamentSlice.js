import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const equipmentSlice = createSlice({
  name: "equipment",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllEquipment.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(addEquipment.fulfilled, (state, action) => {
      return [...state, action.payload];
    });
    builder.addCase(updateEquipment.fulfilled, (state, action) => {
      const updateProduct = action.payload;

      const index = state.findIndex(
        (product) => product.cod === updateProduct.cod
      );
      if (index !== -1) {
        state[index] = updateProduct;
      }
    });
  },
});

export const fetchAllEquipment = createAsyncThunk(
  "equipment/fetchAllEquipment",
  async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:3001/api/nymphaea/equipment"
      );
      return response.data;
    } catch (error) {
      throw new Error("Eroare la incarcarea echipamentelor", error);
    }
  }
);

export const addEquipment = createAsyncThunk(
  "equipment/addEquipment",
  async (product) => {
    try {
      await axios.post("http://127.0.0.1:3001/api/nymphaea/equipment", product);
      return product;
    } catch (error) {
      throw new Error("Eroare la incarcarea adaugarea echipamentului", error);
    }
  }
);

export const updateEquipment = createAsyncThunk(
  "equipment/updateEquipment",
  async (product) => {
    const updates = { ...product };
    delete updates._id;
    try {
      const response = await axios.put(
        `http://127.0.0.1:3001/api/nymphaea/equipment/${product.cod}`,
        updates
      );
      console.log(response.data.message);
      return product;
    } catch (error) {
      throw new Error("Eroare la actualizarea echipamentului ", product.cod, error);
    }
  }
);



export default equipmentSlice.reducer;
