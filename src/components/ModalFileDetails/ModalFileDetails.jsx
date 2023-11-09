import React from "react";
import PagePreview from "../PagePreview/PagePreview";
import TableDisplay from "../table-display/TableDisplay";
import "./modalFileDetails.css";
import Input from "../Input/Input";
import { Button } from "@mui/material";

const ModalFileDetails = ({ file, closeModal }) => {
  const column1 = [
    "codFisa",
    "data",
    "codClient",
    "numeClient",
    "tipPlata",
    "produse",
    "totalDePlata",
  ];

  const column2 = ["codAngajat", "numeAngajat", "codProgramare", "nr"];

  const headProduse = ['cod', 'descriere', 'cantitate', 'pret']

  return (
    <div className="modal-file-details">
      <PagePreview className="modal-overlay">
        <PagePreview className="modal-content">
          <div className="file-info">
            <div className="column">
              {column1.map((item) => {
                if (item !== "produse") {
                  return (
                    <div className="row">
                      <label htmlFor={item}>
                        {item.substring(0, 1).toUpperCase() + item.slice(1)}
                      </label>
                      <span>:</span>
                      <Input name={item} value={file[item]} disabled />
                    </div>
                  );
                } else if (item === "produse") {
                  return (
                    <div className="row">
                      <label htmlFor={item}>Nr de produse </label>
                      <span>:</span>
                      <Input name={item} value={file[item].length} disabled />
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            </div>
            <hr />
            <div className="column">
              {column2.map((item) => {
                return (
                  <div className="row">
                    <label htmlFor={item}>
                      {item.substring(0, 1).toUpperCase() + item.slice(1)}
                    </label>
                    <span>:</span>
                    <Input name={item} value={file[item]} disabled />
                  </div>
                );
              })}
            </div>
          </div>
          <hr />
          <TableDisplay
            thead={headProduse}
            tbody={file.produse}
            listOrder={headProduse}
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

export default ModalFileDetails;
