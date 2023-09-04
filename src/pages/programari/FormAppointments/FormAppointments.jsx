import React, { useEffect, useState } from "react";
import PagePreview from "../../../components/PagePreview/PagePreview";
import Form from "../../../components/Formular/Form";
import Input from "../../../components/Input/Input";
import { Button } from "@mui/material";
import "./formAppointments.css";
import {
  addAppointment,
  updateAppointment,
} from "../../../redux/slices/appointmentsSlice";
import { useDispatch } from "react-redux";

export default function FormAppointment({ closeModal, cod, item, setItem }) {
  const dispatch = useDispatch();
  const date = new Date().toLocaleDateString("ro", "RO");
  const ora = new Date().toLocaleTimeString("ro", "RO");

  const initialState = {
    nr: cod,
    data: "",
    ora: "",
    timp: "",
    client: "",
    angajat: "",
    status: "",
    data_creat: date,
    ora_creat: ora,
    data_update: date,
    ora_update: ora,
  };
  const [newAppointment, setNewAppointment] = useState(initialState);

  useEffect(() => {
    if (item !== null) {
      setNewAppointment(item);
    }
  }, [item]);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setNewAppointment({
      ...newAppointment,
      [name]: value,
    });
  };

  const handleCloseModal = () => {
    setNewAppointment(initialState);
    setItem(null);
    closeModal();
  };

  const handleAdaugaProgramare = (e) => {
    e.preventDefault();
    dispatch(addAppointment(newAppointment));
    handleCloseModal();
  };

  const handleUpdateprogramare = (e) => {
    e.preventDefault();
    dispatch(updateAppointment(newAppointment));
    handleCloseModal();
  };

  const handleInputType = (key) => {
    let type = "text";
    if (key === "data") {
      type = "date";
    }

    if (key === "ora") {
      type = "time";
    }

    return type;
  };

  const handlePlaceholder = (key) => {
    let placeholder = key.substring(0, 1).toUpperCase() + key.slice(1);
    if (key === "angajat") {
      placeholder = "Programat la";
    }

    if (key === "timp") {
      placeholder = "Timp ( Ore )";
    }

    return placeholder;
  };

  return (
    <PagePreview className="modal-overlay">
      <PagePreview className="modal-content">
        <Form className="new-appointment-form">
          {Object.keys(initialState).map((key) => {
            if (
              key !== "nr" &&
              !key.includes("creat") &&
              !key.includes("update") &&
              key !== "status"
            ) {
              return (
                <Input
                  key={key}
                  type={handleInputType(key)}
                  name={key}
                  placeholder={handlePlaceholder(key)}
                  onChange={handleChange}
                  value={newAppointment[key]}
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
              onClick={
                item !== null ? handleUpdateprogramare : handleAdaugaProgramare
              }
              disabled={Object.values(newAppointment).some(
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
