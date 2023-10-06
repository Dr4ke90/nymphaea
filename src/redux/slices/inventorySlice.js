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
    builder.addCase(addProduct.fulfilled, (state, action) => {
      return [...state, action.payload];
    });
    builder.addCase(updateInventory.fulfilled, (state, action) => {
      const updateProduct = action.payload;

      const index = state.findIndex(
        (product) => product.cod === updateProduct.cod
      );
      if (index !== -1) {
        state[index] = updateProduct;
      }
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
      await axios.post("http://127.0.0.1:3001/api/nymphaea/inventory", product);
      return product;
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
        `http://127.0.0.1:3001/api/nymphaea/inventory/${product.cod}`,
        updates
      );
      console.log(response.data.message);
      return product;
    } catch (error) {
      throw new Error("Eroare la actualizarea Produsului ", product.cod, error);
    }
  }
);

export const updateInventoryRecursively = createAsyncThunk(
  "inventory/updateProductRecursively",
  async (sale) => {
    try {
      const inventoryResponse = await axios.get(
        "http://127.0.0.1:3001/api/nymphaea/inventory"
      );

      if (sale.produse && sale.produse.length > 0) {
        const updateInventoryItem = async (itemCod, quantity, quantityInGr) => {
          const inventoryItem = inventoryResponse.data.find(
            (item) => item.cod === itemCod
          );

          console.log(inventoryItem)

          if (inventoryItem) {
            const stoc = inventoryItem.stoc - quantity;
            const stocInGr = inventoryItem.stocInGr - quantityInGr;

            const updatedInventory = {
              ...inventoryItem,
              stoc,
              stocInGr,
            };

            delete updatedInventory._id;

            try {
              const response = await axios.put(
                `http://127.0.0.1:3001/api/nymphaea/inventory/${itemCod}`,
                updatedInventory
              );
              if (Object.keys(response.data).length !== 0) {
                console.log(`Actualizare cu succes pentru produsul ${itemCod}`);
              } else {
                console.error(`Eroare la actualizarea produsului ${itemCod}`);
              }
            } catch (error) {
              console.error(
                `Eroare la actualizarea produsului ${itemCod}:`,
                error
              );
            }
          }
        };

        for (const productInSale of sale.produse) {
          if (productInSale.produseDeBaza) {
            for (const itemFromProduseDeBaza of productInSale.produseDeBaza) {
              console.log(itemFromProduseDeBaza);
              await updateInventoryItem(
                itemFromProduseDeBaza.cod,
                itemFromProduseDeBaza.cantitate / 100,
                itemFromProduseDeBaza.cantitate
              );
            }
          }

          if (productInSale.produseExtra) {
            for (const itemFromProduseExtra of productInSale.produseExtra) {
              await updateInventoryItem(
                itemFromProduseExtra.cod,
                itemFromProduseExtra.cantitateUtilizata / 100,
                itemFromProduseExtra.cantitateUtilizata
              );
            }
          }

          if (productInSale.cod.startsWith("P")) {
            await updateInventoryItem(
              productInSale.cod,
              productInSale.cantitateUtilizata,
              productInSale.gramaj * productInSale.cantitateUtilizata
            );
          }
        }
      }
    } catch (error) {
      throw new Error("Eroare la actualizarea produselor ", error);
    }
  }
);

export default inventorySlice.reducer;
