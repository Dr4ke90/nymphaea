import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

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

const date = new Date().toLocaleDateString("ro", "RO");
const ora = new Date().toLocaleTimeString("ro", "RO");

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
      data_creat: date,
      ora_creat: ora,
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
        "Eroare la adaugarea Programarii " + appointment.nr,
        error
      );
    }
  }
);

export const updateAppointment = createAsyncThunk(
  "appointments/updateAppointment",
  async (appointment) => {
    console.log(appointment);
    const updates = {
      ...appointment,
      data_update: date,
      ora_update: ora,
    };
    delete updates._id;

    try {
      if (
        appointment.status.includes("Anulat") ||
        appointment.status.includes("Terminat")
      ) {
        const getEmployyeRespons = await axios.get(
          `http://127.0.0.1:3001/api/nymphaea/employees/${appointment.angajat}`
        );

        const appointemntUpdate = {
          programari: getEmployyeRespons.data.response.programari.filter(
            (item) => item.nr !== appointment.nr
          ),
        };

        await axios.put(
          `http://127.0.0.1:3001/api/nymphaea/employees/${appointment.angajat}`,
          appointemntUpdate
        );
      }

      const response = await axios.put(
        `http://127.0.0.1:3001/api/nymphaea/appointments/${appointment.nr}`,
        updates
      );
      console.log(response.data.message);
      return appointment;
    } catch (error) {
      throw new Error(
        "Eroare la actualizarea Programarii " + appointment.nr,
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
        `http://52.3.55.96:3001/api/nymphaea/appointments/${appointment.nr}`
      );
      console.log(appointmentRes.data.message);
      return appointment;
    } catch (error) {
      throw new Error(
        "Eroare la stergerea Programarii " + appointment.nr,
        error
      );
    }
  }
);

export default appointmentsSlice.reducer;
