import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getDate } from "../../utils/getDate";
import { getHour } from "../../utils/getHour";

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllAppointments.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(addAppointment.fulfilled, (state, action) => {
      return [...state, action.payload];
    });
    builder.addCase(deleteAppointment.fulfilled, (state, action) => {
      return state.filter((item) => item._id !== action.payload._id);
    });
    builder.addCase(updateAppointment.fulfilled, (state, action) => {
      const index = state.findIndex(
        (appointemnt) => appointemnt.nr === action.payload.nr
      );
      if (index !== -1) {
        state[index] = action.payload;
      }
    });
  },
});

export const fetchAllAppointments = createAsyncThunk(
  "appointments/fetchAllAppointments",
  async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:3001/api/nymphaea/appointments"
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
    const updates = {
      ...appointment,
      data_creat: getDate(),
      ora_creat: getHour(),
    };

    try {
      const getEmployyeRespons = await axios.get(
        `http://127.0.0.1:3001/api/nymphaea/employees/${appointment.angajat}`
      );
      if (Object.keys(getEmployyeRespons.data.response).length === 0) {
        return;
      }

      const appointemntUpdate = {
        programari: [
          ...getEmployyeRespons.data.response.programari,
          appointment,
        ],
      };

      const putEmployyeRespons = await axios.put(
        `http://127.0.0.1:3001/api/nymphaea/employees/${appointment.angajat}`,
        appointemntUpdate
      );

      if (putEmployyeRespons.data.response !== 0) {
        const appointmentRes = await axios.post(
          "http://127.0.0.1:3001/api/nymphaea/appointments",
          updates
        );
        console.log(appointmentRes.data.message);
        return appointment;
      }
    } catch (error) {
      throw new Error(
        "Eroare la adaugarea Programarii " + appointment.cod,
        error
      );
    }
  }
);

export const updateAppointment = createAsyncThunk(
  "appointments/updateAppointment",
  async (appointment) => {
    const updates = {
      ...appointment,
      data_update: getDate(),
      ora_update: getHour(),
    };
    delete updates._id;

    try {
      if (
        appointment.status.includes("Anulat") ||
        appointment.status.includes("Terminat")
      ) {
        const response = await axios.put(
          `http://127.0.0.1:3001/api/nymphaea/appointments/${appointment.cod}`,
          updates
        );
        console.log(response.data.message);

        if (Object.keys(response.data.response).length !== 0) {
          const getEmployeeResponse = await axios.get(
            `http://127.0.0.1:3001/api/nymphaea/employees/${appointment.angajat}`
          );

          const updatedAppointments = getEmployeeResponse.data.response.programari.filter(
            (item) => item.nr !== appointment.cod
          );

          const appointmentUpdate = {
            programari: updatedAppointments,
          };

          await axios.put(
            `http://127.0.0.1:3001/api/nymphaea/employees/${appointment.angajat}`,
            appointmentUpdate
          );
        }
      } else if (appointment.status.includes("Activ")) {
        const response = await axios.put(
          `http://127.0.0.1:3001/api/nymphaea/appointments/${appointment.cod}`,
          updates
        );
        console.log(response.data.message);

        if (Object.keys(response.data.response).length !== 0) {
          const getEmployyeRespons = await axios.get(
            `http://127.0.0.1:3001/api/nymphaea/employees/${appointment.angajat}`
          );
          if (Object.keys(getEmployyeRespons.data.response).length === 0) {
            return;
          }

          const appointemntUpdate = {
            programari: [
              ...getEmployyeRespons.data.response.programari,
              appointment,
            ],
          };

          await axios.put(
            `http://127.0.0.1:3001/api/nymphaea/employees/${appointment.angajat}`,
            appointemntUpdate
          );
        }
      } else {
        const response = await axios.put(
          `http://127.0.0.1:3001/api/nymphaea/appointments/${appointment.cod}`,
          updates
        );
        console.log(response.data.message);
      }

      return appointment;
    } catch (error) {
      throw new Error(
        "Eroare la actualizarea Programarii " + appointment.cod,
        error
      );
    }
  }
);

export const deleteAppointment = createAsyncThunk(
  "appointments/deleteAppointment",
  async (appointment) => {
    try {
      const appointmentRes = await axios.delete(
        `http://52.3.55.96:3001/api/nymphaea/appointments/${appointment.cod}`
      );
      console.log(appointmentRes.data.message);
      return appointment;
    } catch (error) {
      throw new Error(
        "Eroare la stergerea Programarii " + appointment.cod,
        error
      );
    }
  }
);

export default appointmentsSlice.reducer;
