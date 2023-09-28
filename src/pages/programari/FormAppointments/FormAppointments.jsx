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

export default function FormAppointment({ closeModal, cod, item, setItem }) {
  const dispatch = useDispatch();
  const clienti = useSelector((state) => state.clienti);
  const [showCreateClientButton, setShowCreateClientButton] = useState(false);

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
        const capitalizeValuea = value.toUpperCase();
        const client = clienti.find(
          (client) => client.cod === capitalizeValuea
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
          {Object.entries(initialState).map(([key, value]) => {
            if (key !== "status") {
              return (
                <div key={key} className="input-wrapper">
                  <Input
                    type={handleInputType(key)}
                    name={key}
                    placeholder={handlePlaceholder(key)}
                    onChange={handleChange}
                    value={newAppointment[key]}
                    disabled={key === "nr"}
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
                </div>
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
                item !== null ? handleUpdateAppointment : handleAdaugaProgramare
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
