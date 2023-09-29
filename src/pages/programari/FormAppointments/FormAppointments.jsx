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

export default function FormAppointment({ closeModal, cod, item, setItem }) {
  const dispatch = useDispatch();
  const clienti = useSelector((state) => state.clienti);
  const angajati = useSelector((state) => state.angajati);
  const [showCreateClientButton, setShowCreateClientButton] = useState(false);
  const [showEmployeeError, setShowEmployeeError] = useState(false);

  const initialState = {
    nr: cod,
    data: "",
    ora: "",
    timp: "",
    client: "",
    angajat: "",
  };
  const [newAppointment, setNewAppointment] = useState(initialState);

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

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    if (name === "client") {
      if (value.startsWith("c") || value.startsWith("C")) {
        const capitalizeValue = value.toUpperCase();
        const client = clienti.find((client) => client.cod === capitalizeValue);

        if (client) {
          setNewAppointment({
            ...newAppointment,
            [name]: value,
            numeClient: `${client.nume} ${client.prenume}`,
          });
          setShowCreateClientButton(false);
        } else {
          setNewAppointment({
            ...newAppointment,
            [name]: value,
            numeClient: value,
          });
          setShowCreateClientButton(true);
        }
      } else {
        const client = clienti.find(
          (client) =>
            `${client.nume} ${client.prenume}`.toLowerCase() ===
            value.toLowerCase()
        );

        if (client) {
          setNewAppointment({
            ...newAppointment,
            [name]: value,
            numeClient: `${client.nume} ${client.prenume}`,
          });
          setShowCreateClientButton(false);
        } else {
          setNewAppointment({
            ...newAppointment,
            [name]: value,
            numeClient: value,
          });
          setShowCreateClientButton(true);
        }
      }
    } else if (name === "angajat") {
      const angajat = angajati.find((angajat) => angajat.cod === value);

      if (angajat) {
        setNewAppointment({
          ...newAppointment,
          [name]: value,
          numeAngajat: `${angajat.nume} ${angajat.prenume}`,
        });
        setShowEmployeeError(false);
      } else {
        setNewAppointment({
          ...newAppointment,
          [name]: value,
          numeAngajat: value,
        });
        setShowEmployeeError(true);
      }
    } else {
      setNewAppointment({
        ...newAppointment,
        [name]: value,
      });
    }
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
      })
    );
    setNewAppointment(initialState);
    handleCloseModal();
  };

  const handleUpdateAppointment = (e) => {
    e.preventDefault();
    let newApp = {};
    if (newAppointment.status === "Anulat") {
      newApp = {
        ...newAppointment,
        status: "Activ",
        tip_update: "Modificare status: Reprogramare",
      };
    }

    if (newAppointment.status === "Activ") {
      newApp = {
        ...newAppointment,
        tip_update: "Modificare date",
      };
    }
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
            if (key !== "status") {
              return (
                <div key={key} className="input-wrapper">
                  <Input
                    type={handleInputType(key)}
                    name={key}
                    placeholder={handlePlaceholder(key)}
                    onChange={handleChange}
                    value={newAppointment[key]}
                    disabled={
                      key === "nr" ||
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
