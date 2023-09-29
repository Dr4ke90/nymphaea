import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const inventorySlice = createSlice({
  name: "inventory",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllInventory.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const fetchAllInventory = createAsyncThunk(
  "inventory/fetchAllInventory",
  async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:3001/api/nymphaea/inventory"
      );
      return response.data;
    } catch (error) {
      throw new Error("Eroare la incarcarea stocurilor", error);
    }
  }
);

export const addProduct = createAsyncThunk(
  "inventory/addProduct",
  async (product) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:3001/api/nymphaea/inventory",
        product
      );
      return response.data;
    } catch (error) {
      throw new Error("Eroare la incarcarea adaugarea produsului", error);
    }
  }
);

export const updateInventory = createAsyncThunk(
  "inventory/updateProduct",
  async (product) => {
    const updates = { ...product };
    delete updates._id;
    try {
      const response = await axios.put(
        `http://127.0.0.1:3001/api/nympahea/inventory/${product._id}`,
        updates
      );
      console.log(response.data);
    } catch (error) {
      throw new Error("Eroare la actualizarea Produsului ", product._id, error);
    }
  }
);


export const updateInventoryRecursively = createAsyncThunk(
  "inventory/updateProduct",
  async (sale) => {
    try {
      const inventoryResponse = await axios.get(
        "http://127.0.0.1:3001/api/nymphaea/inventory"
      );

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

                delete updatedInventory._id;

                promises.push(
                  axios.put(
                    `http://127.0.0.1:3001/api/nymphaea/inventory/${itemReteta.cod}`,
                    updatedInventory
                  )
                );
              }
            }
          } else if (productInSale.cod.startsWith("P")) {
            const inventoryItem = inventoryResponse.data.find(
              (item) => item.cod === productInSale.cod
            );
            if (inventoryItem) {
              const stoc =
                inventoryItem.stoc - productInSale.cantitateUtilizata;
              const cantitateGr =
                inventoryItem.cantitateGr -
                productInSale.gramaj * productInSale.cantitateUtilizata;

              const updatedInventory = {
                ...inventoryItem,
                stoc,
                cantitateGr,
              };

              delete updatedInventory._id;

              promises.push(
                axios.put(
                  `http://127.0.0.1:3001/api/nymphaea/inventory/${productInSale.cod}`,
                  updatedInventory
                )
              );
            }
          }
        }

        await Promise.all(promises);
      }
    } catch (error) {
      throw new Error("Eroare la actualizarea produselor ", error);
    }
  }
);


export default inventorySlice.reducer;
