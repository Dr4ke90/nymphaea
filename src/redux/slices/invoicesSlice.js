import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const servicesSlice = createSlice({
  name: "invoices",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllInvoices.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(addInvoice.fulfilled, (state, action) => {
      return [...state, action.payload];
    });
    builder.addCase(deleteInvoice.fulfilled, (state, action) => {
      return state.filter((item) => item._id !== action.payload._id);
    });
    builder.addCase(updateInvoice.fulfilled, (state, action) => {
      const updatedInvoice = action.payload;

      const index = state.findIndex(
        (invoice) => invoice.nr === updatedInvoice.nr
      );
      if (index !== -1) {
        state[index] = updatedInvoice;
      }
    });
  },
});

export const fetchAllInvoices = createAsyncThunk(
  "services/fetchAllInvoices",
  async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:3001/api/nymphaea/invoices"
      );
      return response.data;
    } catch (error) {
      throw new Error("Eroare la preluarea Facturilor", error);
    }
  }
);

export const addInvoice = createAsyncThunk(
  "services/addInvoice",
  async (invoice) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:3001/api/nymphaea/invoices",
        invoice
      );
      console.log(response.data.message);

      if (
        Object.keys(response.data.response).length !== 0 &&
        invoice.tip === "Produse"
      ) {
        await Promise.all(
          invoice.produse.map(async (produs) => {
            delete produs.nr;
            delete produs.total;
            delete produs._id;

            console.log(produs)

            const inventoryResponse = await axios.get(
              `http://127.0.0.1:3001/api/nymphaea/inventory/${produs.cod}`
            );

            if (Object.keys(inventoryResponse.data.response).length !== 0) {
              const existingProduct = inventoryResponse.data.response;
              const updatedProduct = {
                ...produs,
                stoc: parseInt(existingProduct.stoc) + parseInt(produs.stoc)
               };

              const updateResponse = await axios.put(
                `http://127.0.0.1:3001/api/nymphaea/inventory/${existingProduct.cod}`,
                updatedProduct
              );

              console.log(updateResponse.data.message);
            } else {
              const addResponse = await axios.post(
                `http://127.0.0.1:3001/api/nymphaea/inventory`,
                produs
              );

              console.log(addResponse.data.message);
            }
          })
        );
      }
      return invoice;
    } catch (error) {
      throw new Error("Eroare la adaugarea Facturii" + invoice.cod, error);
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  "services/deleteInvoice",
  async (invoice) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:3000/api/nymphaea/invoices/${invoice.nr}`
      );
      console.log(response.data.message);
      return invoice;
    } catch (error) {
      throw new Error("Eroare la ștergerea Facturii " + invoice.nr, error);
    }
  }
);

export const updateInvoice = createAsyncThunk(
  "services/updateService",
  async (invoice) => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:3000/api/nymphaea/invoices/${invoice.nr}`,
        invoice
      );
      console.log(response.data.success);
      return invoice;
    } catch (error) {
      throw new Error(
        "Eroare la actualizarea Serviciului " + invoice.nr,
        error
      );
    }
  }
);

export default servicesSlice.reducer;
