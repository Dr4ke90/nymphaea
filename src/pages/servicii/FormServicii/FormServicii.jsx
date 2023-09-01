import React, { useState } from "react";
import PagePreview from "../../../components/PagePreview/PagePreview";
import Form from "../../../components/Formular/Form";
import Input from "../../../components/Input/Input";
import { Button } from "@mui/material";
import "./formServicii.css";

export default function FormServicii({ closeModal, cod }) {
  const initialState = {
    cod: cod,
    departament: "",
    tip: "",
    pret: "",
  };
  const [newService, setNewService] = useState(initialState);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setNewService({
      ...newService,
      [name]: value,
    });
  };

  const handleAdauga = (e) => {
    e.preventDefault();
    console.log(newService);
    closeModal();
  };

  return (
    <PagePreview className="modal-overlay">
      <PagePreview className="modal-content">
        <Form className="new-service-form">
          {Object.keys(initialState).map((key) => {
            const placeholder =
              key.substring(0, 1).toUpperCase() + key.slice(1);
            return (
              <Input
                key={key}
                type="text"
                name={key}
                placeholder={key === "cnp" ? "CNP" : placeholder}
                onChange={handleChange}
                value={newService[key]}
                disabled={key === 'cod'}
              />
            );
          })}
          <PagePreview className="buttons-wrapper">
            <Button variant="contained" color="info" onClick={closeModal}>
              Close
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleAdauga}
              disabled={Object.values(newService).some(
                (value) => typeof value === "string" && value.trim() === ""
              )}
            >
              Adauga
            </Button>
          </PagePreview>
        </Form>
      </PagePreview>
    </PagePreview>
  );
}
