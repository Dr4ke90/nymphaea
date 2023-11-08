import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const salesSlice = createSlice({
  name: "sales",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllSales.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(addNewSale.fulfilled, (state, action) => {
      return [...state, action.payload];
    });
  },
});

export const fetchAllSales = createAsyncThunk(
  "sales/fetchAllSales",
  async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:3001/api/nymphaea/sales"
      );
      console.log(response.data)
      return response.data;
    } catch (error) {
      throw new Error("Eroare la incarcarea stocurilor", error);
    }
  }
);

export const addNewSale = createAsyncThunk("sales/addNewSale", async (sale) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:3001/api/nymphaea/sales",
      sale
    );

    if (response.data.response.acknowledged && sale.codClient !== "N/A") {
      const customerResponse = await axios.get(
        "http://127.0.0.1:3001/api/nymphaea/customers/" + sale.codClient
      );

      if (Object.keys(customerResponse.data.response).length !== 0) {

        const updateFiles = {
          fise: [
            ...customerResponse.data.response.fise,
            sale,
          ],
        };

        await axios.put(
          "http://127.0.0.1:3001/api/nymphaea/customers/" + sale.codClient,
          updateFiles
        );
      }
    }

    return sale;
  } catch (error) {
    throw new Error("Eroare la incarcarea adaugarea incasari", error);
  }
});

export default salesSlice.reducer;
