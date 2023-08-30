import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const servicesSlice = createSlice({
  name: "services",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllServices.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(addService.fulfilled, (state, action) => {
      return [...state, action.payload];
    });
    builder.addCase(deleteService.fulfilled, (state, action) => {
      return state.filter((item) => item._id !== action.payload._id);
    });
  },
});

export const fetchAllServices = createAsyncThunk(
  "services/fetchAllServices",
  async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/nymphaea/services"
      );
      return response.data;
    } catch (error) {
      throw new Error("Eroare la preluarea Serviciilor", error);
    }
  }
);

export const addService = createAsyncThunk(
  "services/addService",
  async (service) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/nymphaea/services",
        service
      );
      return response.data;
    } catch (error) {
      throw new Error("Eroare la adaugarea Serviciului", error);
      
    }
  }
);

export const deleteService = createAsyncThunk(
  "services/deleteService",
  async (service) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/nymphaea/services/${service._id}`
      );
      console.log(response.data.success);
      return service;
    } catch (error) {
      throw new Error("Eroare la ștergerea serviciului " + service.id, error);
    }
  }
);

export const updateService = createAsyncThunk(
  "services/updateService",
  async (service) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/nymphaea/services/${service._id}`,
        service
      );
      console.log(response.data.success);
    } catch (error) {
      throw new Error(
        "Eroare la actualizarea Serviciului " + service.id,
        error
      );
    }
  }
);

export default servicesSlice.reducer;
