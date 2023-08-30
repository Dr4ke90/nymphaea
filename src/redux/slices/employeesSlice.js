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
  },
});

export const fetchAllEmployees = createAsyncThunk(
  "employees/fetchAllEmployees",
  async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/nymphaea/employees"
      );
      console.log(`Angajatii au fost incarcati cu succes`);
      return response.data;
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
        `http://localhost:3000/api/nymphaea/employees/${employee._id}`,
        employee
      );
      console.log(response.data.success);
    } catch (error) {
      throw new Error("Eroare la actualizarea Angajatului " + employee.id, error);
    }
  }
);

export const addEmployee = createAsyncThunk(
  "employees/addEployee",
  async (employee) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/nymphaea/employees",
        employee
      );
      return response.data;
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
        `http://localhost:3000/api/nymphaea/employees/${employee._id}`
      );
      console.log(response.data.success); 
      return employee;
    } catch (error) {
      throw new Error("Eroare la ștergerea Angajatului " + employee.id, error); 
    }
  }
);


export default employeesSlice.reducer;
