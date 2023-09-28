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
    builder.addCase(updateService.fulfilled, (state, action) => {
      const updatedService = action.payload;

      const index = state.findIndex(
        (service) => service.cod === updatedService.cod
      );
      if (index !== -1) {
        state[index] = updatedService;
      }
    });
  },
});

export const fetchAllServices = createAsyncThunk(
  "services/fetchAllServices",
  async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:3000/api/nymphaea/services"
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
      const serviceToSave = {
        ...service,
        data_update: "N/A",
        ora_update: "N/A",
      };

      const response = await axios.post(
        "http://127.0.0.1:3000/api/nymphaea/services",
        serviceToSave
      );
      console.log(response.data.success);
      return serviceToSave;
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
        `http://127.0.0.1:3000/api/nymphaea/services/${service.cod}`
      );
      console.log(response.data.success);
      return service;
    } catch (error) {
      throw new Error("Eroare la ștergerea serviciului " + service.cod, error);
    }
  }
);

export const updateService = createAsyncThunk(
  "services/updateService",
  async (service) => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:3000/api/nymphaea/services/${service.cod}`,
        service
      );
      console.log(response.data.success);
      return service;
    } catch (error) {
      throw new Error(
        "Eroare la actualizarea Serviciului " + service.cod,
        error
      );
    }
  }
);

export default servicesSlice.reducer;
