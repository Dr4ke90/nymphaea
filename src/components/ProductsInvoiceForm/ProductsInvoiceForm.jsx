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
  const [activateInputs, setActivateInputs] = useState(true);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllInventory());
  }, [dispatch]);

  useEffect(() => {
    if (stateProdus.descriere === "") {
      setActivateInputs(true);
    }
  }, [stateProdus.descriere]);

  const handlePlaceHolder = (key) => {
    let placeholder = key.substring(0, 1).toUpperCase() + key.slice(1);

    if (key === "stoc") placeholder = "Cantitate";

    if (key === "gramaj") placeholder = "Gramaj / BUC";

    if (key === "pretFaraTva") placeholder = "Pret fara TVA";

    if (key === "pretAchizitie") placeholder = "Pret achizitie";

    return placeholder;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (stateProdus.descriere !== "") {
      setActivateInputs(false);
    }

    const findedProduct = inventory.find(
      (item) =>
        item.descriere.toLowerCase() === stateProdus.descriere.toLowerCase()
    );

    if (findedProduct) {
      setStateProdus(findedProduct);
    } else {
      setStateProdus({
        ...stateProdus,
        cod:
          stateProdus.descriere !== ""
            ? `P${(inventory.length + 1).toString().padStart(4, "0")}`
            : "",
      });
    }
  };

  const inputsOrder = [
    "descriere",
    "stoc",
    "cod",
    "categorie",
    "brand",
    "gramaj",
    "pretFaraTva",
    "pretAchizitie",
  ];

  const handleAdauga = (e) => {
    handleAdaugaProdus(e);
  };

  return (
    <PagePreview className="form-produse">
      <Form>
        {inputsOrder.map((keyName) => {
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
              disabled={
                (keyName !== "descriere" &&
                  (activateInputs || keyName === "cod")) ||
                (keyName === "cod" && true)
              }
              autoComplete="off"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(e);
                }
              }}
            />
          );
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
