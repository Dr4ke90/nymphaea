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
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomers } from "../../../redux/slices/customersSlice";
import FromCustomer from "../../clienti/FormClienti/FormCustomer";
import { fetchAllEmployees } from "../../../redux/slices/employeesSlice";
import { getDate } from "../../../utils/getDate";
import { getHour } from "../../../utils/getHour";

export default function FormAppointment({ closeModal, cod, item, setItem }) {
  const dispatch = useDispatch();
  const clienti = useSelector((state) => state.clienti);
  const angajati = useSelector((state) => state.angajati);
  const [showCreateClientButton, setShowCreateClientButton] = useState(false);
  const [showEmployeeError, setShowEmployeeError] = useState(false);

  const initialState = {
    cod: cod,
    data: "",
    ora: "",
    timp: "",
    client: "",
    descriere: "",
    angajat: "",
    servicii: []
  };
  const [newAppointment, setNewAppointment] = useState(initialState);

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  let code = 0;
  const nr = clienti.length + 1;
  const paddedNr = nr.toString().padStart(3, "0");
  code = "C" + paddedNr;

  useEffect(() => {
    dispatch(fetchAllCustomers());
    dispatch(fetchAllEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (item !== null) {
      setNewAppointment(item);
    }
  }, [item]);

  const findClientByCode = (code) =>
    clienti.find((client) => client.cod.toUpperCase() === code.toUpperCase());
  const findClientByName = (name) =>
    clienti.find(
      (client) =>
        `${client.nume} ${client.prenume}`.toLowerCase() === name.toLowerCase()
    );
  const findEmployeeByCode = (code) =>
    angajati.find((angajat) => angajat.cod === code);

  const handleClientChange = (name, value) => {
    const uppercasedValue = value.toUpperCase();
    const client =
      value.startsWith("c") || value.startsWith("C")
        ? findClientByCode(uppercasedValue)
        : findClientByName(value);

    const numeClient = client ? `${client.nume} ${client.prenume}` : value;
    setShowCreateClientButton(!client);
    return numeClient;
  };

  const handleEmployeeChange = (name, value) => {
    const angajat = findEmployeeByCode(value);
    setShowEmployeeError(!angajat);
    return angajat ? `${angajat.nume} ${angajat.prenume}` : value;
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    let updatedValue;
    if (name === "client") {
      updatedValue = handleClientChange(name, value);
    } else if (name === "angajat") {
      updatedValue = handleEmployeeChange(name, value);
    } else {
      updatedValue = value;
    }

    setNewAppointment({
      ...newAppointment,
      [name]: value,
      numeClient: name === "client" ? updatedValue : newAppointment.numeClient,
      numeAngajat:
        name === "angajat" ? updatedValue : newAppointment.numeAngajat,
    });
  };

  const handleCloseModal = () => {
    setNewAppointment(initialState);

    setItem(null);

    closeModal();
  };

  const handleAdaugaProgramare = (e) => {
    e.preventDefault();

    dispatch(
      addAppointment({
        ...newAppointment,
        status: "Activ",
        color: getRandomColor(),
      })
    );

    setNewAppointment(initialState);
    handleCloseModal();
  };

  const handleUpdateAppointment = (e) => {
    e.preventDefault();
    const data_update = getDate();
    const ora_update = getHour();
    let newApp = {};
    if (newAppointment.status === "Anulat") {
      newApp = {
        ...newAppointment,
        status: "Activ",
        tip_update: "Modificare status: Reprogramare",
        data_update,
        ora_update,
      };
    }

    if (newAppointment.status === "Activ") {
      newApp = {
        ...newAppointment,
        tip_update: "Modificare date",
        data_update,
        ora_update,
      };
    }

    delete newApp._id;
    handleCloseModal();
    dispatch(updateAppointment(newApp));
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

  const [openFormCustomer, setOpenFormCustomer] = useState(false);

  const toggleFormCustomer = () => {
    setOpenFormCustomer(!openFormCustomer);
  };

  const handleCreateNewCustomer = (e) => {
    e.preventDefault();
    toggleFormCustomer();
  };

  return (
    <PagePreview className="modal-overlay">
      <PagePreview className="modal-content">
        <Form className="new-appointment-form">
          {Object.keys(initialState).map((key) => {
            if (key !== "status" && key !== "color" && key !== "servicii") {
              return (
                <div key={key} className="input-wrapper">
                  <Input
                    type={handleInputType(key)}
                    name={key}
                    placeholder={handlePlaceholder(key)}
                    onChange={handleChange}
                    value={newAppointment[key]}
                    disabled={
                      key === "cod" ||
                      newAppointment.status === "Terminat" ||
                      (key === "client" &&
                        (newAppointment.status === "Anulat" ||
                          newAppointment.status === "Activ")) ||
                      newAppointment.status === "In curs"
                    }
                    autoComplete="off"
                  />
                  {key === "client" &&
                    newAppointment.client !== "" &&
                    showCreateClientButton && (
                      <div className="new-client-div">
                        <p>Creati client nou?</p>
                        <button
                          className="create-client-button"
                          onClick={handleCreateNewCustomer}
                        >
                          Creați
                        </button>
                        {openFormCustomer && (
                          <FromCustomer
                            closeModal={toggleFormCustomer}
                            cod={code}
                            item={null}
                            setItem={null}
                          />
                        )}
                      </div>
                    )}
                  {key === "angajat" &&
                    newAppointment.angajat !== "" &&
                    showEmployeeError && (
                      <p
                        style={{
                          color: "red",
                          margin: "0",
                          fontSize: "11px",
                          marginBottom: "5px",
                        }}
                      >
                        Angajatul nu exista
                      </p>
                    )}
                </div>
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
                item !== null ? handleUpdateAppointment : handleAdaugaProgramare
              }
              disabled={
                Object.values(newAppointment).some(
                  (value) => typeof value === "string" && value.trim() === ""
                ) ||
                newAppointment.status === "Terminat" ||
                showEmployeeError
              }
            >
              {item !== null ? "Update" : "Adauga"}
            </Button>
          </PagePreview>
        </Form>
      </PagePreview>
    </PagePreview>
  );
}
