import { Button } from "@mui/material";
import React from "react";
import PagePreview from "../PagePreview/PagePreview";
import "./modalController.css";
import Input from "../Input/Input";


export default function ModalController({
  state,
  closeModal,
  inregistreaza,
  total,
}) {

  
  const checkForEmptyFields = (obj) => {
    if (state === null) return;
    if (
      Object.values(obj).some(
        (value) => typeof value === "string" && value.trim() === ""
      )
    ) {
      return true;
    }
  };

  function checkForDisabled(state) {
    const isAllFieldsFilled =
      state.tip &&
      state.cod &&
      state.data &&
      state.serie &&
      state.numar &&
      state.vendor &&
      state.valoare &&
      state.tva &&
      (state.produse.length > 0 ||
      state.echipament.length > 0)

    return !isAllFieldsFilled;
  }

  const handleCheck = (state) => {
    if (state.tip === "inventar" || state.tip === "protocol") {
      return checkForDisabled(state);
    }

    return checkForEmptyFields(state);
  };

  
  
  return (
    <PagePreview className="footer">
      <Button variant="contained" color="info" onClick={(closeModal)}>
        Close
      </Button>


      {(state.tip === "inventar" || state.tip === "protocol") && (
        <Input
          value={total}
          style={{
            padding: "5px",
            width: "100px",
            textAlign: "center",
            fontSize: "20px",
          }}
          disabled
        />
      )}

      {state.tip !== "" && (
        <Button
          variant="contained"
          color="success"
          onClick={inregistreaza}
          disabled={handleCheck(state)}
        >
          Inregistreaza
        </Button>
      )}
    </PagePreview>
  );
}
