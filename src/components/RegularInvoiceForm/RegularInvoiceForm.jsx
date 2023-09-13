import React from "react";
import Form from "../Formular/Form";
import "./regularInvoiceForm.css";
import Input from "../Input/Input";

export default function RegularInvoiceForm({
  stateFactura,
  handleChangeFactura,
}) {
  return (
    <Form className="regular-invoce-form">
      {Object.keys(stateFactura).map((keyName) => {
        const placeholder =
          keyName.substring(0, 1).toUpperCase() + keyName.slice(1);
        if (keyName !== "tip" && keyName !== "produse") {
          return (
            <Input
              className="input"
              key={keyName}
              id={keyName}
              type={keyName === "data" ? "date" : "text"}
              name={keyName}
              placeholder={placeholder}
              onChange={handleChangeFactura}
              value={stateFactura[keyName]}
              disabled={
                keyName === "total" ||
                keyName === "cod" ||
                (stateFactura.tip === "chirie" &&
                  ["serie", "vendor", "tva"].includes(keyName))
              }
              autoComplete="off"
            />
          );
        } else {
          return null;
        }
      })}
    </Form>
  );
}
