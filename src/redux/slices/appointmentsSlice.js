import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllAppointments.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(addAppointment, (state, action) => {
      return [...state, action.payload];
    });
    builder.addCase(deleteAppointment.fulfilled, (state, action) => {
      return state.filter((item) => item._id !== action.payload._id);
    });
  },
});

export const fetchAllAppointments = createAsyncThunk(
  "appointments/fetchAllAppointments",
  async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/nymphaea/appointments"
      );
      return response.data;
    } catch (error) {
      throw new Error("Eroare la upload-ul fiselor de retur", error);
    }
  }
);

export const addAppointment = createAsyncThunk(
  "appointments/addAppointment",
  async (appointment) => {
    appointment.status = "Active"
    try {
      const response = await axios.post(
        "http://localhost:3000/api/nymphaea/appointments",
        appointment
      );
      console.log(response.data.success);
      return appointment;
    } catch (error) {
      throw new Error(
        "Eroare la adaugarea Programarii " + appointment.nr,
        error
      );
    }
  }
);

export const updateAppointment = createAsyncThunk(
  "appointments/updateAppointment",
  async (appointment) => {
    const updates = { ...appointment };
    delete updates._id;
    try {
      const response = await axios.put(
        `http://localhost:3000/api/nymphaea/appointments/${appointment._id}`,
        updates
      );
      console.log(response.data);
    } catch (error) {
      throw new Error(
        "Eroare la actualizarea Programarii " + appointment._id,
        error
      );
    }
  }
);

export const deleteAppointment = createAsyncThunk(
  "appointments/deleteAppointment",
  async (appointments) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/nymphaea/appointments/${appointments._id}`
      );
      console.log(response.data);
      return appointments;
    } catch (error) {
      throw new Error(
        "Eroare la stergerea Programarii " + appointments._id,
        error
      );
    }
  }
);

export default appointmentsSlice.reducer;
