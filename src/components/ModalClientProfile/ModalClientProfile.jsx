import React from "react";
import PagePreview from "../PagePreview/PagePreview";
import TableDisplay from "../table-display/TableDisplay";
import "./modalClientProfile.css";
import Input from "../Input/Input";
import { Button } from "@mui/material";

const ModalClientProfile = ({ client, closeModal }) => {
  const headFise = [
    "codFisa",
    "data",
    "codAngajat",
    "tipPlata",
    "totalDePlata",
  ];

  return (
    <div className="modal-client-profile">
      <PagePreview className="modal-overlay">
        <PagePreview className="modal-content">
          <div className="client-info">
            <div className="column">
              {Object.entries(client).map(([key, value]) => {
                if (
                  key !== "fise" &&
                  key !== "data_creat" &&
                  key !== "ora_creat" &&
                  key !== "data_update" &&
                  key !== "ora_update"
                ) {
                  return (
                    <div className="row">
                      <label htmlFor={key}>
                        {key.substring(0, 1).toUpperCase() + key.slice(1)}
                      </label>
                      <span>:</span>
                      <Input name={key} value={value} disabled />
                    </div>
                  );
                } else if (key === "fise") {
                  return (
                    <div className="row">
                      <label htmlFor={key}>Nr de fise </label>
                      <span>:</span>
                      <Input name={key} value={value.length} disabled />
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            </div>
            <hr />
            <div className="column">
              {Object.entries(client).map(([key, value]) => {
                if (
                  key === "data_creat" ||
                  key === "ora_creat" ||
                  key === "data_update" ||
                  key === "ora_update"
                ) {
                  return (
                    <div className="row">
                      <label htmlFor={key}>
                        {key.substring(0, 1).toUpperCase() + key.slice(1)}
                      </label>
                      <span>:</span>
                      <Input name={key} value={value} disabled />
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            </div>
          </div>
          <hr />
          <TableDisplay
            thead={headFise}
            tbody={client.fise}
            listOrder={headFise}
          />
          <hr />
          <div className="close">
            <Button variant="contained" color="info" onClick={closeModal}>
              Close
            </Button>
          </div>
        </PagePreview>
      </PagePreview>
    </div>
  );
};

export default ModalClientProfile;
