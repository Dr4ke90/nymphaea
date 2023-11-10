import React, { useState } from "react";
import PagePreview from "../PagePreview/PagePreview";
import TableDisplay from "../table-display/TableDisplay";
import "./modalClientProfile.css";
import Input from "../Input/Input";
import { Button } from "@mui/material";
import ModalFileDetails from "../ModalFileDetails/ModalFileDetails";

const ModalClientProfile = ({ client, closeModal }) => {
  const headFise = [
    "codFisa",
    "data",
    "codAngajat",
    "tipPlata",
    "totalDePlata",
  ];

  const [openFileDetails, setOpenFileDetails] = useState(false);
  const handleOpenFileDetailes = () => {
    setOpenFileDetails(!openFileDetails);
  };

  const [receivedFile, setReceivedFile] = useState({});

  const handleOpenModal = (file) => {
    setReceivedFile(file);
    handleOpenFileDetailes();
  };

  const handleCleanName = (item) => {
    let name;
    switch (item) {
      case "data_creat":
        name = "data creat";
        break;
      case "ora_creat":
        name = "ora creat";
        break;
      case "data_update":
        name = "data update";
        break;
      case "ora_update":
        name = "ora update";
        break;

      default:
        name = item;
    }
    return name.substring(0, 1).toUpperCase() + name.slice(1);
  };

  return (
    <div className="modal-client-profile">
      <PagePreview className="modal-overlay">
        <PagePreview className="modal-content">
          <div className="info">
            <span>Customer info</span>
          </div>
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
                    <div key={key} className="row">
                      <label htmlFor={key}>{handleCleanName(key)}</label>
                      <span>:</span>
                      <Input name={key} value={value} disabled />
                    </div>
                  );
                } else if (key === "fise") {
                  return (
                    <div key={key} className="row">
                      <label htmlFor={key}>Nr fise </label>
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
                    <div key={key} className="row">
                      <label htmlFor={key}>{handleCleanName(key)}</label>
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
          <div className="title">
            <h4>Fise</h4>
          </div>
          <TableDisplay
            thead={headFise}
            tbody={client.fise}
            listOrder={headFise}
            openDetails={handleOpenModal}
          />
          <hr />
          <div className="close">
            <Button variant="contained" color="info" onClick={closeModal}>
              Close
            </Button>
          </div>

          {openFileDetails && (
            <ModalFileDetails
              file={receivedFile}
              closeModal={handleOpenFileDetailes}
            />
          )}
        </PagePreview>
      </PagePreview>
    </div>
  );
};

export default ModalClientProfile;
