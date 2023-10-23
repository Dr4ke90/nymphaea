import React from "react";
import Form from "../Formular/Form";
import "./regularInvoiceForm.css";
import Input from "../Input/Input";
import { Button } from "@mui/material";

export default function RegularInvoiceForm({
  stateFactura,
  handleChangeFactura,
  setProducts,
  setEquipment,
}) {
  return (
    <div
      className={`regular-invoce-form ${
        stateFactura.tip === "chirie" || stateFactura.tip === "utilitati"
          ? "fullSize"
          : ""
      }`}
    >
      <Form>
        {Object.keys(stateFactura).map((keyName) => {
          const placeholder =
            keyName.substring(0, 1).toUpperCase() + keyName.slice(1);
          if (
            keyName !== "tip" &&
            keyName !== "produse" &&
            keyName !== "echipament"
          ) {
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
      {stateFactura.tip === "inventar" && (
        <div className="lists">
          <Button variant="contained" color="info" onClick={setProducts}>
            Produse
          </Button>

          <Button variant="contained" color="info" onClick={setEquipment}>
            Echipament
          </Button>
        </div>
      )}
    </div>
  );
}
