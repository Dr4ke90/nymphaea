import React, { useEffect, useState } from "react";
import Input from "../../../components/Input/Input";
import PagePreview from "../../../components/PagePreview/PagePreview";
import Form from "../../../components/Formular/Form";
import "./formEmployees.css";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import {
  addEmployee,
  updateEmployee,
} from "../../../redux/slices/employeesSlice";

export default function FormEmployees({ closeModal, cod, item, setItem }) {
  const dispatch = useDispatch();

  const date = new Date().toLocaleDateString("ro", "RO");
  const ora = new Date().toLocaleTimeString("ro", "RO");

  const initialState = {
    cod: cod,
    nume: "",
    prenume: "",
    telefon: "",
    functie: "",
    data_nasterii: "",
    cnp: "",
    adresa: "",
    data_creat: date,
    ora_creat: ora,
    data_update: date,
    ora_update: ora,
    programari: [],
  };

  const [newAngajat, setNewAngajat] = useState(initialState);

  useEffect(() => {
    if (item !== null) {
      setNewAngajat(item);
    }
  }, [item]);

  const handleCloseModal = () => {
    setNewAngajat(initialState);
    setItem(null);
    closeModal();
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let newValue = value.toLocaleLowerCase();

    newValue = newValue.charAt(0).toUpperCase() + newValue.slice(1);

    setNewAngajat({
      ...newAngajat,
      [name]: newValue,
    });
  };

  const handleAdauga = (e) => {
    e.preventDefault();
    dispatch(addEmployee(newAngajat));
    handleCloseModal();
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    dispatch(updateEmployee(newAngajat));
    handleCloseModal();
  };

  const handlePlaceholder = (key) => {
    let placeholder = key.substring(0, 1).toUpperCase() + key.slice(1);
    if (key === "cnp") {
      placeholder = "CNP";
    }

    return placeholder;
  };

  const handleInputType = (key) => {
    let type = "text";
    if (key === "data_nasterii") {
      type = "date";
    }
    return type;
  };

  return (
    <PagePreview className="modal-overlay">
      <div className="modal-content">
        <Form className="new-employee-form">
          {Object.keys(initialState).map((key) => {
            if (
              key !== "programari" &&
              !key.includes("creat") &&
              !key.includes("update")
            ) {
              return (
                <Input
                  key={key}
                  type={handleInputType(key)}
                  name={key}
                  placeholder={handlePlaceholder(key)}
                  onChange={handleChange}
                  disabled={key === "cod"}
                  value={newAngajat[key]}
                />
              );
            } else {
              return null;
            }
          })}
          <PagePreview className="buttons-wrapper">
            <Button variant="contained" color="info" onClick={handleCloseModal}>
              Close
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={item !== null ? handleUpdate : handleAdauga}
              disabled={Object.values(newAngajat).some(
                (value) => typeof value === "string" && value.trim() === ""
              )}
            >
              {item !== null ? "Update" : "Adauga"}
            </Button>
          </PagePreview>
        </Form>
      </div>
    </PagePreview>
  );
}
