import React, { useState } from "react";
import PagePreview from "../PagePreview/PagePreview";
import "./modalAppointmentDetails.css";
import Input from "../Input/Input";
import { Button } from "@mui/material";
import TableDisplay from "../table-display/TableDisplay";
import ModalServiceDetails from "../ModalServiceDetails/ModalServiceDetails";

const ModalAppointmentDetails = ({ appointment, closeModal }) => {
  const column1 = [
    "cod",
    "numeClient",
    "client",
    "numeAngajat",
    "angajat",
    "descriere",
  ];

  const column2 = ["title", "data", "ora", "timp", "status", "nrIncasare"];

  const column3 = [
    "data_creat",
    "ora_creat",
    "data_update",
    "ora_update",
    "tip_update",
    "color",
  ];

  const headProduse = ["cod", "descriere", "cantitate", "pret"];

  const [openModalSerciceDetails, setOpenModalServiceDetails] = useState(false);
  const toggleModalDetails = () => {
    setOpenModalServiceDetails(!openModalSerciceDetails);
  };

  const [receivedObject, setReceivedObject] = useState({});
  const handleOpenServiceDetails = (item) => {
    setReceivedObject(item);
    toggleModalDetails();
  };

  const handleCleanName = (key) => {
    let name;
    switch (key) {
      case "numeClient":
        name = "nume client";
        break;
      case "numeAngajat":
        name = "nume angajat";
        break;
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
      case "tip_update":
        name = "tip update";
        break;
      case "color":
        name = "culoare";
        break;
      case "nrIncasare":
        name = "nr bon";
        break;
        case "descriere":
        name = "descriere servicii";
        break;
      default:
        name = key;
    }
    return name.substring(0, 1).toUpperCase() + name.slice(1);
  };

  return (
    <div className="modal-app-details">
      <PagePreview className="modal-overlay">
        <PagePreview className="modal-content">
          <div className="info">
            <span>Appointment info</span>
          </div>
          <div className="app-info">
            <div className="column">
              {column1.map((key) => {
                return (
                  <div key={key} className="row">
                    <label htmlFor={key}>{handleCleanName(key)}</label>
                    <span>:</span>
                    <Input name={key} value={appointment[key]} disabled />
                  </div>
                );
              })}
            </div>
            <hr />
            <div className="column2">
              {column2.map((key) => {
                return (
                  <div key={key} className="row">
                    <label htmlFor={key}>{handleCleanName(key)}</label>
                    <span>:</span>
                    <Input name={key} value={appointment[key]} disabled />
                  </div>
                );
              })}
            </div>
            <hr />
            <div className="column">
              <div className="invoices-list">
                {column3.map((key) => {
                  return (
                    <div key={key} className="row">
                      <label htmlFor={key}>{handleCleanName(key)}</label>
                      <span>:</span>
                      <Input name={key} value={appointment[key]} disabled />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <hr />
          <div className="title">
            <h4>Servicii</h4>
          </div>
          <TableDisplay
            thead={headProduse}
            tbody={appointment.servicii}
            listOrder={headProduse}
            openDetails={handleOpenServiceDetails}
          />
          <hr />
          <div className="close">
            <Button variant="contained" color="info" onClick={closeModal}>
              Close
            </Button>
          </div>

          {openModalSerciceDetails && (
            <ModalServiceDetails
              service={receivedObject}
              closeModal={toggleModalDetails}
            />
          )}
        </PagePreview>
      </PagePreview>
    </div>
  );
};

export default ModalAppointmentDetails;
