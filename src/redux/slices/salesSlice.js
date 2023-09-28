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
  },
});

export const fetchAllSales = createAsyncThunk(
  "sales/fetchAllSales",
  async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:3000/api/nymphaea/sales"
      );
      return response.data;
    } catch (error) {
      throw new Error("Eroare la incarcarea stocurilor", error);
    }
  }
);

export const addNewSale = createAsyncThunk("sales/addNewSale", async (sale) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:3000/api/nymphaea/sales",
      sale
    );

    if (Object.keys(response.data.response).length !== 0) {
      const inventoryResponse = await axios.get(
        "http://127.0.0.1:3000/api/nymphaea/inventory"
      );

      // Dacă vânzarea conține produse
      if (sale.produse && sale.produse.length > 0) {
        const promises = [];

        for (const productInSale of sale.produse) {
          if (productInSale.reteta) {
            for (const itemReteta of productInSale.reteta) {
              const inventoryItem = inventoryResponse.data.find(
                (item) => item.cod === itemReteta.cod
              );
              if (inventoryItem) {
                const stoc =
                  inventoryItem.stoc - itemReteta.cantitateUtilizata / 100;
                const cantitateGr =
                  inventoryItem.cantitateGr - itemReteta.cantitateUtilizata;

                const updatedInventory = {
                  ...inventoryItem,
                  stoc,
                  cantitateGr,
                };

                delete updatedInventory._id

                promises.push(
                  axios.put(
                    `http://127.0.0.1:3000/api/nymphaea/inventory/${itemReteta.cod}`,
                    updatedInventory
                  )
                );
              }
            }
          } else if (productInSale.cod.startsWith("P")) {
            // Dacă codul produsului începe cu "P"
            const inventoryItem = inventoryResponse.data.find(
              (item) => item.cod === productInSale.cod
            );
            if (inventoryItem) {
              const stoc = inventoryItem.stoc - productInSale.cantitateUtilizata;
              const cantitateGr =
                inventoryItem.cantitateGr -
                productInSale.gramaj * productInSale.cantitateUtilizata;

              const updatedInventory = {
                ...inventoryItem,
                stoc,
                cantitateGr,
              };

              delete updatedInventory._id


              promises.push(
                axios.put(
                  `http://127.0.0.1:3000/api/nymphaea/inventory/${productInSale.cod}`,
                  updatedInventory
                )
              );
            }
          }
        }

       const responsePromise = await Promise.all(promises);

       if (responsePromise.request.status === 200) {
          await axios.delete(`http://127.0.0.1:3000/api/nymphaea/casa/${sale.nrBon}`)
       }
      }
    }

    return response.data;
  } catch (error) {
    throw new Error("Eroare la incarcarea adaugarea incasari", error);
  }
});


export default salesSlice.reducer;
