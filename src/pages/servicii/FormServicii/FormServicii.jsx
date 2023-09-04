import React, { useEffect, useState } from "react";
import PagePreview from "../../../components/PagePreview/PagePreview";
import Form from "../../../components/Formular/Form";
import Input from "../../../components/Input/Input";
import { Button } from "@mui/material";
import "./formServicii.css";
import { useDispatch } from "react-redux";
import { addService, updateService } from "../../../redux/slices/servicesSlice";

export default function FormServicii({ closeModal, cod, item, setItem }) {
  const dispatch = useDispatch();
  const date = new Date().toLocaleDateString("ro", "RO");

  const initialState = {
    cod: cod,
    departament: "",
    tip: "",
    pret: "",
    creat: date,
  };
  const [newService, setNewService] = useState(initialState);

  useEffect(() => {
    if (item !== null) {
      setNewService(item);
    }
  }, [item]);

  const handleCloseModal = () => {
    setNewService(initialState);
    setItem(null);
    closeModal();
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let newValue = value.toLocaleLowerCase();

    if (name === "pret") {
      newValue = newValue.replace(/\D/g, "");

      if (newValue.length > 4) {
        newValue = newValue.substring(0, 4);
      }
    }

    newValue = newValue.charAt(0).toUpperCase() + newValue.slice(1);

    setNewService({
      ...newService,
      [name]: newValue,
    });
  };

  const handleAdaugaService = (e) => {
    e.preventDefault();
    dispatch(addService(newService));
    handleCloseModal();
  };

  const handleUpdateService = (e) => {
    e.preventDefault();
    dispatch(updateService(newService));
    handleCloseModal();
  };

  const handlePlaceholder = (key) => {
    let placeholder = key.substring(0, 1).toUpperCase() + key.slice(1);

    return placeholder;
  };

  return (
    <PagePreview className="modal-overlay">
      <PagePreview className="modal-content">
        <Form className="new-service-form">
          {Object.keys(initialState).map((key) => {
            if (key !== "creat") {
              return (
                <Input
                  key={key}
                  type="text"
                  name={key}
                  placeholder={handlePlaceholder(key)}
                  onChange={handleChange}
                  value={newService[key]}
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
              onClick={
                item !== null ? handleUpdateService : handleAdaugaService
              }
              disabled={Object.values(newService).some(
                (value) => typeof value === "string" && value.trim() === ""
              )}
            >
              {item !== null ? "Update" : "Adauga"}
            </Button>
          </PagePreview>
        </Form>
      </PagePreview>
    </PagePreview>
  );
}
