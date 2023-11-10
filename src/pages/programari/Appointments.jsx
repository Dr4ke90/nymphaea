import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import "./appointments.css";
import FormAppointment from "./FormAppointments/FormAppointments";
import {
  fetchAllAppointments,
  updateAppointment,
} from "../../redux/slices/appointmentsSlice";
import { Button } from "@mui/material";
import BigCalendar from "../../components/Calendar/Calendar";
import { getDate } from "../../utils/getDate";
import { getHour } from "../../utils/getHour";
import ModalFisa from "../../components/ModalFisa/ModalFisa";
import ModalAppointmentDetails from "../../components/ModalAppointmentDetails/ModalAppointmentDetails";

export default function Appointments() {
  const location = useLocation();
  const title =
    location.pathname.substring(1, 2).toUpperCase() +
    location.pathname.substring(1).slice(1);
  const [receivedAppointemnt, setReceivedAppointemnt] = useState(null);
  const appointments = useSelector((state) => state.programari);
  const [currentAppointment, setCurrentAppointment] = useState({});

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllAppointments());
  }, [dispatch]);

  let code = 0;
  const cod = appointments.length + 1;
  const paddedNr = cod.toString().padStart(5, "0");
  code = "A" + paddedNr;

  const [modal, setModal] = useState(false);
  const toggleModal = () => {
    setModal(!modal);
  };

  const [modalFisa, setModalFisa] = useState(false);
  const toggleModalFisa = () => {
    setModalFisa(!modalFisa);
  };

  const [openModalDetails, setOpenModalDetails] = useState(false);
  const toggleModalDetails = () => {
    setOpenModalDetails(!openModalDetails);
  };

  const handleEditAppointment = (item) => {
    setReceivedAppointemnt(item);
    setModal(true);
  };

  const handleCancelAppointment = (item) => {
    const status = "Anulat";
    const tip_update = `Modificare status: ${status}`;
    const data_update = getDate();
    const ora_update = getHour();

    const newApp = {
      ...item,
      status: status,
      tip_update,
      data_update,
      ora_update,
    };

    delete newApp._id;
    dispatch(updateAppointment(newApp));
  };

  const handleFinishAppointment = (item) => {
    const data_update = getDate();
    const ora_update = getHour();
    const status = "Terminat";
    const tip_update = `Modificare status: ${status}`;

    const newApp = {
      ...item,
      status: status,
      tip_update,
      data_update,
      ora_update,
    };

    delete newApp._id;

    dispatch(updateAppointment(newApp));
  };

  const handleOpenAppDetails = (item) => {
    setReceivedAppointemnt(item);
    toggleModalDetails();
  };

  return (
    <div className="appointments-page">
      <div className="title">
        <Button variant="contained" color="info" onClick={toggleModal}>
          Adauga
        </Button>

        <h2>{title}</h2>
      </div>
      <BigCalendar
        appointments={appointments}
        edit={handleEditAppointment}
        cancel={handleCancelAppointment}
        finish={handleFinishAppointment}
        openDetails={handleOpenAppDetails}
        toggleModalFisa={toggleModalFisa}
        setCurrentAppointment={setCurrentAppointment}
      />
      {modal && (
        <FormAppointment
          closeModal={toggleModal}
          cod={code}
          item={receivedAppointemnt}
          setItem={setReceivedAppointemnt}
        />
      )}

      {modalFisa && currentAppointment.status === "Activ" && (
        <ModalFisa
          closeModal={toggleModalFisa}
          appointment={currentAppointment}
        />
      )}

      {openModalDetails && (
        <ModalAppointmentDetails
          appointment={receivedAppointemnt}
          closeModal={toggleModalDetails}
        />
      )}
    </div>
  );
}
