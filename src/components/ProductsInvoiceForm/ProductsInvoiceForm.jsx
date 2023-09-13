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

  
  
  return (
    <PagePreview className="form-produse">
      <Form>
        {Object.keys(stateProdus).map((keyName) => {
          const placeholder =
            keyName.substring(0, 1).toUpperCase() + keyName.slice(1);
          return (
            <Input
              className="input"
              key={keyName}
              id={keyName}
              type="text"
              name={keyName}
              placeholder={keyName === "nrInv" ? "Cod produs" : placeholder}
              onChange={handleChangeProdus}
              value={stateProdus[keyName]}
              disabled={keyName === "nrInv" || keyName === "total"}
              autoComplete="off"
            />
          );
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
