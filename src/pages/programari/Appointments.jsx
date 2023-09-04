import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import TableDisplay from "../../components/table-display/TableDisplay";
import { Button } from "@mui/material";
import "./appointments.css";
import FormAppointment from "./FormAppointments/FormAppointments";
import {
  deleteAppointment,
  fetchAllAppointments,
} from "../../redux/slices/appointmentsSlice";


export default function Appointments() {
  const thead = ["nr", "data", "ora", "timp", "client", "programat la", "#"];
  const appointments = useSelector((state) => state.programari);
  const location = useLocation();
  const title =
    location.pathname.substring(1, 2).toUpperCase() +
    location.pathname.substring(1).slice(1);
  const [modal, setModal] = useState(false);
  const [receivedAppointemnt, setReceivedAppointemnt] = useState(null);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllAppointments());
  }, [dispatch]);

  let code = 0;
  if (appointments.length !== 0) {
    const nr = parseInt(appointments[appointments.length - 1].cod) + 1;
    const paddedNr = nr.toString().padStart(3, "0");
    code = paddedNr;
  } else {
    const nr = appointments.length + 1;
    const paddedNr = nr.toString().padStart(3, "0");
    code = paddedNr;
  }

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleDeleteService = (item) => {
    const confirm = window.confirm(
      `Esti sigur ca vrei sa stergi Angajatul ${item.cod}`
    );
    if (!confirm) return;
    dispatch(deleteAppointment(item));
  };

  const handleEditService = (item) => {
    setReceivedAppointemnt(item);
    setModal(true);
  };

  return (
    <div className="appointments-page">
      <div className="title">
        <Button variant="contained" color="info" onClick={toggleModal}>
          Adauga
        </Button>
        <Button variant="outlined">Toate</Button>
        <Button variant="outlined">Active</Button>
        <Button variant="outlined">Anulate</Button>
        <h2>{title}</h2>
      </div>
      {modal && (
        <FormAppointment
          closeModal={toggleModal}
          cod={code}
          item={receivedAppointemnt}
          setItem={setReceivedAppointemnt}
        />
      )}
      <TableDisplay
        thead={thead}
        tbody={appointments}
        removeItem={handleDeleteService}
        editItem={handleEditService}
      />
    </div>
  );
}
