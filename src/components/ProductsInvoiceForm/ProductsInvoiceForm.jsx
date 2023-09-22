import React from "react";
import PagePreview from "../PagePreview/PagePreview";
import Form from "../Formular/Form";
import Input from "../Input/Input";
import { Button } from "@mui/material";
import "./productsInvoiceForm.css";

export default function ProductsInvoiceForm({
  stateProdus,
  handleAdaugaProdus,
  handleChangeProdus,
}) {
  const handlePlaceHolder = (key) => {
    let placeholder = key.substring(0, 1).toUpperCase() + key.slice(1);

    if (key === "stoc") placeholder = "Cantitate";

    if (key === "gramaj") placeholder = "Gramaj / BUC";

    if (key === "pretUnitar") placeholder = "Pret Unitar";

    return placeholder;
  };

  return (
    <PagePreview className="form-produse">
      <Form>
        {Object.keys(stateProdus).map((keyName) => {
          if (keyName !== "totalP" && keyName !== "cantitateGr") {
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
                disabled={keyName === "cod" || keyName === "total"}
                autoComplete="off"
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
        onClick={handleAdaugaProdus}
        disabled={Object.values(stateProdus).some(
          (value) => typeof value === "string" && value.trim() === ""
        )}
      >
        Adauga
      </Button>
    </PagePreview>
  );
}
