import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import "./inventory.css";
import { fetchAllInventory } from "../../redux/slices/inventorySlice";
import TableDisplay from "../../components/table-display/TableDisplay";
import { Button } from "@mui/material";
import FormProdus from "./FormProdus/FormProdus";

export default function Inventory() {
  const thead = [
    "cod",
    "categorie",
    "brand",
    "descriere",
    "gramaj",
    "stoc",
    "stocInGr",
    "pret",
  ];
  const inventory = useSelector((state) => state.stocuri);
  const location = useLocation();
  const title =
    location.pathname.substring(1, 2).toUpperCase() +
    location.pathname.substring(1).slice(1);
  const [receivedProduct, setReceivedProduct] = useState(null);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllInventory());
  }, [dispatch]);

  let codProdus = 0;
  const nrProd = inventory.length + 1;
  const paddedNrProd = nrProd.toString().padStart(4, "0");
  codProdus = "P" + paddedNrProd;

  const [openFormProdus, setOpenFormProdus] = useState(false);

  const toggleModalFormProdus = () => {
    setOpenFormProdus(!openFormProdus);
  };

  const handleEditProduct = (item) => {
    setReceivedProduct(item);

    toggleModalFormProdus();
  };

  return (
    <div className="inventory-page">
      {openFormProdus && (
        <FormProdus
          cod={codProdus}
          closeModal={toggleModalFormProdus}
          item={receivedProduct}
          setItem={setReceivedProduct}
        />
      )}
      <div className="title">
        <Button
          variant="contained"
          color="info"
          onClick={toggleModalFormProdus}
        >
          Adauga
        </Button>
        <h2>{title}</h2>
      </div>
      <TableDisplay
        thead={thead}
        tbody={inventory}
        listOrder={thead}
        editItem={handleEditProduct}
      />
    </div>
  );
}
