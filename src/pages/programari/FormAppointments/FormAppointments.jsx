import React, { useState } from "react";
import PagePreview from "../../../components/PagePreview/PagePreview";
import Form from "../../../components/Formular/Form";
import Input from "../../../components/Input/Input";
import { Button } from "@mui/material";
import "./formAppointments.css";

export default function FormAppointment({ closeModal }) {
  const initialState = {
    nr: "1",
    data: "",
    ora: "",
    timp: "",
    client: "",
    angajat: "",
  };
  const [newAppointment, setNewAppointment] = useState(initialState);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setNewAppointment({
        ...newAppointment,
        [name]:value
    });
  };

  const handleAdauga = (e) => {
    e.preventDefault();
    console.log(newAppointment);
    closeModal();
  };

  const handleInputType = (key) => {
    let type = 'text'
    if (key === "data") {
        type = "date"
    }

    if (key === 'ora') {
        type = "time"
    }

    return type
  }

  const handlePlaceholder = (key) => {
    let placeholder =
              key.substring(0, 1).toUpperCase() + key.slice(1);
    if (key === "angajat") {
        placeholder = "Programat la"
    }

    if (key === 'timp') {
        placeholder = "Timp ( Ore )"
    }

    return placeholder
  }
  

  return (
    <PagePreview className="modal-overlay">
      <PagePreview className="modal-content">
        <Form className="new-appointment-form">
          {Object.keys(initialState).map((key) => {
            
            if (key !== "nr") {
              return (
                <Input
                  key={key}
                  type={handleInputType(key)}
                  name={key}
                  placeholder={handlePlaceholder(key)}
                  onChange={handleChange}
                />
              );
            } else {
              return null;
            }
          })}
          <PagePreview className="buttons-wrapper">
            
            <Button variant="contained" color="info" onClick={closeModal}>
              Close
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleAdauga}
              disabled={Object.values(newAppointment).some(
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
