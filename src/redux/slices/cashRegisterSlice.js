import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getDate } from "../../utils/getDate";
import { getHour } from "../../utils/getHour";

const cashRegisterSlice = createSlice({
  name: "cashRegister",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllReceipes.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(addRceceipe.fulfilled, (state, action) => {
      return [...state, action.payload];
    });
    builder.addCase(deleteReceipe.fulfilled, (state, action) => {
      return state.filter((item) => item.nrBon !== action.payload.nrBon);
    });
    builder.addCase(updateReceipe.fulfilled, (state, action) => {
      const index = state.findIndex(
        (appointemnt) => appointemnt.nr === action.payload.nr
      );
      if (index !== -1) {
        state[index] = action.payload;
      }
    });
  },
});


export const fetchAllReceipes = createAsyncThunk(
  "cashRegister/fetchAllReceipes",
  async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:3001/api/nymphaea/casa"
      );
      return response.data;
    } catch (error) {
      throw new Error("Eroare la upload-ul fiselor de retur", error);
    }
  }
);

export const addRceceipe = createAsyncThunk(
  "cashRegister/addReceipe",
  async (receipe) => {
    const updates = {
      ...receipe,
      data_creat: getDate(),
      ora_creat: getHour(),
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:3001/api/nymphaea/casa",
        updates
      );
      console.log(response.data.message);

      if (response.data.response) {
        const getEmployyeRespons = await axios.get(
          `http://127.0.0.1:3001/api/nymphaea/employees/${receipe.codAngajat}`
        );

        if (Object.keys(getEmployyeRespons.data.response).length !== 0) {
          const appointemntUpdate = {
            programari: getEmployyeRespons.data.response.programari.filter(
              (item) => item.nr !== receipe.codProgramare
            ),
          };

          const updateEmployyeResponse = await axios.put(
            `http://127.0.0.1:3001/api/nymphaea/employees/${receipe.codAngajat}`,
            appointemntUpdate
          );

          if (updateEmployyeResponse.data.response !== 0) {
            const getCustomerResponse = await axios.get(
              `http://127.0.0.1:3001/api/nymphaea/customers/${receipe.codClient}`
            );

            if (Object.keys(getCustomerResponse.data.response).length !== 0) {
              const customerUpdate = {
                fise: [
                  ...getCustomerResponse.data.response.fise,
                  { ...receipe },
                ],
              };

              const customerUpdateResponse = await axios.put(
                `http://127.0.0.1:3001/api/nymphaea/customers/${receipe.codClient}`,
                customerUpdate
              );

              if (customerUpdateResponse.data.response !== 0) {
                const status = "Terminat";
                const tip_update = `Modificare status: ${status}`;
                const appUpdate = {
                  status: status,
                  tip_update: tip_update,
                };

                const response = await axios.put(
                  `http://127.0.0.1:3001/api/nymphaea/appointments/${receipe.codProgramare}`,
                  appUpdate
                );
                console.log(response.data.message);
              }
            }
          }
        }
      }

      return receipe;
    } catch (error) {
      throw new Error(
        "Eroare la adaugarea programarii " + receipe.nrBon,
        error
      );
    }
  }
);

export const updateReceipe = createAsyncThunk(
  "cashRegister/updateReceipe",
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
        const getEmployyeRespons = await axios.get(
          `http://127.0.0.1:3001/api/nymphaea/employees/${appointment.angajat}`
        );

        const appointemntUpdate = {
          programari: getEmployyeRespons.data.response.programari.filter(
            (item) => item.nr !== appointment.cod
          ),
        };

        await axios.put(
          `http://127.0.0.1:3001/api/nymphaea/employees/${appointment.angajat}`,
          appointemntUpdate
        );
      }

      const response = await axios.put(
        `http://127.0.0.1:3001/api/nymphaea/appointments/${appointment.cod}`,
        updates
      );
      console.log(response.data.message);
      return appointment;
    } catch (error) {
      throw new Error(
        "Eroare la actualizarea Programarii " + appointment.cod,
        error
      );
    }
  }
);

export const deleteReceipe = createAsyncThunk(
  "cashRegister/deleteReceipe",
  async (receipe) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:3001/api/nymphaea/casa/${receipe.nrBon}`
      );
      console.log(response.data.message);
      return receipe;
    } catch (error) {
      throw new Error("Eroare la stergerea bonului " + receipe.nrBon, error);
    }
  }
);

export default cashRegisterSlice.reducer;
