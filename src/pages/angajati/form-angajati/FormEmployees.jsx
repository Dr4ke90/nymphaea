import React, { useState } from "react";
import Input from "../../../components/Input/Input";
import PagePreview from "../../../components/PagePreview/PagePreview";
import Form from "../../../components/Formular/Form";
import "./formEmployees.css";
import { Button } from "@mui/material";

export default function FormEmployees({ closeModal }) {
  const initialState = {
    nume: "",
    prenume: "",
    telefon: "",
    functie: "",
    data_nasterii: "",
    cnp: "",
    adresa: "",
    programari: [],
  };

  const [newAngajat, setNewAngajat] = useState(initialState);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setNewAngajat({
      ...newAngajat,
      [name]: value,
    });
  };

  const handleAdauga = (e) => {
    e.preventDefault();
    console.log(newAngajat);
    closeModal();
  };

  return (
    <PagePreview className="modal-overlay">
      <div className="modal-content">
        <Form className="new-employee-form">
          {Object.entries(initialState).map(([key, value]) => {
            const placeholder =
              key.substring(0, 1).toUpperCase() + key.slice(1);
            if (key !== "programari") {
              if (key === "data_nasterii") {
                const datePlaceholder = "Data Nasterii";
                return (
                  <Input
                    key={key}
                    type="date"
                    name={key}
                    placeholder={datePlaceholder}
                    onChange={handleChange}
                  />
                );
              }
              return (
                <Input
                  key={key}
                  type="text"
                  name={key}
                  placeholder={key === 'cnp' ? "CNP" : placeholder}
                  onChange={handleChange}
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
