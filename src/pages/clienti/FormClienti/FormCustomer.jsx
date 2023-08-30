import React, { useState } from "react";
import PagePreview from "../../../components/PagePreview/PagePreview";
import Form from "../../../components/Formular/Form";
import Input from "../../../components/Input/Input";
import { Button } from "@mui/material";
import './formCustomer.css'

export default function FromCustomer({closeModal}) {
  const initialState = {
    cod: "",
    nume: "",
    prenume: "",
    telefon: "",
    data_nasterii: "",
    adresa: "",
    fise: [],
  };

  const [newClient, setNewClient] = useState(initialState);

  const handleChange = (e) => {
    e.preventDefault()
    const {name, value} = e.target
    setNewClient({
      ...newClient,
      [name]:value
    })
  }

  const handleAdauga = (e) => {
    e.preventDefault()
    console.log(newClient)
    closeModal()
  }

  return (
    <PagePreview className="modal-overlay">
      <div className="modal-content">
        <Form className="new-customer-form">
          {Object.keys(initialState).map((key) => {
            const placeholder =
              key.substring(0, 1).toUpperCase() + key.slice(1);
            if (key !== "fise") {
              return (
                <Input
                  key={key}
                  type={key === "data_nasterii" ? "date" : "text"}
                  name={key}
                  placeholder={placeholder}
                  onChange={handleChange}
                  value={newClient[key]}
                />
              );
            } else {
              return null;
            }
          })}
          <Input type="submit" onClick={handleAdauga} />
          <Button variant="outlined" onClick={closeModal}>
            Close
          </Button>
        </Form>
      </div>
    </PagePreview>
  );
}
