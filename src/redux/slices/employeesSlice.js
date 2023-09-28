import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const employeesSlice = createSlice({
  name: "employees",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllEmployees.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(addEmployee.fulfilled, (state, action) => {
      return [...state, action.payload];
    });
    builder.addCase(deleteEmployee.fulfilled, (state, action) => {
      return state.filter((item) => item.cod !== action.payload.cod);
    });
  },
});

export const fetchAllEmployees = createAsyncThunk(
  "employees/fetchAllEmployees",
  async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:3001/api/nymphaea/employees"
      );
      console.log(`Angajatii au fost incarcati cu succes`);
      return response.data;
    } catch (error) {
      throw new Error("Eroare la preluarea Angajatiilor", error);
    }
  }
);

export const fetchOneEmployee = createAsyncThunk(
  "employees/fetchOneEmployees",
  async (cod) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:3001/api/nymphaea/employees/${cod}`
      );
      console.log(response.data.message);
      return response.data.response;
    } catch (error) {
      throw new Error("Eroare la preluarea Angajatiilor", error);
    }
  }
);



export const updateEmployee = createAsyncThunk(
  "employees/updateEmployee",
  async (employee) => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:3001/api/nymphaea/employees/${employee.cod}`,
        employee
      );
      console.log(response.data.success);
    } catch (error) {
      throw new Error(
        "Eroare la actualizarea Angajatului " + employee.cod,
        error
      );
    }
  }
);

export const addEmployee = createAsyncThunk(
  "employees/addEployee",
  async (employee) => {
    try {
      await axios.post(
        "http://127.0.0.1:3001/api/nymphaea/employees",
        employee
      );
      return employee;
    } catch (error) {
      throw new Error("Eroare la adaugarea Angajatului " + employee.id, error);
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  "employees/deleteEmployee",
  async (employee) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:3001/api/nymphaea/employees/${employee.cod}`
      );
      console.log(response.data.success);
      return employee;
    } catch (error) {
      throw new Error("Eroare la ștergerea Angajatului " + employee.cod, error);
    }
  }
);

export default employeesSlice.reducer;
