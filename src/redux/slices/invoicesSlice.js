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

      if (invoice.tip === "Inventar") {
        const updateOrCreateItem = async (item, endpoint) => {
          delete item.nr;
          delete item.total;
          delete item._id;

          try {
            const inventoryResponse = await axios.get(
              `${endpoint}/${item.cod}`
            );

            if (Object.keys(inventoryResponse.data.response).length !== 0) {
              const existingItem = inventoryResponse.data.response;
              let referintaFactura;
              if (existingItem.referintaFactura) {
                referintaFactura = [
                  ...existingItem.referintaFactura,
                  ...item.referintaFactura,
                ];
              } else {
                referintaFactura = item.referintaFactura;
              }
              const updatedItem = {
                ...item,
                stoc: parseInt(existingItem.stoc) + parseInt(item.stoc),
                referintaFactura,
              };

              const updateResponse = await axios.put(
                `${endpoint}/${item.cod}`,
                updatedItem
              );
              console.log(updateResponse.data.message);
            } else {
              const addResponse = await axios.post(endpoint, item);
              console.log(addResponse.data.message);
            }
          } catch (error) {
            console.error(
              "Eroare la adăugarea produsului/echipamentului:",
              error
            );
            throw new Error(
              "Eroare la adăugarea produsului/echipamentului: " + error
            );
          }
        };

        for (const product of invoice.produse) {
          const { nr, total, _id, ...productData } = product;
          const endpoint = `http://127.0.0.1:3001/api/nymphaea/inventory`;
          await updateOrCreateItem(productData, endpoint);
        }

        for (const equipment of invoice.echipament) {
          const { nr, total, _id, ...equipmentData } = equipment;
          const endpoint = `http://127.0.0.1:3001/api/nymphaea/equipment`;
          await updateOrCreateItem(equipmentData, endpoint);
        }
      }

      return invoice;
    } catch (error) {
      console.error("Eroare la adăugarea Facturii " + invoice.cod, error);
      throw new Error(
        "Eroare la adăugarea Facturii " + invoice.cod + ": " + error
      );
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  "services/deleteInvoice",
  async (invoice) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:3000/api/nymphaea/invoices/${invoice.cod}`
      );
      console.log(response.data.message);
      return invoice;
    } catch (error) {
      throw new Error("Eroare la ștergerea Facturii " + invoice.cod, error);
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
