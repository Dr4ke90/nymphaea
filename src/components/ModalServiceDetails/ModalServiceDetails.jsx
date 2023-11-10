import React, { useState } from "react";
import PagePreview from "../PagePreview/PagePreview";
import TableDisplay from "../table-display/TableDisplay";
import "./modalServiceDetails.css";
import Input from "../Input/Input";
import { Button } from "@mui/material";
import ModalProductDetails from "../ModalProductDetails/ModalProductDetails";

const ModalServiceDetails = ({ service, closeModal }) => {
  const column1 = ["cod", "departament", "descriere", "pret", "produseDeBaza"];

  const column2 = ["data_creat", "ora_creat", "data_update", "ora_update"];

  const headServicii = ["cod", "descriere", "cantitate", "valoare"];

  const [openModalProduct, setOpenModalProduct] = useState(false);
  const handleOpenModalProduct = () => {
    setOpenModalProduct(!openModalProduct);
  };

  const [receivedObject, setReceivedObject] = useState({});
  const handleOpenModal = (obj) => {
    setReceivedObject(obj);
    handleOpenModalProduct();
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
    <div className="modal-service-details">
      <PagePreview className="modal-overlay">
        <PagePreview className="modal-content">
          <div className="info">
            <span>Service info</span>
          </div>
          <div className="service-info">
            <div className="column">
              {column1.map((item) => {
                if (item !== "produseDeBaza") {
                  return (
                    <div key={item} className="row">
                      <label htmlFor={item}>{handleCleanName(item)}</label>
                      <span>:</span>
                      <Input name={item} value={service[item]} disabled />
                    </div>
                  );
                } else if (item === "produseDeBaza") {
                  return (
                    <div key={item} className="row">
                      <label htmlFor={item}>Nr produse </label>
                      <span>:</span>
                      <Input
                        name={item}
                        value={service[item].length}
                        disabled
                      />
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
                  <div key={item} className="row">
                    <label htmlFor={item}>{handleCleanName(item)}</label>
                    <span>:</span>
                    <Input name={item} value={service[item]} disabled />
                  </div>
                );
              })}
            </div>
          </div>
          <hr />
          <div className="title">
            <h4>Produse de baza</h4>
          </div>
          <TableDisplay
            thead={headServicii}
            tbody={service.produseDeBaza}
            listOrder={headServicii}
            openDetails={handleOpenModal}
          />
          <hr />
          <div className="close">
            <Button variant="contained" color="info" onClick={closeModal}>
              Close
            </Button>
          </div>

          {openModalProduct && (
            <ModalProductDetails
              product={receivedObject}
              closeModal={handleOpenModalProduct}
            />
          )}
        </PagePreview>
      </PagePreview>
    </div>
  );
};

export default ModalServiceDetails;
