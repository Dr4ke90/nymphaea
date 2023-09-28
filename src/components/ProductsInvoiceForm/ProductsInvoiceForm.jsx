import React, { useEffect, useState } from "react";
import PagePreview from "../PagePreview/PagePreview";
import Form from "../Formular/Form";
import Input from "../Input/Input";
import { Button } from "@mui/material";
import "./productsInvoiceForm.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllInventory } from "../../redux/slices/inventorySlice";

export default function ProductsInvoiceForm({
  stateProdus,
  setStateProdus,
  handleAdaugaProdus,
  handleChangeProdus,
}) {
  const inventory = useSelector((state) => state.stocuri);
  const [inputDisabled, setInputDisabled] = useState(true);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllInventory());
  }, [dispatch]);

  let codProdus = 0;
  const nrProd = inventory.length + 1;
  const paddedNrProd = nrProd.toString().padStart(4, "0");
  codProdus = "P" + paddedNrProd;

  const handlePlaceHolder = (key) => {
    let placeholder = key.substring(0, 1).toUpperCase() + key.slice(1);

    if (key === "stoc") placeholder = "Cantitate";

    if (key === "barcode") placeholder = "Cod de bare";

    if (key === "gramaj") placeholder = "Gramaj / BUC";

    if (key === "pretUnitar") placeholder = "Pret Unitar";

    return placeholder;
  };

  const handleDisableInputs = (keyName) => {
    return inputDisabled && keyName !== "barcode" && stateProdus.barcode === "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const findedProduct = inventory.find(
      (item) => item.barcode === stateProdus.barcode
    );

    if (findedProduct !== undefined) {
      setStateProdus({
        ...findedProduct,
        stoc: "0",
      });
    } else {
      setStateProdus({
        ...stateProdus,
        cod: codProdus,
      });
    }

    setInputDisabled(false);
  };

  const inputsOrder = [
    "barcode",
    "stoc",
    "cod",
    "categorie",
    "brand",
    "tip",
    "gramaj",
    "pret",
    "total",
  ];


  const handleAdauga = (e) => {
    handleAdaugaProdus(e)
    setInputDisabled(true)
  }

  return (
    <PagePreview className="form-produse">
      <Form>
        {inputsOrder.map((keyName) => {
          if (keyName !== "total" && keyName !== "cantitateGr") {
            return (
              <Input
                className="input"
                key={keyName}
                id={keyName}
                type="text"
                name={keyName}
                placeholder={handlePlaceHolder(keyName)}
                onChange={handleChangeProdus}
                value={stateProdus[keyName]}
                disabled={handleDisableInputs(keyName)}
                autoComplete="off"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit(e);
                  }
                }}
              />
            );
          } else {
            return null;
          }
        })}
      </Form>
      <Button
        variant="contained"
        color="success"
        onClick={(e) => handleAdauga(e)}
        disabled={Object.values(stateProdus).some(
          (value) => typeof value === "string" && value.trim() === ""
        )}
      >
        Adauga
      </Button>
    </PagePreview>
  );
}
