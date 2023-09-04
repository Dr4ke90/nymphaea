import React, { useEffect, useState } from "react";
import PagePreview from "../../../components/PagePreview/PagePreview";
import Form from "../../../components/Formular/Form";
import Input from "../../../components/Input/Input";
import { Button } from "@mui/material";
import "./formCustomer.css";
import { useDispatch } from "react-redux";
import {
  addCustomer,
  updateCustomer,
} from "../../../redux/slices/customersSlice";

export default function FromCustomer({ closeModal, cod, item, setItem }) {
  const date = new Date().toLocaleDateString("ro", "RO");
  const ora = new Date().toLocaleTimeString("ro", "RO");
  const dispatch = useDispatch();

  const initialState = {
    cod: cod,
    nume: "",
    prenume: "",
    telefon: "",
    nascut: "",
    data_creat: date,
    ora_creat: ora,
    data_update: date,
    ora_update: ora,
    fise: [],
  };

  const [newClient, setNewClient] = useState(initialState);

  useEffect(() => {
    if (item !== null) {
      setNewClient(item);
    }
  }, [item]);

  const handleCloseModal = () => {
    setNewClient(initialState);
    setItem(null);
    closeModal();
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setNewClient({
      ...newClient,
      [name]: value,
    });
  };

  const handleAdauga = (e) => {
    e.preventDefault();
    console.log(newClient);
    dispatch(addCustomer(newClient));
    handleCloseModal();
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    dispatch(updateCustomer(newClient));
    handleCloseModal();
  };

  const handlePlaceHolder = (key) => {
    const placeholder = key.substring(0, 1).toUpperCase() + key.slice(1);
    return placeholder;
  };

  const handleInputType = (key) => {
    let type = "text";
    if (key === "nascut") {
      type = "date";
    }
    return type;
  };

  return (
    <PagePreview className="modal-overlay">
      <div className="modal-content">
        <Form className="new-customer-form">
          {Object.keys(initialState).map((key) => {
            if (
              key !== "fise" &&
              !key.includes("creat") &&
              !key.includes("update")
            ) {
              return (
                <Input
                  key={key}
                  type={handleInputType(key)}
                  name={key}
                  placeholder={handlePlaceHolder(key)}
                  onChange={handleChange}
                  value={newClient[key]}
                  disabled={key === "cod"}
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
              disabled={Object.values(newClient).some(
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
